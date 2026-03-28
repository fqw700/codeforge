import path from "path"
import fs from "fs/promises"
import { Log } from "../util/log"
import { lazy } from "../util/lazy"

const initParser = lazy(async () => {
  const { default: Parser } = await import("web-tree-sitter")
  const { default: treeWasm } = await import("web-tree-sitter/tree-sitter.wasm" as string, {
    with: { type: "wasm" },
  })
  await Parser.init({
    locateFile() {
      return treeWasm
    },
  })
  return Parser
})

const grammars: Record<string, () => Promise<any>> = {
  ".ts": async () => {
    const { default: lang } = await import("tree-sitter-typescript/typescript.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".tsx": async () => {
    const { default: lang } = await import("tree-sitter-typescript/tsx.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".js": async () => {
    const { default: lang } = await import("tree-sitter-javascript/tree-sitter-javascript.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".jsx": async () => {
    const { default: lang } = await import("tree-sitter-javascript/tree-sitter-javascript.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".py": async () => {
    const { default: lang } = await import("tree-sitter-python/tree-sitter-python.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".go": async () => {
    const { default: lang } = await import("tree-sitter-go/tree-sitter-go.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
  ".rs": async () => {
    const { default: lang } = await import("tree-sitter-rust/tree-sitter-rust.wasm" as string, {
      with: { type: "wasm" },
    })
    return lang
  },
}

export namespace RepoMap {
  const log = Log.create({ service: "repo-map" })

  export interface Symbol {
    name: string
    kind: "function" | "class" | "interface" | "type" | "method" | "variable" | "export" | "import"
    line: number
    endLine?: number
    signature?: string
  }

  export interface FileSymbols {
    file: string
    symbols: Symbol[]
  }

  const cache = new Map<string, { mtimeMs: number; symbols: Symbol[] }>()

  async function getParser(ext: string) {
    const loader = grammars[ext]
    if (!loader) return null
    const Parser = await initParser()
    const Language = await loader()
    const parser = new Parser()
    parser.setLanguage(Language)
    return parser
  }

  function extractSymbols(tree: any, source: string, ext: string): Symbol[] {
    const symbols: Symbol[] = []
    const root = tree.rootNode

    if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
      for (const node of root.descendantsOfType("function_declaration")) {
        const name = node.childForFieldName("name")
        if (name) {
          const params = node.childForFieldName("parameters")
          symbols.push({
            name: name.text,
            kind: "function",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `function ${name.text}${params?.text ?? "()"}`,
          })
        }
      }

      for (const node of root.descendantsOfType("lexical_declaration")) {
        const declarator = node.namedChildren.find((c: any) => c.type === "variable_declarator")
        if (declarator) {
          const name = declarator.childForFieldName("name")
          const value = declarator.childForFieldName("value")
          if (name && value && ["arrow_function", "function"].includes(value.type)) {
            symbols.push({
              name: name.text,
              kind: "function",
              line: node.startPosition.row + 1,
              endLine: node.endPosition.row + 1,
              signature: `const ${name.text} = ${value.type === "arrow_function" ? "=>" : "function"}`,
            })
          }
        }
      }

      for (const node of root.descendantsOfType("class_declaration")) {
        const name = node.childForFieldName("name")
        const heritage = node.childForFieldName("heritage")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "class",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `class ${name.text}${heritage ? " " + heritage.text : ""}`,
          })
        }
      }

      for (const node of root.descendantsOfType("interface_declaration")) {
        const name = node.childForFieldName("name")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "interface",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `interface ${name.text}`,
          })
        }
      }

      for (const node of root.descendantsOfType("type_alias_declaration")) {
        const name = node.childForFieldName("name")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "type",
            line: node.startPosition.row + 1,
            signature: `type ${name.text}`,
          })
        }
      }

      for (const node of root.descendantsOfType("method_definition")) {
        const name = node.childForFieldName("name")
        if (name && name.text !== "constructor") {
          symbols.push({
            name: name.text,
            kind: "method",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
          })
        }
      }
    }

    if (ext === ".py") {
      for (const node of root.descendantsOfType("function_definition")) {
        const name = node.childForFieldName("name")
        const params = node.childForFieldName("parameters")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "function",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `def ${name.text}${params?.text ?? "()"}`,
          })
        }
      }
      for (const node of root.descendantsOfType("class_definition")) {
        const name = node.childForFieldName("name")
        const bases = node.childForFieldName("superclasses")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "class",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `class ${name.text}${bases ? bases.text : ""}`,
          })
        }
      }
    }

    if (ext === ".go") {
      for (const node of root.descendantsOfType("function_declaration")) {
        const name = node.childForFieldName("name")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "function",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
          })
        }
      }
      for (const node of root.descendantsOfType("type_declaration")) {
        const spec = node.namedChildren[0]
        if (spec) {
          const name = spec.childForFieldName("name")
          if (name) {
            symbols.push({
              name: name.text,
              kind: "type",
              line: node.startPosition.row + 1,
            })
          }
        }
      }
    }

    if (ext === ".rs") {
      for (const node of root.descendantsOfType("function_item")) {
        const name = node.childForFieldName("name")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "function",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
          })
        }
      }
      for (const node of root.descendantsOfType("struct_item")) {
        const name = node.childForFieldName("name")
        if (name) {
          symbols.push({
            name: name.text,
            kind: "class",
            line: node.startPosition.row + 1,
            endLine: node.endPosition.row + 1,
            signature: `struct ${name.text}`,
          })
        }
      }
    }

    return symbols
  }

  export async function parseFile(filePath: string): Promise<Symbol[]> {
    const ext = path.extname(filePath).toLowerCase()
    const parser = await getParser(ext)
    if (!parser) return []

    try {
      const stat = await fs.stat(filePath)
      const cached = cache.get(filePath)
      if (cached && cached.mtimeMs === stat.mtimeMs) {
        return cached.symbols
      }

      const content = await fs.readFile(filePath, "utf-8")
      if (content.length > 500_000) return []

      const tree = parser.parse(content)
      const symbols = extractSymbols(tree, content, ext)
      cache.set(filePath, { mtimeMs: stat.mtimeMs, symbols })
      tree.delete()
      return symbols
    } catch (e) {
      log.warn("parse failed", { file: filePath, error: String(e) })
      return []
    }
  }

  export async function parseFiles(filePaths: string[]): Promise<FileSymbols[]> {
    const results: FileSymbols[] = []
    for (const file of filePaths) {
      const symbols = await parseFile(file)
      if (symbols.length > 0) {
        results.push({ file, symbols })
      }
    }
    return results
  }

  export function formatRepoMap(fileSymbols: FileSymbols[], rootDir: string): string {
    const lines: string[] = []
    for (const { file, symbols } of fileSymbols) {
      const rel = path.relative(rootDir, file).replaceAll("\\", "/")
      lines.push(`${rel}:`)
      for (const sym of symbols) {
        const sig = sym.signature || sym.name
        lines.push(`  ${sym.kind} ${sig} (${sym.line})`)
      }
      lines.push("")
    }
    return lines.join("\n")
  }

  export function clearCache() {
    cache.clear()
  }
}
