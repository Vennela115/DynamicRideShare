import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left Side */}
        <p className="text-sm text-center md:text-left">
          © {new Date().getFullYear()} RideShare. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-5">
          <a href="#" className="hover:text-white transition" aria-label="Facebook">
            <Facebook size={20} />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="Twitter">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="LinkedIn">
            <Linkedin size={20} />
          </a>
          <a href="#" className="hover:text-white transition" aria-label="Instagram">
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
