# User Journey Redesign Tasks

This document tracks the implementation of major changes to the RapidSite user journey, adding distinct paths for quick users and premium users.

## Task Overview

Restructure the user journey to provide two distinct paths:

1. **Quick Journey**: For users who want to try the platform quickly with minimal friction
2. **Quality Journey**: For premium users who want the full value of the app with in-depth customization

## Current User Journey

- Landing page → Login → New website dialog → Chat → Website editor

## Planned User Journeys

### Quick Journey

- Landing page with prompt input → Direct to editor (anonymous auth) → Login to save/publish

### Quality Journey

- Landing page → Login/Signup → Onboarding with best practices → In-depth chat → Website generation (with email notification) → Dashboard view

### Existing User Journey

- Dashboard → Chat (with UI updates for prompt/quality modes)

## Implementation Tasks

### Landing Page Redesign

- [x] Update landing page to include prompt input for quick journey
- [x] Implement express mode website generation directly from landing page
- [x] Add login/signup CTAs for quality journey
- [x] Create clearer visual differentiation between the two paths
- [ ] Improve responsive design for both journeys

### Quick Journey Implementation

- [x] Implement anonymous authentication with Supabase
- [x] Create direct path from landing page to editor with prompt
- [x] Implement express website generation API endpoint
- [x] Add "Login to Save/Edit" prompts in editor for anonymous users
- [x] Implement conversion from anonymous to authenticated user
- [x] Handle website data migration during authentication

### Quality Journey Implementation

- [ ] Create onboarding flow with best practices guidance
- [ ] Enhance chat interface for in-depth customization
- [ ] Implement email notification system for website generation completion
- [ ] Update dashboard to show generation progress
- [ ] Improve chat with better handling of uploaded images and inspiration

### Backend Enhancements

- [x] Implement anonymous user authentication API
- [x] Create express generation API for quick websites
- [x] Remove dependency on website name/description in early stages
- [x] Generate temporary random website identifiers if needed
- [x] Move subdomain selection to the publish dialog
- [ ] Modify website generation API to support both quick and quality modes -
      cancelled, api only for quality, quick handled within next js backend express route
- [ ] Implement background processing for quality website generation

### UX Improvements

- [ ] Remove unnecessary new website dialog
- [ ] Streamline authentication flows
- [ ] Add clear visual indicators for website generation status
- [ ] Improve feedback during longer generation processes
- [ ] Add tooltips and guidance for new user journeys

## Completion Criteria

- Both quick and quality journeys are fully functional
- Users can successfully create websites through either path
- Anonymous users can convert to authenticated users without data loss
- Quality generation provides email notifications when complete
- Dashboard clearly shows website status for all users
- UI is intuitive and guides users through their chosen journey

## Technical Details

### Key Files Modified

- `components/landing/Hero.tsx` - Updated to include prompt input and express generation
- `app/api/auth/anonymous/route.ts` - Added API endpoint for anonymous authentication
- `app/api/express-generate/route.ts` - Added API endpoint for express website generation

### Current Progress

The quick journey path has seen significant progress:

1. The landing page now includes a prompt input field and "Express Mode" generation
2. Anonymous authentication has been implemented with Supabase
3. Express generation API has been created to generate websites quickly
4. Direct redirection to the editor with the generated website

The main remaining tasks are:

1. Implementing the conversion from anonymous to authenticated users
2. Creating the onboarding flow for the quality journey
3. Enhancing the chat interface for in-depth customization
4. Implementing email notifications for website generation completion
5. Updating the dashboard to show generation progress
