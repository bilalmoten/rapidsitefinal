# Pro Chat Implementation Plan

This document outlines the detailed implementation plan for the Pro Chat interface in RapidSite.

## Overview

The Pro Chat interface will provide a premium experience for users who want to invest more time to create high-quality, customized websites. Unlike the express mode, which generates websites quickly based on a simple prompt, the Pro Chat will facilitate an in-depth conversation with the AI, allowing users to provide detailed requirements, inspiration, and preferences.

## Tech Stack

- **Chat Interface**: Google Gemini Flash 2.0 (for fast, responsive chat)
- **Website Generation**: Claude 3.7 Sonnet (for high-quality generation)
- **Integration**: Vercel AI SDK for model interactions
- **Storage**: Supabase for data persistence
- **UI Framework**: Next.js with Tailwind CSS

## User Flow

1. User selects "Pro Website" from dashboard
2. User is directed to the Pro Chat interface
3. First-time users see a lightweight onboarding overlay
4. User engages in guided conversation with AI
5. User can provide additional inputs beyond text (images, links, etc.)
6. When ready, website generation begins with progress tracking
7. User receives email notification when website is ready

## Implementation Progress

### Phase 1: Basic Infrastructure (Current Task)

- [x] Create pro-chat route and layout
- [x] Implement Amazon Bedrock Claude 3.7 API integration with Vercel AI SDK
- [x] Implement Google Gemini Flash 2.0 API integration
- [x] Build minimal chat UI with test button
- [x] Create main ProChatInterface component
- [x] Build MessageList and MessageInput components
- [x] Add tabs for switching between interface and API testing
- [x] Verify functional message exchange

### Phase 2: Enhanced Chat Interface

- [x] Implement full chat UI with message history
- [x] Add message typing indicators and loading states
- [x] Support for markdown formatting in messages
- [x] Implement persistent chat storage with Supabase

### Phase 3: Additional Input Types

- [x] Image upload functionality with tagging
- [x] Website inspiration link sharing
- [x] Color palette and style preference tools
- [ ] PDF document upload for reference

### Phase 4: Guidance and Onboarding

- [x] Implement onboarding overlay screens
- [x] Add contextual tips and suggestions
- [x] Create help/tutorial button and panel
- [x] Add example prompts and best practices

### Phase 5: Website Generation

- [x] Implement quality website generation process
- [x] Add progress tracking and status updates
- [ ] Integrate with email notification system
- [x] Handle completion and redirection to dashboard

## Technical Details

### Core Components

- [x] `app/(app)/dashboard/pro-chat/page.tsx` - Main Pro Chat page
- [x] `app/(app)/dashboard/pro-chat/layout.tsx` - Layout component
- [x] `components/pro-chat/ProChatInterface.tsx` - Main chat UI container
- [x] `components/pro-chat/MessageList.tsx` - Displays chat history
- [x] `components/pro-chat/MessageInput.tsx` - Input area for messages
- [ ] `components/pro-chat/AdditionalInputs.tsx` - Panel for non-text inputs
- [x] `app/api/bedrock/route.ts` - Amazon Bedrock API integration with Vercel AI SDK
- [x] `app/api/gemini/route.ts` - Google Gemini API for chat interface
- [x] `components/ui/spinner.tsx` - Spinner component for loading states

### Implementation Notes

- Created a fully functional chat UI with the following features:

  - Message history display with avatars and timestamps
  - Text input with auto-resize functionality
  - Markdown support for formatting
  - Loading states for pending messages
  - Mobile-responsive design with collapsible sidebar
  - Tabbed interface for tools and help
  - API testing tab for verifying model integration

- Implemented API routes for both models:

  - Claude 3.7 Sonnet via Bedrock for website generation
  - Gemini Flash 2.0 for chat interface
  - System prompts tailored to each model's purpose

- Added UI components for future functionality:
  - Placeholder for image upload
  - Color selection interface
  - Help section with tips
  - Generate website button (not yet functional)

### Next Steps

1. Connect the UI to the API to enable full message exchange
2. Implement file upload functionality for images
3. Connect website generation button to Claude API
4. Add persistent storage for chat history in Supabase
5. Implement onboarding overlay for first-time users

### Input Types

1. **Text Messages**

   - Primary form of communication
   - Support for formatting (bold, italic, lists)
   - Code blocks for technical requirements

2. **Images**

   - Inspiration images for design reference
   - Logo/brand assets for incorporation
   - Mood boards for style guidance
   - Screenshots of existing sites for reference

3. **Links**

   - Competitor websites for reference
   - Style inspiration links
   - Content sources for the website

4. **Design Preferences**

   - Color palette selection
   - Typography preferences
   - Layout style options (minimalist, detailed, etc.)
   - Responsive design priorities

5. **Documents**
   - PDF brochures or marketing materials
   - Brand guidelines
   - Content documents

## Environment Variables Required

The following environment variables need to be set in `.env`:

```
# AWS Bedrock for Claude 3.7 Sonnet
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Google Gemini
GOOGLE_API_KEY=your_google_api_key
```

## UI Design Principles

- Clean, minimal interface with focus on the conversation
- Clear distinction between user and AI messages
- Visual indicators for different input types
- Accessible design with proper contrast and focus states
- Mobile-responsive layout
- Consistent with RapidSite's existing design language
