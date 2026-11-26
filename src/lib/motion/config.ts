export const motionConfig = {
  duration: {
    heading: 1, // Heading reveal duration in seconds.
    image: 1.2, // Image reveal duration in seconds.
    wipe: 1.2, // Editorial wipe duration in seconds.
    cards: 0.9, // Card-row reveal duration in seconds.
    stats: 0.7, // Stat pop duration in seconds.
    columns: 1, // Paired-column reveal duration in seconds.
    subtle: 0.8, // Subtle reveal duration in seconds.
    gallery: 0.9, // Gallery reveal duration in seconds.
    stagger: 0.8, // Staggered-row reveal duration in seconds.
    cascade: 0.7, // Cascade reveal duration in seconds.
    loader: 1.2, // Intro loader counter duration in seconds.
    loaderExit: 0.6, // Intro loader exit duration in seconds.
    homeMedia: 1, // Home hero media settle duration in seconds.
    homeCurtain: 0.9, // Home hero content curtain duration in seconds.
    heroChars: 1.1, // Hero character reveal duration in seconds.
    innerSequence: 0.9, // Inner-page hero sequence duration in seconds.
    magneticSnap: 0.4, // Magnetic cursor return duration in seconds.
    shake: 0.4, // Invalid-form shake duration in seconds.
    counter: 1.5, // Counter duration in seconds.
    magnetic: 0.3, // Magnetic button response duration in seconds.
    pageCurtain: 0.45, // Route curtain transition duration in seconds.
    accordion: 0.3, // Accordion and service-row transition duration in seconds.
    serviceImage: 0.55, // Active service image transition duration in seconds.
    focusFade: 0.15, // Reduced-motion opacity fade duration in seconds.
    header: 0.3, // Header state transition duration in seconds.
    navUnderline: 0.25, // Navigation underline transition duration in seconds.
  },
  distance: {
    headingY: 40, // Heading reveal vertical distance in pixels.
    cardY: 40, // Card-row reveal vertical distance in pixels.
    subtleY: 20, // Subtle reveal vertical distance in pixels.
    galleryY: 30, // Gallery reveal vertical distance in pixels.
    staggerY: 40, // Staggered-row reveal vertical distance in pixels.
    cascadeX: 30, // Cascade reveal horizontal distance in pixels.
    columnX: 60, // Desktop paired-column distance in pixels.
    mobileColumnY: 30, // Mobile paired-column vertical distance in pixels.
    heroTextY: 80, // Hero text scroll-away distance in pixels.
    heroParallaxSize: 20, // Parallax image overscan percentage.
    shakeX: 10, // Maximum invalid-form shake distance in pixels.
    curtainTitleIn: 8, // Route-title entrance distance in pixels.
    curtainTitleOut: 6, // Route-title exit distance in pixels.
    magneticRadius: 80, // Magnetic cursor influence radius in pixels.
    magneticMax: 8, // Maximum magnetic button offset in pixels.
    rippleRadius: 140, // Hero character hover influence radius in pixels.
  },
  ease: {
    heading: 'power3.out', // Heading reveal easing.
    image: 'power3.out', // Image reveal easing.
    wipe: 'power2.inOut', // Wipe reveal easing.
    cards: 'power3.out', // Card-row reveal easing.
    stats: 'back.out(1.7)', // Stat pop easing.
    columns: 'power3.out', // Paired-column reveal easing.
    subtle: 'power2.out', // Subtle reveal easing.
    gallery: 'power3.out', // Gallery reveal easing.
    stagger: 'power3.out', // Staggered-row reveal easing.
    cascade: 'power2.out', // Cascade reveal easing.
    homeMedia: 'power3.out', // Home media settle easing.
    homeCurtain: 'power3.inOut', // Home content curtain easing.
    heroChars: 'expo.out', // Hero character easing.
    magneticSnap: 'elastic.out(1, 0.5)', // Magnetic button return easing.
    shake: 'power2.out', // Invalid-form shake easing.
    counter: 'expo.out', // Count-up easing.
    loader: 'power2.inOut', // Intro-loader easing.
    none: 'none', // Linear easing for scroll-scrubbed timelines.
  },
  stagger: {
    stats: 0.12, // Delay between stat reveals in seconds.
    gallery: 0.08, // Delay between gallery panels in seconds.
    row: 0.12, // Delay between row elements in seconds.
    cascade: 0.1, // Delay between cascade elements in seconds.
    words: 0.08, // Delay between words in seconds.
    nav: 0.06, // Delay between desktop navigation items in seconds.
    heroChars: 0.02, // Delay between hero characters in seconds.
    innerChars: 0.015, // Delay between inner-page characters in seconds.
  },
  scrub: {
    horizontalRail: 1, // Horizontal project rail scrub amount.
    words: 0.8, // Word opacity scrub amount.
    parallax: 0.8, // Parallax scrub amount.
    hero: 0.8, // Hero media and text scrub amount.
    divider: 0.8, // Divider reveal scrub amount.
    progress: 0.2, // Global scroll progress scrub amount.
  },
  trigger: {
    heading: 'top 85%', // Heading reveal trigger position.
    image: 'top 85%', // Image reveal trigger position.
    wipe: 'top 85%', // Wipe reveal trigger position.
    cards: 'top 88%', // Card-row reveal trigger position.
    stats: 'top 80%', // Stats reveal trigger position.
    columns: 'top 75%', // Paired-column reveal trigger position.
    subtle: 'top 90%', // Subtle reveal trigger position.
    gallery: 'top bottom+=80', // Gallery reveal trigger position.
    stagger: 'top 85%', // Staggered-row reveal trigger position.
    cascade: 'top 85%', // Cascade reveal trigger position.
    wordsStart: 'top 75%', // Word scrub start position.
    wordsEnd: 'bottom 45%', // Word scrub end position.
    focusStart: 'top bottom', // Focus paragraph entry position.
    focusEnd: 'bottom top', // Focus paragraph exit position.
    dividerStart: 'top 90%', // Divider scrub start position.
    dividerEnd: 'top 55%', // Divider scrub end position.
    parallaxStart: 'top bottom', // Parallax start position.
    parallaxEnd: 'bottom top', // Parallax end position.
    heroStart: 'top top', // Hero exit start position.
    heroEnd: 'bottom top', // Hero exit end position.
    railStart: 'top top', // Horizontal rail pin position.
    headerSolid: 80, // Scroll distance before the header becomes solid.
    serviceRow: 'top center', // Service row state trigger position.
  },
  parallax: {
    hero: 0.04, // Total hero parallax travel as a percentage.
    quote: 0.05, // Total testimonial-mark parallax travel as a percentage.
    closing: 0.04, // Total closing-band parallax travel as a percentage.
    owner: 0.05, // Total owner photograph parallax travel as a percentage.
  },
  variation: {
    weightStart: 200, // Display heading variable-font starting weight.
    weightEnd: 800, // Display heading final variable-font weight.
    widthStart: 60, // Display heading variable-font starting width.
    widthEnd: 120, // Display heading final variable-font width.
    rippleWeight: 900, // Hovered character variable-font weight.
    rippleWidth: 140, // Hovered character variable-font width.
    maxRippleChars: 60, // Maximum animated hero characters.
    statsScaleStart: 0.8, // Initial scale for stat reveals.
    heroMediaScaleStart: 1.08, // Initial scale for hero media.
    wordOpacityStart: 0.2, // Initial opacity for scrubbed words.
  },
  marquee: {
    duration: 40, // Marquee loop duration in seconds.
    quoteAutoplay: 7000, // Testimonial auto-advance interval in milliseconds.
  },
  smoothScroll: {
    lerp: 0.1, // Lenis interpolation amount.
    anchorOffset: -72, // Scroll offset below the fixed header in pixels.
  },
  rail: {
    desktopEndOffset: 64, // Horizontal project rail viewport gutter in pixels.
  },
  ui: {
    expoOut: [0.16, 1, 0.3, 1] as [number, number, number, number], // Expo-out curve used by Motion UI transitions.
    curtain: [0.76, 0, 0.24, 1] as [number, number, number, number], // Route curtain easing curve.
  },
  timings: {
    supportAfterHeadline: 0.2, // Delay before the hero support line.
    actionsAfterSupport: 0.3, // Delay before hero actions.
    loaderHomeOffset: 0.2, // Delay from loader exit to home media.
    loaderLine: 0.3, // Loader progress line reveal offset.
    innerPageAfterCurtain: 0.45, // Inner hero delay after the route curtain.
    failsafe: 2.5, // Time before hidden visible-page content is forced final.
    curtainTitlePeak: 0.25, // Route-title peak point within its timeline.
  },
  pageHero: {
    services: { xPercent: 0, yPercent: 110, scale: 1, duration: 1.05, stagger: 0.018 },
    about: { xPercent: -35, yPercent: 45, scale: 1, duration: 1.3, stagger: 0.024 },
    faq: { xPercent: 0, yPercent: 0, scale: 0.72, duration: 0.85, stagger: 0.012 },
    contact: { xPercent: 80, yPercent: 0, scale: 0.96, duration: 1.15, stagger: 0.025 },
    warranty: { xPercent: 0, yPercent: -110, scale: 1, duration: 1.05, stagger: 0.02 },
    newaygo: { xPercent: 60, yPercent: 35, scale: 0.88, duration: 1.2, stagger: 0.018 },
  },
  viewport: {
    mobile: 1023, // Largest viewport width treated as mobile or tablet.
    desktop: 1024, // Smallest viewport width treated as desktop.
    mobileColumns: 768, // Width below which columns reveal vertically.
    headingFitRatio: 0.24, // Maximum display-heading height as a viewport fraction.
    minimumFittedFontSize: 16, // Smallest fitted heading size in pixels.
  },
  resize: {
    debounce: 150, // Resize debounce for fitting and refresh in milliseconds.
  },
} as const
