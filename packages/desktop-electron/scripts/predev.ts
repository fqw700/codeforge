import { $ } from "bun"

import { copyBinaryToSidecarFolder, getCurrentSidecar, windowsify } from "./utils"

await $`bun ./scripts/copy-icons.ts ${process.env.OPENCODE_CHANNEL ?? "dev"}`

const RUST_TARGET = Bun.env.RUST_TARGET

const sidecarConfig = getCurrentSidecar(RUST_TARGET)

const binaryPath = windowsify(`../codeforge/dist/${sidecarConfig.ocBinary}/bin/codeforge`)

await (sidecarConfig.ocBinary.includes("-baseline")
  ? $`cd ../codeforge && bun run build --single --baseline`
  : $`cd ../codeforge && bun run build --single`)

await copyBinaryToSidecarFolder(binaryPath, RUST_TARGET)
