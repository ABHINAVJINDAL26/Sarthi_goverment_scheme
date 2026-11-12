import React from 'react'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
}

// ─────────────────────────────────────────────────────────────────────────────
// UX4G Standard Icons (Google Material Symbols for Government Applications)
// ─────────────────────────────────────────────────────────────────────────────

/** UX4G Search Icon */
export function SearchIcon({ width = 20, height = 20, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4.35-4.35" />
    </svg>
  )
}

/** UX4G Location / MapPin Icon (place / location_on) */
export function MapPinIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  )
}

/** UX4G Accessibility Icon (accessibility_new) */
export function AccessibilityIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
    </svg>
  )
}

/** UX4G Broadcast / Live Updates Icon (podcasts / sensors) */
export function BroadcastIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M4.93 4.93A10 10 0 0 0 2 12a10 10 0 0 0 2.93 7.07l1.41-1.41A8 8 0 0 1 4 12a8 8 0 0 1 2.34-5.66L4.93 4.93zm14.14 0l-1.41 1.41A8 8 0 0 1 20 12a8 8 0 0 1-2.34 5.66l1.41 1.41A10 10 0 0 0 22 12a10 10 0 0 0-2.93-7.07zM7.76 7.76A6 6 0 0 0 6 12a6 6 0 0 0 1.76 4.24l1.41-1.41A4 4 0 0 1 8 12a4 4 0 0 1 1.17-2.83L7.76 7.76zm8.48 0l-1.41 1.41A4 4 0 0 1 16 12a4 4 0 0 1-1.17 2.83l1.41 1.41A6 6 0 0 0 18 12a6 6 0 0 0-1.76-4.24z" />
    </svg>
  )
}

/** UX4G Notifications / Bell Icon (notifications) */
export function BellIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
    </svg>
  )
}

/** UX4G Chevron Down Icon (expand_more) */
export function ChevronDownIcon({ width = 12, height = 12, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  )
}

/** UX4G Person / Profile Icon (person) */
export function PersonIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  )
}

/** UX4G Home / House Icon (home) */
export function HomeIcon({ width = 24, height = 24, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  )
}

/** UX4G Explore / Compass Icon (explore) */
export function ExploreIcon({ width = 22, height = 22, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-5.5l2.79-6.14 6.14-2.79-2.79 6.14-6.14 2.79zm4.27-2.12c.7 0 1.27-.57 1.27-1.27s-.57-1.27-1.27-1.27-1.27.57-1.27 1.27.57 1.27 1.27 1.27z" />
    </svg>
  )
}

/** UX4G Description / Document Icon (description) */
export function DescriptionIcon({ width = 22, height = 22, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  )
}

/** UX4G Family / Groups Icon (groups / family_restroom) */
export function FamilyIcon({ width = 22, height = 22, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

/** UX4G Assistant / Forum Icon (forum / chat) */
export function AssistantIcon({ width = 22, height = 22, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
    </svg>
  )
}

/** UX4G Saved / Bookmark Icon (bookmark_border) */
export function BookmarkIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z" />
    </svg>
  )
}

/** UX4G FactCheck / Checklist Icon (fact_check) */
export function FactCheckIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-3.5-3.5 1.41-1.41L11 14.17l5.59-5.59 1.41 1.41L11 17z" />
    </svg>
  )
}

/** UX4G Settings Icon (settings) */
export function SettingsIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  )
}

/** UX4G Help Icon (help_outline) */
export function HelpOutlineIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
    </svg>
  )
}

/** UX4G Delete / Clear Icon (delete_outline) */
export function DeleteOutlineIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  )
}

/** UX4G Logout Icon (logout) */
export function LogoutIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  )
}

/** UX4G Senior Citizen / Elderly Icon (elderly) */
export function ElderlyIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7z" />
    </svg>
  )
}

/** UX4G Disability / Wheelchair Accessible Icon (accessible) */
export function AccessibleIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 15.5c0 .83-.67 1.5-1.5 1.5H16l-3.35-4.47-.9-1.2C11.43 14.84 11 14.23 11 13.5v-3.7l1.7.7c.3.12.63.15.95.07.65-.16 1.1-.73 1.1-1.4V7.5c0-.83-.67-1.5-1.5-1.5H9.72c-.73 0-1.37.52-1.48 1.24L7.5 12h2l.53-3.5h1.97v3.9c0 .64.26 1.25.72 1.69l3.47 4.63c.27.36.7.58 1.15.58h1.66V22h2v-2.5zM12 18c-3.31 0-6-2.69-6-6 0-1.66.67-3.16 1.76-4.24l-1.42-1.42C4.91 7.77 4 9.77 4 12c0 4.41 3.59 8 8 8 2.23 0 4.23-.91 5.66-2.34l-1.42-1.42C15.16 17.33 13.66 18 12 18z" />
    </svg>
  )
}

/** UX4G Storefront / Business Icon (storefront) */
export function StorefrontIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M21.9 8.89l-1.05-4.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.63-1.9 1.52L2.1 8.89c-.24 1.02-.02 2.06.62 2.88.08.11.19.19.28.29V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6.94c.09-.09.2-.18.28-.28.64-.82.87-1.87.62-2.89zm-2.99-3.9l1.05 4.37c.1.42.01.84-.25 1.17-.25.32-.64.47-1.06.47-.86 0-1.65-.67-1.65-1.6V5h1.91zm-4.91 0h2v4.46c0 .85-.59 1.54-1.39 1.54-.75 0-1.36-.6-1.36-1.42V5zm-4 0h2v4.58c0 .82-.61 1.42-1.36 1.42-.8 0-1.39-.69-1.39-1.54V5zm-4 0h1.91v4.4c0 .93-.79 1.6-1.65 1.6-.42 0-.81-.15-1.06-.47-.26-.33-.35-.75-.25-1.17L4.99 5zM4 19v-6.15c.34.1.7.15 1.05.15 1.34 0 2.53-.63 3.3-1.61.77.98 1.96 1.61 3.3 1.61s2.53-.63 3.3-1.61c.77.98 1.96 1.61 3.3 1.61.35 0 .71-.05 1.05-.15V19H4z" />
    </svg>
  )
}

/** UX4G Grid / Apps Icon (apps) */
export function AppsIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z" />
    </svg>
  )
}

/** UX4G Education / School Icon (school) */
export function SchoolIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  )
}

/** UX4G Health / Heart Icon (favorite) */
export function FavoriteIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

/** UX4G Employment / Work Icon (work) */
export function WorkIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  )
}

/** UX4G Agriculture / Eco Icon (eco) */
export function EcoIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M20.5 3.5C12.8 3.7 6.7 6.2 4.1 11.1c-1.6 3.1-.7 6.6 2.1 8.3 2.8 1.7 6.6.7 8.4-2.1 1.3-2 1.6-4.5 1.3-6.9l-8.7 8.2-1.4-1.4 8.6-8.1c-2.4-.2-4.8.2-6.8 1.5C5.9 8.8 7.9 5.2 20.5 3.5z" />
    </svg>
  )
}

/** UX4G Government Building Icon (account_balance) */
export function GovernmentBuildingIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z" />
    </svg>
  )
}

/** UX4G Find In Page / Documents Analysed Icon (find_in_page) */
export function FindInPageIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z" />
    </svg>
  )
}

/** UX4G Verified User / Shield Icon (verified_user) */
export function VerifiedShieldIcon({ width = 26, height = 26, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  )
}

/** UX4G Insights / Analytics Bar Chart Icon (insights / bar_chart) */
export function InsightsIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" />
    </svg>
  )
}

/** UX4G Checklist / Assignment Icon (checklist) */
export function ChecklistIcon({ width = 14, height = 14, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
    </svg>
  )
}

/** UX4G Policy / Gavel / Rule Icon (policy) */
export function PolicyIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  )
}

/** UX4G Security / Lock Icon (lock) */
export function LockIcon({ width = 18, height = 18, size, className, ...props }: IconProps) {
  const w = size ?? width
  const h = size ?? height
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width={w} height={h} className={className} fill="currentColor" {...props}>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Centralized Icon Component
// ─────────────────────────────────────────────────────────────────────────────

export type IconName =
  | 'search'
  | 'map-pin'
  | 'accessibility'
  | 'bell'
  | 'chevron-down'
  | 'person'
  | 'home'
  | 'explore'
  | 'description'
  | 'family'
  | 'assistant'
  | 'bookmark'
  | 'fact-check'
  | 'settings'
  | 'help'
  | 'delete'
  | 'logout'
  | 'school'
  | 'health'
  | 'work'
  | 'agriculture'
  | 'apps'
  | 'elderly'
  | 'accessible'
  | 'storefront'
  | 'government'
  | 'documents'
  | 'verified'
  | 'insights'
  | 'checklist'
  | 'policy'
  | 'lock'

export function Icon({ name, ...props }: { name: IconName } & IconProps) {
  switch (name) {
    case 'search': return <SearchIcon {...props} />
    case 'map-pin': return <MapPinIcon {...props} />
    case 'accessibility': return <AccessibilityIcon {...props} />
    case 'bell': return <BellIcon {...props} />
    case 'chevron-down': return <ChevronDownIcon {...props} />
    case 'person': return <PersonIcon {...props} />
    case 'home': return <HomeIcon {...props} />
    case 'explore': return <ExploreIcon {...props} />
    case 'description': return <DescriptionIcon {...props} />
    case 'family': return <FamilyIcon {...props} />
    case 'assistant': return <AssistantIcon {...props} />
    case 'bookmark': return <BookmarkIcon {...props} />
    case 'fact-check': return <FactCheckIcon {...props} />
    case 'settings': return <SettingsIcon {...props} />
    case 'help': return <HelpOutlineIcon {...props} />
    case 'delete': return <DeleteOutlineIcon {...props} />
    case 'logout': return <LogoutIcon {...props} />
    case 'school': return <SchoolIcon {...props} />
    case 'health': return <FavoriteIcon {...props} />
    case 'work': return <WorkIcon {...props} />
    case 'agriculture': return <EcoIcon {...props} />
    case 'apps': return <AppsIcon {...props} />
    case 'elderly': return <ElderlyIcon {...props} />
    case 'accessible': return <AccessibleIcon {...props} />
    case 'storefront': return <StorefrontIcon {...props} />
    case 'government': return <GovernmentBuildingIcon {...props} />
    case 'documents': return <FindInPageIcon {...props} />
    case 'verified': return <VerifiedShieldIcon {...props} />
    case 'insights': return <InsightsIcon {...props} />
    case 'checklist': return <ChecklistIcon {...props} />
    case 'policy': return <PolicyIcon {...props} />
    case 'lock': return <LockIcon {...props} />
    default: return null
  }
}
