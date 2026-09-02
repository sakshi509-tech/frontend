import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, Save } from "lucide-react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const initialTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#0f172a",
  accentColor: "#f59e0b",
  backgroundColor: "#f8fafc",
  textColor: "#0f172a",
};

const getImageUrl = (image) => {
  if (!image) return "";
  const value = typeof image === "object" ? image.url || image.secure_url || image.path || "" : String(image);
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  const baseUrl = (import.meta.env.VITE_API_URL || "https://backend-12-xsvw.onrender.com/api").replace(/\/api\/?$/, "");
  return `${baseUrl}/${value.replace(/^\/+/, "")}`;
};

const StoreDashboard = () => {
  const [store, setStore] = useState(null);
  const [websiteName, setWebsiteName] = useState("MyStore");
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ username: "", storeName: "", storeSlug: "", subdomain: "", logo: "", banner: "", themeKey: "modern", theme: initialTheme });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [storeResponse, selectedResponse] = await Promise.all([
        api.get("/store/me"),
        api.get("/store/me/products"),
      ]);
      const currentStore = storeResponse.data.store;
      setStore(currentStore);
      if (currentStore) setForm({ username: currentStore.username || currentStore.subdomain, storeName: currentStore.storeName, storeSlug: currentStore.storeSlug || currentStore.subdomain, subdomain: currentStore.subdomain, logo: currentStore.logo || "", banner: currentStore.banner || "", themeKey: currentStore.themeKey || "modern", theme: { ...initialTheme, ...currentStore.theme } });
      setSelected(selectedResponse.data.products || []);
    } catch (error) {
      if (error?.response?.status !== 404) toast.error(error?.response?.data?.message || "Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    api.get("/settings")
      .then(({ data }) => {
        const name = data?.siteName || data?.settings?.siteName || data?.data?.siteName;
        if (name) setWebsiteName(name);
      })
      .catch(() => {});
  }, []);

  const saveStore = async (event) => {
    event.preventDefault();
    const payload = { ...form, username: form.username.trim().toLowerCase(), storeSlug: form.storeSlug.trim().toLowerCase(), subdomain: form.storeSlug.trim().toLowerCase() };
    setSaving(true);
    try {
      const response = await api.post("/store/me", payload);
      setStore(response.data.store);
      toast.success("Store saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not save store");
    } finally {
      setSaving(false);
    }
  };

  const updatePrice = async (productId, value) => {
    try {
      await api.patch(`/store/me/products/${productId}`, { sellingPrice: value === "" ? null : Number(value) });
      setSelected((items) => items.map((item) => item.product?._id === productId ? { ...item, sellingPrice: value === "" ? null : Number(value) } : item));
      toast.success("Store price updated");
    } catch (error) { toast.error(error?.response?.data?.message || "Could not update price"); }
  };

  const removeProduct = async (productId) => {
    try {
      try {
        await api.delete(`/store/me/products/${productId}`);
      } catch (error) {
        if (error?.response?.status !== 404) throw error;
        await api.patch(`/store/me/products/${productId}`, { isActive: false });
      }
      setSelected((items) => items.filter((item) => item.product?._id !== productId));
      toast.success("Product removed from your store");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not remove product");
    }
  };

  if (loading) return <div className="min-h-[70vh] grid place-items-center">Loading store...</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8"><Store className="text-blue-600" /><h1 className="text-3xl font-bold">Your Store: {websiteName} . {store?.storeName || "Store"}</h1></div>
      <form onSubmit={saveStore} className="bg-white border rounded-2xl p-6 mb-8 grid gap-5 md:grid-cols-2">
        <label>Username<input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <label>Store name<input required value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <label>Store slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.storeSlug} onChange={(e) => setForm({ ...form, storeSlug: e.target.value.toLowerCase() })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <label className="md:col-span-2">Logo URL<input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">{Object.keys(initialTheme).map((key) => <label key={key} className="text-sm">{key.replace("Color", " color")}<input type="color" value={form.theme[key]} onChange={(e) => setForm({ ...form, theme: { ...form.theme, [key]: e.target.value } })} className="mt-2 h-10 w-full" /></label>)}</div>
        <button disabled={saving} className="md:col-span-2 inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white py-3"><Save size={17} />{saving ? "Saving..." : "Save Store"}</button>
      </form>
      {store && <p className="mb-6">Your Store: <strong>{websiteName} . {store.storeName}</strong></p>}
      <section>
        <h2 className="text-xl font-bold mb-3">Products in my store</h2>
        <p className="text-gray-600 mb-4">Products selected from the main catalogue appear here.</p>
        <div className="grid md:grid-cols-2 gap-4">{selected.map((item) => {
          const product = item.product;
          const image = getImageUrl(product?.image || product?.images?.[0]);
          return <article key={item._id} className="border rounded-xl p-4 flex gap-4">
            <div className="w-28 h-28 shrink-0 rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
              {image ? <img src={image} alt={product?.name || "Product"} className="w-full h-full object-contain" /> : <Store size={28} className="text-gray-300" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-gray-900">{product?.name || "Product"}</h3>
                <button type="button" title="Remove product" onClick={() => removeProduct(product?._id)} className="text-red-600 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product?.description || "No description available."}</p>
              <label className="block mt-3 text-sm text-gray-600">Selling price<input type="number" min="0" placeholder={product?.price} defaultValue={item.sellingPrice ?? ""} onBlur={(e) => updatePrice(product?._id, e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label>
            </div>
          </article>;
        })}</div>
      </section>
      {!store && <p className="mt-6 text-gray-600"><Link to="/profile" className="text-blue-600">Return to profile</Link></p>}
    </main>
  );
};

export default StoreDashboard;
