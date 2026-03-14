# Steam Viewer

A desktop application that aggregates and displays your Steam game library across all user accounts on your system. Browse, search, sort, and launch games from a single retro terminal-inspired interface.

![Windows](https://img.shields.io/badge/platform-Windows-blue)

## Features

- **Multi-Account Aggregation** — Automatically detects all Steam accounts on your machine and combines their game libraries into one unified view
- **Search & Sort** — Filter games by name and sort by name, playtime, last played date, or file size
- **Installed Filter** — Toggle to show only installed games
- **Game Details** — View hero images, playtime stats, installation status, file size, and per-user breakdowns for shared games
- **Quick Launch** — Launch installed games or trigger installs directly via Steam protocol links (`steam://rungameid/`, `steam://install/`)
- **User Directory** — Browse all Steam accounts with persona names, Steam IDs, and activity status
- **Persistent Settings** — Steam Web API key stored locally for fetching owned-games data

## Prerequisites

- Steam installed at the default location (`C:\Program Files (x86)\Steam`)
- A [Steam Web API Key](https://steamcommunity.com/dev/apikey) (entered in the app's Settings tab)

## Getting Started (Development)

```bash
# Install dependencies
bun install

# Development without HMR (uses bundled assets)
bun run dev

# Development with HMR (recommended)
bun run dev:hmr

# Build for production
bun run build

# Build for production release
bun run build:prod
```

## How It Works

1. The **main process** (Bun) reads local Steam configuration files:
   - `loginusers.vdf` — discovers all Steam user accounts
   - `libraryfolders.vdf` — maps installed apps and their file sizes
2. For each user, it calls the [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API) to fetch owned games, playtime, and metadata
3. The **renderer process** (React) displays an aggregated, searchable game list with per-user breakdowns
4. Communication between processes happens over Electrobun's built-in RPC layer

## Project Structure

```
src/
├── bun/
│   └── index.ts              # Main process — reads VDF files, calls Steam API, manages settings
├── mainview/
│   ├── App.tsx               # Root component — data loading, state management, view routing
│   ├── main.tsx              # React entry point
│   ├── index.html            # HTML template
│   ├── index.css             # Tailwind CSS styles
│   ├── types.ts              # Frontend type definitions
│   └── components/
│       ├── TitleBar.tsx      # Header with app name, installed count, total playtime
│       ├── NavBar.tsx        # Tab navigation, sort controls, install filter
│       ├── GameList.tsx      # Searchable game list with multi-owner accordion
│       ├── GameDetail.tsx    # Selected game details, hero image, launch button
│       ├── UsersView.tsx     # Steam accounts directory
│       ├── SettingsView.tsx  # API key configuration
│       ├── LoadingScreen.tsx # Animated loading state
│       └── StatusBar.tsx     # Footer with status and version
└── shared/
    └── types.ts              # Shared type definitions (API responses, VDF structures)
```

## Tech Stack

| Layer    | Technology                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime  | [Electrobun](https://electrobun.dev/) + [Bun](https://bun.sh/)                                                                                       |
| Frontend | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)                                                                       |
| Styling  | [Tailwind CSS 4](https://tailwindcss.com/)                                                                                                           |
| Build    | [Vite 8](https://vite.dev/)                                                                                                                          |
| Data     | [Steam Web API](https://developer.valvesoftware.com/wiki/Steam_Web_API) + local VDF files via [vdf-parser](https://www.npmjs.com/package/vdf-parser) |

## Configuration

The Steam Web API key is stored at `%APPDATA%/steam-viewer/api-key.txt` and can be managed from the Settings tab within the app.
