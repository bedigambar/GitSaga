# GitSaga

> Turn your GitHub commit history into an epic AI-narrated story.

GitSaga transforms any repository's commit log into a dramatic, chapter-based narrative. Every commit becomes a plot point, every developer becomes a hero, and every bug fix becomes a battle won.

## Features

- **AI Story Generation** — Powered by Groq (LLaMA 3.3 70B), commits are woven into a multi-chapter epic fantasy saga
- **Real-time Streaming** — Watch the story generate live, word by word
- **RPG Character Card** — Each repo gets a stats card with level, class, and attributes based on repo metrics
- **Code Snippet Viewer** — Click any filename mentioned in the story to view the actual source code from GitHub
- **Text-to-Speech** — Listen to the saga narrated aloud with chunked browser TTS
- **Export** — Copy to clipboard or download the story as Markdown
- **GitHub OAuth** — Secure authentication with access to both public and private repos

## Demo Video

Check out the application in action:


https://github.com/user-attachments/assets/7677ae2c-c29c-4a28-8e38-89721af9ea42




## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **AI**: [Vercel AI SDK](https://sdk.vercel.ai/) + [Groq](https://groq.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Auth**: Custom GitHub OAuth (cookie-based sessions with HMAC signing)

## Getting Started

### Prerequisites

- Node.js 18+
- A [GitHub OAuth App](https://github.com/settings/developers) (set callback URL to `http://localhost:3000/api/auth/callback/github`)
- A [Groq API key](https://console.groq.com/)

### Installation

```bash
# Clone this repository
git clone https://github.com/bedigambar/GitSaga

# Navigate to the project directory
cd gitsaga

# Install dependencies
npm install
```

### Environment Variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

```env
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
BETTER_AUTH_SECRET=your_random_secret_string
GROQ_API_KEY=your_groq_api_key
```

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | From your GitHub OAuth App settings |
| `GITHUB_CLIENT_SECRET` | From your GitHub OAuth App settings |
| `BETTER_AUTH_SECRET` | Any random string used to sign session cookies |
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com/) |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata, Toaster)
│   ├── globals.css             # Theme, animations, custom utilities
│   ├── robots.ts               # Search engine crawl rules
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── manifest.ts             # Web app manifest (PWA)
│   ├── opengraph-image.tsx     # Dynamic OG image for social sharing
│   ├── not-found.tsx           # Custom 404 page
│   ├── (app)/
│   │   ├── layout.tsx          # App shell layout
│   │   ├── page.tsx            # Landing page (SSR)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard metadata
│   │   │   └── page.tsx        # Repo selector
│   │   └── story/
│   │       ├── layout.tsx      # Story metadata
│   │       └── [owner]/[repo]/page.tsx  # Story generation page
│   └── api/
│       ├── auth/               # GitHub OAuth flow
│       ├── generate-story/     # AI story streaming endpoint
│       ├── code-snippet/       # Fetch file content from GitHub
│       └── github/             # Repos, commits, repo details
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroCTA.tsx             # Auth-aware CTA button (client component)
│   ├── RepoCard.tsx
│   ├── StoryViewer.tsx         # Story renderer with TTS, export, code links
│   ├── RpgCharacterCard.tsx    # RPG stats card for repos
│   ├── CodeSnippetModal.tsx    # Modal to view source files
│   ├── InteractiveBackground.tsx
│   └── ui/                     # shadcn/ui primitives
└── lib/
    ├── auth.ts                 # Server-side session (HMAC cookies)
    ├── auth-client.ts          # Client-side session hook, signIn/signOut
    └── utils.ts                # cn(), formatDistanceToNow()
```

## License
This project is open source and available under the [MIT License](https://github.com/bedigambar/GitSaga/blob/main/LICENSE).
