export const getStoreSubdomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  const querySubdomain = new URLSearchParams(window.location.search).get("store");
  const pathMatch = window.location.pathname.match(/^\/store\/([^/]+)/i);

  if (querySubdomain) return querySubdomain.trim().toLowerCase();
  if (pathMatch) return decodeURIComponent(pathMatch[1]).trim().toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") return "";

  const configuredDomain = (import.meta.env.VITE_STORE_ROOT_DOMAIN || "frontend-q.com").toLowerCase();
  if (!hostname.endsWith(`.${configuredDomain}`)) return "";

  const parts = hostname.split(".");
  return parts.length === configuredDomain.split(".").length + 1 ? parts[0] : "";
};

export const getStoreBaseDomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts.length > 2 ? parts.slice(1).join(".") : hostname;
};

export const getStorePath = (path) => {
  const store = getStoreSubdomain();
  return store ? `/store/${encodeURIComponent(store)}${path}` : path;
};
