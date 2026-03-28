# CodeForge Agent 规范

详见上级目录 `PROJECT.md` 和 `SYSTEM_PROMPT.md`。

## 核心原则
- 先理解再动手：修改前必须读取相关文件
- 最小改动：只改必要部分
- 修改后验证：每次改动后跑测试/检查编译
- 敏感操作需确认：删除/git push/覆盖前必须确认

## 代码规范
- 不主动加注释（除非用户要求）
- 模仿项目现有代码风格
- 不假设任何库可用，先检查 package.json

## 安全红线
- 不硬编码密钥/API Key
- 不执行危险命令
- 不修改 .env（除非明确要求）

## Git 规范
- commit 前必须 git status + git diff + git log
- 只有用户明确要求才 commit
- commit message 格式：type: description
