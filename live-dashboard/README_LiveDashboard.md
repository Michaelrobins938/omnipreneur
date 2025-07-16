# 📈 Live Dashboard

Tracks real-time AI model output, scores, platforms, and timestamps for NOVUS launches.  
Built with React, Shadcn UI, and mock backend endpoint (`/api/dashboard`).

## Setup

1. Paste the following files into your project:
   - `pages/index.tsx`
   - `pages/api/dashboard.ts`
   - `components/ui/table.tsx`
2. Run your Next.js dev server:
```bash
npm run dev
```
3. Visit `http://localhost:3000`

## Example Output

| Launch            | Model     | Score | Platform | Timestamp              |
|-------------------|-----------|-------|----------|-------------------------|
| ADHD Toolkit      | Claude 3  | 92    | Gumroad  | 7/5/25, 4:00 PM         |
| Chaos Planner     | GPT-4     | 88    | Etsy     | 7/5/25, 3:00 PM         |
| Shadow Launch     | Command R+| 95    | Notion   | 7/5/25, 2:00 PM         |

Powered by static mock data — plug in real-time updates when ready.
