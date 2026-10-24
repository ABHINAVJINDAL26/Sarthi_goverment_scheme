export default function PortalStatsSection() {
  return (
<section className="portal-stats-bar" aria-label="Portal Statistics">
      <div className="portal-stats-container">
        <div className="portal-stats-grid">

          {/* Col 1: Government Schemes (Departments/Entities style) */}
          <div className="portal-stat-col">
            <div className="portal-stat-header">
              <span className="portal-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="10" y="5" width="12" height="23" rx="1" />
                  <rect x="4" y="11" width="6" height="17" rx="1" />
                  <rect x="22" y="11" width="6" height="17" rx="1" />
                  <rect x="13" y="9" width="2" height="2" fill="#2c3e50" />
                  <rect x="17" y="9" width="2" height="2" fill="#2c3e50" />
                  <rect x="13" y="14" width="2" height="2" fill="#2c3e50" />
                  <rect x="17" y="14" width="2" height="2" fill="#2c3e50" />
                  <rect x="13" y="19" width="2" height="2" fill="#2c3e50" />
                  <rect x="17" y="19" width="2" height="2" fill="#2c3e50" />
                  <rect x="6" y="15" width="2" height="2" fill="#2c3e50" />
                  <rect x="6" y="20" width="2" height="2" fill="#2c3e50" />
                  <rect x="24" y="15" width="2" height="2" fill="#2c3e50" />
                  <rect x="24" y="20" width="2" height="2" fill="#2c3e50" />
                  <line x1="2" y1="28" x2="30" y2="28" strokeWidth="2" />
                </svg>
              </span>
              <span className="portal-stat-title">Government Schemes</span>
            </div>
            <div className="portal-stat-body portal-stat-body--split">
              <div className="portal-stat-metric">
                <span className="portal-stat-label">Central</span>
                <span className="portal-stat-value">80</span>
              </div>
              <div className="portal-stat-metric">
                <span className="portal-stat-label">State</span>
                <span className="portal-stat-value">162</span>
              </div>
            </div>
          </div>

          {/* Col 2: Eligibility Checks (Services style) */}
          <div className="portal-stat-col">
            <div className="portal-stat-header">
              <span className="portal-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="6" width="12" height="22" rx="2" />
                  <line x1="8" y1="9" x2="12" y2="9" />
                  <circle cx="10" cy="24" r="1" fill="#2c3e50" />
                  <path d="M14 8h10a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H16" />
                  <line x1="18" y1="13" x2="23" y2="13" />
                  <line x1="18" y1="17" x2="23" y2="17" />
                  <line x1="18" y1="21" x2="23" y2="21" />
                  <line x1="18" y1="25" x2="21" y2="25" />
                </svg>
              </span>
              <span className="portal-stat-title">Eligibility Checks</span>
            </div>
            <div className="portal-stat-body portal-stat-body--split">
              <div className="portal-stat-metric">
                <span className="portal-stat-label">Central</span>
                <span className="portal-stat-value">889</span>
              </div>
              <div className="portal-stat-metric">
                <span className="portal-stat-label">State</span>
                <span className="portal-stat-value">1,726</span>
              </div>
            </div>
          </div>

          {/* Col 3: Documents Analysed (Registrations style) */}
          <div className="portal-stat-col">
            <div className="portal-stat-header">
              <span className="portal-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="4" width="18" height="24" rx="2" />
                  <circle cx="14" cy="11" r="3" />
                  <path d="M9 19c0-2.5 2-4 5-4s5 1.5 5 4" />
                  <line x1="9" y1="23" x2="16" y2="23" />
                  <path d="M20 18c0 4 5 7 5 7s5-3 5-7v-3l-5-2-5 2v3z" fill="#f0f7fc" stroke="#00669e" strokeWidth="1.6" />
                  <path d="m23 20 1.5 1.5 3-3" stroke="#00669e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="portal-stat-title">Documents Analysed</span>
            </div>
            <div className="portal-stat-body">
              <div className="portal-stat-metric">
                <span className="portal-stat-label">Total</span>
                <span className="portal-stat-value">12.59 Crores</span>
              </div>
            </div>
          </div>

          {/* Col 4: Verified Sources (Transactions style) */}
          <div className="portal-stat-col">
            <div className="portal-stat-header">
              <span className="portal-stat-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" width="26" height="26" fill="none" stroke="#2c3e50" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="7" width="22" height="16" rx="2" />
                  <line x1="4" y1="12" x2="26" y2="12" />
                  <line x1="7" y1="16" x2="11" y2="16" />
                  <line x1="7" y1="19" x2="14" y2="19" />
                  <path d="M20 17c0 4 5 7 5 7s5-3 5-7v-3l-5-2-5 2v3z" fill="#f0f7fc" stroke="#00669e" strokeWidth="1.6" />
                  <path d="m23 19 1.5 1.5 3-3" stroke="#00669e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="portal-stat-title">Verified Sources</span>
            </div>
            <div className="portal-stat-body">
              <div className="portal-stat-metric">
                <span className="portal-stat-label">Total</span>
                <span className="portal-stat-value">806.98 Crores</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
