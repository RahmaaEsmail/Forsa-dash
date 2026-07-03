import React from 'react'
import { Link } from 'react-router-dom'

const ROUTES = {
  supplier: (id) => `/suppliers/${id}/details`,
  customer: (id) => `/customer-details/${id}`,
}

/**
 * Renders supplier/customer names as a link to their registered details page.
 * Falls back to plain text when no id is available.
 */
export default function EntityLink({ type, id, children, className = '', fallback = 'N/A' }) {
  const content = children ?? fallback

  if (!id || !ROUTES[type]) {
    return <span className={className}>{content}</span>
  }

  return (
    <Link
      to={ROUTES[type](id)}
      onClick={(e) => e.stopPropagation()}
      className={`text-primary hover:underline underline-offset-2 font-medium ${className}`}
    >
      {content}
    </Link>
  )
}
