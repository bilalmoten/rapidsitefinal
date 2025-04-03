# Quality Journey Onboarding Tasks

This document tracks the implementation of the onboarding flow for premium users seeking the full value of RapidSite through the quality journey.

## Task Overview

Create a guided onboarding process for users who choose the quality journey, using a hybrid approach of initial overlay screens and in-chat guidance.

## Current Approach (Selected)

**Hybrid Onboarding Approach**:

- Initial 2-3 screens as an overlaid popup directly in the pro-chat interface
- Contextual guidance provided throughout the chat experience
- Help/tutorial button for users to access guidance anytime
- Focus on educating users about effective chat interaction for best results

## Objectives

- Guide users on how to use the pro-chat interface effectively
- Demonstrate best practices for quality website generation
- Provide contextual help without disrupting the website creation flow
- Set expectations about the time required for quality website generation
- Allow users to revisit guidance when needed

## Implementation Tasks

### Initial Overlay Design

- [ ] Design 2-3 concise, focused tutorial screens
- [ ] Create overlay component that appears on first pro-chat visit
- [ ] Add skip/next/previous navigation controls
- [ ] Implement persistence to track if user has seen tutorial

### Help System

- [ ] Create help/tutorial button in pro-chat interface
- [ ] Implement tutorial reopening functionality
- [ ] Design compact help panel with key tips
- [ ] Add ability to navigate between help topics

### In-Chat Guidance

- [ ] Implement contextual tips based on user actions
- [ ] Create suggested prompts for different website aspects
- [ ] Add example messages showing effective communication
- [ ] Design subtle hints that don't disrupt the chat flow

### Content Development

- [ ] Write concise, actionable guidance for each overlay screen
- [ ] Develop contextual tips for different stages of chat
- [ ] Create example prompts that demonstrate best practices
- [ ] Design visual aids showing good vs. basic website descriptions

## Technical Details

### Key Files to Create

- `components/pro-chat/OnboardingOverlay.tsx` - Initial tutorial overlay
- `components/pro-chat/TutorialButton.tsx` - Help button component
- `components/pro-chat/ContextualTips.tsx` - In-context guidance
- `components/pro-chat/ExamplePrompts.tsx` - Example prompts for better results

### Integration Points

The onboarding will be directly integrated with the new pro-chat interface being developed in Task 7, rather than as a separate flow.
