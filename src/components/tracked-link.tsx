'use client';

import { trackEvent } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
  eventPath: string;
  eventDestination: string;
}

/**
 * Client Component wrapper for analytics-tracked links.
 *
 * Required because the root layout is a Server Component (RSC) and
 * onClick handlers cannot be serialized across the RSC boundary.
 */
export default function TrackedLink({
  href,
  className,
  children,
  eventPath,
  eventDestination,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() =>
        trackEvent({
          type: 'map_directions_click',
          path: eventPath,
          destination: eventDestination,
        })
      }
    >
      {children}
    </a>
  );
}
