"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Chip } from "@/components/ui/Chip";
import type { Ingredient } from "@/types";
import { Plus, Salad } from "lucide-react";

interface PantryInputProps {
  ingredients: Ingredient[];
  onAdd: (ingredient: Ingredient) => void;
  onRemove: (id: string) => void;
}

export function PantryInput({ ingredients, onAdd, onRemove }: PantryInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addIngredient = () => {
    const trimmed = inputValue.trim().replace(/,$/, "").trim();
    if (!trimmed) return;
    // Prevent duplicates (case-insensitive)
    const isDuplicate = ingredients.some(
      (i) => i.label.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setInputValue("");
      return;
    }
    onAdd({ id: crypto.randomUUID(), label: trimmed });
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addIngredient();
    }
    // Backspace on empty input removes last chip
    if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      onRemove(ingredients[ingredients.length - 1].id);
    }
  };

  return (
    <section aria-label="Pantry ingredients">
      <div className="flex items-center gap-2 mb-3">
        <Salad size={18} className="text-sage-500" aria-hidden="true" />
        <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
          What&apos;s in your pantry?
        </h2>
      </div>

      {/* Chip input area */}
      <div
        role="group"
        aria-label="Ingredient tags"
        onClick={() => inputRef.current?.focus()}
        className={[
          "min-h-[80px] flex flex-wrap gap-2 items-start content-start",
          "rounded-xl border bg-white p-3 cursor-text transition-colors",
          "border-cream-200 hover:border-sage-300 focus-within:border-sage-400 focus-within:ring-2 focus-within:ring-sage-100",
        ].join(" ")}
      >
        {ingredients.map((ing) => (
          <Chip key={ing.id} label={ing.label} onRemove={() => onRemove(ing.id)} />
        ))}

        {/* Inline text input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addIngredient}
          placeholder={
            ingredients.length === 0
              ? "Type an ingredient and press Enter…"
              : "Add another…"
          }
          aria-label="Add ingredient"
          className="flex-1 min-w-[140px] bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 py-0.5"
        />
      </div>

      {/* Helper text + add button row */}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">
          Press <kbd className="font-mono bg-gray-100 px-1 rounded text-gray-500">Enter</kbd> or{" "}
          <kbd className="font-mono bg-gray-100 px-1 rounded text-gray-500">,</kbd> to add
        </p>
        {inputValue.trim() && (
          <button
            type="button"
            onClick={addIngredient}
            aria-label="Add ingredient"
            className="flex items-center gap-1 text-xs text-sage-600 hover:text-sage-800 font-medium transition-colors"
          >
            <Plus size={13} aria-hidden="true" />
            Add
          </button>
        )}
      </div>

      {/* Ingredient count badge */}
      {ingredients.length > 0 && (
        <p className="mt-2 text-xs text-sage-600 font-medium">
          {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} added
        </p>
      )}
    </section>
  );
}
