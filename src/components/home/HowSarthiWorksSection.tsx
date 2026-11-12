import {
  PersonIcon,
  InsightsIcon,
  ChecklistIcon,
  VerifiedShieldIcon,
  PolicyIcon,
  LockIcon,
} from '../ui/icons'

export default function HowSarthiWorksSection() {
  return (
    <section className="how-section" aria-label="How Sarthi Works">
      <div className="how-container">

        {/* Header */}
        <div className="how-header">
          <span className="how-eyebrow">HOW SARTHI WORKS</span>
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
                <PersonIcon width={14} height={14} fill="#f85c13" />
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
                <InsightsIcon width={14} height={14} fill="#f85c13" />
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
                <ChecklistIcon width={14} height={14} fill="#f85c13" />
                <span>Practical next steps</span>
              </div>
            </div>
          </div>

        </div>

        {/* Trust info row */}
        <div className="how-trust-row">
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--green">
              <VerifiedShieldIcon width={18} height={18} fill="#16a34a" />
            </span>
            <div>
              <p className="how-trust-title">Official sources &amp; verification dates</p>
              <p className="how-trust-desc">Information from government portals, with last-updated dates.</p>
            </div>
          </div>
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--orange">
              <PolicyIcon width={18} height={18} fill="#f85c13" />
            </span>
            <div>
              <p className="how-trust-title">Preliminary results — government decides</p>
              <p className="how-trust-desc">We show likely matches based on rules. Final approval is by the government authority.</p>
            </div>
          </div>
          <div className="how-trust-item">
            <span className="how-trust-icon how-trust-icon--blue">
              <LockIcon width={18} height={18} fill="#2563eb" />
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
