import React from 'react'
import { BroadcastIcon, Icon } from '../ui/icons'
import { VERIFIED_SCHEME_UPDATES, SchemeAnnouncement } from '../../data/schemeUpdatesData'

interface LiveUpdatesTickerProps {
  announcements?: SchemeAnnouncement[]
}

export default function LiveUpdatesTicker({
  announcements = VERIFIED_SCHEME_UPDATES,
}: LiveUpdatesTickerProps) {
  const activeUpdates = announcements.filter((a) => a.status === 'active')

  return (
    <div
      className="live-ticker"
      role="region"
      aria-label="Live Government Scheme Updates"
    >
      {/* Static Left Badge */}
      <div className="live-ticker__badge" aria-hidden="true">
        <span className="live-ticker__pulse">
          <span className="live-ticker__pulse-ring" />
          <BroadcastIcon width={12} height={12} />
        </span>
        <span className="live-ticker__badge-text">LIVE UPDATES</span>
      </div>

      {/* Scrolling Content Track */}
      <div className="live-ticker__viewport">
        {activeUpdates.length === 0 ? (
          <div className="live-ticker__empty">
            No new verified updates at the moment.
          </div>
        ) : (
          <div className="live-ticker__track">
            {/* Loop 1: Main Announcement Sequence */}
            <div className="live-ticker__group" aria-label="Recent Announcements">
              {activeUpdates.map((item) => (
                <a
                  key={`u1-${item.id}`}
                  href={item.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="live-ticker__item"
                  title={`${item.schemeName}: ${item.announcementTitle} — ${item.shortDescription} (Source: ${item.sourceName}, Verified: ${item.lastVerifiedAt})`}
                >
                  <span className="live-ticker__item-icon" aria-hidden="true">
                    <Icon name={item.iconName} width={13} height={13} />
                  </span>
                  <span className="live-ticker__item-name">{item.schemeName}</span>
                  <span className="live-ticker__item-sep" aria-hidden="true">
                    —
                  </span>
                  <span className="live-ticker__item-title">{item.announcementTitle}</span>
                  {item.highlightBadge && (
                    <span className="live-ticker__item-tag">
                      {item.highlightBadge}
                    </span>
                  )}
                  <span className="live-ticker__item-bullet" aria-hidden="true">
                    •
                  </span>
                </a>
              ))}
            </div>

            {/* Loop 2: Duplicate Sequence for Seamless Infinite Looping */}
            <div className="live-ticker__group" aria-hidden="true">
              {activeUpdates.map((item) => (
                <a
                  key={`u2-${item.id}`}
                  href={item.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={-1}
                  className="live-ticker__item"
                  title={`${item.schemeName}: ${item.announcementTitle} — ${item.shortDescription} (Source: ${item.sourceName}, Verified: ${item.lastVerifiedAt})`}
                >
                  <span className="live-ticker__item-icon" aria-hidden="true">
                    <Icon name={item.iconName} width={13} height={13} />
                  </span>
                  <span className="live-ticker__item-name">{item.schemeName}</span>
                  <span className="live-ticker__item-sep" aria-hidden="true">
                    —
                  </span>
                  <span className="live-ticker__item-title">{item.announcementTitle}</span>
                  {item.highlightBadge && (
                    <span className="live-ticker__item-tag">
                      {item.highlightBadge}
                    </span>
                  )}
                  <span className="live-ticker__item-bullet" aria-hidden="true">
                    •
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

