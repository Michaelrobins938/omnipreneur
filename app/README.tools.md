# Omnipreneur Tools Architecture

## Overview

This document describes the comprehensive toolkit architecture that powers all 26+ AI tools in the Omnipreneur platform. Each tool is built using a unified, scalable architecture that provides consistent functionality while allowing for product-specific customizations.

## Architecture Components

### 1. Generic Toolkit Components (`components/toolkit/`)

Reusable React components that provide the core UI functionality for all tools:

- **`PromptEditor.tsx`** - Input editor with variable substitution and token counting
- **`ResultPreview.tsx`** - Side-by-side display of original and processed content
- **`MetricsStrip.tsx`** - Configurable metrics dashboard with progress bars
- **`RunControls.tsx`** - Action buttons for run, save, copy, export operations
- **`SessionSidebar.tsx`** - Session management with search and tagging
- **`TemplateManager.tsx`** - Template CRUD operations with variable extraction
- **`UpgradeGate.tsx`** - Usage limits and upgrade prompts
- **`DocsShortcut.tsx`** - Documentation links
- **`HotkeysHelp.tsx`** - Keyboard shortcut reference

### 2. Toolkit Library (`lib/toolkit/`)

Product-agnostic business logic and utilities:

- **`types.ts`** - Shared TypeScript interfaces for sessions, templates, strategies
- **`storage.ts`** - File-based storage abstraction with product namespacing
- **`limits.ts`** - Free tier quotas and usage tracking
- **`metrics.ts`** - Calculation functions for readability, structure, safety, etc.
- **`diff.ts`** - Text comparison and diff generation
- **`pipeline.ts`** - Strategy execution and validation framework

### 3. Product Strategy Registry (`lib/tools/strategies.ts`)

Defines behavior and configuration for each tool:

```typescript
interface ProductStrategy {
  run: (input: string, params?: Record<string, any>) => Promise<ProcessResult>;
  labels: { run: string; save: string; copy: string; /* ... */ };
  metricsConfig: MetricConfig[];
  docsLink?: string;
  tokenCountFn?: (text: string) => number;
  hotkeys?: Array<{ key: string; action: string }>;
}
```

## Tool Implementation Pattern

Each tool follows the same file structure and implementation pattern:

### Route Structure
```
app/{product-slug}/
├── page.tsx                    # Redirect to workspace
├── workspace/page.tsx          # Main tool interface
├── sessions/page.tsx           # Session management (redirect)
├── templates/page.tsx          # Template management (redirect)
└── analytics/page.tsx          # Analytics view (redirect)

app/api/{product-slug}/
├── run/route.ts               # Main processing endpoint
├── sessions/route.ts          # Sessions CRUD
├── sessions/[id]/route.ts     # Individual session operations
├── templates/route.ts         # Templates CRUD
├── templates/[id]/route.ts    # Individual template operations
└── usage/route.ts            # Usage tracking
```

### Workspace Component Pattern

Every workspace follows this structure:

```typescript
const PRODUCT_ID = 'product-slug';
const strategy = TOOL_STRATEGIES[PRODUCT_ID];

export default function ProductWorkspace() {
  // State management
  const [inputContent, setInputContent] = useState('');
  const [resultContent, setResultContent] = useState('');
  const [metrics, setMetrics] = useState({});
  // ... other state

  // Data loading functions
  const loadSessions = async () => { /* ... */ };
  const loadTemplates = async () => { /* ... */ };
  const loadUsage = async () => { /* ... */ };

  // Core functionality
  const handleProcess = async () => { /* ... */ };
  const handleSaveSession = async () => { /* ... */ };
  const handleExport = async (format) => { /* ... */ };

  // Template management
  const handleSelectTemplate = (template) => { /* ... */ };
  const handleCreateTemplate = async (template) => { /* ... */ };

  return (
    <ProductAccessControl 
      productId={PRODUCT_ID} 
      productName="Product Name"
      requiredPlans={['PRODUCT_PLAN', 'PRO', 'ENTERPRISE']}
    >
      {/* Tool UI using toolkit components */}
    </ProductAccessControl>
  );
}
```

## Implemented Tools

### Processing Strategies

Tools are categorized by their underlying processing strategy:

#### Auto-Rewrite Strategy
Focuses on content improvement and optimization:
- **auto-rewrite** - Content rewriting and tone optimization
- **live-dashboard** - Real-time analytics content
- **customer-service-ai** - Support response generation
- **education-ai-compliance** - Educational content compliance
- **financial-ai-compliance** - Financial content compliance
- **healthcare-ai-compliance** - Healthcare content compliance
- **legal-ai-compliance** - Legal content compliance
- **medical-ai-assistant** - Medical response generation
- **quantum-ai-processor** - Advanced data processing

#### Content Generation Strategy
Creates new content from briefs and inputs:
- **content-spawner** - Content generation from briefs
- **bundle-builder** - Product bundle creation
- **aesthetic-generator** - Design element generation
- **auto-niche-engine** - Niche discovery and analysis
- **content-calendar-pro** - Content planning and scheduling
- **invoice-generator** - Invoice and billing content
- **podcast-producer** - Podcast script creation
- **project-management-pro** - Project planning
- **prompt-packs** - AI prompt collections
- **social-media-manager** - Social media content
- **time-tracking-ai** - Time analysis reports
- **video-editor-ai** - Video script generation

#### SEO Optimization Strategy
Optimizes content for search engines:
- **seo-optimizer-pro** - SEO content optimization
- **ecommerce-optimizer** - E-commerce store optimization

#### Lead Generation Strategy
Creates outreach and marketing content:
- **lead-generation-pro** - Outreach message generation
- **affiliate-portal** - Affiliate marketing content
- **email-marketing-suite** - Email campaign creation

## Features

### Core Functionality

Every tool includes:

- ✅ **Real-time Processing** - Instant content transformation
- ✅ **Session Management** - Save, load, and organize work sessions
- ✅ **Template System** - Reusable templates with variable substitution
- ✅ **Export Options** - JSON and Markdown export formats
- ✅ **Usage Tracking** - Free tier limits with upgrade prompts
- ✅ **Keyboard Shortcuts** - Productivity keyboard shortcuts
- ✅ **Access Control** - Plan-based feature gating
- ✅ **Metrics Dashboard** - Real-time quality metrics
- ✅ **Responsive UI** - Mobile and desktop optimized

### Advanced Features

- **Variable Substitution** - Dynamic template variables like `{brand}`, `{audience}`
- **Diff Visualization** - Side-by-side content comparison
- **Tag System** - Organize sessions with custom tags
- **Search Functionality** - Find sessions by title or content
- **Copy to Clipboard** - One-click content copying
- **Auto-save** - Automatic session preservation
- **Hotkey Support** - Ctrl/Cmd shortcuts for common actions

## Usage Limits and Plans

### Free Tier
- 5 runs per day per tool
- Basic template access
- Export functionality
- Email support

### Pro/Enterprise Plans
- Unlimited processing
- Advanced templates
- Priority support
- API access
- Custom integrations

## Storage System

### File-based Fallback
Currently using file-based storage under `/tmp/{product-id}/`:
- Sessions stored as JSON files
- Templates stored as JSON files
- Usage tracking per user per tool
- Automatic cleanup and organization

### Database Migration Path
Ready for database migration with:
- Abstract storage interface
- Consistent data models
- Easy swap-out of storage backend
- Preserved API contracts

## Adding a New Tool

### 1. Define Strategy
Add to `lib/tools/strategies.ts`:

```typescript
'new-tool': {
  async run(input: string, params?: Record<string, any>): Promise<ProcessResult> {
    // Tool-specific processing logic
    return { output, metrics, improvements };
  },
  labels: {
    run: "Process Content",
    save: "Save Session",
    // ... other labels
  },
  metricsConfig: [
    { label: 'Quality', key: 'quality', color: 'bg-blue-500' },
    // ... other metrics
  ]
}
```

### 2. Create Routes
Follow the standard pattern:
- `/app/new-tool/` directory structure
- `/app/api/new-tool/` API endpoints
- Copy and customize from existing tool

### 3. Update Product Pages
Add workspace CTA to product page:

```tsx
<Link href="/new-tool/workspace">
  <Button>Open Workspace</Button>
</Link>
```

## API Reference

### Processing Endpoint
`POST /api/{product}/run`
```json
{
  "input": "Content to process",
  "params": { "tone": "professional" }
}
```

### Sessions API
- `GET /api/{product}/sessions` - List sessions
- `POST /api/{product}/sessions` - Create session
- `GET /api/{product}/sessions/{id}` - Get session
- `DELETE /api/{product}/sessions/{id}` - Delete session

### Templates API
- `GET /api/{product}/templates` - List templates
- `POST /api/{product}/templates` - Create template
- `PUT /api/{product}/templates/{id}` - Update template
- `DELETE /api/{product}/templates/{id}` - Delete template

### Usage API
- `GET /api/{product}/usage` - Get usage statistics

## Keyboard Shortcuts

### Global Shortcuts
- `Ctrl/Cmd + Enter` - Run processing
- `Ctrl/Cmd + S` - Save session
- `Ctrl/Cmd + B` - Copy result to clipboard
- `Ctrl/Cmd + E` - Export as Markdown
- `Ctrl/Cmd + T` - Apply template

## Performance Considerations

### Optimization Features
- Component lazy loading
- Efficient state management
- Debounced search inputs
- Minimal re-renders
- Optimized bundle sizes

### Scalability
- Stateless API design
- Horizontal scaling ready
- CDN-friendly assets
- Database migration ready
- Microservice architecture support

## Security

### Access Control
- Plan-based feature gating
- Product-specific permissions
- Rate limiting per user
- Input validation and sanitization

### Data Protection
- No persistent sensitive data
- Temporary file cleanup
- Secure API endpoints
- CSRF protection

## Monitoring and Analytics

### Built-in Events
- `{product}_run` - Processing initiated
- `{product}_success` - Processing completed
- `{product}_error` - Processing failed
- `{product}_session_saved` - Session saved
- `{product}_template_applied` - Template used
- `{product}_export_clicked` - Content exported
- `checkout_initiated` - Upgrade attempted

### Usage Metrics
- Processing frequency
- Feature adoption
- Error rates
- Performance metrics
- Conversion tracking

## Contributing

### Code Style
- TypeScript strict mode
- React functional components
- Consistent naming conventions
- Comprehensive error handling
- Accessibility compliance

### Testing Strategy
- Component unit tests
- API integration tests
- E2E workflow tests
- Performance benchmarks
- Accessibility testing

## Roadmap

### Planned Enhancements
- **Database Migration** - Move from file storage to database
- **Real-time Collaboration** - Multi-user session sharing
- **Advanced Analytics** - Detailed usage insights
- **Custom Strategies** - User-defined processing logic
- **API SDK** - Developer integration toolkit
- **Mobile Apps** - Native mobile experiences
- **Enterprise SSO** - Advanced authentication
- **Workflow Automation** - Scheduled processing
- **A/B Testing** - Strategy optimization
- **Multi-language Support** - Internationalization

---

This architecture provides a robust, scalable foundation for AI-powered content tools while maintaining consistency and enabling rapid feature development across the entire product suite.