import {
  HomeIcon,
  FamilyIcon,
  ElderlyIcon,
  AccessibleIcon,
  StorefrontIcon,
  AppsIcon,
} from '../ui/icons'

export default function CategorySchemesSection() {
  return (
    <section className="category-schemes-section" aria-label="Discover Schemes by Category">
      <div className="category-container">
        {/* Header Block */}
        <div className="category-header">
          <span className="category-eyebrow">EXPLORE SCHEMES</span>
          <p className="category-subtext">
            Explore government support across different areas of life.
          </p>
        </div>

        {/* Content Layout: 4 Cards on Left + 1 Category Grid Box on Right */}
        <div className="category-main-grid">

          {/* Card 1: Education Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--education">
              <img
                src="/assets/header/Education Schemes.png"
                alt="Education Schemes"
                className="scheme-card__img"
              />
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Education Schemes</h3>
              <p className="scheme-card__desc">Scholarships, fee support and learning opportunities for students.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Education</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 2: Healthcare Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--healthcare">
              <img
                src="/assets/header/Healthcare Schemes.png"
                alt="Healthcare Schemes"
                className="scheme-card__img"
              />
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Healthcare Schemes</h3>
              <p className="scheme-card__desc">Health insurance, treatment support and wellness benefits for all.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Healthcare</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 3: Agriculture Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--agriculture">
              <img
                src="/assets/header/Agriculture Schemes.png"
                alt="Agriculture Schemes"
                className="scheme-card__img"
              />
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Agriculture Schemes</h3>
              <p className="scheme-card__desc">Financial support, subsidies and resources for farmers and rural communities.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Agriculture</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Card 4: Employment Schemes */}
          <div className="scheme-feature-card">
            <div className="scheme-card__illustration scheme-card__illustration--employment">
              <img
                src="/assets/header/Employment Schemes.png"
                alt="Employment Schemes"
                className="scheme-card__img"
              />
            </div>
            <div className="scheme-card__content">
              <h3 className="scheme-card__title">Employment Schemes</h3>
              <p className="scheme-card__desc">Job opportunities, skill development and self-employment support.</p>
              <button type="button" className="scheme-card__btn">
                <span>Explore Employment</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Right Side: 3×2 Icon Grid + Divider + Orange Button */}
          <div className="scheme-side-categories">

            {/* Row 1 — 3 items */}
            <div className="side-cat-row">

              {/* Housing Schemes */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--teal">
                  <HomeIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">Housing Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Women & Child */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--coral">
                  <FamilyIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">Women &amp; Child Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Senior Citizen */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--blue">
                  <ElderlyIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">Senior Citizen Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

            </div>

            {/* Horizontal divider */}
            <hr className="side-cat-divider" />

            {/* Row 2 — 3 items */}
            <div className="side-cat-row">

              {/* Disability */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--purple">
                  <AccessibleIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">Disability Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* Business */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--indigo">
                  <StorefrontIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">Business Schemes</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

              {/* More */}
              <div className="side-cat-item">
                <div className="side-cat-circle side-cat-circle--amber">
                  <AppsIcon width={26} height={26} fill="#ffffff" />
                </div>
                <span className="side-cat-item__label">More Categories</span>
                <span className="side-cat-item__arrow">→</span>
              </div>

            </div>

            {/* Solid Orange Action Button */}
            <button type="button" className="side-cat-all-btn">
              <span>View All Scheme Categories</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
