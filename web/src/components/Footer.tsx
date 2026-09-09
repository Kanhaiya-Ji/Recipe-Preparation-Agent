import React from "react";
import Link from "next/link";
import { ChefHat, Leaf, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cream-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
                <ChefHat size={18} />
              </div>
              <span className="font-bold text-gray-900 text-sm">
                Recipe Prep Agent
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transforming your leftover ingredients into delicious, chef-grade
              recipes with AI while cutting household food waste.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-sage-700 bg-sage-50 px-2.5 py-1 rounded-md border border-sage-200 w-fit">
              <Leaf size={12} className="text-sage-600" />
              <span>Zero Food Waste Initiative</span>
            </div>
          </div>

          {/* Quick Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
              Explore Suite
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link
                  href="/"
                  className="hover:text-amber-600 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles size={12} className="text-amber-500" />
                  AI Recipe Studio
                </Link>
              </li>
              <li>
                <Link
                  href="/cookbook"
                  className="hover:text-amber-600 transition-colors"
                >
                  Gourmet Cookbook & Library
                </Link>
              </li>
              <li>
                <Link
                  href="/meal-planner"
                  className="hover:text-amber-600 transition-colors"
                >
                  7-Day Smart Meal Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/pantry-insights"
                  className="hover:text-amber-600 transition-colors"
                >
                  Pantry Tracker & Waste Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Smart Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
              Features
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>Pantry Ingredient Matcher</li>
              <li>Automated Grocery Shopping Lists</li>
              <li>Interactive Cook Mode with Timers</li>
              <li>Carbon & Cost Savings Metrics</li>
              <li>Dietary & Allergen Filtering</li>
            </ul>
          </div>

          {/* Technology & Watsonx */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-3">
              Architecture
            </h4>
            <p className="text-xs text-gray-500 mb-2">
              Powered by IBM watsonx Orchestrate LLM reasoning engine + Next.js App
              Router.
            </p>
            <div className="p-3 bg-cream-50 border border-cream-200 rounded-xl text-[11px] text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Agent Status:</span>
                <span className="font-semibold text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>Region:</span>
                <span className="font-medium text-gray-700">au-syd</span>
              </div>
              <div className="flex justify-between">
                <span>LLM Engine:</span>
                <span className="font-medium text-gray-700">Granite 3.0 / watsonx</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© 2026 Recipe Preparation Agent. Crafted for sustainable cooking.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={12} className="text-amber-500 fill-amber-500" /> for home chefs & eco warriors
          </p>
        </div>
      </div>
    </footer>
  );
}
