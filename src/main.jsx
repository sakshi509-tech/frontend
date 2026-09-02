import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DropshipperProvider } from "./context/DropshipperContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <ThemeProvider>

          <DropshipperProvider>

            <CartProvider>

              <App />

            </CartProvider>

          </DropshipperProvider>

        </ThemeProvider>

      </AuthProvider>

      <Toaster
        position="top-right"
      />

    </BrowserRouter>

  </React.StrictMode>
);