import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand & Contact Info */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wide text-white">shopMart</h2>
          <p className="text-sm leading-relaxed">
            123 Market Street<br />
            Moragasotuwa, Central Province<br />
            Sri Lanka
          </p>
          <p className="text-sm">
            Email:{" "}
            <a href="mailto:support@shopmart.com" className="text-blue-400 hover:underline">
              support@shopmart.com
            </a>
          </p>
          <p className="text-sm">
            Phone:{" "}
            <a href="tel:+94112223344" className="text-blue-400 hover:underline">
              +94 112 223 344
            </a>
          </p>
        </section>

        {/* Purchase Policy */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-white">Purchase Policy</h3>
          <p className="text-sm">
            Orders can be placed on or after the current date.
          </p>
          <p className="text-sm text-red-400 font-medium">
            *Purchases are not allowed on Sundays.
          </p>
          <p className="text-sm text-gray-400">
            This restriction ensures timely processing and delivery.
          </p>
        </section>

        {/* Social Media */}
        <section className="space-y-4 ml-20">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaFacebook />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <FaTwitter />
            </a>
          </div>
        </section>
      </div>

      {/* Footer Bottom */}
      <div className="text-center mt-10 text-sm border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} <span className="font-semibold text-white">shopMart</span> | All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;