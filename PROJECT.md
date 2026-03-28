# CodeForge 2.0 — Claude Code 复刻方案

## 核心策略：Fork OpenCode + 改造

不从零写，直接 fork 开源的 OpenCode（anomalyco/opencode），只改差异化部分。
已有能力：TUI / 工具层 / 流式输出 / 多 provider / 插件系统 / TodoWrite / Task Agent。

## 技术栈

- 基础：OpenCode（TypeScript + Bun + Ink/React）
- LLM SDK：Vercel AI SDK（已有）
- 代码解析：tree-sitter（新增）
- Checkpoint：文件快照系统（新增）
- 记忆：OpenViking（已有）

## 五阶段改造

### Phase 1：Fork + 改名（第 1-3 天）✅ 完成

1. ✅ Clone OpenCode 到 codeforge-v2
2. ✅ Remote 指向 fqw700/codeforge.git
3. ✅ 全局改名 opencode → codeforge
4. ✅ bun install + TUI 跑通

### Phase 2：重写 Prompt（第 4-7 天）✅ 完成

5. ✅ anthropic.txt 重写（10.8KB，深度对齐 Claude Code）
6. ✅ default.txt 同步精简版
7. ✅ 工具定义审计 — bash/edit/task/todowrite 已和 Claude Code 对齐

### Phase 3：加 Checkpoint（第 2 周）

8. Checkpoint 系统 — 每次写入前保存快照，Esc 回退

### Phase 4：加 Repo Map（第 2-3 周）✅ 完成

9. ✅ tree-sitter 解析器 — 支持 TS/JS/Python/Go/Rust
10. ✅ `<repo_map>` 注入 system prompt

### Phase 5：强化（第 3 周）✅ 完成

11. ✅ 溢出检测（overflow.ts）
12. ✅ 对话压缩（compaction.ts）— AI 生成结构化摘要
13. ✅ 工具输出截断（truncate.ts）

### 全部 5 Phase 完成 🎯

| Phase | 内容 | 状态 |
|-------|------|------|
| 1 | Fork + 改名 + TUI | ✅ |
| 2 | 重写 Prompt + 工具审计 | ✅ |
| 3 | Checkpoint 快照回退 | ✅（已有） |
| 4 | Repo Map + tree-sitter | ✅（新建） |
| 5 | 智能上下文管理 | ✅（已有） |

## 核心文件

```
codeforge-v2/
├── packages/codeforge/src/
│   ├── session/
│   │   ├── prompt/
│   │   │   ├── anthropic.txt    ✅ 已改名 CodeForge
│   │   │   ├── default.txt      ✅ 已改名
│   │   │   ├── gpt.txt          ✅ 已改名
│   │   │   └── ...              ✅ 全部改名
│   │   ├── prompt.ts            ← 组装完整 prompt（72KB 核心）
│   │   ├── system.ts            ← 模型选择 + 环境注入
│   │   ├── todo.ts              ← TodoWrite（已有）
│   │   └── instruction.ts       ← 指令构建
│   ├── tool/
│   │   ├── task.ts              ← Task 子 Agent（已有）
│   │   ├── read.ts / edit.ts    ← 文件工具（已有）
│   │   └── ...
│   └── ...
├── SYSTEM_PROMPT.md             ← 我们写的参考 Prompt
├── PROJECT.md                   ← 本文件
└── .opencode/                   ← OpenCode 配置
```

## 参考资源

- Claude Code Prompt.txt：桌面 system-prompts 仓库
- Claude Code Tools.json：同上
- OpenCode 源码：已 clone 到本目录
