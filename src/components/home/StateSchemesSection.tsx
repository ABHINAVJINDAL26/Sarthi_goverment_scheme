import { useState, useRef } from 'react'
import INDIA_MAP_DATA, { StateLocation } from './indiaMapData'

const CENTRAL_MINISTRIES = [
  'Ministry Of Social Justice and Empowerment',
  'Ministry of Education',
  'Ministry Of Science And Technology',
  'Ministry Of Commerce And Industry',
  'Ministry Of Agriculture and Farmers Welfare',
  'Ministry Of Micro, Small and Medium Enterprises',
  'Ministry Of Culture',
  'Ministry Of Textiles',
  'Ministry of Electronics and Information Technology',
  'Ministry Of Youth Affairs & Sports',
  'Ministry Of Finance',
  'Ministry Of Home Affairs',
  'Ministry Of Defence',
  'Ministry Of Health & Family Welfare',
  'Ministry of Fisheries, Animal Husbandry and Dairying',
  'Ministry of External Affairs',
  'Ministry of Railways',
  'Ministry of Road Transport and Highways',
  'Ministry of Rural Development',
  'Ministry of Housing and Urban Affairs',
  'Ministry of Women and Child Development',
  'Ministry of Power',
  'Ministry of Labour and Employment',
  'Ministry of Environment, Forest and Climate Change',
  'Ministry of Tourism',
]

export default function StateSchemesSection() {
  const [activeTab, setActiveTab] = useState<'central' | 'states'>('central')
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredState, setHoveredState] = useState<StateLocation | null>(null)
  const [selectedState, setSelectedState] = useState<StateLocation | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [isNearTop, setIsNearTop] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setTooltipPos({ x, y })
    setIsNearTop(y < 45)
  }

  const handleStateMouseEnter = (loc: StateLocation) => {
    setHoveredState(loc)
  }

  const handleStateMouseLeave = () => {
    setHoveredState(null)
  }

  const handleStateClick = (loc: StateLocation) => {
    setSelectedState(loc)
  }

  const handleStateFocus = (e: React.FocusEvent<SVGPathElement>, loc: StateLocation) => {
    setHoveredState(loc)
    if (!containerRef.current) return
    const containerRect = containerRef.current.getBoundingClientRect()
    const pathRect = e.currentTarget.getBoundingClientRect()
    const x = (pathRect.left + pathRect.right) / 2 - containerRect.left
    const y = (pathRect.top + pathRect.bottom) / 2 - containerRect.top
    setTooltipPos({ x, y })
    setIsNearTop(y < 45)
  }

  const handleStateBlur = () => {
    setHoveredState(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<SVGPathElement>, loc: StateLocation) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSelectedState(loc)
    }
  }

  const handleExploreClick = () => {
    if (selectedState) {
      alert(`Exploring government schemes for ${selectedState.name} (${selectedState.code})`)
    } else if (hoveredState) {
      alert(`Exploring government schemes for ${hoveredState.name} (${hoveredState.code})`)
    } else {
      alert('Explore state-specific schemes tailored to your state')
    }
  }

  const handleMinistryClick = (ministry: string) => {
    alert(`Exploring schemes under ${ministry}`)
  }

  const getTooltipStyle = () => {
    if (!tooltipPos || !containerRef.current) return { display: 'none' }
    const containerWidth = containerRef.current.clientWidth
    const clampX = Math.max(65, Math.min(containerWidth - 65, tooltipPos.x))

    return {
      left: `${clampX}px`,
      top: `${tooltipPos.y}px`,
      transform: isNearTop ? 'translate(-50%, 18px)' : 'translate(-50%, -120%)',
    }
  }

  const displayedMinistries = isExpanded
    ? CENTRAL_MINISTRIES
    : CENTRAL_MINISTRIES.slice(0, 15)

  return (
    <section className="central-state-section" aria-label="Central and State Schemes">
      <div className="central-state-container">

        {/* Section Header */}
        <div className="central-state-header">
          <span className="central-state-eyebrow">CENTRAL &amp; STATE SCHEMES</span>

          {/* Toggle pill buttons */}
          <div className="central-state-toggle-pill" role="tablist" aria-label="Select Schemes Type">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'central'}
              className={`toggle-tab-btn ${activeTab === 'central' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('central')}
            >
              Central
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'states'}
              className={`toggle-tab-btn ${activeTab === 'states' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('states')}
            >
              States/UTs
            </button>
          </div>
        </div>

        {/* View 1: Central Schemes (Ministries 5-Column Grid) */}
        {activeTab === 'central' && (
          <div className="central-schemes-view" role="tabpanel">
            <div className="central-ministries-grid">
              {displayedMinistries.map((ministry) => (
                <button
                  key={ministry}
                  type="button"
                  className="ministry-card"
                  onClick={() => handleMinistryClick(ministry)}
                >
                  <span className="ministry-card__name">{ministry}</span>
                </button>
              ))}
            </div>

            {/* View More / View Less */}
            <div className="central-view-more-row">
              <button
                type="button"
                className="central-view-more-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'View Less' : 'View More'}
              </button>
            </div>
          </div>
        )}

        {/* View 2: States / UTs Schemes (Interactive Map + Details) */}
        {activeTab === 'states' && (
          <div className="state-schemes-view" role="tabpanel">
            <div className="state-schemes-grid">

              {/* Left Column: Interactive Map of India */}
              <div className="state-map-column">
                <div
                  className="state-map-wrapper"
                  ref={containerRef}
                  onMouseLeave={handleStateMouseLeave}
                >
                  <svg
                    viewBox={INDIA_MAP_DATA.viewBox}
                    className="india-svg-map"
                    preserveAspectRatio="xMidYMid meet"
                    aria-label="Interactive map of India showing states and union territories"
                    onMouseMove={handleMouseMove}
                  >
                    {INDIA_MAP_DATA.locations.map((loc) => {
                      const isHovered = hoveredState?.id === loc.id
                      const isSelected = selectedState?.id === loc.id
                      const isHighlight = isHovered || isSelected

                      return (
                        <path
                          key={loc.id}
                          id={loc.id}
                          d={loc.path}
                          className={`india-state-path ${isHighlight ? 'is-active' : ''}`}
                          fill={isHighlight ? '#FFFFFF' : '#173F73'}
                          stroke={isHighlight ? '#173F73' : '#FFFFFF'}
                          strokeWidth={isHighlight ? 1.2 : 0.75}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          role="button"
                          tabIndex={0}
                          aria-label={`${loc.name} (${loc.code})`}
                          aria-pressed={isSelected}
                          onMouseEnter={() => handleStateMouseEnter(loc)}
                          onClick={() => handleStateClick(loc)}
                          onFocus={(e) => handleStateFocus(e, loc)}
                          onBlur={handleStateBlur}
                          onKeyDown={(e) => handleKeyDown(e, loc)}
                        />
                      )
                    })}
                  </svg>

                  {/* Tooltip */}
                  {hoveredState && (
                    <div
                      className={`state-map-tooltip ${isNearTop ? 'state-map-tooltip--below' : ''}`}
                      style={getTooltipStyle()}
                      role="tooltip"
                    >
                      {hoveredState.name} ({hoveredState.code})
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Text & Call-to-Action */}
              <div className="state-content-column">
                <h3 className="state-heading">State-Specific Schemes</h3>
                <p className="state-description">
                  highlights government programs and policies tailored to each state's unique needs and challenges. This resource details state-specific schemes aimed at improving public welfare, promoting economic development, and ensuring inclusive growth.
                </p>
                <button
                  type="button"
                  className="state-explore-btn"
                  onClick={handleExploreClick}
                >
                  Explore
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  )
}
