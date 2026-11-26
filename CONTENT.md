# Content source guide

The canonical tagged content is `src/data/site.ts`. Each value uses one of:

- `legacy`: supplied from the legacy content captured for this migration.
- `verify`: uncertain content that must be checked against `mandjwaterwells.com`; its `note` says what to verify.
- `dummy`: placeholder content that needs owner approval or replacement. Dummy values are shown only in development when `VITE_SHOW_SAMPLE_DATA=true`; the fixed development badge identifies the review state. Production access must use `resolveContent()`, which omits dummy values.

## Verify before launch

| Field path | Current value | What to check on `mandjwaterwells.com` |
| --- | --- | --- |
| `business.address.street` | 1038 Stanton Avenue | Confirm the street number and street name. |
| `business.address.zip` | 49337 | Confirm the ZIP code. |
| `business.owners` | Mark, Julie | Confirm the owners' surnames. |
| `services[7].title` | Well abandonment | Confirm the exact wording. |
| `services[0..9].image` | Service image paths | Confirm each image depicts the listed service; replace with approved company images. |
| `areas.towns[7].name` | Bard Lake | Confirm the town name; it is difficult to read in the screenshot. |
| `areas.towns[8].name` | Reed Lake | Confirm the town name; it is difficult to read in the screenshot. |
| `areas.counties[0..5]` | Kent, Ottawa, Newaygo, Muskegon, Montcalm, Mecosta | Confirm the complete county list. |
| `capabilities.wellDiameter` | 2" to 10" | Confirm the upper limit. |
| `capabilities.replacementOrDrillingDiameter` | up to 12" | Confirm the diameter. |
| `warranty.years` | 5 years | Confirm the warranty duration. |
| `pages.about.ownerPhotoPlaceholder` | `[CONFIRM: owner photo]` | Supply an approved owner photo or remove the slot. |
| `pages.about.equipmentPhotoPlaceholder` | `[CONFIRM: truck and rig photo]` | Supply an approved truck-and-rig photo or remove the slot. |
| `pages.home.heroMediaPlaceholder` | `[CONFIRM: drilling video or photo]` | Supply an owner-provided hero photo/video if the current video and poster fail to load. |
| `contact.responseHours` | `[CONFIRM: hours]` | Confirm the follow-up timeframe before publishing the form success message. |
| `contact.form.title`, `contact.form.intro` | Current estimate-form heading and introduction | Confirm the wording with the owner. |
| `contact.form.fullName`, `phone`, `email`, `city`, `service`, `preferredTime`, `noPreference`, `message`, `optional`, `consent`, `honeypot` | Form field labels and consent/honeypot copy | Confirm field wording and consent language with the owner. |
| `contact.form.namePlaceholder`, `phonePlaceholder`, `emailPlaceholder`, `cityPlaceholder`, `messagePlaceholder` | Example input prompts | Confirm or replace the examples and prompts. |
| `contact.form.submit`, `sending`, `successTitle`, `successPrefix`, `error`, `phoneFallback`, `backToForm`, `callNow` | Form state and action copy | Confirm the copy and ensure the response-time promise is accurate. |
| `contact.form.validation.*` | Seven validation/error messages | Confirm validation and consent wording with the owner. |

## Dummy content to replace

| Field path(s) | Current placeholder | Owner action |
| --- | --- | --- |
| `services[0..9].summary` | Short sample service summaries | Replace each with owner-approved service copy. |
| `warranty.terms` | `[PLACEHOLDER: full warranty terms]` | Add complete, approved warranty terms. |
| `emergency.hours` | `[PLACEHOLDER: emergency service hours]` | Supply confirmed emergency hours, or remove the field. |
| `contact.businessHours.weekdays`, `contact.businessHours.saturday` | Business-hours placeholders | Supply confirmed weekday and Saturday hours. |
| `contact.mapPlaceholder` | `[PLACEHOLDER: map embed]` | Add a verified map embed or remove the map slot. |
| `faq[1]` through `faq[4]` question, answer, and category | Four sample FAQ entries | Review each question, write an approved answer, and confirm its category. |
| `about.rating`, `about.reviewCount` | Google rating and review-count placeholders | Add a verified Google rating and count, or remove the rating display. |
| `about.gallery[0..5].image`, `about.gallery[0..5].label` | Six `/images/placeholder-*.jpg` project slots | Replace every image and label with an approved project and identify any remaining sample item. |
| `about.licenseNumber` | `LICENSE_NUMBER_PLACEHOLDER` | Supply an applicable confirmed license/certification or remove the credential. |
| `about.team[0..1].bio` | Team biography placeholders | Add owner-approved biographies or remove the bios. |
| `about.standards[0..2].title`, `about.standards[0..2].line` | Three company-standard placeholders | Supply approved standards and descriptions, or remove the section. |
| `about.counters[0..2].value`, `about.counters[0..2].label` | Years in business, wells drilled, and rigs-in-service placeholders | Supply verified values and labels, or remove these counters. |
| `about.testimonials[0..2].name`, `quote`, `label` | Three `PLACEHOLDER` testimonials | Replace with approved customer names and quotes, or remove the testimonials. |
| `about.socialLinks.facebook`, `instagram`, `youtube` | `null` links | Add verified URLs; `null` intentionally renders no link. |

## Editing content

Edit `siteContent` in `src/data/site.ts`. Keep each leaf wrapped in `legacy(...)`, `verify(value, note)`, or `dummy(value, note)` so provenance and review status remain explicit. For `verify` and `dummy`, update the note with a concrete next step. Do not mark an unconfirmed fact as `legacy`.

The content report is generated with:

```sh
npm run check:content
```

Current tagged-field totals: **223 legacy**, **63 verify**, and **68 dummy**.

Production content reads must use `resolveContent()` rather than accessing a dummy field's `.value` directly. The production guard checks dummy metadata and direct source reads during `npm run build`.

Before launch, configure `VITE_FORM_ENDPOINT` with a real form endpoint (for example Formspree or Netlify Forms). Without it, the form intentionally presents the phone fallback rather than pretending to submit.
