"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChefHat,
  Leaf,
  BookOpen,
  Calendar,
  BarChart3,
  Sparkles,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      label: "AI Recipe Studio",
      href: "/",
      icon: Sparkles,
      badge: "AI Powered",
    },
    {
      label: "Cookbook & Recipes",
      href: "/cookbook",
      icon: BookOpen,
      count: "12",
    },
    {
      label: "Meal Planner",
      href: "/meal-planner",
      icon: Calendar,
      badge: "7-Day",
    },
    {
      label: "Pantry & Insights",
      href: "/pantry-insights",
      icon: BarChart3,
      badge: "Zero-Waste",
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-cream-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <ChefHat size={22} className="text-white" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-gray-900 text-base tracking-tight group-hover:text-amber-600 transition-colors">
                Recipe Prep Agent
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                Pro
              </span>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Leaf size={11} className="text-sage-500" aria-hidden="true" />
              Cook smart · Zero waste · AI assisted
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-cream-100/80 p-1.5 rounded-2xl border border-cream-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm font-bold border border-cream-200/80 text-amber-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                <Icon
                  size={15}
                  className={isActive ? "text-amber-500" : "text-gray-400"}
                />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                      isActive
                        ? "bg-amber-100 text-amber-800"
                        : "bg-sage-100 text-sage-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cream-200 text-gray-700 font-medium">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Badge & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 border border-sage-200 rounded-full">
            <span
              className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="text-xs text-sage-700 font-medium">
              IBM watsonx Orchestrate
            </span>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
          >
            <Sparkles size={13} />
            <span>Generate Recipe</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-cream-100 focus:outline-none"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-slide-up">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? "bg-amber-50 text-amber-700 font-bold"
                    : "text-gray-700 hover:bg-cream-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    size={17}
                    className={isActive ? "text-amber-600" : "text-gray-400"}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-gray-700">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-xs text-sage-700 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
              IBM watsonx Active
            </span>
            <span className="text-gray-400">v2.4 Ready</span>
          </div>
        </div>
      )}
    </header>
  );
}
