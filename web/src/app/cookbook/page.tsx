"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Clock,
  Flame,
  Users,
  Star,
  Leaf,
  Plus,
  ArrowRight,
  CheckCircle2,
  Bookmark,
  Share2,
  ChefHat,
  Scale,
} from "lucide-react";
import { SAMPLE_RECIPES } from "@/data/cookbookData";
import type { RecipeItem } from "@/types/cookbook";
import { CookModeModal } from "@/components/CookModeModal";

const CATEGORIES = [
  { id: "all", label: "All Recipes", icon: "✨" },
  { id: "zero-waste", label: "Zero Waste Specials", icon: "♻️" },
  { id: "quick-15m", label: "15-Min Fast Bites", icon: "⚡" },
  { id: "high-protein", label: "High Protein", icon: "💪" },
  { id: "plant-based", label: "Plant-Based", icon: "🌱" },
  { id: "budget-bites", label: "Budget-Friendly", icon: "💰" },
];

export default function CookbookPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);
  const [cookingModeRecipe, setCookingModeRecipe] = useState<RecipeItem | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(["crispy-rice-omelette", "tuscan-white-bean-skillet"]);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);

  // Filter recipes
  const filteredRecipes = SAMPLE_RECIPES.filter((r) => {
    const matchesCategory =
      activeCategory === "all" || r.category === activeCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleSaveRecipe = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenRecipe = (recipe: RecipeItem) => {
    setSelectedRecipe(recipe);
    setServingsMultiplier(1);
    setCheckedIngredients([]);
  };

  const handleSendToAI = (recipe: RecipeItem) => {
    // Generate ingredients query string to load in AI Studio
    const ingNames = recipe.ingredients.map((i) => i.name).join(",");
    router.push(`/?preset=${encodeURIComponent(recipe.title)}&ingredients=${encodeURIComponent(ingNames)}`);
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* ── Hero Banner ────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-cream-100 border-b border-cream-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-700">
                <BookOpen size={14} className="text-amber-500" />
                <span>Curated Sustainable Recipe Library</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Gourmet Recipes for Everyday Pantries
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Explore chef-tested recipes engineered to minimize household food
                waste, scale effortlessly, and repurpose leftovers into restaurant-quality meals.
              </p>
            </div>

            {/* Quick Stats Header Cards */}
            <div className="flex items-center gap-3">
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-amber-600">12+</span>
                <p className="text-[11px] font-semibold text-gray-500">Zero-Waste Dishes</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-sage-600">95%</span>
                <p className="text-[11px] font-semibold text-gray-500">Pantry Match</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm text-center min-w-[110px]">
                <span className="text-2xl font-black text-amber-700">15m</span>
                <p className="text-[11px] font-semibold text-gray-500">Avg Prep Time</p>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipe name, leftover ingredient (rice, beans, spinach)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-cream-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Sparkles size={16} />
              <span>Ask AI Chef</span>
            </Link>
          </div>

          {/* Category Tabs */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 chat-scroll">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-white shadow-sm scale-105"
                    : "bg-white text-gray-700 border border-cream-200 hover:bg-cream-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recipe Cards Grid ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>Recipes</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cream-200 text-gray-700 font-normal">
              {filteredRecipes.length} found
            </span>
          </h2>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Filter size={13} className="text-gray-400" />
            <span>Sorted by highest pantry efficiency</span>
          </div>
        </div>

        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-cream-200 max-w-lg mx-auto shadow-sm">
            <span className="text-4xl mb-3 block">🍲</span>
            <h3 className="text-base font-bold text-gray-800 mb-1">
              No matching recipes found
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Try adjusting your search terms or generate a custom AI recipe for your exact ingredients!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-semibold shadow"
            >
              <Sparkles size={14} />
              <span>Create with AI Generator</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => {
              const isSaved = savedRecipeIds.includes(recipe.id);
              return (
                <article
                  key={recipe.id}
                  onClick={() => handleOpenRecipe(recipe)}
                  className="bg-white rounded-3xl border border-cream-200 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col overflow-hidden cursor-pointer group relative"
                >
                  {/* Card Top / Header with Emoji Art */}
                  <div className="h-40 bg-gradient-to-br from-cream-100 via-amber-50/50 to-sage-50/60 p-5 flex flex-col justify-between relative border-b border-cream-100">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl p-2 rounded-2xl bg-white/90 shadow-sm group-hover:scale-110 transition-transform">
                        {recipe.imageEmoji}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sage-100 text-sage-800 border border-sage-200">
                          {recipe.pantryMatchScore}% Match
                        </span>
                        <button
                          type="button"
                          onClick={(e) => toggleSaveRecipe(recipe.id, e)}
                          aria-label="Save recipe to favorites"
                          className="p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-amber-500 shadow-sm transition-colors"
                        >
                          <Bookmark
                            size={16}
                            className={isSaved ? "text-amber-500 fill-amber-500" : ""}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-white/80 text-gray-700 border border-cream-200">
                        {recipe.difficulty}
                      </span>
                      <span className="text-[11px] font-medium text-sage-700 flex items-center gap-1 bg-sage-50/80 px-2 py-0.5 rounded-lg border border-sage-200">
                        <Leaf size={11} />
                        Saves {recipe.wasteSavedGrams}g waste
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{recipe.rating}</span>
                        <span className="text-gray-400 font-normal">
                          ({recipe.reviewsCount})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>

                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {recipe.description}
                      </p>

                      {/* Tag Chips */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {recipe.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-gray-600 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="mt-5 pt-3 border-t border-cream-100 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-gray-400" />
                          {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame size={13} className="text-amber-500" />
                          {recipe.calories} kcal
                        </span>
                      </div>

                      <span className="font-semibold text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        View <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Recipe Detail Drawer / Modal ────────────────────── */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-br from-cream-50 via-white to-amber-50/30 border-b border-cream-200 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <span className="text-4xl p-2.5 rounded-2xl bg-white shadow-sm border border-cream-200">
                  {selectedRecipe.imageEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      {selectedRecipe.category.replace("-", " ")}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-sage-700 font-medium">
                      Zero Waste Grade A
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {selectedRecipe.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {selectedRecipe.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-xl hover:bg-cream-100 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Quick action bar */}
            <div className="px-6 py-3 bg-cream-50/80 border-b border-cream-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-gray-700 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-amber-500" />
                  Prep: {selectedRecipe.prepTimeMinutes}m | Cook: {selectedRecipe.cookTimeMinutes}m
                </span>
                <span className="flex items-center gap-1">
                  <Flame size={14} className="text-amber-500" />
                  {selectedRecipe.calories} kcal / serving
                </span>
              </div>

              {/* Servings Scaler */}
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-cream-200">
                <Users size={13} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-700">Servings:</span>
                {[1, 2, 4].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setServingsMultiplier(mult)}
                    className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors ${
                      servingsMultiplier === mult
                        ? "bg-amber-500 text-white"
                        : "text-gray-600 hover:bg-cream-100"
                    }`}
                  >
                    {mult * selectedRecipe.servings}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Macro Nutrition Row */}
              <div className="grid grid-cols-4 gap-2 text-center bg-cream-100/60 p-3 rounded-2xl border border-cream-200">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Protein</span>
                  <p className="text-sm font-bold text-gray-800">{selectedRecipe.nutrition.protein}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Carbs</span>
                  <p className="text-sm font-bold text-gray-800">{selectedRecipe.nutrition.carbs}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Healthy Fat</span>
                  <p className="text-sm font-bold text-gray-800">{selectedRecipe.nutrition.fat}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">Fiber</span>
                  <p className="text-sm font-bold text-gray-800">{selectedRecipe.nutrition.fiber}</p>
                </div>
              </div>

              {/* Ingredients section with dynamic calculation */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide flex items-center gap-2">
                    <Leaf size={15} className="text-sage-600" />
                    Ingredients ({servingsMultiplier * selectedRecipe.servings} Servings)
                  </h3>
                  <span className="text-xs text-gray-400">Click to check off</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const isChecked = checkedIngredients.includes(ing.name);
                    const scaledAmount = Number((ing.amount * servingsMultiplier).toFixed(1));
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setCheckedIngredients((prev) =>
                            prev.includes(ing.name)
                              ? prev.filter((n) => n !== ing.name)
                              : [...prev, ing.name]
                          );
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? "bg-sage-50 border-sage-300 text-gray-400 line-through"
                            : "bg-white border-cream-200 hover:border-amber-300 text-gray-800"
                        }`}
                      >
                        <span className="text-xs font-medium">{ing.name}</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {scaledAmount} {ing.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions section */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <ChefHat size={15} className="text-amber-600" />
                  Step-by-Step Directions
                </h3>
                <div className="space-y-3">
                  {selectedRecipe.instructions.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 bg-cream-50 rounded-2xl border border-cream-200 flex gap-3.5"
                    >
                      <div className="w-7 h-7 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {step.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 mb-0.5">
                          {step.title}
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitutions & Tips */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-sage-50 border border-sage-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-sage-900 mb-2">🔄 Smart Substitutions</h4>
                  <ul className="text-xs text-sage-800 space-y-1.5 list-disc pl-4">
                    {selectedRecipe.substitutions.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-amber-900 mb-2">💡 Chef Pro-Tips</h4>
                  <ul className="text-xs text-amber-800 space-y-1.5 list-disc pl-4">
                    {selectedRecipe.chefTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 sm:p-6 bg-cream-50 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleSendToAI(selectedRecipe)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-cream-300 hover:bg-cream-100 text-xs font-bold text-gray-800 shadow-sm transition-colors"
              >
                <Sparkles size={14} className="text-amber-500" />
                <span>Remix with AI Agent</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const r = selectedRecipe;
                    setSelectedRecipe(null);
                    setCookingModeRecipe(r);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
                >
                  <ChefHat size={15} />
                  <span>Start Cook Mode & Timers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Cook Mode */}
      {cookingModeRecipe && (
        <CookModeModal
          recipe={cookingModeRecipe}
          onClose={() => setCookingModeRecipe(null)}
        />
      )}
    </div>
  );
}
