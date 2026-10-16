# Hugo Theme Extraction Design

## 目标

将当前 Hugo 博客副本整理为一个不包含真实文章和个人站点数据的主题开发仓库。仓库根目录作为带中性示例内容的开发壳，通过 `theme = "termline"` 加载 `themes/termline/`；该子目录是唯一完整主题实现和后续发布单元。

命名契约固定为：对外展示名 `termline`、Hugo 主题 slug `termline`、主题目录 `themes/termline/`，Git 仓库名使用便于检索的 `hugo-theme-termline`。

## 最终结构

```text
E:\blog-theme
├─ hugo.toml
├─ LICENSE
├─ content/                  # 可公开复用的中性展示内容
├─ assets/custom/
│  ├─ custom.css
│  └─ custom.js
├─ layouts/partials/hooks/
│  ├─ head-end.html
│  ├─ body-start.html
│  ├─ header-after.html
│  ├─ content-before.html
│  ├─ content-after.html
│  ├─ footer-before.html
│  └─ body-end.html
├─ scripts/
│  ├─ dev.ps1
│  └─ verify-theme.ps1
├─ .github/workflows/
│  ├─ build.yml
│  └─ publish-theme.yml
└─ themes/termline/
   ├─ archetypes/
   ├─ assets/
   ├─ i18n/
   ├─ layouts/
   ├─ static/
   ├─ images/
   ├─ hugo.toml
   ├─ theme.toml
   ├─ LICENSE
   ├─ THIRD_PARTY_NOTICES.md
   └─ README.md
```

## 边界

- 不保留真实文章和个人数据；允许提交不含真实人物、账号、地点轨迹和站点信息的中性 `content/` 示例。
- 不保留 `raw/`、个人头像、个人背景、备案信息、邮箱、个人域名、真实旅行数据或文章封面。
- 不创建 `exampleSite/`。构建验证脚本在系统临时目录动态生成匿名测试站点，完成后安全删除。
- 根目录不保留完整 `_default`、页面模板或主题基础样式；根目录只保留稳定 hook 和 `assets/custom/` 覆盖插槽。
- `themes/termline/` 必须独立包含所有运行时模板、样式、脚本、字体、图标和第三方前端资源。
- `main` 保留开发壳，`theme` 分支通过 `git subtree split` 只发布 `themes/termline/`，使主题文件位于仓库根并可直接作为 Git submodule 安装。
- 默认 Hugo 最低版本为 `0.163.3`，与当前已验证开发环境一致。

## 覆盖接口

主题在基础模板中固定调用以下 partial：

```text
hooks/head-end.html
hooks/body-start.html
hooks/header-after.html
hooks/content-before.html
hooks/content-after.html
hooks/footer-before.html
hooks/body-end.html
```

主题同时加载 `assets/custom/custom.css` 和 `assets/custom/custom.js`。主题内提供无输出默认文件，仓库根目录提供同路径覆盖文件。Hugo 统一文件系统会优先选择根目录版本。

## 配置职责

- 根 `hugo.toml`：中性开发站配置、`theme = "termline"`、构建所需 outputs 与 markup 设置。
- 主题 `hugo.toml`：主题默认参数和 `[module.hugoVersion]`。
- `theme.toml`：主题展示元数据、作者、派生来源和许可证链接。
- 页面专属数据继续由使用者通过 Front Matter 提供；模板在数据缺失时必须正常渲染空状态。

## 开源和归属

当前代码与 `panr/hugo-theme-terminal` 存在大量路径和实现继承关系。仓库根与主题发布单元均使用 MIT 许可证，保留 `Copyright (c) 2024 panr`，增加当前维护者版权，并在 `theme.toml`、README 和 `THIRD_PARTY_NOTICES.md` 中标注 Terminal 派生来源。GLightbox、Mermaid 和 Fira Code 的许可证与来源一并记录。

## 验证

验证只在三个实现模块全部完成后执行。`scripts/verify-theme.ps1` 是唯一验收入口；以下内容是同一次最终体检内部的检查层，而不是分散在迁移过程中的阶段性测试：

```text
目录契约检查
    ↓
隐私与硬编码扫描
    ↓
临时匿名站点完整构建与输出断言
```

CI 在 Windows 和 Ubuntu 上运行同一个 PowerShell 验证脚本，并使用 Hugo `0.163.3` 构建匿名测试站点；独立发布工作流将 `themes/termline/` 同步到 `theme` 分支。实现过程中仅允许按完整目录和完整接口模块迁移，不在中间状态运行 Hugo 构建。
