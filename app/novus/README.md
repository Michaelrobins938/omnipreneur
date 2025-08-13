# NOVUS Protocol Workspace

## Overview
The NOVUS Protocol Workspace is a comprehensive tool for AI prompt optimization using the CAL™ (Cognitive Architecture Layering) technology. It provides a complete environment for creating, optimizing, saving, and managing AI prompts.

## Routes
- `/novus/workspace` - Main workspace interface
- `/novus/sessions` - Saved prompt optimization sessions
- `/novus/templates` - Custom prompt templates
- `/novus/analytics` - Performance analytics (Pro/Enterprise only)

## Features
- **Prompt Editor**: Advanced editor with variable support
- **CAL™ Optimization**: AI prompt optimization using Cognitive Architecture Layering
- **Session Management**: Save and organize optimization sessions
- **Template System**: Create reusable prompt templates with variables
- **Metrics Dashboard**: View readability, structure, safety, and token efficiency metrics
- **Export Options**: Export sessions as JSON or Markdown
- **Usage Limits**: Free tier with upgrade options

## Limits
- **Free Tier**: 5 optimizations per day, limited to 10 saved sessions
- **Pro/Enterprise**: Unlimited optimizations, templates, and analytics

## Storage
Currently using file-based storage in `/tmp/novus/` as a fallback. To swap to a database:

1. Implement the `NovusStorage` interface in `lib/novus/storage.ts`
2. Replace the `FileBasedStorage` implementation with database queries
3. Update the API routes to use the new storage implementation
4. Add database migrations for sessions and templates tables

## Analytics Events
- `novus_optimize_run`
- `novus_optimize_success`
- `novus_optimize_error`
- `novus_session_saved`
- `novus_template_applied`
- `novus_export_clicked`
- `novus_upgrade_viewed`
- `checkout_initiated`