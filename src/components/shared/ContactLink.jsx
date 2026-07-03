import React from 'react';
import { Mail, Phone } from 'lucide-react';

/**
 * Renders a clickable mailto: or tel: anchor for contact information.
 * Falls back to a dash when the value is empty.
 *
 * @param {'email'|'phone'|'mobile'} type  - Contact type
 * @param {string} value                   - The raw email / phone string
 * @param {string} [className]             - Extra CSS classes
 */
export default function ContactLink({ type, value, className = '' }) {
  if (!value) return <span className="text-slate-400">—</span>;

  const isEmail = type === 'email';
  const href = isEmail ? `mailto:${value}` : `tel:${value}`;
  const Icon = isEmail ? Mail : Phone;

  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 text-primary hover:underline underline-offset-2 font-medium transition-colors ${className}`}
      title={isEmail ? `Send email to ${value}` : `Call ${value}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate max-w-[180px]">{value}</span>
    </a>
  );
}
