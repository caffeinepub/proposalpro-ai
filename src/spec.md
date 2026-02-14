# Specification

## Summary
**Goal:** Build “ProposalPro AI,” a minimal, professional SaaS dashboard app where authenticated users can generate, edit, copy, and save proposal/pitch sets with a Free vs Premium usage limit and an upgrade screen.

**Planned changes:**
- Create the core dashboard UI shell with navigation/routing for Generate, Dashboard (saved proposals), and Account/Upgrade.
- Add Internet Identity login with session gating: logged-out landing with sign-in CTA; logged-in access to app areas with principal indicator and sign-out.
- Implement backend user profile + entitlements: plan (Free/Premium), remaining free generations (Free starts at 3), generation counter, persisted via stable storage.
- Implement deterministic (non-LLM) backend generation from inputs (job description, skills, experience level, portfolio link) producing 4 outputs: Upwork proposal, cold email pitch, short DM pitch, pricing breakdown suggestion.
- Enforce usage limits: decrement free quota on successful generation; block generation at 0 with messaging and Upgrade CTA; Premium is unlimited.
- Add editing mode for each generated section and copy-to-clipboard for the edited content without consuming additional generations.
- Add save + history: save a generated set (inputs + edited outputs), list saved proposals in Dashboard, view details, and delete saved entries (persisted per user).
- Build Account/Upgrade page showing plan and remaining quota/unlimited, with a clearly labeled developer-safe upgrade action that flips to Premium.
- Add static brand assets (logo/wordmark + app icon) and apply them in the header and as the favicon/app icon where supported.

**User-visible outcome:** Users can sign in with Internet Identity, generate proposal/pitch content from a form, edit and copy each section, save sets to a personal dashboard with view/delete, and see/upgrade their plan with free-generation limits enforced.
