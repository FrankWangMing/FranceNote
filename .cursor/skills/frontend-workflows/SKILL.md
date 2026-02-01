---
name: frontend-workflows
description: Guides creating React components, pages, and routes; runs accessibility checks; uses existing UI components. Use when the user asks to add a component, add a page, do accessibility review, or refactor frontend code.
---

# 前端工作流

## Quick start

- 前端代码在 `client/src`：`components/`（含 `ui/`）、`pages/`、`hooks/`、`contexts/`、`lib/`。新代码放在对应目录。
- UI 优先用 `@/components/ui/*`（Button、Card、Input 等），样式用 Tailwind + `cn()` from `@/lib/utils`。
- 路由在 `App.tsx` 的 `Router` 里用 wouter 的 `Route` 注册；路径风格与现有 `/`、`/exercises`、`/404` 一致。

---

## Task plan: 新建组件

1. **路径与命名**：按用途放在 `components/` 或 `components/ui/`；文件名 PascalCase（如 `ExerciseCard.tsx`）。
2. **Props 类型**：为组件定义 `interface Props` 或 `type`，必填/可选写清。
3. **使用现有 UI**：从 `@/components/ui` 引入 Button、Card、Input 等，不重复实现。
4. **样式**：用 Tailwind 类名，需要合并或条件类时用 `cn()`；有多个变体时可用 cva（参考 `components/ui/button.tsx`）。
5. **无障碍**：按钮/链接用 `<button>`/`<a>`；表单控件关联 `<Label>`；可聚焦区域保证键盘可操作。
6. **导出与使用**：在需要处 `import`；可复用组件用 `export function` 或 `export default`，与项目现有方式一致。

---

## Task plan: 新建页面与路由

1. **页面组件**：在 `client/src/pages/` 下新建文件（如 `NewPage.tsx`），函数组件 + 明确类型，默认导出。
2. **注册路由**：在 `client/src/App.tsx` 的 `Router` 内增加一条 `<Route path="/your-path" component={NewPage} />`；如需 404，保持最后一条为 `<Route component={NotFound} />`。
3. **导航**：需要跳转时用 wouter 的 `useLocation` 得到 `navigate`，或使用 `<Link href="/your-path">`（若项目有封装）；路径与现有风格一致（小写、短横线）。
4. **布局与主题**：页面无需再包 `ThemeProvider`、`TooltipProvider`、`Toaster`，根 App 已提供。

---

## Task plan: 可访问性检查

按下列清单检查页面或组件，并遵循 `.cursor/rules/frontend-a11y.mdc` 中的约定：

- **语义**：按钮用 `<button>`，链接用 `<a href="...">`；标题层级用 `<h1>`～`<h6>`，不跳级。
- **ARIA**：仅在有需要时补充（如自定义控件、加载状态）；能用原生语义的不用 ARIA 覆盖。
- **焦点**：交互元素可被 Tab 聚焦；自定义控件（如弹层、手风琴）保证焦点进入/离开与 Esc 关闭合理。
- **键盘**：列表、菜单、标签页等支持方向键与 Enter/Space；关闭用 Esc。
- **表单**：每个输入都有可见的 `<Label>` 或 `aria-label`；错误用 `aria-invalid` 与可见提示关联。
- **对比度与可见性**：文字与背景对比足够；不单独用颜色表达信息；焦点环可见（项目 UI 组件已带 `focus-visible` 样式）。

可选：在关键流程用键盘走一遍，确认无焦点陷阱、顺序合理。

---

## 参考

- 组件/页面命名与目录结构见 [reference.md](reference.md)（若有）。
- 编码规范见 `.cursor/rules/` 下 `frontend-ts-react.mdc`、`frontend-ui-tailwind.mdc`、`frontend-a11y.mdc`。
