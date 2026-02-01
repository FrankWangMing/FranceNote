# FranceNotes

法语学习笔记应用 - 一个基于 React + Vite 构建的静态网站，用于展示法语学习内容（语法、词汇、课文、对话）和练习题。

## 功能特性

- 📚 **学习笔记**：包含 A1-B2 级别的语法、词汇、课文和情景对话
- 🎯 **练习题**：多种类型的练习题（选择题、填空题、翻译题）
- 🔊 **音频播放**：支持法语短语的标准发音
- 🎨 **现代化 UI**：使用 Tailwind CSS 和 Radix UI 构建的响应式界面

## 技术栈

- **框架**：React 19 + TypeScript
- **构建工具**：Vite 7
- **路由**：Wouter
- **样式**：Tailwind CSS 4
- **UI 组件**：Radix UI
- **包管理**：pnpm

## 开发

### 前置要求

- Node.js 20+
- pnpm 10.4.1+

### 安装依赖

```bash
cd fronted
pnpm install
```

### 开发服务器

```bash
pnpm dev
```

应用将在 `http://localhost:3000` 启动。

### 构建

```bash
pnpm build
```

构建产物将输出到 `fronted/dist` 目录。

### 预览构建结果

```bash
pnpm preview
```

## 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

项目已配置 GitHub Actions 工作流，自动部署到 GitHub Pages：

1. 确保仓库已启用 GitHub Pages（Settings → Pages）
2. 将代码推送到 `main` 或 `master` 分支
3. GitHub Actions 会自动构建并部署

### 方法二：手动部署

1. 构建项目：
   ```bash
   cd fronted
   pnpm build
   ```

2. 将 `fronted/dist` 目录的内容推送到 GitHub 仓库的 `gh-pages` 分支

3. 在 GitHub 仓库设置中启用 GitHub Pages，选择 `gh-pages` 分支作为源

### 配置 Base 路径

如果仓库名称不是 `FranceNotes`，需要修改 `fronted/vite.config.ts` 中的 `base` 配置：

```typescript
base: "/你的仓库名/",
```

如果使用自定义域名，设置为：

```typescript
base: "/",
```

## 项目结构

```
FranceNotes/
├── fronted/              # 前端项目
│   ├── client/          # 客户端代码
│   │   ├── public/      # 静态资源（JSON 数据文件）
│   │   └── src/         # 源代码
│   ├── shared/          # 共享代码
│   └── dist/            # 构建输出目录
└── .github/
    └── workflows/       # GitHub Actions 工作流
```

## 许可证

MIT

---

## 内容 ID 规则（按 A1→B2 难度 + 领域组织）

为便于前端路由与数据管理，每条学习单元的 `id` 遵循以下格式：

**格式**：`{type}-{level}-{序号}`

- **type**：领域缩写（与 `ContentType` 对应）
  - `dlg`：情景对话（dialogue）
  - `les`：课文（lesson）
  - `rdg`：阅读（reading）
  - `voc`：词汇（vocabulary）
  - `gra`：语法（grammar）
  - `cul`：文化（culture）

- **level**：难度等级（CEFR）：`A1` / `A2` / `B1` / `B2`

- **序号**：两位数字（01–99），同一级别 + 类型下递增，跨级别独立编号

**示例**：
- `dlg-a1-01`：A1 情景对话第 1 篇
- `gra-b1-03`：B1 语法第 3 节
- `voc-a2-01`：A2 词汇第 1 组
- `cul-a1-geo`：A1 文化（法国地理）可用主题后缀辅助（可选，不建议在 `id` 中含主题，主题用 `domain` 字段）

**注意**：
- 同一 `level` + `type` 下序号递增；跨 `level` 时序号独立（如 dlg-a1-99 之后是 dlg-a2-01，而非 dlg-a1-100）。
- 若需要区分同级别同类型的不同子主题，优先在 `ContentUnit` 的 `domain` 或 `tags` 字段描述，而不是把主题编码进 `id`。
