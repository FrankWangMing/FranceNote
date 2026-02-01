# 前端目录与命名参考

## 目录结构 (client/src)

- **components/** 业务或共享组件；**components/ui/** Radix/shadcn 风格基础 UI（Button、Card、Input、Dialog 等）。
- **pages/** 页面级组件，对应路由；默认导出。
- **contexts/** React Context 提供者（如 ThemeProvider）。
- **hooks/** 自定义 Hooks（如 useMobile、usePersistFn）。
- **lib/** 工具函数（如 `utils.ts` 的 `cn()`）。

## 命名约定

- 组件文件：PascalCase（`ExerciseCard.tsx`、`AudioPlayer.tsx`）。
- 工具/Hook 文件：camelCase（`utils.ts`、`useMobile.tsx`）。
- 路由路径：小写、短横线（`/exercises`、`/404`）。
