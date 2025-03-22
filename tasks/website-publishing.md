# Website Publishing Implementation Tasks

This file tracks the implementation of publishing/unpublishing functionality for websites in RapidSite.

## Overview

We're adding the ability for users to publish and unpublish their websites, with different behavior based on the site's current status and the user's subscription level.

## Tasks

### Publish Functionality

- [x] Add `is_published` column to the websites table in Supabase (default: false)
- [x] Create `PublishWebsiteDialog` component for publishing a website
- [x] Update TopBar component to show "Publish" instead of "Save" for unpublished sites
- [x] Allow Pro users to customize subdomain, restrict for free users
- [x] Implement the API to update `is_published` status
- [x] Track publishing events with analytics

### Unpublish Functionality

- [x] Create `UnpublishWebsiteDialog` component
- [x] Add unpublish option to website settings page
- [x] Implement the API to set `is_published` to false
- [x] Track unpublishing events with analytics

### UI Enhancements

- [x] Show website publication status in settings page
- [x] Visual indicators for published/unpublished state
- [x] Conditional rendering of publish/unpublish options

### User Data Handling

- [x] Fix user data retrieval to fetch from user_usage table
- [x] Properly format user data to match expected types
- [x] Implement proper fallbacks for missing data

## Potential Future Enhancements

- [ ] Schedule publishing/unpublishing for a future date
- [ ] Custom publishing settings (robots.txt, sitemap)
- [ ] Email notifications when site status changes
- [ ] Analytics dashboard with traffic before/after publishing

## Implementation Notes

- The publishing dialog requires a website name and subdomain
- Free users cannot modify the subdomain when publishing
- Pro users can customize the subdomain during publishing
- Unpublishing is a destructive action that requires confirmation
- The `is_published` field determines whether to show "Save" or "Publish" in the editor

## Related Components

- `PublishWebsiteDialog.tsx` - Dialog for publishing websites
- `UnpublishWebsiteDialog.tsx` - Dialog for unpublishing websites
- `TopBar.tsx` - Contains the Save/Publish button
- `app/(app)/dashboard/settings/[website_id]/page.tsx` - Contains website settings including unpublish option
- `ClientEditor.tsx` - Main editor component that fetches and manages website data
