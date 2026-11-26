import { Facebook, Linkedin, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ContentText } from '@/components/content/ContentText'
import { mainNavLinks, resolveContent, siteContent, siteData } from '@/data/site'

export function Footer() {
  const content = siteContent.homepage.footer
  const year = new Date().getFullYear()
  const socialLinks = [
    { href: resolveContent(content.facebook), label: content.socialFacebookLabel, Icon: Facebook },
    { href: resolveContent(content.youtube), label: content.socialYoutubeLabel, Icon: Youtube },
    { href: resolveContent(content.linkedin), label: content.socialLinkedinLabel, Icon: Linkedin },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href))
  const weekdays = resolveContent(siteContent.contact.businessHours.weekdays)
  const saturday = resolveContent(siteContent.contact.businessHours.saturday)

  return (
    <footer className="home-site-footer">
      <div className="home-container">
        <div className="home-site-footer__grid">
          <div className="home-site-footer__brand">
            <Link className="home-brand" to="/" aria-label={resolveContent(siteContent.pages.labels.homeLinkAria) ?? ''}>
              <img
                src="/images/newlogo.png"
                alt={resolveContent(siteContent.pages.labels.homeLinkAria) ?? ''}
                width={1748}
                height={900}
                className="home-footer-logo"
              />
            </Link>
            <p><ContentText field={content.description} /></p>
          </div>

          <nav aria-label={resolveContent(content.quickLinks) ?? ''}>
            <h2><ContentText field={content.quickLinks} /></h2>
            <ul>
              {mainNavLinks.map((item) => (
                <li key={item.href}><Link to={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div className="home-site-footer__contact">
            <h2><ContentText field={siteContent.pages.labels.contactHeading} /></h2>
            <a href={`tel:${siteData.phoneClean}`}><Phone size={15} aria-hidden="true" /><span>{siteData.phone}</span></a>
            <a href={`mailto:${siteData.email}`}><Mail size={15} aria-hidden="true" /><span>{siteData.email}</span></a>
            <Link to="/contact"><MapPin size={15} aria-hidden="true" /><span><ContentText field={siteContent.business.location} /></span></Link>
          </div>

          <div className="home-site-footer__hours">
            <h2><ContentText field={content.hoursHeading} /></h2>
            {weekdays && <p><ContentText field={siteContent.contact.businessHours.weekdays} /></p>}
            {saturday && <p><ContentText field={siteContent.contact.businessHours.saturday} /></p>}
            {!weekdays && !saturday && (
              <p><ContentText field={siteContent.homepage.labels.hoursUnavailable} /></p>
            )}
            {socialLinks.length > 0 && (
              <nav className="home-site-footer__socials" aria-label={resolveContent(siteContent.homepage.labels.socialLinks) ?? ''}>
                {socialLinks.map(({ href, label, Icon }) => (
                  <a key={href} href={href} aria-label={resolveContent(label) ?? ''} target="_blank" rel="noreferrer">
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
        <div className="home-site-footer__bottom">
          <span><ContentText field={content.copyrightMark} /> {year} <ContentText field={siteContent.business.name} />. <ContentText field={siteContent.pages.labels.allRightsReserved} /></span>
          <Link to="/contact"><ContentText field={siteContent.pages.labels.contact} /></Link>
        </div>
      </div>
    </footer>
  )
}
