import { lazy } from "react";

/**
 * A robust lazy-loading wrapper that handles ChunkLoadErrors (MIME type errors) 
 * by forcing a page reload to fetch the latest production bundles.
 * This is essential for SPAs when a new version is deployed.
 */
export const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.localStorage.getItem("vault-page-has-been-force-refreshed") || "false"
    );

    try {
      const component = await componentImport();
      window.localStorage.setItem("vault-page-has-been-force-refreshed", "false");
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Essential for handling new deployments where old chunks are purged
        window.localStorage.setItem("vault-page-has-been-force-refreshed", "true");
        window.location.reload();
        return { default: () => null }; // Return a dummy while reloading
      }

      // If we already refreshed and it still fails, it's a real error
      console.error("ChunkLoadError detected after retry:", error);
      throw error;
    }
  });
