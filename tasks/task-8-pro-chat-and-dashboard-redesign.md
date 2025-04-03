# Task 7: Pro Chat Implementation and Dashboard Redesign

This document tracks the implementation of the pro chat interface, onboarding flow, and dashboard redesign for RapidSite's quality journey.

## Task Overview

Create a dedicated pro-chat experience for quality website generation with integrated onboarding, and redesign the dashboard's new website dialog to better support both journey options.

## Background Context

RapidSite is transitioning from a single user journey to dual pathways:

1. **Express Journey**: For quick website generation (already implemented)
2. **Quality/Pro Journey**: For premium users seeking more customized websites (this task)

The express journey has been implemented on the landing page with anonymous authentication, allowing users to enter a prompt and quickly generate a website. This task focuses on creating the complementary "Pro" experience for users who want to invest more time for better results.

## Tech Stack Decision

- **Chat Interface**: Google Gemini Flash 2.0 (for fast, responsive chat)
- **Website Generation**: Claude 3.7 Sonnet (for high-quality generation)
- **Integration**: Vercel AI SDK for model interactions
- **Storage**: Supabase for data persistence

## Current Implementation

- **Express Mode**: Currently available on the landing page with prompt input
- **Current Chat**: Located at `/dashboard/chat/[website_id]` with basic functionality
- **Dashboard**: Currently has a New Website dialog that asks for name, description, and subdomain
- **Authentication**: Both regular and anonymous auth are implemented

## Current Progress

✅ Created a detailed [Pro Chat Implementation Plan](./task-7-pro-chat-implementation.md) with phased approach
✅ Implemented basic Pro Chat route and layout
✅ Created Amazon Bedrock API integration for Claude 3.7 Sonnet via Vercel AI SDK
✅ Added test button to verify API functionality
✅ Implemented dynamic routing with `/dashboard/pro-chat/[website_id]` support
✅ Modified NewWebsiteDialog to include Express vs Pro website options
✅ Added Pro Chat index page for selecting existing websites or creating new ones

## Next Steps

1. Complete the API testing and ensure proper connection with AWS Bedrock
2. Implement Gemini Flash 2.0 for the chat interface component
3. Develop the full Pro Chat interface with proper message history
4. Implement the additional input types (images, links, color selections)
5. Build the onboarding overlay for first-time users

## Objectives

- Create an intuitive pro-chat interface optimized for quality website generation
- Implement a lightweight onboarding within the chat interface
- Redesign the dashboard's new website flow to clearly offer express vs. pro options
- Ensure consistent user experience across all entry points

## Design Requirements

- **Pro Chat UI**: Modern, clean interface with clear sections for different input types
- **Color Scheme**: Match existing app theme (dark mode with blue accents)
- **Mobile Support**: All interfaces must be responsive and work on mobile devices
- **Onboarding**: Overlay design should be minimal, non-intrusive, and dismissible

## Implementation Plan

### Pro Chat Interface Development

- [x] Create new pro-chat route and basic layout
- [x] Implement Amazon Bedrock Claude 3.7 API integration with Vercel AI SDK
- [x] Build minimal chat UI with test button
- [x] Implement Google Gemini Flash 2.0 for chat interface
- [x] Design enhanced chat UI with features for quality website generation
- [x] Add image upload and tagging capabilities
- [x] Implement color/style preference selection tools
- [x] Add progress tracking for website generation
- [x] Implement dynamic routing with website_id parameter

### Onboarding Implementation

- [x] Design 2-3 overlay screens for initial onboarding
- [x] Add help/tutorial button for users to access guidance anytime
- [x] Create contextual in-chat guidance for specific features
- [x] Implement guided prompts within the chat flow
- [x] Add examples and best practices messaging

### Dashboard Redesign

- [x] Modify new website dialog to offer express vs. pro options
- [x] Remove description field from initial setup
- [x] Add prompt field for express mode websites
- [x] Create direct path to pro-chat for quality websites
- [x] Implement auto-assignment of temporary subdomain
- [x] Create a landing page for the Pro Chat section

## Technical Implementation Details

### Pro Chat Route and Components

- `app/(app)/dashboard/pro-chat/page.tsx` - Pro Chat index page ✅
- `app/(app)/dashboard/pro-chat/[website_id]/page.tsx` - Dynamic route for Pro Chat ✅
- `app/(app)/dashboard/pro-chat/layout.tsx` - Layout for pro-chat ✅
- `components/pro-chat/PCChatInterface.tsx` - Enhanced chat UI ✅
- `components/pro-chat/PCMessageList.tsx` - Displays chat history ✅
- `components/pro-chat/PCMessageInput.tsx` - Input area for messages ✅
- `components/pro-chat/PCAssetUploader.tsx` - Image upload component ✅
- `components/pro-chat/StyleSelector.tsx` - Color/style selection tools ✅

### Onboarding Components

- `components/pro-chat/OnboardingOverlay.tsx` - Initial tutorial overlay ✅
- `components/pro-chat/TutorialButton.tsx` - Help button component ✅
- `components/pro-chat/ContextualTips.tsx` - In-context guidance ✅
- `components/pro-chat/ExamplePrompts.tsx` - Example prompts for better results ✅

### Dashboard Modifications

- `components/dashboard/NewWebsiteDialog.tsx` - Updated dialog with journey options ✅
- `components/dashboard/WebsiteOptions.tsx` - Express vs. Pro selection component ✅
- `components/dashboard/ExpressPromptInput.tsx` - Input for express website generation ✅

### API Integration Points

- `app/api/bedrock/route.ts` - Amazon Bedrock API for Claude 3.7 Sonnet ✅
- `app/api/gemini/route.ts` - Google Gemini API for chat interface ✅
- `app/api/pro-chat/route.ts` - Pro Chat API for message processing ✅
- `app/api/save-pro-chat/route.ts` - Endpoint for saving chat state ✅
- Utilize existing `api/express-generate` endpoint for express mode ✅
- Create quality generation endpoint with progress tracking ✅
- Integrate with email notification system for completion alerts
- Use Supabase for data storage and status tracking ✅

### Key Existing Files to Reference

- `components/landing/Hero.tsx` - Contains the express mode implementation
- `components/NewWebsiteDialog.tsx` - Updated with Express vs Pro options
- `app/(app)/dashboard/chat/[website_id]/page.tsx` - Existing chat implementation
