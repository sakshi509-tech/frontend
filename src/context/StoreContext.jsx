import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getStoreSubdomain } from "../utils/storeUtils";

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [storeProducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const subdomain = getStoreSubdomain();

  useEffect(() => {
    let mounted = true;
    const loadStore = async () => {
      if (!subdomain) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/store/subdomain/${encodeURIComponent(subdomain)}`);
        if (mounted) {
          setStore(response.data.store);
          setStoreProducts(response.data.products || []);
        }
      } catch (error) {
        if (mounted) {
          setStore(null);
          setStoreProducts([]);
        }
        console.error("STORE LOAD ERROR:", error?.response?.data || error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadStore();
    return () => { mounted = false; };
  }, [subdomain]);

  useEffect(() => {
    if (!store) return undefined;
    const root = document.documentElement;
    Object.entries(store.theme || {}).forEach(([key, value]) => {
      const cssName = `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
      root.style.setProperty(cssName, value);
    });
    const previousTitle = document.title;
    document.title = store.storeName;
    return () => { document.title = previousTitle; };
  }, [store]);

  return (
    <StoreContext.Provider value={{ store, storeProducts, subdomain, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
