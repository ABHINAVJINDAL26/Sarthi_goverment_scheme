import { useState, useEffect, useRef } from 'react'
import { SearchIcon } from '../ui/icons'
import LiveUpdatesTicker from './LiveUpdatesTicker'

export interface CampaignSlide {
  id: number
  category: string
  schemeName: string
  headline: string
  shortDesc: string
  description: string
  benefits: string[]
  primaryCtaText: string
  secondaryCtaText: string
  bannerImg: string
  thumbnailImg: string
  badgeText: string
  isActive: boolean
}

export const CAMPAIGNS: CampaignSlide[] = [
  {
    id: 1,
    category: 'HEALTHCARE ASSURANCE',
    schemeName: 'Ayushman Bharat PM-JAY',
    headline: 'Free Cashless Health Cover up to ₹5 Lakh per Family per Year',
    shortDesc: 'Cashless secondary & tertiary hospital care up to ₹5 lakh per family across 27,000+ hospitals.',
    description:
      'The flagship health assurance initiative provides secondary and tertiary care hospitalisation benefits across 27,000+ empanelled public and private hospitals across the country.',
    benefits: [
      '₹5,00,000 Annual Family Cover',
      'Cashless & Paperless Hospitalization',
      '27,000+ Empanelled Hospitals',
    ],
    primaryCtaText: 'Explore Scheme',
    secondaryCtaText: 'Check Eligibility',
    bannerImg: '/assets/header/HomepageBanner.png',
    thumbnailImg: '/assets/header/Healthcare Schemes.png',
    badgeText: 'Health Assurance',
    isActive: true,
  },
  {
    id: 2,
    category: 'AGRICULTURE & FARMER WELFARE',
    schemeName: 'PM Kisan Samman Nidhi',
    headline: '₹6,000 Annual Direct Financial Support for Farmer Families',
    shortDesc: 'Direct financial support of ₹6,000 per year released in three instalments for farmer families.',
    description:
      'Direct benefit transfer of ₹6,000 per year released in three equal instalments of ₹2,000 directly into the bank accounts of landholding farmer families across India.',
    benefits: [
      '₹6,000 / Year Direct Bank Transfer',
      '100% Central Government Funded',
      'Over 11 Crore Farmers Benefited',
    ],
    primaryCtaText: 'Explore Scheme',
    secondaryCtaText: 'Check Eligibility',
    bannerImg: '/assets/header/HomepageBanner2.png',
    thumbnailImg: '/assets/header/Agriculture Schemes.png',
    badgeText: 'Farmer Support',
    isActive: true,
  },
  {
    id: 3,
    category: 'CLEAN ENERGY & HOUSING',
    schemeName: 'PM Surya Ghar: Muft Bijli Yojana',
    headline: 'Free Electricity up to 300 Units Monthly with Solar Subsidy',
    shortDesc: 'Rooftop solar subsidy up to ₹78,000 enabling households to get up to 300 units of free power.',
    description:
      'Transform your home into a green energy producer with direct financial assistance of up to ₹78,000 for installing residential rooftop solar systems and reducing utility bills.',
    benefits: [
      'Up to 300 Units Free Power Monthly',
      'Direct Subsidy up to ₹78,000',
      'Zero or Reduced Electricity Bills',
    ],
    primaryCtaText: 'Explore Scheme',
    secondaryCtaText: 'Check Eligibility',
    bannerImg: '/assets/header/HomepageBanner3.png',
    thumbnailImg: '/assets/header/HomepageBanner3.png',
    badgeText: 'Solar Subsidy',
    isActive: true,
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartXRef = useRef<number | null>(null)

  // Auto-play interval with pause capability
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPAIGNS.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [isPaused])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + CAMPAIGNS.length) % CAMPAIGNS.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % CAMPAIGNS.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const diff = touchStartXRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext()
      else handlePrev()
    }
    touchStartXRef.current = null
  }

  return (
    <section className="hero-campaign-section" aria-label="Government Schemes Featured Campaigns">
      {/* 1. Live Government Scheme Updates Bar — immediately below navigation */}
      <div className="hero-ticker-container">
        <LiveUpdatesTicker />
      </div>

      {/* 2. Main Two-Column Section: Left Promotional Banner Carousel + Right Search & Featured Initiatives */}
      <div className="hero-campaign-container">
        <div className="hero-campaign-layout">

          {/* Left Column: Image-Only Promotional Banner Slideshow (No Text/Button Overlays) */}
          <div
            className="campaign-carousel-card"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="region"
            aria-label="Promotional campaign banner slideshow"
          >
            {/* Direct Promotional Banner Image Slides */}
            <div className="campaign-banner-viewport">
              {CAMPAIGNS.map((c, idx) => {
                const isActive = idx === currentSlide
                return (
                  <div
                    key={c.id}
                    className={`campaign-banner-slide ${
                      isActive ? 'campaign-banner-slide--active' : ''
                    }`}
                    aria-hidden={!isActive}
                  >
                    <img
                      src={c.bannerImg}
                      alt={c.headline || c.schemeName}
                      className="campaign-banner-img"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                )
              })}
            </div>

            {/* Carousel Navigation Bar (Docked at the Bottom of Banner Card) */}
            <div className="campaign-controls-bar" aria-label="Banner carousel navigation">
              {/* Slide Counter (e.g. 01 / 03) */}
              <div className="campaign-counter">
                <span className="campaign-counter-current">0{currentSlide + 1}</span>
                <span className="campaign-counter-sep">/</span>
                <span className="campaign-counter-total">0{CAMPAIGNS.length}</span>
              </div>

              {/* Progress Segment Dots */}
              <div className="campaign-progress-dots" role="tablist" aria-label="Banner slides">
                {CAMPAIGNS.map((c, idx) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    className={`campaign-progress-dot ${idx === currentSlide ? 'campaign-progress-dot--active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${c.schemeName}`}
                    aria-selected={idx === currentSlide}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="campaign-nav-arrows">
                <button
                  type="button"
                  className="campaign-arrow-btn"
                  onClick={handlePrev}
                  aria-label="Previous banner"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="campaign-arrow-btn"
                  onClick={handleNext}
                  aria-label="Next banner"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Search Bar + Featured Initiatives */}
          <aside className="campaign-side-column" aria-label="Search schemes and featured initiatives">
            {/* First: Search bar */}
            <div className="right-col-search-box">
              <form
                className="right-col-search-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const q = (e.currentTarget.querySelector('input') as HTMLInputElement).value
                  if (q.trim()) alert(`Searching schemes: ${q}`)
                }}
              >
                <span className="right-col-search-icon" aria-hidden="true">
                  <SearchIcon width={17} height={17} stroke="#64748b" />
                </span>
                <input
                  type="search"
                  className="right-col-search-input"
                  placeholder="Search schemes..."
                  aria-label="Search government schemes"
                />
                <button type="submit" className="right-col-search-btn" aria-label="Submit search">
                  <SearchIcon width={15} height={15} stroke="#ffffff" />
                </button>
              </form>
            </div>

            {/* Second: Featured Initiatives heading */}
            <div className="campaign-side-header">
              <div className="campaign-side-title-wrap">
                <span className="campaign-side-title-accent" aria-hidden="true" />
                <h2 className="campaign-side-title">FEATURED INITIATIVES</h2>
              </div>
              <span className="campaign-side-count">{CAMPAIGNS.length} Schemes</span>
            </div>

            {/* Third: Horizontal Scheme Cards List */}
            <div className="campaign-side-cards-list">
              {CAMPAIGNS.map((c, idx) => {
                const isSelected = idx === currentSlide
                return (
                  <div
                    key={c.id}
                    role="button"
                    tabIndex={0}
                    className={`campaign-promo-card ${
                      isSelected ? 'campaign-promo-card--selected' : ''
                    }`}
                    onClick={() => setCurrentSlide(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setCurrentSlide(idx)
                      }
                    }}
                    aria-current={isSelected ? 'true' : 'false'}
                    aria-label={`View ${c.schemeName}`}
                  >
                    {/* Left side — Scheme image */}
                    <div className="promo-card-thumb">
                      <img
                        src={c.thumbnailImg}
                        alt={c.schemeName}
                        className="promo-card-img"
                        loading="lazy"
                      />
                      {c.isActive && (
                        <span className="promo-card-active-badge">
                          <span className="promo-card-active-dot" aria-hidden="true" />
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Right side — Scheme information */}
                    <div className="promo-card-body">
                      <span className="promo-card-category">{c.badgeText}</span>
                      <h3 className="promo-card-title">{c.schemeName}</h3>
                      <p className="promo-card-summary">{c.shortDesc}</p>

                      <div className="promo-card-footer">
                        <span
                          className="promo-card-explore-link"
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`Exploring ${c.schemeName}`)
                          }}
                        >
                          <span>Explore scheme</span>
                          <span className="promo-card-explore-arrow" aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </aside>

        </div>
      </div>
    </section>
  )
}
