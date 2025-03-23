# Gemini Model Integration Task

This document tracks the implementation of Google's Gemini 2.0 Flash model for AI edits in the RapidSite editor.

## Task Overview

Replace the current Azure OpenAI models (o1-mini, gpt-4o-mini) used for element editing with Google's Gemini 2.0 Flash model, which is already being used for website generation in express mode.

## Objectives

- Ensure consistent AI technology throughout the application
- Leverage the performance benefits of Gemini Flash 2.0
- Maintain the existing user experience with "quick" and "quality" modes
- Ensure proper error handling and validation
- Document the changes for future reference

## Implementation Plan

1. Analyze the current implementation in `handle_element_request/route.ts`
2. Study the existing Gemini implementation in `utils/gemini.ts`
3. Modify the API endpoint to use the Gemini model while keeping previous code commented
4. Update the ClientEditor component to send the appropriate parameters
5. Adjust the text descriptions in the UI to reflect the new model capabilities
6. Test the implementation with both quick and quality edit modes
7. Document the changes in the task tracking file

## Expected Behavior

- The "quick" mode should use a lower temperature setting (0.6) for more predictable edits
- The "quality" mode should use a higher temperature setting (0.8) for more creative edits
- The model should consistently respond with valid HTML
- Error handling should remain robust
- The user experience should remain unchanged except for potential improvements in response quality and speed

## Technical Details

### Key Files Modified

- `app/api/handle_element_request/route.ts` - The API endpoint that processes element edit requests
- `components/ClientEditor.tsx` - The client component that sends edit requests to the API
- `components/textpopup2.tsx` - The popup UI component for editing elements

### Model Information

- Previous models:
  - "o1-mini" - Used for quick mode
  - "gpt-4o-mini" - Used for quality mode
- New model:
  - "gemini-2.0-flash-001" - Used for both modes with different temperature settings

## Testing Checklist

- [ ] Test quick edits on text elements
- [ ] Test quality edits on text elements
- [ ] Test edits on complex elements (divs with multiple children)
- [ ] Test edits with structural changes
- [ ] Test response times compared to previous implementation
- [ ] Verify error handling
- [ ] Check appropriate system prompting

## Notes

- The generateContent utility already handles authentication and configuration for Vertex AI
- The model name should be explicitly set to ensure consistency
- Previous implementation is commented out rather than removed for easy rollback if needed
- Console logs are commented out after testing is complete
