import { addons, types } from "storybook/manager-api"
import { ThemeTool } from "./theme-tool"

addons.register("codeforge/theme-toggle", () => {
  addons.add("codeforge/theme-toggle/tool", {
    type: types.TOOL,
    title: "Theme",
    match: ({ viewMode }) => viewMode === "story" || viewMode === "docs",
    render: ThemeTool,
  })
})
