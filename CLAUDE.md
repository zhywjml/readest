# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Readest is an open-source ebook reader built as a **Next.js 16 + Tauri v2** hybrid application. It's organized as a pnpm monorepo that targets multiple platforms from a single codebase:

- **Web**: Deployed to Cloudflare Workers (PWA via Serwist)
- **Desktop**: macOS, Windows, Linux via Tauri
- **Mobile**: iOS, Android via Tauri

## Monorepo Structure

```
├── apps/
│   ├── readest-app/          # Main Next.js + Tauri application
│   └── readest.koplugin/     # KOReader sync plugin (Lua)
├── packages/
│   ├── foliate-js/           # Ebook rendering engine (fork)
│   ├── simplecc-wasm/        # Chinese text conversion WASM
│   ├── qcms/                 # Color management
│   └── tauri-plugins/        # Shared Tauri plugin utilities
├── Cargo.toml                # Workspace-level Rust config
└── pnpm-workspace.yaml       # pnpm workspace definition
```

## Development Commands

All commands run from the monorepo root and delegate to the readest-app package:

```bash
# Web development (fastest - no Rust compilation)
pnpm dev-web

# Desktop development (compiles Rust backend)
pnpm tauri dev

# Mobile development
pnpm tauri ios dev
pnpm tauri android dev

# Building
pnpm build-web               # Static export for web
pnpm tauri build             # Desktop production build
pnpm tauri ios build
pnpm tauri android build

# Linting & Formatting
pnpm lint                    # Biome + TypeScript check
pnpm format                  # Prettier across monorepo
pnpm fmt:check               # Rust format check
pnpm clippy:check            # Rust linting
```

## Testing Architecture

The project uses a three-tier testing approach via Vitest:

| Command | Environment | Use Case |
|---------|-------------|----------|
| `pnpm test` | jsdom | Unit tests for pure logic |
| `pnpm test:browser` | Chromium (Playwright) | Browser APIs, Web Workers, WASM |
| `pnpm test:tauri` | Tauri WebView | Native plugin integration |
| `pnpm test:e2e` | WDIO | Full UI automation |

Test file naming convention:
- `*.test.ts` → Unit tests (jsdom)
- `*.browser.test.ts` → Browser tests
- `*.tauri.test.ts` → Tauri integration tests
- `*.e2e.ts` → E2E tests

## Platform Abstractions

The codebase uses several strategies to handle platform differences:

### Build-time Abstraction
- `NEXT_PUBLIC_APP_PLATFORM` env var controls platform-specific code paths
- `export const IS_TAURI = process.env.NEXT_PUBLIC_APP_PLATFORM !== 'web'`

### Tauri Conditional Imports
Webpack/Turbopack aliases disable WASM database on non-web platforms:
```javascript
// next.config.mjs
'@tursodatabase/database-wasm': appPlatform !== 'web' ? false : undefined
```

### Native Modules
Rust backend code is organized by platform in `src-tauri/src/{macos,windows,android,ios}/`.

## Key Dependencies

- **foliate-js**: Ebook rendering engine (local fork in `packages/`)
- **@tauri-apps/api**: Frontend-to-Rust IPC
- **@supabase/supabase-js**: Cloud sync (web) / Local auth (desktop)
- **@tursodatabase/database-wasm**: SQLite in browser via WASM
- **zustand**: State management
- **i18next**: Internationalization (see `docs/i18n.md`)

## Custom Tauri Plugins

Located in `apps/readest-app/src-tauri/plugins/`:

- **tauri-plugin-native-bridge**: Platform-specific native functionality
- **tauri-plugin-native-tts**: Text-to-speech integration
- **tauri-plugin-turso**: Turso/libSQL database access

## Important File Locations

| File | Purpose |
|------|---------|
| `apps/readest-app/.env.tauri` | Desktop build env vars |
| `apps/readest-app/.env.web` | Web build env vars |
| `apps/readest-app/src-tauri/tauri.conf.json` | Tauri app configuration |
| `apps/readest-app/src-tauri/capabilities/` | Tauri permission definitions |
| `apps/readest-app/next.config.mjs` | Next.js + build configuration |
| `apps/readest-app/vitest.config.mts` | Unit test configuration |

## Release Process

Version bumps and releases are managed via GitHub Actions (`.github/workflows/release.yml`). The workflow:
1. Extracts version from `apps/readest-app/package.json`
2. Builds for all platforms (macOS universal, Windows x64/ARM64, Linux AppImage)
3. Packages KOReader plugin
4. Updates GitHub release with built artifacts

## Contributing Notes

See `CONTRIBUTING.md` for setup instructions. Key points:
- Requires Node.js v22+ and Rust (latest stable)
- Run `git submodule update --init --recursive` after cloning
- Run `pnpm --filter @readest/readest-app setup-vendors` to copy PDF.js assets
- For Windows: requires Visual Studio 2022 Build Tools with C++ workload

For app-specific architecture, see `apps/readest-app/CLAUDE.md`.
