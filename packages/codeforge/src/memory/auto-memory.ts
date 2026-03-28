import fs from "fs/promises"
import path from "path"
import { Log } from "../util/log"
import { Instance } from "../project/instance"

export namespace AutoMemory {
  const log = Log.create({ service: "auto-memory" })

  const MEMORY_DIR = ".codeforge"
  const MEMORY_FILE = "memory.md"

  function memoryPath(): string {
    return path.join(Instance.worktree, MEMORY_DIR, MEMORY_FILE)
  }

  export async function ensureDir() {
    const dir = path.join(Instance.worktree, MEMORY_DIR)
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch {}
  }

  export async function read(): Promise<string> {
    try {
      return await fs.readFile(memoryPath(), "utf-8")
    } catch {
      return ""
    }
  }

  export async function append(section: string) {
    if (!section.trim()) return

    await ensureDir()
    const filePath = memoryPath()
    const timestamp = new Date().toISOString().slice(0, 16).replace("T", " ")

    let existing = ""
    try {
      existing = await fs.readFile(filePath, "utf-8")
    } catch {}

    const entry = `\n### ${timestamp}\n\n${section.trim()}\n`

    if (existing) {
      await fs.writeFile(filePath, existing + entry, "utf-8")
    } else {
      const header = `# ${path.basename(Instance.worktree)} — 自动记忆\n\n由 CodeForge 在对话压缩时自动生成。不要手动编辑此文件。\n`
      await fs.writeFile(filePath, header + entry, "utf-8")
    }

    log.info("appended auto-memory", { file: filePath })
  }

  export function extractDiscoveries(summary: string): string {
    const lines = summary.split("\n")
    const result: string[] = []
    let inSection = false
    let sectionName = ""

    for (const line of lines) {
      const headerMatch = line.match(/^##?\s+(.+)/)
      if (headerMatch) {
        sectionName = headerMatch[1].trim().toLowerCase()
        inSection =
          sectionName.includes("discover") ||
          sectionName.includes("发现") ||
          sectionName.includes("learn") ||
          sectionName.includes("note") ||
          sectionName.includes("relevant file")
        continue
      }

      if (inSection && line.trim()) {
        result.push(line)
      }
    }

    return result.join("\n")
  }

  export async function processCompactionSummary(summary: string) {
    const discoveries = extractDiscoveries(summary)
    if (discoveries.trim()) {
      await append(discoveries)
    }
  }
}
