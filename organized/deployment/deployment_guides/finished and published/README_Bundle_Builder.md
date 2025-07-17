# 📦 Bundle Builder  
_Automatically stack and export digital products into resale-ready kits._

---

**Part of the** [⚙️ NOVUS Protocol Toolkit](https://novusprotocol.io)  
**Module Type:** AI SaaS Micro-App  
**Purpose:** Rapidly compile ZIP bundles + storefront listings for Gumroad, Etsy, and Notion.

---

## 💡 What It Does

Bundle Builder takes uploaded digital files (PDFs, templates, prompts, etc.) and packages them into a sellable ZIP archive. It also autogenerates:
- 🎯 Product Title  
- 📝 Description copy  
- 🏷️ 5 SEO-friendly tags  
- 🔗 Download link for final ZIP

Powered by Claude 3 + OpenRouter, this tool gives you an instant storefront-ready product listing.

---

## ⚙️ Tech Stack

| Layer       | Tool/Tech                    |
|-------------|-----------------------------|
| Backend     | Claude 3 Opus via OpenRouter |
| Frontend    | Next.js + Shadcn UI + Tailwind |
| Output      | Zipped bundle + metadata     |
| Export      | `/public/bundles/*.zip`      |

---

## 🛠 Setup Instructions

### 1. Clone + Install

```bash
git clone https://github.com/YOU/bundle-builder
cd bundle-builder
npm install
```

### 2. Add Your OpenRouter Key

Create a `.env.local` file:

```env
OPENROUTER_API_KEY=sk-your-openrouter-key
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🖼 How It Works (UI)

1. Drag + drop your files  
2. ai will create a **Bundle Title** based on profitable seo keywords and best profitable phrasing (e.g. “Clarity Planner Kit”)  
3. Select target platform → Gumroad, Etsy, or Notion  
4. Hit “Generate Bundle”  
5. Get ZIP + storefront text instantly

---

## 📂 File Structure

```
bundle_builder_project/
├── pages/
│   ├── index.tsx         ← Frontend logic
│   └── api/bundle.ts     ← File ZIP logic + Claude request
├── components/ui/        ← Shadcn UI: input, select, button
│   └── ...
├── public/bundles/       ← Downloadable ZIPs
├── .env.local            ← Your OpenRouter key
```

---

## 🤖 Claude Prompt Strategy

> “You are a product marketing assistant. Given a title and platform, generate a compelling product listing (title, description, tags).”

Output is parsed and returned alongside ZIP URL.

---

## 🧰 Part of the NOVUS Stack

You now have **Module 5** of the Omnipreneur SaaS suite:

1. 🔄 AutoRewrite Engine  
2. 🎨 Aesthetic Generator  
3. 📣 Content Spawner  
4. 🧠 Multi-Agent Chain  
5. 📦 **Bundle Builder** ← *(you are here)*  
6. 📈 Live Dashboard *(next)*  
7. 🌐 Affiliate Portal *(next)*

---

## ✨ License & Reuse

MIT License — designed for cloning + resale.  
You’re encouraged to white-label this as part of your own product suite.

> Want a branded storefront page + launch dashboard?  
> Ask NOVUS for your **LaunchKit Extension ⚙️**
