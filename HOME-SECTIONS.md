# Homepage content map

Homepage copy is read from `src/data/site.ts`. Dummy-tagged content remains hidden unless sample data is explicitly enabled, and the production content guard rejects dummy content exposed to production.

| Homepage section | Component | Content fields |
| --- | --- | --- |
| Header | `src/layout/Header.tsx`, `src/layout/MobileNav.tsx` | `business.name`, `business.location`, `homepage.hero.quoteCta`, `homepage.labels`, `services`, `homepageNavLinks` |
| Hero and ZIP card | `src/sections/homepage/Hero.tsx` | `homepage.hero.*`, `business.tagline`, `business.description` |
| Development statistics | `src/sections/homepage/StatStrip.tsx` | `homepage.stats`, `homepage.labels.developmentStats` |
| Services | `src/sections/homepage/ServicesGrid.tsx` | `homepage.services.*`, `homepage.services.cards` |
| Why choose us and service map | `src/sections/homepage/WhyChooseUs.tsx` | `homepage.whyUs.*`, including checklist, image, and service area fields |
| Projects carousel | `src/sections/homepage/ProjectsCarousel.tsx` | `homepage.projects.*` (six accessible crops from the supplied project collage), carousel labels |
| Testimonials | `src/sections/homepage/Testimonials.tsx` | `homepage.testimonials.*` |
| Closing contact band | `src/sections/homepage/CtaBand.tsx` | `homepage.cta.*`, `business.phone`, `business.email`, `business.location` |
| Footer | `src/layout/Footer.tsx` | `homepage.footer.*`, business contact fields, `contact.businessHours.*`, nav links |

## Owner review before launch

Resolve these `dummy` values in `src/data/site.ts` before making them available in production:

- `homepage.hero.eyebrow` and `homepage.hero.supportingLine`.
- All three `homepage.stats` values and labels: years of experience, project count, and customer satisfaction. They are development only.
- `homepage.services.intro` and each `homepage.services.cards[*].summary`.
- `homepage.whyUs.description` and checklist claims `Expert Team`, `Competitive Pricing`, and `Responsive Support`.
- `homepage.projects.intro`.
- `homepage.testimonials.intro` remains a development-only placeholder. The three owner-provided testimonial quotes, names, towns, ratings, and paired customer photos are now used by the homepage carousel.
- `homepage.cta.intro`.
- `homepage.footer.facebook`, `youtube`, and `linkedin`: add verified URLs or keep them `null` (social links stay hidden while null).
- `contact.businessHours.weekdays` and `contact.businessHours.saturday` shown in the footer.

The contact ZIP card only forwards the submitted ZIP to `/contact`; checking service coverage needs backend work. Project images remain a homepage carousel with no project-detail route or gallery CTA. The hero and work panels use the existing video assets.
