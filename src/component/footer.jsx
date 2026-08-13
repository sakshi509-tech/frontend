import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaLightbulb,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  // ==========================================
  // WHATSAPP
  // ==========================================

  const whatsappNumber = "7230910907";

  const whatsappMessage =
    "Hello LIGHTS, mujhe aapke products ke baare mein information chahiye.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <footer className="bg-gray-900 text-gray-300">

      {/* ================================
          MAIN FOOTER
      ================================= */}
      <div className="mx-auto max-w-7xl px-5 py-14">

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* ================================
              BRAND
          ================================= */}
          <div>

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600">
                <FaLightbulb className="text-2xl text-white" />
              </div>

              <span className="text-2xl font-bold text-white">
                LIGHTS
              </span>
            </Link>

            <p className="mt-5 leading-7 text-gray-400">
              Your trusted destination for quality products,
              great prices and a smooth online shopping
              experience.
            </p>

            {/* ================================
                SOCIAL MEDIA
            ================================= */}
            <div className="mt-6 flex gap-3">

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-blue-600 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-pink-600 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-sky-500 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>

              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-red-600 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>

              {/* WHATSAPP */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 transition hover:bg-green-600 hover:text-white"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>

            </div>

          </div>

          {/* ================================
              QUICK LINKS
          ================================= */}
          <div>

            <h3 className="mb-5 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  to="/"
                  className="transition hover:text-green-500"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/products"
                  className="transition hover:text-green-500"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="transition hover:text-green-500"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-green-500"
                >
                  Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-green-500"
                >
                  My Profile
                </Link>
              </li>

            </ul>

          </div>

          {/* ================================
              CONTACT
          ================================= */}
          <div>

            <h3 className="mb-5 text-lg font-bold text-white">
              Contact Us
            </h3>

            <div className="space-y-5">

              {/* PHONE */}
              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                  <FaPhoneAlt className="text-sm text-white" />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Call Us
                  </p>

                  <a
                    href="tel:+917230910907"
                    className="text-white transition hover:text-green-500"
                  >
                    +91 7230910907
                  </a>

                </div>

              </div>

              {/* WHATSAPP */}
              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                  <FaWhatsapp className="text-sm text-white" />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    WhatsApp
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white transition hover:text-green-500"
                  >
                    Chat With Us
                  </a>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600">
                  <FaMapMarkerAlt className="text-sm text-white" />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="text-white">
                    Jaipur, Rajasthan, India
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ================================
              WHATSAPP SECTION
          ================================= */}
          <div>

            <h3 className="mb-5 text-lg font-bold text-white">
              Need Help?
            </h3>

            <p className="leading-7 text-gray-400">
              Have any questions about our products?
              Contact us directly on WhatsApp.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-5 py-4 font-bold text-white transition hover:bg-green-700"
            >
              <FaWhatsapp className="text-2xl" />

              Chat on WhatsApp
            </a>

          </div>

        </div>

      </div>

      {/* ================================
          BOTTOM FOOTER
      ================================= */}
      <div className="border-t border-gray-700">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center md:flex-row md:text-left">

          <p className="text-sm text-gray-400">
            © {currentYear}{" "}

            <span className="font-semibold text-white">
              LIGHTS
            </span>

            . All rights reserved.
          </p>

          {/* BOTTOM WHATSAPP */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-green-500 transition hover:text-green-400"
          >
            <FaWhatsapp className="text-lg" />

            WhatsApp Support
          </a>

        </div>

      </div>

    </footer>
  );
}

export default Footer;