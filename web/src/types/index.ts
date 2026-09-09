// ============================================================
// Shared domain types for the Recipe Preparation Agent UI
// ============================================================

/** A single ingredient in the user's pantry */
export interface Ingredient {
  id: string;
  label: string;
}

/** User dietary preferences and cooking constraints */
export interface Preferences {
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  keto: boolean;
  nutFree: boolean;
  /** Cooking time limit — e.g. "15", "30", "60", or "any" */
  maxCookingTime: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
  vegan: false,
  vegetarian: false,
  glutenFree: false,
  dairyFree: false,
  keto: false,
  nutFree: false,
  maxCookingTime: "any",
};

/** A single message in the chat thread */
export interface RecipeMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Structured sections parsed out of an assistant recipe response */
export interface ParsedRecipe {
  title?: string;
  ingredientsUsed?: string[];
  steps?: string[];
  substitutions?: string[];
  tips?: string[];
  raw: string;
}

/** Response shape returned by /api/recipe */
export interface RecipeApiResponse {
  recipe?: string;
  error?: string;
}
