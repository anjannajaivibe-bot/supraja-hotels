"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  MessageCircle,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Offers", href: "/offers" },
  { label: "Contact", href: "/contact" },
];

const hotelLinks = [
  {
    label: "Hotel Supraja Cyber View",
    href: "/hotels/supraja-cyber-view",
  },
  {
    label: "Hotel Supraja Residency",
    href: "/hotels/supraja-residency",
  },
  {
    label: "Hotel Supraja Lodge",
    href: "/hotels/supraja-lodge",
  },
  {
    label: "Saket Banquet Hall",
    href: "/saket-banquet-hall",
  },
];

type HeaderContact = {
  phone: string;
  whatsapp: string;
  label: string;
  whatsappText: string;
};

function getHeaderContact(pathname: string): HeaderContact {
  if (pathname.includes("/saket-banquet-hall")) {
    return {
      phone: "9346316161",
      whatsapp: "9346316161",
      label: "Saket Banquet Hall",
      whatsappText:
        "Hi, I would like to know about availability and booking details for Saket Banquet Hall.",
    };
  }

  if (pathname.includes("/hotels/supraja-residency")) {
    return {
      phone: "9346316161",
      whatsapp: "9346316161",
      label: "Hotel Supraja Residency",
      whatsappText:
        "Hi, I would like to know about room availability at Hotel Supraja Residency.",
    };
  }

  if (pathname.includes("/hotels/supraja-lodge")) {
    return {
      phone: "9348446161",
      whatsapp: "9348446161",
      label: "Hotel Supraja Lodge",
      whatsappText:
        "Hi, I would like to know about room availability at Hotel Supraja Lodge.",
    };
  }

  if (pathname.includes("/hotels/supraja-cyber-view")) {
    return {
      phone: "9550776161",
      whatsapp: "9550776161",
      label: "Hotel Supraja Cyber View",
      whatsappText:
        "Hi, I would like to know about room availability at Hotel Supraja Cyber View.",
    };
  }

  return {
    phone: "9550776161",
    whatsapp: "9550776161",
    label: "Supraja Hotels",
    whatsappText:
      "Hi, I would like to know about room availability at Supraja Hotels.",
  };
}

export default function Header() {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [hotelsOpen, setHotelsOpen] = useState(false);

  const contact = getHeaderContact(pathname);

  const closeMenu = () => {
    setMobileOpen(false);
    setHotelsOpen(false);
  };

  const isHotelsActive =
    pathname.startsWith("/hotels") ||
    pathname.startsWith("/saket-banquet-hall");

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="container-custom flex items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-800"
          onClick={closeMenu}
        >
          Supraja Hotels
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/"
            className={`text-sm font-semibold transition hover:text-amber-500 ${
              pathname === "/" ? "text-amber-600" : "text-slate-700"
            }`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`text-sm font-semibold transition hover:text-amber-500 ${
              pathname === "/about" ? "text-amber-600" : "text-slate-700"
            }`}
          >
            About
          </Link>

          <div className="group relative">
            <Link
              href="/hotels"
              className={`flex items-center gap-1 text-sm font-semibold transition hover:text-amber-500 ${
                isHotelsActive ? "text-amber-600" : "text-slate-700"
              }`}
            >
              Hotels
              <ChevronDown size={15} />
            </Link>

            <div className="invisible absolute left-0 top-full w-72 translate-y-3 rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-2 group-focus-within:opacity-100">
              <Link
                href="/hotels"
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800"
              >
                View All Hotels
              </Link>

              <div className="my-2 border-t border-slate-100" />

              {hotelLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition hover:bg-blue-50 hover:text-blue-800 ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {navLinks.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition hover:text-amber-500 ${
                pathname === link.href ||
                (link.href === "/blog" && pathname.startsWith("/blog/"))
                  ? "text-amber-600"
                  : "text-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:+91${contact.phone}`}
            aria-label={`Call ${contact.label} at ${contact.phone}`}
            className="flex items-center gap-2 rounded-full bg-blue-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            <Phone size={16} />
            {contact.phone}
          </a>

          <a
            href={`https://wa.me/91${
              contact.whatsapp
            }?text=${encodeURIComponent(contact.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contact ${contact.label} on WhatsApp`}
            className="flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-blue-800 lg:hidden"
          aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-2 shadow-lg lg:hidden">
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={closeMenu}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                pathname === "/"
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-700"
              }`}
            >
              Home
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                pathname === "/about"
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-700"
              }`}
            >
              About
            </Link>

            <button
              type="button"
              onClick={() => setHotelsOpen((current) => !current)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                isHotelsActive
                  ? "bg-blue-50 text-blue-800"
                  : "text-slate-700"
              }`}
              aria-expanded={hotelsOpen}
            >
              Hotels
              <ChevronDown
                size={16}
                className={`transition ${
                  hotelsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {hotelsOpen && (
              <div className="ml-3 border-l border-slate-200 pl-3">
                <Link
                  href="/hotels"
                  onClick={closeMenu}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                    pathname === "/hotels"
                      ? "bg-blue-50 text-blue-800"
                      : "text-slate-600"
                  }`}
                >
                  View All Hotels
                </Link>

                {hotelLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                      pathname === item.href
                        ? "bg-blue-50 text-blue-800"
                        : "text-slate-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-blue-50 hover:text-blue-800 ${
                  pathname === link.href ||
                  (link.href === "/blog" && pathname.startsWith("/blog/"))
                    ? "bg-blue-50 text-blue-800"
                    : "text-slate-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={`tel:+91${contact.phone}`}
              onClick={closeMenu}
              aria-label={`Call ${contact.label} at ${contact.phone}`}
              className="flex items-center justify-center gap-2 rounded-full bg-blue-800 px-4 py-3 text-sm font-semibold text-white"
            >
              <Phone size={16} />
              {contact.phone}
            </a>

            <a
              href={`https://wa.me/91${
                contact.whatsapp
              }?text=${encodeURIComponent(contact.whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              aria-label={`Contact ${contact.label} on WhatsApp`}
              className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
