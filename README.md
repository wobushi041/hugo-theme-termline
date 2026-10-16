# hugo-theme-termline

Development repository for `termline`, a minimal line-driven terminal theme for Hugo.

## Repository Structure

```text
仓库根目录                  → 中性 Hugo 开发壳与覆盖插槽
themes/termline/            → 完整主题与唯一发布单元
theme 分支                  → 以主题目录为仓库根的安装分支
scripts/verify-theme.ps1    → 最终全面体检与匿名临时站点
```

## Local Development

Start the local development server:

```powershell
./scripts/dev.ps1
```

The root repository contains a neutral development configuration, reusable
example content, and hook slots. It does not contain personal blog content or
personal site data.

## Distribution

Changes under `themes/termline/` are published to the `theme` branch, where the
theme files are located at the repository root. This keeps the development
shell on `main` while allowing Hugo sites to install the theme directly:

```bash
git submodule add -b theme https://github.com/wobushi041/hugo-theme-termline.git themes/termline
```

## Verification

To run full validation including privacy, structure, hooks contract, and an anonymous temporary site build:

```powershell
./scripts/verify-theme.ps1
```

## License

MIT © panr, wobushi041. See [LICENSE](LICENSE) and
[themes/termline/THIRD_PARTY_NOTICES.md](themes/termline/THIRD_PARTY_NOTICES.md).
