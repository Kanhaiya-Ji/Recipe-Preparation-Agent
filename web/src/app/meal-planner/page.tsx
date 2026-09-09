"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  ShoppingBag,
  Plus,
  Trash2,
  Check,
  Clock,
  Flame,
  Copy,
  CheckCheck,
  ChevronRight,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Leaf,
  Shuffle,
} from "lucide-react";
import {
  INITIAL_MEAL_PLAN,
  INITIAL_GROCERY_LIST,
  type GroceryItem,
} from "@/data/mealPlanData";
import type { MealPlanDay } from "@/types/cookbook";

export default function MealPlannerPage() {
  const [mealPlan, setMealPlan] = useState<MealPlanDay[]>(INITIAL_MEAL_PLAN);
  const [groceries, setGroceries] = useState<GroceryItem[]>(INITIAL_GROCERY_LIST);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDept, setNewItemDept] = useState<GroceryItem["department"]>("Fresh Produce");
  const [copied, setCopied] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Toggle grocery check
  const toggleGrocery = (id: string) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Add custom grocery item
  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newItem: GroceryItem = {
      id: crypto.randomUUID(),
      name: newItemName.trim(),
      department: newItemDept,
      amount: "1 unit",
      checked: false,
    };
    setGroceries((prev) => [newItem, ...prev]);
    setNewItemName("");
  };

  // Delete grocery item
  const handleDeleteGrocery = (id: string) => {
    setGroceries((prev) => prev.filter((i) => i.id !== id));
  };

  // Clear completed
  const handleClearCompleted = () => {
    setGroceries((prev) => prev.filter((i) => !i.checked));
  };

  // Copy shopping list to clipboard
  const handleCopyShoppingList = () => {
    const listText = groceries
      .map((g) => `${g.checked ? "[x]" : "[ ]"} ${g.name} (${g.amount}) - ${g.department}`)
      .join("\n");
    navigator.clipboard.writeText(`🛒 Zero-Waste Meal Plan Shopping List:\n\n${listText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick randomize/shuffle meal for active day
  const handleShuffleDay = (dayIndex: number) => {
    const alternatives = [
      { title: "Zesty Chickpea Avocado Smash", cal: 340, time: "7 min", emoji: "🥑", tag: "No Cook" },
      { title: "Crispy Rice & Scallion Pancake", cal: 380, time: "12 min", emoji: "🍳", tag: "Leftover Fix" },
      { title: "Honey Garlic Glazed Noodles", cal: 420, time: "10 min", emoji: "🍜", tag: "Quick" },
      { title: "Tuscan Tomato White Bean Stew", cal: 310, time: "15 min", emoji: "🧆", tag: "Plant-Based" },
      { title: "Sheet-Pan Lemon Herb Roast", cal: 460, time: "20 min", emoji: "🍗", tag: "High-Protein" },
    ];
    
    setMealPlan((prev) => {
      const updated = [...prev];
      const rand1 = alternatives[Math.floor(Math.random() * alternatives.length)];
      const rand2 = alternatives[Math.floor(Math.random() * alternatives.length)];
      const rand3 = alternatives[Math.floor(Math.random() * alternatives.length)];
      
      updated[dayIndex] = {
        ...updated[dayIndex],
        meals: [
          { type: "Breakfast", recipeTitle: rand1.title, calories: rand1.cal, prepTime: rand1.time, imageEmoji: rand1.emoji, tags: [rand1.tag] },
          { type: "Lunch", recipeTitle: rand2.title, calories: rand2.cal, prepTime: rand2.time, imageEmoji: rand2.emoji, tags: [rand2.tag] },
          { type: "Dinner", recipeTitle: rand3.title, calories: rand3.cal, prepTime: rand3.time, imageEmoji: rand3.emoji, tags: [rand3.tag] },
        ],
      };
      return updated;
    });
  };

  const activeDay = mealPlan[activeDayIndex];
  const totalWeeklyCalories = mealPlan.reduce(
    (acc, day) => acc + day.meals.reduce((mAcc, m) => mAcc + m.calories, 0),
    0
  );

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-cream-100 border-b border-cream-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                <Calendar size={14} className="text-amber-500" />
                <span>Smart Meal Planning & Auto-Pantry Sync</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                7-Day Zero-Waste Meal Planner
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Coordinate your weekly meals to rotate perishables before they spoil,
                balance daily macros, and generate consolidated grocery lists.
              </p>
            </div>

            {/* Metric badges */}
            <div className="flex items-center gap-3">
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-amber-600">21</span>
                <p className="text-[11px] font-semibold text-gray-500">Planned Meals</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-sage-600">$48</span>
                <p className="text-[11px] font-semibold text-gray-500">Weekly Saved</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-amber-700">0%</span>
                <p className="text-[11px] font-semibold text-gray-500">Food Waste</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Layout: 7-Day Plan + Grocery List ────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
        
        {/* Left Side: 7-Day Schedule */}
        <div className="space-y-6">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 chat-scroll">
            {mealPlan.map((day, idx) => (
              <button
                key={day.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex flex-col items-center min-w-[95px] p-3 rounded-2xl border transition-all ${
                  activeDayIndex === idx
                    ? "bg-amber-500 text-white border-amber-600 shadow-md scale-105"
                    : "bg-white text-gray-700 border-cream-200 hover:bg-cream-50"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wide">
                  {day.day.slice(0, 3)}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    activeDayIndex === idx ? "text-amber-100" : "text-gray-400"
                  }`}
                >
                  {day.dateStr}
                </span>
              </button>
            ))}
          </div>

          {/* Active Day Detail Card */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-cream-200">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Selected Daily Menu
                </span>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeDay.day}, {activeDay.dateStr}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShuffleDay(activeDayIndex)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-xs font-bold text-gray-700 transition-colors"
                >
                  <Shuffle size={13} className="text-amber-600" />
                  <span>Shuffle Day</span>
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Sparkles size={13} />
                  <span>AI Custom Dish</span>
                </Link>
              </div>
            </div>

            {/* Meals in the day */}
            <div className="space-y-4">
              {activeDay.meals.map((meal, mIdx) => (
                <div
                  key={mIdx}
                  className="p-4 bg-cream-50 rounded-2xl border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl p-2 rounded-2xl bg-white border border-cream-200 shadow-sm">
                      {meal.imageEmoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {meal.type}
                        </span>
                        {meal.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white text-gray-600 border border-cream-200 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        {meal.recipeTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-gray-600 self-end sm:self-center">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-amber-500" />
                      {meal.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame size={13} className="text-amber-500" />
                      {meal.calories} kcal
                    </span>
                    <Link
                      href="/cookbook"
                      className="p-1.5 rounded-lg bg-white border border-cream-200 hover:bg-amber-50 text-amber-700 transition-colors"
                      title="View in Cookbook"
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Week Overview Summary Table */}
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-amber-500" />
              <span>Week at a Glance Overview</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cream-200 text-gray-500">
                    <th className="py-2.5 font-bold">Day</th>
                    <th className="py-2.5 font-bold">Breakfast</th>
                    <th className="py-2.5 font-bold">Lunch</th>
                    <th className="py-2.5 font-bold">Dinner</th>
                    <th className="py-2.5 font-bold text-right">Daily Cal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100 text-gray-700">
                  {mealPlan.map((d, i) => {
                    const dayCal = d.meals.reduce((sum, m) => sum + m.calories, 0);
                    return (
                      <tr
                        key={d.day}
                        onClick={() => setActiveDayIndex(i)}
                        className={`cursor-pointer hover:bg-amber-50/50 transition-colors ${
                          activeDayIndex === i ? "bg-amber-50/70 font-semibold" : ""
                        }`}
                      >
                        <td className="py-3 font-bold text-gray-900">
                          {d.day}
                        </td>
                        <td className="py-3 text-gray-600 truncate max-w-[130px]">
                          {d.meals[0]?.imageEmoji} {d.meals[0]?.recipeTitle}
                        </td>
                        <td className="py-3 text-gray-600 truncate max-w-[130px]">
                          {d.meals[1]?.imageEmoji} {d.meals[1]?.recipeTitle}
                        </td>
                        <td className="py-3 text-gray-600 truncate max-w-[130px]">
                          {d.meals[2]?.imageEmoji} {d.meals[2]?.recipeTitle}
                        </td>
                        <td className="py-3 text-right font-bold text-amber-700">
                          {dayCal} kcal
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Smart Grocery List */}
        <aside className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card flex flex-col space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShoppingBag size={17} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Smart Grocery List
                </h3>
                <p className="text-[11px] text-gray-500">
                  {groceries.filter((g) => g.checked).length} of {groceries.length} bought
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyShoppingList}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-xs text-gray-700 font-semibold transition-colors"
              title="Copy List"
            >
              {copied ? <CheckCheck size={13} className="text-green-600" /> : <Copy size={13} />}
              <span>{copied ? "Copied!" : "Export"}</span>
            </button>
          </div>

          {/* Add Item Input Form */}
          <form onSubmit={handleAddGrocery} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item (e.g. Sourdough loaf)..."
                className="flex-1 px-3 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
            <select
              value={newItemDept}
              onChange={(e) => setNewItemDept(e.target.value as GroceryItem["department"])}
              aria-label="Grocery department category"
              className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-cream-200 text-[11px] text-gray-600 focus:outline-none"
            >
              <option value="Fresh Produce">Fresh Produce</option>
              <option value="Dairy & Cold">Dairy & Cold</option>
              <option value="Pantry & Grains">Pantry & Grains</option>
              <option value="Spices & Oils">Spices & Oils</option>
              <option value="Proteins">Proteins</option>
            </select>
          </form>

          {/* Grocery Items List */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto chat-scroll pr-1">
            {groceries.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleGrocery(item.id)}
                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  item.checked
                    ? "bg-sage-50/80 border-sage-200 text-gray-400"
                    : "bg-white border-cream-200 hover:border-amber-300 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      item.checked
                        ? "bg-sage-600 border-sage-600 text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {item.checked && <Check size={11} strokeWidth={3} />}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-medium truncate ${
                        item.checked ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <span className="text-[10px] text-gray-400">
                      {item.department} · {item.amount}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGrocery(item.id);
                  }}
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Grocery Actions */}
          <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleClearCompleted}
              className="text-gray-400 hover:text-gray-700 text-[11px] font-medium transition-colors"
            >
              Clear bought ({groceries.filter((g) => g.checked).length})
            </button>
            <span className="text-[11px] text-sage-700 font-semibold flex items-center gap-1">
              <Leaf size={11} />
              Pantry Optimized
            </span>
          </div>
        </aside>
      </main>
    </div>
  );
}
