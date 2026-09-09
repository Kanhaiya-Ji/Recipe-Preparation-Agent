"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Leaf,
  Sparkles,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  ChefHat,
  Lightbulb,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import {
  INITIAL_PANTRY_ITEMS,
  WASTE_REDUCTION_STATS,
  ZERO_WASTE_TIPS,
} from "@/data/pantryData";
import type { PantryItem } from "@/types/cookbook";

const CATEGORIES = [
  "All",
  "Produce",
  "Dairy & Eggs",
  "Grains & Pasta",
  "Proteins",
  "Pantry Staples",
  "Herbs & Spices",
];

export default function PantryInsightsPage() {
  const router = useRouter();
  const [items, setItems] = useState<PantryItem[]>(INITIAL_PANTRY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<PantryItem["category"]>("Produce");
  const [newItemDays, setNewItemDays] = useState(4);
  const [newItemQty, setNewItemQty] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Expiring soon items (<= 3 days)
  const expiringItems = items.filter((i) => i.daysUntilExpiry <= 3);

  // Filtered inventory
  const filteredItems = items.filter((i) =>
    selectedCategory === "All" ? true : i.category === selectedCategory
  );

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    let status: PantryItem["expiryStatus"] = "fresh";
    if (newItemDays <= 1) status = "critical";
    else if (newItemDays <= 3) status = "warning";
    else if (newItemDays > 60) status = "stable";

    const newItem: PantryItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty || "1 pack",
      daysUntilExpiry: Number(newItemDays),
      expiryStatus: status,
      iconEmoji:
        newItemCategory === "Produce"
          ? "🥦"
          : newItemCategory === "Dairy & Eggs"
          ? "🧀"
          : newItemCategory === "Proteins"
          ? "🍗"
          : "🥫",
    };

    setItems((prev) => [newItem, ...prev]);
    setNewItemName("");
    setNewItemQty("");
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCookExpiring = () => {
    const names = expiringItems.map((i) => i.name).join(",");
    router.push(`/?preset=Zero-Waste Rescue&ingredients=${encodeURIComponent(names)}`);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-cream-100 border-b border-cream-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-50 border border-sage-200 rounded-full text-xs font-bold text-sage-800">
                <Leaf size={14} className="text-sage-600" />
                <span>Zero-Waste Pantry Intelligence & Tracking</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Pantry Inventory & Waste Analytics
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Keep tabs on what you have in stock, prevent expiring perishables from
                ending up in landfill, and see your real-time environmental savings.
              </p>
            </div>

            {/* Quick Action button for expiring items */}
            {expiringItems.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-3xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span>{expiringItems.length} Items Expiring Soon</span>
                  </div>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Save them with custom AI recipe synthesis.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCookExpiring}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow transition-all whitespace-nowrap"
                >
                  <Sparkles size={14} />
                  <span>Cook What’s Expiring</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Impact Metrics Dashboard ──────────────────────────── */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 flex items-center justify-center font-bold">
              <Leaf size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Food Waste Prevented</span>
              <p className="text-2xl font-black text-gray-900">
                {WASTE_REDUCTION_STATS.totalWastePreventedKg} <span className="text-sm font-semibold text-sage-600">kg</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Estimated Money Saved</span>
              <p className="text-2xl font-black text-gray-900">
                ${WASTE_REDUCTION_STATS.monthlyMoneySavedDollars}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cream-200 text-amber-700 flex items-center justify-center font-bold">
              <Flame size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">CO2 Emissions Avoided</span>
              <p className="text-2xl font-black text-gray-900">
                {WASTE_REDUCTION_STATS.carbonOffsetKgCO2} <span className="text-sm font-semibold text-gray-600">kg CO2e</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-cream-200 shadow-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500">Sustainability Rank</span>
              <p className="text-sm font-extrabold text-sage-900">
                {WASTE_REDUCTION_STATS.ecoLevel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Pantry Inventory & Tips ─────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* Left Side: Inventory Table & Filters */}
        <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>Active Pantry Stock</span>
                <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-cream-200 text-gray-700">
                  {items.length} items logged
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                Track freshness dates to minimize leftover spoilage
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Plus size={15} />
              <span>{showAddForm ? "Hide Form" : "Add Pantry Item"}</span>
            </button>
          </div>

          {/* Add Item Form Toggle */}
          {showAddForm && (
            <form
              onSubmit={handleAddItem}
              className="p-5 bg-cream-50 rounded-2xl border border-cream-200 space-y-4 animate-slide-up"
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Log New Pantry Item
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="e.g. Greek Yogurt, Mozzarella..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-cream-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as PantryItem["category"])}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-cream-200 text-xs focus:outline-none"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Grains & Pasta">Grains & Pasta</option>
                    <option value="Proteins">Proteins</option>
                    <option value="Pantry Staples">Pantry Staples</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Days Remaining
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={newItemDays}
                    onChange={(e) => setNewItemDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-cream-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow"
                >
                  Save to Inventory
                </button>
              </div>
            </form>
          )}

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 chat-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-cream-100 text-gray-700 hover:bg-cream-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Inventory Items List */}
          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white rounded-2xl border border-cream-200 flex items-center justify-between gap-4 hover:border-amber-300 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl p-2 rounded-xl bg-cream-50 border border-cream-100">
                    {item.iconEmoji}
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      {item.category} · {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Expiry Badge */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      item.expiryStatus === "critical"
                        ? "bg-red-100 text-red-700 border border-red-200 animate-pulse"
                        : item.expiryStatus === "warning"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : item.expiryStatus === "fresh"
                        ? "bg-sage-100 text-sage-800 border border-sage-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    <Clock size={11} />
                    {item.daysUntilExpiry <= 1
                      ? "Expires Today!"
                      : item.daysUntilExpiry <= 3
                      ? `${item.daysUntilExpiry} days left`
                      : item.daysUntilExpiry > 60
                      ? "Shelf Stable"
                      : `${item.daysUntilExpiry} days`}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label="Delete pantry item"
                    className="text-gray-300 hover:text-red-500 p-1.5 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Zero-Waste Kitchen Hacks */}
        <aside className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-cream-200">
              <Lightbulb size={18} className="text-amber-500" />
              <h3 className="font-bold text-gray-900 text-sm">
                Zero-Waste Kitchen Hacks
              </h3>
            </div>

            <div className="space-y-3.5">
              {ZERO_WASTE_TIPS.map((tip, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{tip.icon}</span>
                    <h4 className="text-xs font-bold text-gray-900">
                      {tip.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI CTA Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <ChefHat size={20} />
              <span className="text-xs font-bold uppercase tracking-wide">
                AI Chef On Call
              </span>
            </div>
            <h4 className="text-base font-bold">
              Have random ingredients you don’t know what to do with?
            </h4>
            <p className="text-xs text-amber-100 leading-relaxed">
              Launch our Watson-powered agent to turn odd bits and pieces into gourmet dinner.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-700 rounded-xl text-xs font-bold shadow hover:bg-cream-50 transition-colors"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Go to AI Generator</span>
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
