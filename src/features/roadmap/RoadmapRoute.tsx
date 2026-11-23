import React from 'react'

const desktopRoute = 'M120 52 C200 52 285 52 360 52 C445 52 515 84 600 52 C685 20 770 20 840 52 C910 84 930 115 930 166 C930 217 910 248 840 280 C770 312 685 312 600 280 C515 248 445 248 360 280 C285 312 200 312 120 280'
const tabletRoute = 'M160 75 C255 75 385 75 480 75 C540 75 540 235 480 235 C385 235 255 235 160 235 C100 235 100 395 160 395 C255 395 385 395 480 395 C540 395 540 555 480 555 C385 555 255 555 160 555'

export const RoadmapRoute: React.FC = () => (
  <div aria-hidden="true" className="roadmap-static-route">
    <svg className="roadmap-static-route-desktop" viewBox="0 0 960 450" preserveAspectRatio="none">
      <path d={desktopRoute} fill="none" stroke="var(--color-accent-teal)" strokeWidth="12" strokeOpacity=".55" strokeLinecap="round" strokeLinejoin="round" />
      <path d={desktopRoute} fill="none" stroke="var(--color-bg-cream)" strokeWidth="3" strokeDasharray="7 10" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(120 14)"><rect x="-24" y="-12" width="48" height="20" rx="10" fill="#3F8E8E"/><text x="0" y="2" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">START</text></g>
      <g transform="translate(45 280)"><rect x="-26" y="-10" width="52" height="20" rx="10" fill="#3F8E8E"/><text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">FINISH</text></g>
    </svg>
    <svg className="roadmap-static-route-tablet" viewBox="0 0 640 700" preserveAspectRatio="none">
      <path d={tabletRoute} fill="none" stroke="var(--color-accent-teal)" strokeWidth="10" strokeOpacity=".55" strokeLinecap="round" strokeLinejoin="round" />
      <path d={tabletRoute} fill="none" stroke="var(--color-bg-cream)" strokeWidth="3" strokeDasharray="7 10" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(160 20)"><rect x="-22" y="-10" width="44" height="18" rx="9" fill="#3F8E8E"/><text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">START</text></g>
      <g transform="translate(80 555)"><rect x="-24" y="-10" width="48" height="18" rx="9" fill="#3F8E8E"/><text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">FINISH</text></g>
    </svg>
    <svg className="roadmap-static-route-mobile" viewBox="0 0 40 400" preserveAspectRatio="none">
      <path d="M20 8 V392" fill="none" stroke="var(--color-accent-teal)" strokeWidth="8" strokeOpacity=".55" />
      <path d="M20 8 V392" fill="none" stroke="var(--color-bg-cream)" strokeWidth="2" strokeDasharray="6 9" />
    </svg>
  </div>
)

export default RoadmapRoute
