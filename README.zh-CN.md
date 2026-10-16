# hugo-theme-termline

[English](README.md) | [简体中文](README.zh-CN.md)

一个极简、线条驱动的终端风格 [Hugo](https://gohugo.io/) 主题。

![termline 主题截图](themes/termline/images/screenshot.png)

## 项目概览

这是用于开发、预览和验证 `termline` 的 Hugo 项目。仓库根目录提供通用演示内容
和项目级覆盖，可发布主题位于 `themes/termline/`，项目不包含真实博客内容或
个人站点数据。

```text
main
├─ hugo.toml + content/       → 项目配置与通用演示内容
├─ layouts/ + assets/         → 项目级覆盖示例
└─ themes/termline/           → 完整、可发布的主题
                               ↓
theme 分支                    → 主题文件位于仓库根目录，可直接安装
```

安装与配置方法请参阅[主题文档](themes/termline/README.zh-CN.md)。

## 主要特性

- 响应式终端风格布局，支持浅色与深色配色
- 英文和简体中文界面文本
- 客户端搜索、归档、标签、封面与分页
- 关于页和足迹页模板
- Markdown 警告块、代码高亮、Mermaid 图表与图片灯箱
- 项目级 CSS、JavaScript 和模板插槽覆盖

## 环境要求

- Hugo Extended `0.163.3` 或更高版本
- 建议使用 PowerShell 7 运行仓库脚本

## 本地开发

在仓库根目录启动开发服务器：

```powershell
./scripts/dev.ps1
```

`content/` 中的通用演示内容仅用于覆盖主题功能。个人内容和配置应保留在
实际使用主题的 Hugo 项目中。

## 仓库结构

| 路径 | 用途 |
| --- | --- |
| `content/` | 用于覆盖主题功能的通用演示页面和文章 |
| `assets/custom/` | 项目级 CSS、JavaScript 覆盖示例 |
| `layouts/partials/hooks/` | 项目级模板插槽覆盖示例 |
| `themes/termline/` | 完整主题，也是 `theme` 分支的发布源 |
| `scripts/dev.ps1` | 本地开发服务器 |
| `scripts/verify-theme.ps1` | 结构、隐私、覆盖机制、资源和构建的完整检查 |

## 覆盖约定

Hugo 会优先使用项目中的同路径文件。仓库根目录保留了主题支持的覆盖位置：

- `assets/custom/custom.css`
- `assets/custom/custom.js`
- `layouts/partials/hooks/*.html`

完整插槽列表参见[自定义与模板插槽](themes/termline/README.zh-CN.md#自定义与模板插槽)。

## 发布方式

`main` 是开发分支。发布工作流会把 `themes/termline/` 导出到 `theme` 分支，
该分支以主题文件作为仓库根目录。Hugo 站点可以通过以下命令安装：

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

创建 Release 或标签前，运行完整检查：

```powershell
./scripts/verify-theme.ps1
```

## 参与贡献

欢迎提交 Issue 和 Pull Request。演示内容应保持通用和匿名；主题运行时代码
放在 `themes/termline/` 中，项目根目录仅用于开发配置和覆盖示例。

## 许可证与署名

`termline` 使用 [MIT License](LICENSE) 开源。部分代码源自 panr 的
[Terminal](https://github.com/panr/hugo-theme-terminal)。随主题分发的第三方组件
及其许可证见 [THIRD_PARTY_NOTICES.md](themes/termline/THIRD_PARTY_NOTICES.md)。
