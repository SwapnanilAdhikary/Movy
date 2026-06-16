# Movy

A digital detox app to help you move on. Track your streaks, complete missions, write your thoughts, and watch yourself heal — all on-device, zero data shared.

## Features

- **3 Streak Timers** — Phone, WhatsApp, Instagram (honor system)
- **Move-On Meter** — See your healing progress at a glance
- **Missions** — Daily & one-time tasks with XP rewards
- **Level System** — Earn XP, level up as you heal
- **Journal** — Free-form entries with mood/trigger tags
- **Letters to Ex** — Write what you never got to say (stays on your device)
- **Urge Mode** — Breathing exercise, distraction generator, journal quick-write
- **12 Achievements** — Auto-unlock as you hit milestones
- **100% On-Device** — SQLite database, no accounts, no servers

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 56 + React Native |
| Routing | Expo Router (file-based) |
| State | Zustand |
| Storage | expo-sqlite (SQLite) |
| Language | TypeScript |

## Setup

```sh
git clone https://github.com/SwapnanilAdhikary/Move-On.git
cd Move-On
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone to run in development mode.

## Building an APK

1. Create a free account at [expo.dev](https://expo.dev/signup)
2. Run `eas login` and `eas init` to link the project
3. Run `eas build --platform android --profile preview` to build
4. The APK will be available on the EAS Build dashboard

For automated builds via GitHub Actions, add your `EXPO_TOKEN` as a repository secret and push a tag:

```sh
git tag v1.0.0
git push origin v1.0.0
```

## License

MIT
