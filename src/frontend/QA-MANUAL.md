# ProposalPro AI - Manual QA Checklist

## Pre-Test Setup
- [ ] Clear browser cache and local storage
- [ ] Open application in incognito/private window
- [ ] Ensure Internet Identity is accessible

## Authentication Flow
- [ ] Can log in with Internet Identity
- [ ] Profile setup modal appears for new users
- [ ] Can enter name and save profile
- [ ] Profile setup modal does not appear on subsequent logins
- [ ] Can log out successfully

## Generate Flow - Free User
- [ ] Navigate to Generate page
- [ ] Quota banner shows "10 free generations remaining" for new user
- [ ] Fill in all required fields (Job Description, Skills, Experience Level)
- [ ] Click "Generate Proposals" button
- [ ] Generation completes without errors
- [ ] All four output sections render (Upwork, Cold Email, DM, Pricing)
- [ ] Quota banner updates to "9 free generations remaining"
- [ ] Can edit generated content in each section
- [ ] Can save proposal to dashboard
- [ ] Repeat generation until quota exhausted (0 remaining)
- [ ] When quota = 0, Generate button is disabled
- [ ] Error message shows: "You've used all your free generations"
- [ ] Quota banner shows upgrade CTA

## Generate Flow - Premium User
- [ ] Navigate to Account page
- [ ] Click "Developer Upgrade" button
- [ ] Success toast appears
- [ ] Plan badge changes to "Premium"
- [ ] Navigate to Generate page
- [ ] Quota banner shows "Unlimited generations available"
- [ ] Can generate proposals without limit
- [ ] No quota decrement occurs
- [ ] Generate button remains enabled after multiple generations

## Dashboard Flow
- [ ] Navigate to Dashboard
- [ ] Saved proposals list displays all saved proposals
- [ ] Each proposal card shows: title snippet, date, experience level, skills
- [ ] Click "View" button navigates to proposal detail page
- [ ] Click "Delete" button shows confirmation dialog
- [ ] Confirm delete removes proposal from list
- [ ] Empty state shows when no proposals exist

## Proposal Detail Flow
- [ ] View a saved proposal
- [ ] All input fields display correctly
- [ ] All four output sections display correctly
- [ ] Click "Copy" button on each section
- [ ] Success toast appears for each copy
- [ ] Click "Delete" button shows confirmation dialog
- [ ] Confirm delete navigates back to Dashboard
- [ ] Deleted proposal no longer appears in list

## Account Page
- [ ] Current plan card shows correct plan (Free/Premium)
- [ ] Usage statistics display correctly (Total Generations, Remaining Free)
- [ ] Free plan shows upgrade card with benefits
- [ ] Premium plan shows "Premium Active" card
- [ ] Upgrade button works (for Free users)
- [ ] No errors in console during navigation

## Error Handling
- [ ] No React error overlays appear during normal usage
- [ ] No console errors related to BigInt comparisons
- [ ] No "Minified React error #185" appears
- [ ] Backend traps show appropriate error messages (not raw stack traces)
- [ ] Network errors show user-friendly toast messages

## Cross-Browser Testing (Optional)
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test on mobile device

## Performance
- [ ] Pages load within 2 seconds
- [ ] No visible layout shifts during load
- [ ] Smooth transitions between pages
- [ ] No memory leaks after extended usage

## Notes
- Record any unexpected behavior or edge cases
- Note any UI/UX improvements needed
- Document any backend traps encountered
