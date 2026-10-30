// FooterSection.tsx — India.gov.in-style footer section component for Sarthi

// ── Link data ─────────────────────────────────────────────────────────────────
const CAT_COL_1 = [
  'Agriculture, Rural & Environment',
  'Benefits & Social development',
  'Business & Self-employed',
  'Citizenship, Visa & Passports',
  'Defence & Foreign affairs',
  'Driving & Transport',
  'Education & Learning',
  'Governance & Planning',
  'Health & Wellness',
]

const CAT_COL_2 = [
  'Housing & Local services',
  'Infrastructure & Industries',
  'Jobs',
  'Justice, Law & Grievances',
  'Money & Taxes',
  'Science, IT & Communication',
  'Travel & Tourism',
  'Welfare of Families',
  'Youth sports & Culture',
]

const MY_GOV_LINKS = ['Acts & Rules', 'Schemes', 'Constitution of India', 'Documents']
const DIR_LINKS = ['Who\'s Who', 'Contact Directory', 'Web Directory', 'Public Utilities', 'Helpline']

const EXPLORE_LINKS = ['Travel & Tourism', 'Culinary Delights', 'One District One Product', 'Facts of India']
const NEWS_LINKS = ['Services']

const ABOUT_LINKS = ['Contact Us', 'Feedback', 'FAQs', 'Help', 'Link to Us', 'Newsletter', 'Site Map', 'Calendar']

const SPOTLIGHT_LINKS = [
  'Visitor Summary',
  'Disclaimer',
  'Website Policy',
  'Subscribe to Newsletter',
  'App Privacy Policy',
  'Content Sources',
  'India Portal 2.0 Brochure',
]

// ── Last reviewed timestamp ───────────────────────────────────────────────────
function getLastReviewed(): string {
  const now = new Date()
  return now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FooterLink({ href = '#', children }: { href?: string; children: React.ReactNode }) {
  return (
    <li>
      <a href={href} className="footer-link">
        {children}
      </a>
    </li>
  )
}

function ColHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="footer-col-heading">{children}</h3>
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FooterSection() {
  return (
    <footer className="site-footer" role="contentinfo">

      {/* ── TOP RULE ─────────────────────────────────────────────────────── */}
      <div className="footer-top-rule" aria-hidden="true" />

      {/* ── MAIN FOOTER (black) ──────────────────────────────────────────── */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-columns">

            {/* COLUMN 1: Category (two sub-columns) */}
            <div className="footer-col footer-col--category">
              <ColHeading>Category</ColHeading>
              <div className="footer-cat-grid">
                <ul className="footer-link-list">
                  {CAT_COL_1.map(l => <FooterLink key={l}>{l}</FooterLink>)}
                </ul>
                <ul className="footer-link-list">
                  {CAT_COL_2.map(l => <FooterLink key={l}>{l}</FooterLink>)}
                </ul>
              </div>
            </div>

            {/* COLUMN 2: My Government + Directory */}
            <div className="footer-col footer-col--gov">
              <ColHeading>My-Government</ColHeading>
              <ul className="footer-link-list">
                {MY_GOV_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
              <ColHeading>Directory</ColHeading>
              <ul className="footer-link-list">
                {DIR_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
            </div>

            {/* COLUMN 3: Explore India + News Hub */}
            <div className="footer-col footer-col--explore">
              <ColHeading>Explore India</ColHeading>
              <ul className="footer-link-list">
                {EXPLORE_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
              <ColHeading>News Hub</ColHeading>
              <ul className="footer-link-list">
                {NEWS_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
            </div>

            {/* COLUMN 4: About Us */}
            <div className="footer-col footer-col--about">
              <ColHeading>About Us</ColHeading>
              <ul className="footer-link-list">
                {ABOUT_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
            </div>

            {/* COLUMN 5: Spotlights */}
            <div className="footer-col footer-col--spotlight">
              <ColHeading>Spotlights</ColHeading>
              <ul className="footer-link-list">
                {SPOTLIGHT_LINKS.map(l => <FooterLink key={l}>{l}</FooterLink>)}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM INFO BAR (charcoal, centered) ─────────────────────────── */}
      <div className="footer-bottom-bar">
        <div className="footer-container">
          <div className="footer-bottom-inner">

            {/* Centered NIC Logo */}
            <div className="footer-bottom-logo-wrap">
              <img
                src="/assets/header/nic-logo.png"
                alt="National Informatics Centre"
                className="footer-nic-logo"
              />
            </div>

            {/* Centered Description & Last Reviewed */}
            <div className="footer-bottom-desc-wrap">
              <p className="footer-bottom-desc">
                India Portal is developed under the Digital India Programme to provide citizens with open and easy access to information. It is designed, developed, and maintained by the National Informatics Centre (NIC), under the Ministry of Electronics &amp; Information Technology, Government of India. The content available on India Portal is owned and managed by the respective Ministries and Departments.
              </p>
              <p className="footer-bottom-reviewed">
                Last reviewed and updated on {getLastReviewed()}
              </p>
            </div>

          </div>
        </div>
      </div>

    </footer>
  )
}

