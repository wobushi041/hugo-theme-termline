$ErrorActionPreference = "Stop"

hugo server `
  --source . `
  --themesDir themes `
  --theme termline `
  --bind 127.0.0.1 `
  --port 1313 `
  --baseURL http://127.0.0.1:1313/
