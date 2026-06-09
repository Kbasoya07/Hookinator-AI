Heya  <br>
So guys this is my 1st Saas website   <br>
the idea just randomly came into my mind of building a Saas and I came to the conclusion that this idea might be a good start on my journey in this particular feild and then I thought let's bring it to reality coz why not? <br>
This project proved of immense importance as it is the onset or the starting point in my career where I actually learn how to "play" with these APIs and database and the authentication and especially the next.js . All these things will prove to be highly important in the age of AI.
A B.Tech student going to the 4th year btw ;) <br>
that's all folks <br>
cya  <br>
<br>

# Hookinator AI - High-CTR YouTube Metadata Optimizer

Hookinator AI is a lightning-fast, production-ready Next.js 15 web application designed to help creators optimize their YouTube video titles, descriptions, and hashtags for maximum Click-Through Rate (CTR) and search discoverability.

---

##  Key Features

* **AI Content Optimizer:** Input your draft title and description to receive curiosity-driven hook adjustments and keyword-dense descriptions.
* **AI Content Generator:** Generate clickable titles, detailed video outlines, and tags from scratch based on a topic and genre.
* **Circular Score Gauge:** Shows a real-time visual rating meter representing the SEO and CTR improvement percentage calculated by the AI.
* **Transaction History:** Access past optimizations, copy titles/descriptions individually, copy entire metadata blocks, or delete history records.
* **Usage Limits & Billing:** Free daily quota tracking alongside Premium billing support featuring Indian Rupee (₹) conversions and UPI payment instructions.
* **SEO Blog Engine:** A static pre-rendered blogging system housing creator articles optimized for search crawler indexing.

---

##  Tech Stack & Codebase Architecture

* **Framework:** Next.js 15.5 (App Router, Turbopack)
* **Styling:** Vanilla CSS & TailwindCSS (responsive layouts, custom dark themes)
* **Database & Auth:** Supabase (PostgreSQL database, Supabase Auth, client-side & server-side cookies validation)
* **AI Processing:** Groq Llama 3 API (Llama 3.3 70B & 3.1 8B) with fallback Google Gemini API Beta
* **Validation:** Zod schemas for structured AI outputs and configuration validation

---

##  Speed & Core Web Vitals Optimizations

1. **Zero-Hydration Landing Page:** The home routing layout uses a pure Server Component architecture, bypassing client-side hydration delays and slashing page bundle size to **3.48 kB** (Largest Contentful Paint < 1.0s).
2. **Hybrid Edge Execution:** Performance-critical API routes (`/api/optimize` and `/api/health`) execute on Vercel's Edge Runtime located in the **Mumbai (bom1) region** for ultra-low latency.
3. **Loop-Free Auth Provider:** Handled React's state loop by memoizing the `refreshProfile` function in `useCallback` and restricting `useEffect` dependencies, ending page flickering.
4. **Brotli & Tree-Shaking:** Configured Brotli compression and strict package pruning in `next.config.ts` to keep the build lightweight.

---

##  Robust AI Pipeline & Failover Setup

The AI metadata engine uses a highly resilient failover pipeline:
* **Primary (Llama 70B & 8B):** Fast and structured JSON generation via Groq API.
* **Secondary Backup (Gemini Flash):** If Groq encounters rate limits or API outages, the request automatically falls back to the Google Gemini API.
* **Key Rotation:** Supports rotating multiple Gemini API keys parsed from a comma-separated list (`GEMINI_API_KEYS`), preventing service blockages.

---

##  Database Schema & Serialization Workarounds

1. **Atomic Credit Locks:** PL/pgSQL database functions securely deduct credits atomically, bypassing double-spend request exploits.
2. **JS-Query Fallbacks:** If the database SQL functions are not created yet, the server automatically drops back to standard JavaScript queries to check and update the `profiles` table.
3. **Hidden Score Serialization:** Instead of running SQL database migrations to store the AI score, Hookinator serializes the value as an invisible HTML comment in the description field (`<!-- score:45 -->`). The history list parses this value dynamically and strips the comment tag before clipboard copies.

---

## ⚙️ Environment Variables (`.env.local`)

To run this project locally, create a `.env.local` file with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# AI API Keys
GROQ_API_KEY=your-groq-api-key
GEMINI_API_KEY=your-gemini-api-key  # Supports comma-separated keys: key1,key2,key3

