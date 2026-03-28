import { Ripgrep } from "../file/ripgrep"
import { RepoMap } from "../parser/repo-map"

import { Instance } from "../project/instance"

import PROMPT_ANTHROPIC from "./prompt/anthropic.txt"
import PROMPT_DEFAULT from "./prompt/default.txt"
import PROMPT_BEAST from "./prompt/beast.txt"
import PROMPT_GEMINI from "./prompt/gemini.txt"
import PROMPT_GPT from "./prompt/gpt.txt"

import PROMPT_CODEX from "./prompt/codex.txt"
import PROMPT_TRINITY from "./prompt/trinity.txt"
import type { Provider } from "@/provider/provider"
import type { Agent } from "@/agent/agent"
import { Permission } from "@/permission"
import { Skill } from "@/skill"

export namespace SystemPrompt {
  export function provider(model: Provider.Model) {
    if (model.api.id.includes("gpt-4") || model.api.id.includes("o1") || model.api.id.includes("o3"))
      return [PROMPT_BEAST]
    if (model.api.id.includes("gpt")) {
      if (model.api.id.includes("codex")) {
        return [PROMPT_CODEX]
      }
      return [PROMPT_GPT]
    }
    if (model.api.id.includes("gemini-")) return [PROMPT_GEMINI]
    if (model.api.id.includes("claude")) return [PROMPT_ANTHROPIC]
    if (model.api.id.toLowerCase().includes("trinity")) return [PROMPT_TRINITY]
    return [PROMPT_DEFAULT]
  }

  export async function environment(model: Provider.Model) {
    const project = Instance.project

    // Build directory tree
    const dirTree = project.vcs === "git"
      ? await Ripgrep.tree({ cwd: Instance.directory, limit: 50 })
      : ""

    // Build repo map (symbol-level view of code)
    const repoMapContent = await repoMap()

    return [
      [
        `You are powered by the model named ${model.api.id}. The exact model ID is ${model.providerID}/${model.api.id}`,
        `Here is some useful information about the environment you are running in:`,
        `<env>`,
        `  Working directory: ${Instance.directory}`,
        `  Workspace root folder: ${Instance.worktree}`,
        `  Is directory a git repo: ${project.vcs === "git" ? "yes" : "no"}`,
        `  Platform: ${process.platform}`,
        `  Today's date: ${new Date().toDateString()}`,
        `</env>`,
        dirTree ? `<directories>\n${dirTree}\n</directories>` : "",
        repoMapContent || "",
      ].join("\n"),
    ]
  }

  export async function repoMap() {
    try {
      const project = Instance.project
      if (project.vcs !== "git") return ""

      // Get all source files
      const files: string[] = []
      const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".rs"])
      for await (const file of Ripgrep.files({ cwd: Instance.directory })) {
        const ext = file.slice(file.lastIndexOf(".")).toLowerCase()
        if (exts.has(ext)) {
          files.push(file)
        }
      }

      // Parse top 50 files for symbols
      const topFiles = files.slice(0, 50)
      const parsed = await RepoMap.parseFiles(topFiles)
      if (parsed.length === 0) return ""

      const map = RepoMap.formatRepoMap(parsed, Instance.worktree)
      return [
        `<repo_map>`,
        map,
        `</repo_map>`,
      ].join("\n")
    } catch {
      return ""
    }
  }

  export async function skills(agent: Agent.Info) {
    if (Permission.disabled(["skill"], agent.permission).has("skill")) return

    const list = await Skill.available(agent)

    return [
      "Skills provide specialized instructions and workflows for specific tasks.",
      "Use the skill tool to load a skill when a task matches its description.",
      Skill.fmt(list, { verbose: true }),
    ].join("\n")
  }
}
