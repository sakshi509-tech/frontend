
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// =========================
// USER PAGES
// =========================
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/register";
import Profile from "./pages/profile";
import Wishlist from "./pages/wishlist";
import Cart from "./pages/cart";
import Search from "./pages/search";
import Products from "./pages/product";
import ProductDetails from "./pages/singleProduct.jsx";
import CategoryProducts from "./pages/categoryProducts";
import EditProfile from "./pages/EditProfile.jsx";

// =========================
// COMPONENTS
// =========================
import WhatsAppButton from "./component/whatsappButton";
import AdminRoute from "./component/adminRoute.jsx";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./admin/adminDeshboard.jsx";
import AdminLayout from "./admin/adminLayout.jsx";
import AdminProducts from "./admin/adminProduct.jsx";
import AdminProductAdd from "./admin/adminProductAdd.jsx";
import AdminProductEdit from "./admin/adminProductEdit.jsx";
import AdminUsers from "./admin/adminUser.jsx";
import AdminCategories from "./admin/adminCategory.jsx";
import AdminCategoryAdd from "./admin/adminCategoryAdd.jsx";
import AdminCategoryEdit from "./admin/categoryEdit.jsx";

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      <Routes>

        {/* =========================
            USER ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/category/:id"
          element={<CategoryProducts />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/whatsapp"
          element={<WhatsAppButton />}
        />


<Route
  path="/edit-profile"
  element={<EditProfile />}
/>


        {/* =========================
            ADMIN ROUTES
        ========================= */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* /admin */}
            <Route
              index
              element={<AdminDashboard />}
            />

            {/* /admin/dashboard */}
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* /admin/users */}
            <Route
              path="users"
              element={<AdminUsers />}
            />

            {/* /admin/categories */}
            <Route
              path="categories"
              element={<AdminCategories />}
            />

            {/* /admin/categories/add */}
            <Route
              path="categories/add"
              element={<AdminCategoryAdd />}
            />

            {/* /admin/categories/edit/:id */}
            <Route
              path="categories/edit/:id"
              element={<AdminCategoryEdit />}
            />

            {/* /admin/products */}
            <Route
              path="products"
              element={<AdminProducts />}
            />

            {/* /admin/products/add */}
            <Route
              path="products/add"
              element={<AdminProductAdd />}
            />

            {/* /admin/products/edit/:id */}
            <Route
              path="products/edit/:id"
              element={<AdminProductEdit />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;
