export default function HowSarthiWorksSection() {
  return (
<section className="how-section" aria-label="How Sarthi Works">
      <div className="how-container">

        {/* Header */}
        <div className="how-header">
          <span className="how-eyebrow">HOW SARTHI WORKS</span>
          <div className="how-tricolor" aria-hidden="true">
            <span className="how-tricolor__s" />
            <span className="how-tricolor__w" />
            <span className="how-tricolor__g" />
          </div>
          <h2 className="how-heading">
            Your Path to Government Benefits, Made{' '}
            <span className="how-heading--orange">Simple</span>
          </h2>
          <p className="how-subtext">
            From your profile to practical application guidance, Sarthi helps you take the next step with confidence.
          </p>
        </div>

        {/* Step numbers + connector line */}
        <div className="how-steps-track" aria-hidden="true">
          <span className="how-step-badge">01</span>
          <span className="how-step-badge">02</span>
          <span className="how-step-badge">03</span>
        </div>

        {/* 3 Cards */}
        <div className="how-cards-grid">

          {/* Card 1 */}
          <div className="how-card">
            <div className="how-card__img-wrap">
              <img src="/assets/header/HowImage1.jpg" alt="Tell Us About You" className="how-card__img" />
            </div>
            <div className="how-card__body">
              <h3 className="how-card__title">Tell Us About You</h3>
              <p className="how-card__desc">
                Share a few details about your age, location, income and situation. Skip questions that don't apply.
              </p>
              <div className="how-card__tag">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Personalised profile</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="how-card">
            <div className="how-card__img-wrap">
              <img src="/assets/header/HowImage2.jpg" alt="Discover Your Matches" className="how-card__img" />
            </div>
            <div className="how-card__body">
              <h3 className="how-card__title">Discover Your Matches</h3>
              <p className="how-card__desc">
                Explore relevant schemes and see why you may qualify, including missing information.
              </p>
              <div className="how-card__tag">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
                <span>Explainable eligibility</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="how-card">
            <div className="how-card__img-wrap">
              <img src="/assets/header/HowImage3.jpg" alt="Get Guided to Apply" className="how-card__img" />
            </div>
            <div className="how-card__body">
              <h3 className="how-card__title">Get Guided to Apply</h3>
              <p className="how-card__desc">
                Review required documents, learn how to obtain missing items, then continue on the official portal.
              </p>
              <div className="how-card__tag">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="13" y2="17"/>
                </svg>
                <span>Practical next steps</span>
              </div>
            </div>
          </div>

        </div>

        {/* Trust info row */}
        <div className="how-trust-row">
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--green">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </span>
            <div>
              <p className="how-trust-title">Official sources &amp; verification dates</p>
              <p className="how-trust-desc">Information from government portals, with last-updated dates.</p>
            </div>
          </div>
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--orange">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#f85c13" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22V12"/>
                <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
                <path d="M12 2a5 5 0 0 1 5 5c0 2-5 5-5 5S7 9 7 7a5 5 0 0 1 5-5z"/>
              </svg>
            </span>
            <div>
              <p className="how-trust-title">Preliminary results — government decides</p>
              <p className="how-trust-desc">We show likely matches based on rules. Final approval is by the government authority.</p>
            </div>
          </div>
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--blue">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <div>
              <p className="how-trust-title">Your data, your consent</p>
              <p className="how-trust-desc">We collect only what is needed and keep your information secure and private.</p>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="how-cta-row">
          <button type="button" className="how-cta-primary">
            Check Eligibility <span aria-hidden="true">→</span>
          </button>
          <button type="button" className="how-cta-ghost">
            Browse all schemes <span aria-hidden="true">→</span>
          </button>
        </div>

      </div>
    </section>
  )
}
