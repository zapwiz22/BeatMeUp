# BeatMeUp: ZType Game Leaderboard

A modern, real-time leaderboard web app for a ZType-inspired typing game. Built with Next.js 15, Prisma, and Tailwind CSS.

## 🚀 Features

- **Fast-paced Typing Game**: Type out words before they reach the bottom!
- **Live Leaderboard**: See your rank, username, and score instantly after playing.
- **Beautiful Visuals**: Animated galaxy background, shiny text, and smooth UI.
- **Persistent Usernames**: Your username is saved locally for quick replays.
- **Responsive Design**: Works great on desktop and mobile.

## 🕹️ How to Play

1. Enter your username in the format `firstName_rollNo` (e.g., `Jacob_25075041`).
2. Click **Start Game** and type the words as they appear before they reach the bottom.
3. Your score is calculated based on speed and accuracy.
4. View your rank and compare with others on the **Leaderboard**.

## 🏆 Leaderboard

- Ranks are shown with medals for the top 3.
- Username and score are displayed for each player.
- Click **Leaderboard** on the home page to view all scores.

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OGL](https://github.com/oframe/ogl) for WebGL backgrounds
- TypeScript, React Hooks

## 🧑‍💻 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play and develop.

## 📦 Deployment

Deploy easily on [Vercel](https://vercel.com/) or your favorite platform.

## 📁 Project Structure

- `app/` — Next.js app directory (pages, API routes)
- `components/` — React UI components
- `lib/` — Prisma client setup
- `prisma/` — Prisma schema and migrations
- `public/` — Static assets (images, icons)

## 🙌 Contributing

Pull requests and issues are welcome! Please use clear commit messages and follow the username format for leaderboard entries.
