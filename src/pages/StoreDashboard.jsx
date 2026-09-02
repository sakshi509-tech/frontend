import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Store, Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

const initialTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#0f172a",
  accentColor: "#f59e0b",
  backgroundColor: "#f8fafc",
  textColor: "#0f172a",
};

const StoreDashboard = () => {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ storeName: "", subdomain: "", logo: "", theme: initialTheme });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [storeResponse, productResponse, selectedResponse] = await Promise.all([
        api.get("/store/me"),
        api.get("/product/all?limit=100"),
        api.get("/store/me/products"),
      ]);
      const currentStore = storeResponse.data.store;
      setStore(currentStore);
      if (currentStore) setForm({ storeName: currentStore.storeName, subdomain: currentStore.subdomain, logo: currentStore.logo || "", theme: { ...initialTheme, ...currentStore.theme } });
      setProducts(productResponse.data.products || []);
      setSelected(selectedResponse.data.products || []);
    } catch (error) {
      if (error?.response?.status !== 404) toast.error(error?.response?.data?.message || "Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const saveStore = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await api.post("/store/me", form);
      setStore(response.data.store);
      toast.success("Store saved");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not save store");
    } finally {
      setSaving(false);
    }
  };

  const addProduct = async (product) => {
    if (!store) return toast.error("Create your store first");
    try {
      await api.post(`/store/me/products/${product._id}`, {});
      await load();
      toast.success("Added to your store");
    } catch (error) { toast.error(error?.response?.data?.message || "Could not add product"); }
  };

  const removeProduct = async (productId) => {
    try {
      await api.delete(`/store/me/products/${productId}`);
      setSelected((items) => items.filter((item) => String(item.product?._id) !== String(productId)));
      toast.success("Removed from your store");
    } catch (error) { toast.error(error?.response?.data?.message || "Could not remove product"); }
  };

  const updatePrice = async (productId, value) => {
    try {
      await api.post(`/store/me/products/${productId}`, { sellingPrice: value === "" ? null : Number(value) });
      setSelected((items) => items.map((item) => item.product?._id === productId ? { ...item, sellingPrice: value === "" ? null : Number(value) } : item));
      toast.success("Store price updated");
    } catch (error) { toast.error(error?.response?.data?.message || "Could not update price"); }
  };

  const selectedIds = new Set(selected.map((item) => String(item.product?._id)));
  if (loading) return <div className="min-h-[70vh] grid place-items-center">Loading store...</div>;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8"><Store className="text-blue-600" /><h1 className="text-3xl font-bold">My Store</h1></div>
      <form onSubmit={saveStore} className="bg-white border rounded-2xl p-6 mb-8 grid gap-5 md:grid-cols-2">
        <label>Store name<input required value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <label>Subdomain<input required pattern="[a-z0-9-]+" value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value.toLowerCase() })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <label className="md:col-span-2">Logo URL<input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="mt-2 w-full border rounded-lg p-3" /></label>
        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-3">{Object.keys(initialTheme).map((key) => <label key={key} className="text-sm">{key.replace("Color", " color")}<input type="color" value={form.theme[key]} onChange={(e) => setForm({ ...form, theme: { ...form.theme, [key]: e.target.value } })} className="mt-2 h-10 w-full" /></label>)}</div>
        <button disabled={saving} className="md:col-span-2 inline-flex justify-center items-center gap-2 rounded-lg bg-blue-600 text-white py-3"><Save size={17} />{saving ? "Saving..." : "Save Store"}</button>
      </form>
      {store && <p className="mb-6">Your store: <a className="text-blue-600" href={`${window.location.protocol}//${store.subdomain}.${window.location.host.replace(/^www\./, "")}`}>{store.subdomain}.{window.location.host.replace(/^www\./, "")}</a></p>}
      <section className="grid md:grid-cols-2 gap-6">
        <div><h2 className="text-xl font-bold mb-3">Choose products</h2><div className="grid gap-3">{products.filter((product) => !selectedIds.has(String(product._id))).map((product) => <div key={product._id} className="flex items-center justify-between border rounded-xl p-4"><span>{product.name}</span><button onClick={() => addProduct(product)} className="inline-flex items-center gap-1 text-blue-600"><Plus size={16} />Add</button></div>)}</div></div>
        <div><h2 className="text-xl font-bold mb-3">Selected products</h2><div className="grid gap-3">{selected.map((item) => <div key={item._id} className="border rounded-xl p-4"><div className="flex items-center justify-between gap-3"><span>{item.product?.name}</span><button onClick={() => removeProduct(item.product?._id)} className="text-red-600"><Trash2 size={17} /></button></div><label className="block mt-3 text-sm text-gray-600">Custom selling price<input type="number" min="0" placeholder={item.product?.price} defaultValue={item.sellingPrice ?? ""} onBlur={(e) => updatePrice(item.product?._id, e.target.value)} className="mt-1 w-full border rounded-lg p-2" /></label></div>)}</div></div>
      </section>
      {!store && <p className="mt-6 text-gray-600"><Link to="/profile" className="text-blue-600">Return to profile</Link></p>}
    </main>
  );
};

export default StoreDashboard;
