// Utility to detect dropshipper subdomain
export const detectSubdomain = () => {
  try {
    // Get hostname
    const hostname = window.location.hostname;

    // Split hostname to get subdomain
    const parts = hostname.split(".");

    let subdomain = null;

    // Check if this is a subdomain (not main domain)
    if (parts.length > 2) {
      // subdomain.example.com -> subdomain
      subdomain = parts[0];
    } else if (parts.length === 2) {
      // Check if it's localhost
      if (!hostname.includes("localhost") && !hostname.includes("127.0.0.1")) {
        // Could be a subdomain
      }
    }

    // For localhost testing, support URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (!subdomain && urlParams.has("subdomain")) {
      subdomain = urlParams.get("subdomain");
    }

    return subdomain;
  } catch (error) {
    console.error("Error detecting subdomain:", error);
    return null;
  }
};

// Utility to get API base URL based on subdomain
export const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:2000/api";
  return apiUrl;
};

// Utility to get main domain
export const getMainDomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  if (parts.length > 2) {
    // subdomain.example.com -> example.com
    return parts.slice(1).join(".");
  }

  return hostname;
};
