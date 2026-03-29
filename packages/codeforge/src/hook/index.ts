import { execFile } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs/promises"
import { Log } from "../util/log"
import { Instance } from "../project/instance"

const execFileAsync = promisify(execFile)

export namespace Hooks {
  const log = Log.create({ service: "hooks" })

  type HookCommand = {
    type: "command"
    command: string
    timeout?: number
  }

  type HookMatcher = {
    matcher?: string
    hooks: HookCommand[]
  }

  type HookConfig = {
    PreToolUse?: HookMatcher[]
    PostToolUse?: HookMatcher[]
    Stop?: HookMatcher[]
    Notification?: HookMatcher[]
  }

  async function loadConfig(): Promise<HookConfig> {
    const configPaths = [
      path.join(Instance.worktree, ".codeforge", "hooks.json"),
      path.join(Instance.worktree, ".codeforge", "settings.json"),
    ]

    for (const configPath of configPaths) {
      try {
        const content = await fs.readFile(configPath, "utf-8")
        const parsed = JSON.parse(content)
        if (parsed.hooks) {
          return parsed.hooks as HookConfig
        }
      } catch {}
    }

    return {}
  }

  function matchesTool(matcher: string | undefined, toolName: string): boolean {
    if (!matcher) return true
    if (matcher === "*") return true
    if (matcher.toLowerCase() === toolName.toLowerCase()) return true
    try {
      return new RegExp(matcher, "i").test(toolName)
    } catch {
      return matcher.toLowerCase() === toolName.toLowerCase()
    }
  }

  async function runHook(
    hook: HookCommand,
    env: Record<string, string>,
  ): Promise<{ stdout: string; stderr: string; code: number }> {
    const timeout = hook.timeout ?? 30000
    try {
      const result = await execFileAsync("sh", ["-c", hook.command], {
        cwd: Instance.worktree,
        env: { ...process.env, ...env },
        timeout,
        maxBuffer: 1024 * 1024,
      })
      return { stdout: result.stdout, stderr: result.stderr, code: 0 }
    } catch (err: any) {
      const code = err.code ?? 1
      const stdout = err.stdout ?? ""
      const stderr = err.stderr ?? String(err)
      log.warn("hook failed", { command: hook.command, code, stderr: stderr.slice(0, 200) })
      return { stdout, stderr, code }
    }
  }

  export async function preToolUse(
    toolName: string,
    input: Record<string, any>,
  ): Promise<{ blocked: boolean; reason?: string }> {
    const config = await loadConfig()
    const matchers = config.PreToolUse ?? []

    const env: Record<string, string> = {
      TOOL_NAME: toolName,
      TOOL_INPUT: JSON.stringify(input),
      FILE_PATH: input.file_path ?? input.filePath ?? "",
    }

    for (const matcher of matchers) {
      if (!matchesTool(matcher.matcher, toolName)) continue

      for (const hook of matcher.hooks) {
        const result = await runHook(hook, env)
        if (result.code !== 0) {
          const reason = result.stderr.trim() || result.stdout.trim() || `Hook exited with code ${result.code}`
          log.info("pre-hook blocked tool", { tool: toolName, reason })
          return { blocked: true, reason }
        }
      }
    }

    return { blocked: false }
  }

  export async function postToolUse(
    toolName: string,
    input: Record<string, any>,
    output: string,
  ): Promise<void> {
    const config = await loadConfig()
    const matchers = config.PostToolUse ?? []

    const env: Record<string, string> = {
      TOOL_NAME: toolName,
      TOOL_INPUT: JSON.stringify(input),
      TOOL_OUTPUT: output.slice(0, 10000),
      FILE_PATH: input.file_path ?? input.filePath ?? "",
    }

    for (const matcher of matchers) {
      if (!matchesTool(matcher.matcher, toolName)) continue

      for (const hook of matcher.hooks) {
        const result = await runHook(hook, env)
        if (result.stdout.trim()) {
          log.info("post-hook output", { tool: toolName, output: result.stdout.trim().slice(0, 200) })
        }
      }
    }
  }

  export async function stop(): Promise<void> {
    const config = await loadConfig()
    const matchers = config.Stop ?? []

    for (const matcher of matchers) {
      for (const hook of matcher.hooks) {
        await runHook(hook, {})
      }
    }
  }
}
