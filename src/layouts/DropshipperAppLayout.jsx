import React, { useEffect } from "react";
import { useDropshipper } from "../hooks/useDropshipper";
import { detectSubdomain } from "../utils/subdomainUtils";

const DropshipperAppLayout = ({ children }) => {
  const { currentDropshipper, dropshipperTheme, loading } = useDropshipper();
  const subdomain = detectSubdomain();

  // If not on a subdomain, render children as is
  if (!subdomain) {
    return <>{children}</>;
  }

  // While loading dropshipper data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  // If dropshipper not found
  if (!currentDropshipper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Store Not Found</h1>
          <p className="text-gray-600">The store you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Apply dropshipper theme styles
  const themeStyles = dropshipperTheme
    ? {
        "--primary-color": dropshipperTheme.primaryColor,
        "--secondary-color": dropshipperTheme.secondaryColor,
        "--accent-color": dropshipperTheme.accentColor,
        "--bg-color": dropshipperTheme.backgroundColor,
        "--text-color": dropshipperTheme.textColor,
        "--font-family": dropshipperTheme.fontFamily,
        "--font-size": `${dropshipperTheme.fontSize}px`,
        "--border-radius": dropshipperTheme.borderRadius,
      }
    : {};

  return (
    <div style={themeStyles} className="dropshipper-store">
      {/* Optional: Display dropshipper info/branding header */}
      {dropshipperTheme?.bannerImageUrl && (
        <div className="w-full h-40 bg-cover bg-center" style={{ backgroundImage: `url(${dropshipperTheme.bannerImageUrl})` }}>
        </div>
      )}

      {/* Render the actual content */}
      {children}
    </div>
  );
};

export default DropshipperAppLayout;
