export const getStoreSubdomain = () => {
  const hostname = window.location.hostname.toLowerCase();
  const querySubdomain = new URLSearchParams(window.location.search).get("store");

  if (querySubdomain) return querySubdomain.trim().toLowerCase();
  if (hostname === "localhost" || hostname === "127.0.0.1") return "";

  const parts = hostname.split(".");
  return parts.length > 2 ? parts[0] : "";
};

export const getStoreBaseDomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts.length > 2 ? parts.slice(1).join(".") : hostname;
};
