# agents.md

## Project Vision

Democratize technological development by enabling any entrepreneur without a technical background to transform a brief idea into a comprehensive, professional, development-ready product specification.

## Tech Stack

- **Frontend:** Next.js 16 + React + Tailwind CSS
- **Backend:** Next.js API Routes
- **AI:** Google Gen AI SDK (Gemini)
- **Deploy:** Vercel
- **Auth:** None
- **Database:** None

## Agent Instructions

- All code must be written in English (UI text, comments, commit messages, etc.).
- No authentication or database dependencies should be introduced.
- Prefer serverless-friendly patterns; avoid file-system state or long-running processes.
- Use the `src/` directory convention for application code.
- Place API routes under `src/app/api/`.
- Use environment variables for configuration (e.g., `GEMINI_API_KEY`).
- Keep the AI interaction layer isolated in a dedicated module (e.g., `src/lib/ai/`).
- UI components should be in `src/components/`, pages in `src/app/`.
