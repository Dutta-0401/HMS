# TODOS

## Design debt (from /plan-design-review, 2026-06-17)

Source: design review of the in-progress frontend redesign (commit a036397).
These two items were approved as decisions during the review. Both touch
`frontend/src/components/DoctorCard.jsx` and `frontend/src/components/HospitalCard.jsx`.

- [ ] **P1 — Remove fabricated trust signals** (human: ~2h / CC: ~15min)
  - **What:** Strip invented metrics from the doctor/hospital cards: star ratings
    (`4 + id.charCodeAt(0) % 10`), distance, doctor counts (`specialties.length * 3`),
    and the permanently-green "online" availability dot.
  - **Why:** On a healthcare product, showing fabricated 4.x-star ratings and
    "online" status for real doctors erodes trust the moment a user notices the
    pattern. Design-for-trust says show only what's real, or nothing.
  - **Pros:** Honest by default; removes a credibility landmine before real patients see it.
  - **Cons:** Cards look sparser until real data exists.
  - **Context:** DoctorCard.jsx:7,21 and HospitalCard.jsx:7-10 derive these from the
    record id. Re-introduce each signal only when backed by a real API field.
  - **Depends on / blocked by:** none.

- [ ] **P1 — Lead cards with next-available slot** (human: ~3h / CC: ~25min)
  - **What:** Rework DoctorCard + HospitalCard so the most prominent element is the
    soonest open slot (e.g. "Next available — Today, 2:30 PM"), with fee secondary.
  - **Why:** The product's pitch is "see a doctor this week," but the card a user
    picks from never shows availability. The decision point should surface the one
    thing the product promises.
  - **Pros:** Information architecture aligns with the value prop; faster decisions.
  - **Cons:** Requires real per-doctor/per-hospital availability data; don't show a
    slot you can't guarantee.
  - **Context:** DoctorCard.jsx:31-51 leads with experience/rating/fee; HospitalCard.jsx:63-68
    leads with rating/distance. Reuse the existing `.eyebrow` + `.badge-emerald` tokens.
  - **Depends on / blocked by:** availability data from the booking API.

## Noted but not tracked (raised in review, not added as TODOs)

- Error states on data fetches — `Hospitals.jsx:31` has no `.catch()`, so API
  failures render as "No hospitals found." (distinct error+retry state recommended).
- Accessibility — `aria-label`/`aria-expanded` on Header toggles, Esc-to-close menus,
  and raising `slate-400`/`slate-500` body text to meet 4.5:1 AA contrast.
- DESIGN.md — the design system lives implicitly in `tailwind.config.cjs` + `index.css`;
  documenting it would prevent drift.
- Typographic voice for entity names — left as-is by decision (Fraunces in hero card,
  Inter on listing cards).
