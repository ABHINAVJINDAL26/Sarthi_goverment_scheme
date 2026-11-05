import {
  GovernmentBuildingIcon,
  FactCheckIcon,
  FindInPageIcon,
  VerifiedShieldIcon,
} from '../ui/icons'

export default function PortalStatsSection() {
  return (
    <section className="portal-stats-bar" aria-label="Portal Statistics">
      <div className="portal-stats-container">
        <div className="portal-stats-card">
          <div className="portal-stats-grid">

            {/* Col 1: Government Schemes */}
            <div className="portal-stat-col">
              <div className="portal-stat-header">
                <span className="portal-stat-icon" aria-hidden="true">
                  <GovernmentBuildingIcon width={24} height={24} fill="#ea580c" />
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

            {/* Col 2: Eligibility Checks */}
            <div className="portal-stat-col">
              <div className="portal-stat-header">
                <span className="portal-stat-icon" aria-hidden="true">
                  <FactCheckIcon width={24} height={24} fill="#2563eb" />
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

            {/* Col 3: Documents Analysed */}
            <div className="portal-stat-col">
              <div className="portal-stat-header">
                <span className="portal-stat-icon" aria-hidden="true">
                  <FindInPageIcon width={24} height={24} fill="#16a34a" />
                </span>
                <span className="portal-stat-title">Documents Analysed</span>
              </div>
              <div className="portal-stat-body">
                <div className="portal-stat-metric">
                  <span className="portal-stat-label">Total Verified</span>
                  <span className="portal-stat-value">12.59 Crores</span>
                </div>
              </div>
            </div>

            {/* Col 4: Verified Sources */}
            <div className="portal-stat-col">
              <div className="portal-stat-header">
                <span className="portal-stat-icon" aria-hidden="true">
                  <VerifiedShieldIcon width={24} height={24} fill="#7c3aed" />
                </span>
                <span className="portal-stat-title">Verified Sources</span>
              </div>
              <div className="portal-stat-body">
                <div className="portal-stat-metric">
                  <span className="portal-stat-label">Total Real-Time</span>
                  <span className="portal-stat-value">806.98 Crores</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
