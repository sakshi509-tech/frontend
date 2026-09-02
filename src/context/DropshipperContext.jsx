import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { detectSubdomain, getApiBaseUrl } from "../utils/subdomainUtils";

export const DropshipperContext = createContext();

export const DropshipperProvider = ({ children }) => {
  const [currentDropshipper, setCurrentDropshipper] = useState(null);
  const [dropshipperTheme, setDropshipperTheme] = useState(null);
  const [dropshipperProducts, setDropshipperProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = getApiBaseUrl();

  // Fetch dropshipper data based on subdomain
  useEffect(() => {
    const fetchDropshipperData = async () => {
      try {
        setLoading(true);
        const subdomain = detectSubdomain();

        if (!subdomain) {
          // Not a dropshipper subdomain, just set loading to false
          setLoading(false);
          return;
        }

        // Fetch dropshipper data
        const response = await axios.get(
          `${apiUrl}/dropshipper/subdomain/${subdomain}`
        );

        if (response.data.success) {
          setCurrentDropshipper(response.data.dropshipper);
          setDropshipperTheme(response.data.theme);
          setDropshipperProducts(response.data.products || []);
        }
      } catch (err) {
        console.error("Error fetching dropshipper data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDropshipperData();
  }, [apiUrl]);

  // Apply dropshipper theme to document
  useEffect(() => {
    if (dropshipperTheme) {
      const root = document.documentElement;

      // Set CSS variables for theming
      root.style.setProperty("--primary-color", dropshipperTheme.primaryColor);
      root.style.setProperty("--secondary-color", dropshipperTheme.secondaryColor);
      root.style.setProperty("--accent-color", dropshipperTheme.accentColor);
      root.style.setProperty("--bg-color", dropshipperTheme.backgroundColor);
      root.style.setProperty("--text-color", dropshipperTheme.textColor);
      root.style.setProperty("--font-family", dropshipperTheme.fontFamily);
      root.style.setProperty("--font-size", `${dropshipperTheme.fontSize}px`);
      root.style.setProperty("--border-radius", dropshipperTheme.borderRadius);

      // Inject custom CSS
      if (dropshipperTheme.customCSS) {
        const style = document.createElement("style");
        style.innerHTML = dropshipperTheme.customCSS;
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
      }

      // Update document title
      if (dropshipperTheme.companyName) {
        document.title = dropshipperTheme.companyName;
      }

      // Update favicon if provided
      if (dropshipperTheme.faviconUrl) {
        const link = document.querySelector("link[rel='icon']") || document.createElement("link");
        link.rel = "icon";
        link.href = dropshipperTheme.faviconUrl;
        if (!document.querySelector("link[rel='icon']")) {
          document.head.appendChild(link);
        }
      }
    }
  }, [dropshipperTheme]);

  const value = {
    currentDropshipper,
    dropshipperTheme,
    dropshipperProducts,
    loading,
    error,
    setDropshipperProducts,
  };

  return (
    <DropshipperContext.Provider value={value}>
      {children}
    </DropshipperContext.Provider>
  );
};

export default DropshipperContext;
