import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { base44 } from "@/api/base44Client";
import { pagesConfig } from "@/pages.config";

export default function NavigationTracker() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { Pages, mainPage } = pagesConfig;
  const mainPageKey = mainPage ?? Object.keys(Pages)[0];

  useEffect(() => {
    const pathname = location.pathname;
    let pageName;

    if (pathname === "/" || pathname === "") {
      pageName = mainPageKey;
    } else {
      const pathSegment = pathname.replace(/^\//, "").split("/")[0];
      const pageKeys = Object.keys(Pages);
      const matchedKey = pageKeys.find(
        (key) => key.toLowerCase() === pathSegment.toLowerCase()
      );
      pageName = matchedKey || null;
    }

    // ✅ OFFLINE SAFE: si no existe appLogs/logUserInApp, no hacemos nada
    const logFn = base44?.appLogs?.logUserInApp;
    if (!isAuthenticated || !pageName || typeof logFn !== "function") return;

    Promise.resolve(logFn(pageName)).catch(() => {
      // logging no debe romper la app
    });
  }, [location, isAuthenticated, Pages, mainPageKey]);

  return null;
}
