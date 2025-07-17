# 📣 Content Spawner  
_A Claude-powered matrix builder for viral-ready content._

---

**Part of the** [⚙️ NOVUS Protocol Toolkit](https://novusprotocol.io)  
**Module Type:** AI SaaS Micro-App  
**Purpose:** Generate a high-volume, platform-ready content library in seconds.

---

## 💡 What It Does

The **Content Spawner** instantly generates a **100-post content matrix** using Claude 3 Opus. Designed for creators, solopreneurs, and startup operators, this tool builds:
- 🧠 Headlines  
- 🔥 Hooks  
- 🎯 CTAs  
- 📱 Platform-specific formatting  

Use it to prep your entire launch calendar in one click.

---

## ⚙️ Stack & Integration

| Layer       | Tool/Tech                      |
|-------------|-------------------------------|
| Backend     | Claude 3 Opus via OpenRouter   |
| Frontend    | Next.js + Shadcn UI + Tailwind |
| Output      | Tabular post matrix            |
| Export      | Notion / CSV (coming soon)     |

---

## 🛠 Usage Instructions

### 1. 📥 Setup

```bash
git clone https://github.com/YOU/content-spawner
cd content-spawner
npm install
```

Create a `.env.local` file with your OpenRouter key:

```env
OPENROUTER_API_KEY=sk-your-openrouter-key-here
```

Start the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`

---

### 2. 📤 How To Use

1. **Describe your product or niche**  
2. **Choose your content goal**  
   → Awareness / Engagement / Sales / Education / Mixed  
3. **Pick a platform**  
   → TikTok, Instagram, Twitter, Blog  
4. **Click “Generate Posts”**

Get a 100-row post feed. Export coming soon.

---

## 📁 Project Structure

```
content_spawner_project/
├── pages/
│   ├── index.tsx          ← Frontend UI
│   └── api/spawn.ts       ← Claude prompt logic
├── components/ui/         ← Shadcn UI placeholders
│   ├── textarea.tsx
│   ├── select.tsx
│   ├── button.tsx
│   └── table.tsx
├── .env.local             ← Add OpenRouter key
```

---

## 🧠 Claude Prompt Strategy

> “You are a viral content strategist. Based on a niche, platform, and goal, generate 100 post ideas in the format:
> - Headline
> - Hook
> - CTA
> - Platform…”

Output is parsed and formatted into a JSON-ready matrix for live table rendering.

---

## 📦 Upcoming Features

- [ ] Notion content sync
- [ ] CSV + PDF export
- [ ] Claude + GPT-4 hybrid formatting
- [ ] Launch calendar scheduler integration

---

## 🧰 Part of the NOVUS Omnipreneur Stack

This is **Module 4** in the full toolkit:

1. 🔄 AutoRewrite Engine  
2. 🎨 Aesthetic Generator  
3. 🧠 Multi-Agent Chain  
4. 📣 **Content Spawner** ← *(you are here)*  
5. 📦 Bundle Builder *(coming)*  
6. 📈 Live Dashboard *(coming)*  
7. 🌐 Affiliate Portal *(coming)*

---

## 🧬 License & Reuse

MIT License — commercial use encouraged.  
Built to be cloned, branded, and shipped by creators.

> Want help branding this as your own SaaS?  
> **Use the [🔧 NOVUS White-Labelizer]**

---

## 👁 Preview Screenshot (Optional)

*(Insert image here)*

---

### ✨ Built by NOVUS – your AI stack optimizer.  
