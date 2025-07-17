# 🚀 BUNDLE BUILDER - DEPLOYMENT GUIDE

## 🎯 **COMPLETE DEPLOYMENT PROCESS**

Follow this guide to deploy Bundle Builder from development to production with payment processing and analytics.

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### **Environment Setup**
- [ ] Node.js 18+ installed
- [ ] npm/yarn configured
- [ ] Git repository created
- [ ] Vercel account ready
- [ ] OpenRouter API key obtained
- [ ] Stripe account created
- [ ] Domain name purchased (optional)

### **Development Environment**
- [ ] Next.js project created
- [ ] Tailwind CSS configured
- [ ] Shadcn UI components installed
- [ ] TypeScript configured
- [ ] ESLint and Prettier setup

---

## 🛠️ **STEP-BY-STEP DEPLOYMENT**

### **Phase 1: Project Setup**

#### **1.1 Create Next.js Project**
```bash
# Create new Next.js project
npx create-next-app@latest bundle-builder --typescript --tailwind --eslint --app

# Navigate to project
cd bundle-builder

# Install dependencies
npm install @radix-ui/react-slot @radix-ui/react-select @radix-ui/react-toast
npm install jszip @types/jszip
npm install @stripe/stripe-js stripe
npm install lucide-react
```

#### **1.2 Configure Environment Variables**
Create `.env.local` file:
```env
# OpenRouter API
OPENROUTER_API_KEY=sk-your-openrouter-key-here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Vercel Configuration
VERCEL_URL=your-vercel-url
NEXT_PUBLIC_VERCEL_URL=your-vercel-url

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-your-ga-id
```

#### **1.3 Install Shadcn UI Components**
```bash
# Initialize Shadcn UI
npx shadcn-ui@latest init

# Install required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
```

### **Phase 2: Core Development**

#### **2.1 Create File Upload Component**
```typescript
// components/FileUpload.tsx
'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
}

export function FileUpload({ onFilesSelected }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles(files)
      onFilesSelected(files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles(files)
      onFilesSelected(files)
    }
  }

  return (
    <Card className="p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or{' '}
          <label className="text-blue-600 hover:text-blue-500 cursor-pointer">
            browse
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, DOC, XLS, PPT, images, and more
        </p>
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{file.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newFiles = selectedFiles.filter((_, i) => i !== index)
                    setSelectedFiles(newFiles)
                    onFilesSelected(newFiles)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
```

#### **2.2 Create AI Integration API**
```typescript
// pages/api/generate-bundle.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { files, platform } = req.body

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus:beta',
        messages: [
          {
            role: 'system',
            content: 'You are a product marketing specialist. Generate compelling product titles and descriptions for digital bundles.'
          },
          {
            role: 'user',
            content: `Generate a product title and description for these files: ${files.join(', ')} for platform: ${platform}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate content')
    }

    const generatedContent = data.choices[0]?.message?.content

    res.status(200).json({
      title: extractTitle(generatedContent),
      description: extractDescription(generatedContent),
      tags: extractTags(generatedContent),
    })
  } catch (error) {
    console.error('Error generating bundle:', error)
    res.status(500).json({ message: 'Failed to generate bundle content' })
  }
}

function extractTitle(content: string): string {
  // Extract title from AI response
  const titleMatch = content.match(/Title: (.+)/)
  return titleMatch ? titleMatch[1] : 'Professional Digital Bundle'
}

function extractDescription(content: string): string {
  // Extract description from AI response
  const descMatch = content.match(/Description: (.+)/s)
  return descMatch ? descMatch[1] : 'Professional digital bundle with high-quality content.'
}

function extractTags(content: string): string[] {
  // Extract tags from AI response
  const tagsMatch = content.match(/Tags: (.+)/)
  return tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : []
}
```

#### **2.3 Create ZIP Generation API**
```typescript
// pages/api/create-zip.ts
import { NextApiRequest, NextApiResponse } from 'next'
import JSZip from 'jszip'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { files, title } = req.body

    const zip = new JSZip()

    // Add files to ZIP
    for (const file of files) {
      zip.file(file.name, file.buffer)
    }

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    // Return ZIP as base64
    const base64Zip = zipBuffer.toString('base64')

    res.status(200).json({
      zipData: base64Zip,
      fileName: `${title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`,
    })
  } catch (error) {
    console.error('Error creating ZIP:', error)
    res.status(500).json({ message: 'Failed to create ZIP file' })
  }
}
```

### **Phase 3: Payment Integration**

#### **3.1 Set up Stripe**
```bash
# Install Stripe
npm install stripe @stripe/stripe-js
```

#### **3.2 Create Stripe API Routes**
```typescript
// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { priceId } = req.body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    })

    res.status(200).json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ message: 'Failed to create checkout session' })
  }
}
```

### **Phase 4: Vercel Deployment**

#### **4.1 Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **4.2 Configure Environment Variables**
In Vercel dashboard:
1. Go to your project
2. Navigate to Settings > Environment Variables
3. Add all environment variables from `.env.local`

#### **4.3 Set up Custom Domain (Optional)**
1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Configure DNS settings with your domain provider

### **Phase 5: Analytics & Monitoring**

#### **5.1 Google Analytics Setup**
```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_location: url,
    })
  }
}

export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

#### **5.2 Add Analytics to _app.tsx**
```typescript
// pages/_app.tsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { pageview } from '@/lib/analytics'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
```

---

## 🧪 **TESTING PROTOCOL**

### **Functionality Tests**
```bash
# Run tests
npm test

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### **Manual Testing Checklist**
- [ ] File upload works with various file types
- [ ] AI generates appropriate titles and descriptions
- [ ] ZIP files are created correctly
- [ ] Download links work properly
- [ ] Payment processing functions correctly
- [ ] Analytics tracking is working
- [ ] Mobile responsiveness is good
- [ ] Error handling is graceful

---

## 📊 **MONITORING & MAINTENANCE**

### **Performance Monitoring**
- Set up Vercel Analytics
- Monitor Core Web Vitals
- Track conversion rates
- Monitor API response times

### **Error Monitoring**
- Set up Sentry for error tracking
- Monitor API failures
- Track user feedback
- Monitor payment failures

### **Regular Maintenance**
- Update dependencies monthly
- Monitor API rate limits
- Review and optimize performance
- Update security patches

---

## 🚀 **POST-DEPLOYMENT CHECKLIST**

- [ ] All environment variables configured
- [ ] Payment processing tested
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Backup system in place
- [ ] Documentation updated

---

**Your Bundle Builder is now ready for production! Follow the testing protocol and monitor performance closely.** 