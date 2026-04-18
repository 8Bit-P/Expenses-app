import type { Theme } from "../types/preferences";

/**
 * Determines whether the user's operating system is currently running
 * in dark mode or light mode using the matchMedia API.
 *
 * @returns "dark" if the system prefers dark mode, otherwise "light".
 */
export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"; // For SSR compatibility
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Applies the specified theme to the application.
 * If the theme is "system", it resolves to the actual system preference.
 * Toggles the "dark" class on the document root (HTML tag).
 *
 * @param theme - The selected theme mode ("light", "dark", or "system").
 * @returns The explicitly resolved theme ("light" or "dark") that was applied.
 */
export function applyTheme(theme: Theme): "light" | "dark" {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}
