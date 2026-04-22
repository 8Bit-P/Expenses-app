import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the screen is mobile based on a media query.
 * Default breakpoint is 768px (MD in Tailwind).
 *
 * @param breakpoint The pixel width to trigger the mobile state (default: 768)
 * @returns boolean true if the screen is mobile
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Set initial value
    setIsMobile(mql.matches);

    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Modern way to add listener
    mql.addEventListener("change", listener);

    return () => mql.removeEventListener("change", listener);
  }, [breakpoint]);

  return isMobile;
}
