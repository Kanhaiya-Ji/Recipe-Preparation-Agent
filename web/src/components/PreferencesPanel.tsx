"use client";

import React from "react";
import { Toggle } from "@/components/ui/Toggle";
import type { Preferences } from "@/types";
import { SlidersHorizontal, Clock } from "lucide-react";

interface PreferencesPanelProps {
  preferences: Preferences;
  onChange: (updated: Preferences) => void;
}

const DIETARY_OPTIONS: { key: keyof Omit<Preferences, "maxCookingTime">; label: string }[] = [
  { key: "vegan",        label: "Vegan" },
  { key: "vegetarian",   label: "Vegetarian" },
  { key: "glutenFree",   label: "Gluten-Free" },
  { key: "dairyFree",    label: "Dairy-Free" },
  { key: "keto",         label: "Keto" },
  { key: "nutFree",      label: "Nut-Free" },
];

const COOKING_TIMES = [
  { value: "any",  label: "No limit" },
  { value: "15",   label: "15 min" },
  { value: "30",   label: "30 min" },
  { value: "45",   label: "45 min" },
  { value: "60",   label: "1 hour" },
];

export function PreferencesPanel({ preferences, onChange }: PreferencesPanelProps) {
  const handleDietToggle = (key: keyof Omit<Preferences, "maxCookingTime">, checked: boolean) => {
    onChange({ ...preferences, [key]: checked });
  };

  return (
    <section aria-label="Dietary preferences and cooking time">
      {/* Dietary restrictions */}
      <div className="flex items-center gap-2 mb-3">
        <SlidersHorizontal size={18} className="text-sage-500" aria-hidden="true" />
        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          Dietary Preferences
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
        {DIETARY_OPTIONS.map(({ key, label }) => (
          <Toggle
            key={key}
            id={`pref-${key}`}
            label={label}
            checked={preferences[key]}
            onChange={(checked) => handleDietToggle(key, checked)}
          />
        ))}
      </div>

      {/* Cooking time */}
      <div className="flex items-center gap-2 mb-3">
        <Clock size={18} className="text-sage-500" aria-hidden="true" />
        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          Max Cooking Time
        </h2>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Cooking time limit">
        {COOKING_TIMES.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ ...preferences, maxCookingTime: value })}
            aria-pressed={preferences.maxCookingTime === value}
            className={[
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-500",
              preferences.maxCookingTime === value
                ? "bg-sage-500 text-white border-sage-500 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-sage-300 hover:text-sage-700",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active filters summary */}
      {Object.entries(preferences).some(
        ([k, v]) => k !== "maxCookingTime" && v === true
      ) && (
        <p className="mt-3 text-xs text-amber-600 font-medium">
          🌿 Active:{" "}
          {DIETARY_OPTIONS
            .filter(({ key }) => preferences[key])
            .map(({ label }) => label)
            .join(", ")}
        </p>
      )}
    </section>
  );
}
