# Specification

## Summary
**Goal:** Fix the React runtime crash on the Generate page after clicking “Generate Proposals” and eliminate related runtime/type errors so proposal generation and quota/entitlement UI are stable.

**Planned changes:**
- Fix the /generate “Generate Proposals” flow so it completes without triggering Minified React error #185 and renders the “Generated Content” section with all four outputs.
- Normalize subscription/entitlements numeric values used in UI/gating logic (e.g., remaining generations, total generations) to avoid unsafe comparisons/conversions (including BigInt-like values).
- Update Generate gating/quota banner and related account/upgrade plan displays to use the normalized values and remain consistent after a successful generation.
- Add a minimal manual regression QA checklist to verify generation, quota decrementing/exhaustion behavior, and stability of Generate/Dashboard/Proposal Detail (save/view/delete).

**User-visible outcome:** Logged-in users can click “Generate Proposals” without the app crashing; generated outputs display correctly, quota/entitlement counts render and update safely, and core save/view/delete proposal flows work without new errors.
