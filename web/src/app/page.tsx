"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChefHat,
  Leaf,
  AlertCircle,
  Sparkles,
  Zap,
  BookOpen,
  Calendar,
  BarChart3,
  Bookmark,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PantryInput } from "@/components/PantryInput";
import { PreferencesPanel } from "@/components/PreferencesPanel";
import { ChatInterface } from "@/components/ChatInterface";
import { CookModeModal } from "@/components/CookModeModal";
import { parseRecipe } from "@/components/RecipeCard";
import type {
  Ingredient,
  Preferences,
  RecipeMessage,
  RecipeApiResponse,
} from "@/types";
import { DEFAULT_PREFERENCES } from "@/types";
import type { RecipeItem } from "@/types/cookbook";

// ─────────────────────────────────────────────────────────────
// Pantry Preset Packs
// ─────────────────────────────────────────────────────────────

const PANTRY_PRESETS = [
  {
    name: "🍳 Leftover Rice & Eggs",
    items: ["cooked rice", "eggs", "cheese", "scallions", "cumin"],
  },
  {
    name: "🥫 White Beans & Spinach",
    items: ["canned white beans", "tomatoes", "garlic", "spinach", "olive oil"],
  },
  {
    name: "🍜 Quick Garlic Noodles",
    items: ["noodles", "garlic", "soy sauce", "honey", "sesame oil"],
  },
  {
    name: "🥗 Harvest Salad Cleanout",
    items: ["mixed greens", "chickpeas", "cucumber", "avocado", "lemon"],
  },
];

// ─────────────────────────────────────────────────────────────
// Helper — build the visible user message for the chat thread
// ─────────────────────────────────────────────────────────────

function buildUserMessage(ingredients: Ingredient[], prefs: Preferences): string {
  const ingList = ingredients.map((i) => i.label).join(", ");
  const activePrefs = (
    [
      prefs.vegan && "Vegan",
      prefs.vegetarian && "Vegetarian",
      prefs.glutenFree && "Gluten-Free",
      prefs.dairyFree && "Dairy-Free",
      prefs.keto && "Keto",
      prefs.nutFree && "Nut-Free",
    ] as (string | false)[]
  ).filter(Boolean) as string[];

  const timePart =
    prefs.maxCookingTime !== "any"
      ? `Max cooking time: ${prefs.maxCookingTime} min.`
      : "";

  const prefPart =
    activePrefs.length > 0 ? `Dietary needs: ${activePrefs.join(", ")}.` : "";

  return `🛒 Ingredients: ${ingList}.\n${prefPart}${timePart
    ? "\n" + timePart
    : ""}`.trim();
}

function RecipeStudioContent() {
  const searchParams = useSearchParams();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "1", label: "rice" },
    { id: "2", label: "egg" },
    { id: "3", label: "cheese" },
    { id: "4", label: "cumin" },
    { id: "5", label: "coriander" },
    { id: "6", label: "water" },
  ]);
  const [preferences, setPreferences] = useState<Preferences>({
    ...DEFAULT_PREFERENCES,
    vegetarian: true,
    maxCookingTime: "30",
  });
  const [messages, setMessages] = useState<RecipeMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cookModeRecipe, setCookModeRecipe] = useState<RecipeItem | null>(null);

  // Check URL params for preset injection (from other pages)
  useEffect(() => {
    const rawIngs = searchParams.get("ingredients");
    if (rawIngs) {
      const parsed = rawIngs
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((label) => ({
          id: crypto.randomUUID(),
          label,
        }));
      if (parsed.length > 0) {
        setIngredients(parsed);
      }
    }
  }, [searchParams]);

  const canSubmit = ingredients.length > 0 && !isLoading;

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients((prev) => [...prev, ingredient]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const handleApplyPreset = (items: string[]) => {
    const newIngs: Ingredient[] = items.map((label) => ({
      id: crypto.randomUUID(),
      label,
    }));
    setIngredients(newIngs);
  };

  const handlePreferencesChange = (updated: Preferences) => {
    setPreferences(updated);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);

    // Append user message optimistically
    const userMsg: RecipeMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: buildUserMessage(ingredients, preferences),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, preferences }),
      });

      const data: RecipeApiResponse = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const assistantMsg: RecipeMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.recipe ?? "No recipe was returned. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract latest assistant recipe
  const latestAssistantMsg = messages
    .filter((m) => m.role === "assistant")
    .slice(-1)[0];

  const handleStartCookModeFromAI = () => {
    if (!latestAssistantMsg) return;
    const parsed = parseRecipe(latestAssistantMsg.content);
    
    // Convert parsed structure to full RecipeItem
    const recipeItem: RecipeItem = {
      id: "ai-generated-" + Date.now(),
      title: parsed.title || "Chef's Pantry Creation",
      description: "Custom recipe synthesized by IBM watsonx Orchestrate AI Agent.",
      category: "zero-waste",
      prepTimeMinutes: 5,
      cookTimeMinutes: Number(preferences.maxCookingTime) || 20,
      servings: 2,
      calories: 360,
      difficulty: "Easy",
      rating: 5.0,
      reviewsCount: 1,
      tags: ["AI Generated", "Pantry Match", "Zero Waste"],
      dietary: preferences,
      pantryMatchScore: 100,
      wasteSavedGrams: 280,
      imageEmoji: "🍳",
      ingredients: (parsed.ingredientsUsed || ingredients.map((i) => i.label)).map(
        (name) => ({
          name,
          amount: 1,
          unit: "portion",
        })
      ),
      instructions: (parsed.steps || [
        "Prepare ingredients and heat cooking skillet.",
        "Sauté ingredients until fragrant and golden.",
        "Season to taste and serve hot.",
      ]).map((stepText, idx) => ({
        step: idx + 1,
        title: `Step ${idx + 1}`,
        detail: stepText,
        timerMinutes: Math.max(2, Math.floor((Number(preferences.maxCookingTime) || 15) / ((parsed.steps?.length || 3) + 1))),
      })),
      substitutions: parsed.substitutions || ["Use any available spices or oils."],
      chefTips: parsed.tips || ["Taste and adjust seasoning right before serving."],
      nutrition: {
        protein: "18g",
        carbs: "35g",
        fat: "12g",
        fiber: "4g",
      },
    };

    setCookModeRecipe(recipeItem);
  };

  const handleCopyRecipe = () => {
    if (!latestAssistantMsg) return;
    navigator.clipboard.writeText(latestAssistantMsg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRecipe = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* ── Sub-header / Feature Ribbon ───────────────────────── */}
      <section className="bg-gradient-to-r from-amber-500/10 via-cream-100 to-sage-500/10 border-b border-cream-200 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-500" />
            <span className="font-bold text-gray-800">
              Interactive AI Recipe Synthesis Studio
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 hidden md:inline">
              Input what’s inside your fridge & pantry to generate instant waste-free recipes
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-600 font-medium">
            <Link
              href="/cookbook"
              className="hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <BookOpen size={13} className="text-amber-500" />
              <span>Browse 12+ Recipes</span>
            </Link>
            <Link
              href="/meal-planner"
              className="hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <Calendar size={13} className="text-amber-500" />
              <span>7-Day Plan</span>
            </Link>
            <Link
              href="/pantry-insights"
              className="hover:text-amber-600 transition-colors flex items-center gap-1"
            >
              <BarChart3 size={13} className="text-sage-600" />
              <span>Pantry Insights</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main Studio Grid ─────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 grid lg:grid-cols-[400px_1fr] gap-6 items-start">
        
        {/* Left column: Pantry Input + Quick Presets + Preferences */}
        <aside className="space-y-4">
          {/* Quick Preset Packs */}
          <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Quick Pantry Presets
              </span>
              <span className="text-[10px] text-gray-400">1-click load</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PANTRY_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p.items)}
                  className="p-2 rounded-xl text-left text-[11px] font-medium bg-cream-50 hover:bg-amber-50 hover:border-amber-300 border border-cream-200 transition-colors truncate"
                  title={p.items.join(", ")}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pantry card */}
          <Card>
            <PantryInput
              ingredients={ingredients}
              onAdd={handleAddIngredient}
              onRemove={handleRemoveIngredient}
            />
          </Card>

          {/* Preferences card */}
          <Card>
            <PreferencesPanel
              preferences={preferences}
              onChange={handlePreferencesChange}
            />
          </Card>

          {/* Submit + error */}
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              loading={isLoading}
              disabled={!canSubmit}
              onClick={handleSubmit}
              aria-label="Generate recipe from pantry ingredients"
              className="w-full shadow-md hover:shadow-lg transition-all"
            >
              {isLoading ? (
                "AI Chef is Crafting Your Recipe…"
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  <span>Cook It with AI Agent!</span>
                </span>
              )}
            </Button>

            {!canSubmit && !isLoading && ingredients.length === 0 && (
              <p className="text-xs text-center text-gray-400">
                Add at least one ingredient to get started
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              >
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Right column: Chat & Interactive Recipe Viewer */}
        <div className="flex flex-col space-y-3">
          {/* Top Recipe Action Bar (Shown when recipe is generated) */}
          {latestAssistantMsg && (
            <div className="bg-white p-3.5 rounded-2xl border border-cream-200 shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-gray-800">
                  Recipe Generated & Ready
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartCookModeFromAI}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <ChefHat size={14} />
                  <span>Start Cook Mode & Step Timers</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyRecipe}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-xs font-semibold text-gray-700 transition-colors"
                >
                  {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                  <span>{copied ? "Copied" : "Copy Markdown"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveRecipe}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-xs font-semibold text-sage-800 transition-colors"
                >
                  <Bookmark size={13} />
                  <span>{savedSuccess ? "Saved!" : "Save Recipe"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Chat Interface Box */}
          <div
            className="bg-white rounded-3xl shadow-card border border-cream-200 flex flex-col overflow-hidden"
            style={{ minHeight: "560px", maxHeight: "calc(100vh - 180px)" }}
          >
            <ChatInterface messages={messages} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* Full-screen Cook Mode Modal */}
      {cookModeRecipe && (
        <CookModeModal
          recipe={cookModeRecipe}
          onClose={() => setCookModeRecipe(null)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-xs text-sage-700 animate-pulse">
            Loading Recipe Preparation Agent Studio…
          </div>
        </div>
      }
    >
      <RecipeStudioContent />
    </Suspense>
  );
}
