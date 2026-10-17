# hugo-theme-termline

[English](README.md) | [简体中文](README.zh-CN.md)

一个极简、线条驱动的终端风格 [Hugo](https://gohugo.io/) 主题。

<p align="center">
  <img src="themes/termline/images/screenshot.png" alt="termline 浅色主题截图" width="49%">
  <img src="themes/termline/images/screenshot-dark.png" alt="termline 深色主题截图" width="49%">
</p>

## 项目概览

这是用于开发、预览和验证 `termline` 的 Hugo 项目。仓库根目录包含通用演示内容、
开发脚本和项目级覆盖示例；可独立安装的主题位于 `themes/termline/`。

```text
main
├─ hugo.toml + content/       → 项目配置与通用演示内容
├─ layouts/ + assets/         → 项目级覆盖示例
├─ scripts/                   → 开发与验证脚本
└─ themes/termline/           → 完整、可发布的主题
                               ↓
theme 分支                    → 主题文件位于仓库根目录，可直接安装
```

项目不包含真实博客内容或个人站点数据。完整主题配置请参阅
[主题中文文档](themes/termline/README.zh-CN.md)。

## 主要特性

- 响应式终端风格布局，支持浅色与深色配色
- 英文和简体中文界面文本
- 客户端搜索、归档、标签、封面与分页
- 关于页和足迹页模板
- Markdown 警告块、代码高亮、Mermaid 图表与图片灯箱
- 项目级 CSS、JavaScript 和模板插槽覆盖

## 如何使用

如果想先体验主题效果，请克隆完整的 `main` 分支并运行快速启动脚本。如果已经有
Hugo 站点，可以直接从 `theme` 分支安装主题。

### 1. 准备环境

- [Git](https://git-scm.com/)
- Hugo Extended `0.163.3` 或更高版本
- 建议使用 PowerShell 7 运行仓库脚本

安装完成后，可以检查 Hugo 版本：

```powershell
hugo version
```

### 2. 快速预览主题

在 PowerShell 中克隆开发仓库：

```powershell
git clone --branch main https://github.com/wobushi041/hugo-theme-termline.git
Set-Location .\hugo-theme-termline
.\scripts\dev.ps1
```

脚本默认在 `http://127.0.0.1:1313/` 启动开发服务器。如果该端口已被占用，
脚本会自动选择后续可用端口，请以终端实际输出的地址为准。

也可以手动指定起始端口：

```powershell
.\scripts\dev.ps1 -Port 1414
```

按 `Ctrl+C` 停止开发服务器。`scripts/dev.ps1` 仅存在于用于开发和预览的
`main` 分支；精简发布的 `theme` 分支只包含可安装的主题文件。

### 3. 安装到现有 Hugo 站点

推荐使用 Git submodule 安装 `theme` 分支：

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

后续更新主题：

```bash
git submodule update --remote --merge themes/termline
```

也可以下载 `theme` 分支或 Release 压缩包，将其解压到站点的
`themes/termline/` 目录。

### 4. 配置站点

在站点根目录的 `hugo.toml` 中启用主题，并配置搜索所需的 JSON 首页输出：

```toml
baseURL = "https://example.org/"
title = "示例站点"
theme = "termline"
defaultContentLanguage = "zh-cn"

[outputs]
home = ["HTML", "RSS", "JSON"]

[params]
contentTypeName = "posts"
showMenuItems = 6
fullWidthTheme = false
centerTheme = true
autoCover = true
showLastUpdated = false

[languages]
[languages.zh-cn]
label = "简体中文"
weight = 1

[languages.zh-cn.params]
subtitle = "一个极简的终端风格博客"

[languages.zh-cn.params.logo]
logoText = "termline"
logoHomeLink = "/"
```

### 5. 创建文章并启动站点

```bash
hugo new content posts/hello.md
hugo server
```

打开终端输出中的本地地址即可预览。如果文章仍为草稿，可以使用：

```bash
hugo server --buildDrafts
```

### 6. 生成静态站点

```bash
hugo
```

生成结果位于 `public/`，可以部署到任意静态网站托管平台。

## 仓库结构

| 路径 | 用途 |
| --- | --- |
| `content/` | 用于覆盖主题功能的通用演示页面和文章 |
| `assets/custom/` | 项目级 CSS、JavaScript 覆盖示例 |
| `layouts/partials/hooks/` | 项目级模板插槽覆盖示例 |
| `themes/termline/` | 完整主题，也是 `theme` 分支的发布源 |
| `scripts/dev.ps1` | 自动选择可用端口并启动本地开发服务器 |
| `scripts/verify-theme.ps1` | 结构、隐私、覆盖机制、资源和构建的完整检查 |

`content/` 中的通用演示内容仅用于覆盖主题功能。个人内容和配置应保留在实际使用
主题的 Hugo 项目中。

## 覆盖约定

Hugo 会优先使用项目中的同路径文件。仓库根目录保留了主题支持的覆盖位置：

- `assets/custom/custom.css`
- `assets/custom/custom.js`
- `layouts/partials/hooks/*.html`

完整插槽列表参见[自定义与模板插槽](themes/termline/README.zh-CN.md#自定义与模板插槽)。

## 发布方式

`main` 是开发分支。发布工作流会把 `themes/termline/` 导出到 `theme` 分支，
使主题文件直接位于分支根目录。

```text
main: themes/termline/   →   theme: /
```

创建 Release 或标签前，请运行完整检查：

```powershell
.\scripts\verify-theme.ps1
```

## 参与贡献

欢迎提交 Issue 和 Pull Request。演示内容应保持通用和匿名；主题运行时代码放在
`themes/termline/` 中，项目根目录仅用于开发配置和覆盖示例。

## 许可证与署名

`termline` 使用 [MIT License](LICENSE) 开源。部分代码源自 panr 的
[Terminal](https://github.com/panr/hugo-theme-terminal)。随主题分发的第三方组件
及其许可证见 [THIRD_PARTY_NOTICES.md](themes/termline/THIRD_PARTY_NOTICES.md)。
