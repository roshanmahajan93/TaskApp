# TaskApp

A local-first task and project management app built with React Native and Expo. All data lives on-device — no accounts, no cloud sync required.

## Summary

TaskApp helps you organize daily work into projects and tasks with a clean, calendar-driven UI. The home dashboard gives you an at-a-glance view of today's progress, active projects, and upcoming tasks. A weekly calendar strip on the tasks screen lets you jump between days and see a timeline of what's scheduled. A stats screen tracks overall and per-project completion rates, and a settings screen lets you switch between light, dark, and system themes.

## Features

- **Dashboard** — daily task progress card, horizontally scrollable project cards with progress bars, and a preview of today's tasks
- **Weekly timeline** — tap any day in the week strip to see that day's tasks laid out in a timeline with a live "now" marker
- **Task statuses** — `pending`, `working`, `on_hold`, and `completed`, each with distinct visual styling
- **Project management** — create projects with custom colors, track due dates, member counts, comments, and attachments
- **Statistics** — overall completion percentage and individual project progress bars
- **Theme switching** — light, dark, or follow system preference, persisted across launches
- **Local-first storage** — all data stored on-device via SQLite (`expo-sqlite`) with no backend dependency

## Tech Stack

| Layer | Library |
|---|---|
| Framework | [Expo](https://expo.dev) ~55 |
| Runtime | React Native 0.83.2 / React 19 |
| Navigation | [Expo Router](https://expo.github.io/router) (file-based) |
| State | [Redux Toolkit](https://redux-toolkit.js.org) + React Redux |
| Storage | `expo-sqlite` + `@react-native-async-storage/async-storage` |
| Animations | React Native Reanimated 4 + Gesture Handler |
| Icons | `@expo/vector-icons` (Ionicons) |
| Language | TypeScript |

## Project Structure

```
app/
  (tabs)/
    index.tsx       # Home dashboard
    tasks.tsx       # Weekly calendar + timeline
    stats.tsx       # Completion statistics
    settings.tsx    # Theme preferences
  onboarding.tsx
  project/[id].tsx  # Project detail / create
  task/[id].tsx     # Task detail / create
src/
  store/            # Redux store + slices (theme, tasks, projects)
  types/            # Shared TypeScript types (Task, Project, TaskStatus)
  constants/        # Design tokens (colors, spacing, radii)
  hooks/            # useColors — resolves tokens for current theme
  utils/date.ts     # Date formatting and week-building helpers
  db/               # SQLite database setup
```

## Getting Started

**Prerequisites:** Node.js 18+, Expo CLI, and either the Expo Go app or a simulator/emulator.

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on a specific platform
npm run ios
npm run android
npm run web
```

Scan the QR code with Expo Go (iOS/Android) or press `i` / `a` in the terminal to open a simulator.

## Data Model

```ts
interface Task {
  id: string;
  title: string;
  projectId: string | null;
  status: 'pending' | 'working' | 'completed' | 'on_hold';
  startsAt: number;   // Unix ms
  endsAt: number;
  members: number;
  notes: string | null;
  createdAt: number;
}

interface Project {
  id: string;
  name: string;
  color: string;
  totalTasks: number;
  progress: number;   // 0–1
  dueDate: string | null;
  members: number;
  comments: number;
  attachments: number;
  createdAt: number;
}
```
