export interface RecipeItem {
  id: string;
  title: string;
  description: string;
  category: "zero-waste" | "quick-15m" | "high-protein" | "plant-based" | "budget-bites";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  difficulty: "Easy" | "Medium" | "Advanced";
  rating: number;
  reviewsCount: number;
  tags: string[];
  dietary: {
    vegan?: boolean;
    vegetarian?: boolean;
    glutenFree?: boolean;
    dairyFree?: boolean;
    keto?: boolean;
    nutFree?: boolean;
  };
  pantryMatchScore: number; // e.g. 95%
  wasteSavedGrams: number;
  imageEmoji: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
  instructions: {
    step: number;
    title: string;
    detail: string;
    timerMinutes?: number;
  }[];
  substitutions: string[];
  chefTips: string[];
  nutrition: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
}

export interface MealPlanDay {
  day: string;
  dateStr: string;
  meals: {
    type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
    recipeTitle: string;
    calories: number;
    prepTime: string;
    imageEmoji: string;
    tags: string[];
  }[];
}

export interface PantryItem {
  id: string;
  name: string;
  category: "Produce" | "Dairy & Eggs" | "Grains & Pasta" | "Proteins" | "Pantry Staples" | "Herbs & Spices";
  quantity: string;
  daysUntilExpiry: number; // 0 = today, negative = expired
  expiryStatus: "critical" | "warning" | "fresh" | "stable";
  iconEmoji: string;
}
