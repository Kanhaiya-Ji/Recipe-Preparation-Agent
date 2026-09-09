import { MealPlanDay } from "@/types/cookbook";

export const INITIAL_MEAL_PLAN: MealPlanDay[] = [
  {
    day: "Monday",
    dateStr: "Sep 9",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Zesty Chickpea Avocado Protein Smash",
        calories: 340,
        prepTime: "7 min",
        imageEmoji: "🥑",
        tags: ["No-Cook", "Fiber Rich"],
      },
      {
        type: "Lunch",
        recipeTitle: "Crispy Scallion & Rice Skillet Omelette",
        calories: 380,
        prepTime: "12 min",
        imageEmoji: "🍳",
        tags: ["Leftover Rice", "High-Protein"],
      },
      {
        type: "Dinner",
        recipeTitle: "Tuscan Garlic & Tomato White Bean Skillet",
        calories: 290,
        prepTime: "15 min",
        imageEmoji: "🧆",
        tags: ["Plant-Based", "Pantry Staples"],
      },
    ],
  },
  {
    day: "Tuesday",
    dateStr: "Sep 10",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Zero-Waste Rainbow Vegetable Frittata",
        calories: 240,
        prepTime: "15 min",
        imageEmoji: "🥧",
        tags: ["Keto", "High-Protein"],
      },
      {
        type: "Lunch",
        recipeTitle: "Mediterranean Chicken & Roasted Veggies",
        calories: 460,
        prepTime: "20 min",
        imageEmoji: "🍗",
        tags: ["High-Protein", "Meal Prep"],
      },
      {
        type: "Dinner",
        recipeTitle: "15-Minute Sticky Honey Garlic Noodles",
        calories: 420,
        prepTime: "12 min",
        imageEmoji: "🍜",
        tags: ["Quick Fix", "Comfort"],
      },
    ],
  },
  {
    day: "Wednesday",
    dateStr: "Sep 11",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Golden Scrambled Eggs on Toasted Sourdough",
        calories: 310,
        prepTime: "8 min",
        imageEmoji: "🍞",
        tags: ["Quick", "High-Protein"],
      },
      {
        type: "Lunch",
        recipeTitle: "Tuscan White Bean & Spinach Salad Bowl",
        calories: 320,
        prepTime: "10 min",
        imageEmoji: "🥗",
        tags: ["Plant-Based", "Fiber"],
      },
      {
        type: "Dinner",
        recipeTitle: "Sheet-Pan Lemon Herb Chicken & Potatoes",
        calories: 480,
        prepTime: "25 min",
        imageEmoji: "🍗",
        tags: ["One-Pan", "Gluten-Free"],
      },
    ],
  },
  {
    day: "Thursday",
    dateStr: "Sep 12",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Overnight Oats with Chia & Apple Slices",
        calories: 290,
        prepTime: "5 min",
        imageEmoji: "🥣",
        tags: ["Prep Ahead", "Fiber"],
      },
      {
        type: "Lunch",
        recipeTitle: "Quick Pantry Vegetable Stir-Fry & Rice",
        calories: 360,
        prepTime: "15 min",
        imageEmoji: "🥦",
        tags: ["Zero Waste", "Vegan"],
      },
      {
        type: "Dinner",
        recipeTitle: "Crispy Egg & Cheese Rice Skillet",
        calories: 410,
        prepTime: "12 min",
        imageEmoji: "🍳",
        tags: ["Comfort Food", "Fast"],
      },
    ],
  },
  {
    day: "Friday",
    dateStr: "Sep 13",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Avocado Smash with Crushed Pepper & Olive Oil",
        calories: 320,
        prepTime: "6 min",
        imageEmoji: "🥑",
        tags: ["Healthy Fats"],
      },
      {
        type: "Lunch",
        recipeTitle: "Honey Garlic Sesame Noodles with Scallions",
        calories: 420,
        prepTime: "12 min",
        imageEmoji: "🍜",
        tags: ["Vegetarian", "Quick"],
      },
      {
        type: "Dinner",
        recipeTitle: "Creamy Coconut Lentil & Spinach Curry",
        calories: 450,
        prepTime: "20 min",
        imageEmoji: "🍲",
        tags: ["Comfort", "Plant-Based"],
      },
    ],
  },
  {
    day: "Saturday",
    dateStr: "Sep 14",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Fluffy Cottage Cheese & Banana Hotcakes",
        calories: 380,
        prepTime: "15 min",
        imageEmoji: "🥞",
        tags: ["Weekend Brunch"],
      },
      {
        type: "Lunch",
        recipeTitle: "Zero-Waste Veggie & Feta Frittata Slice",
        calories: 260,
        prepTime: "10 min",
        imageEmoji: "🥧",
        tags: ["Leftover Friendly"],
      },
      {
        type: "Dinner",
        recipeTitle: "Wood-Fired Style Skillet Pita Pizzas",
        calories: 520,
        prepTime: "18 min",
        imageEmoji: "🍕",
        tags: ["Chef Special", "Family"],
      },
    ],
  },
  {
    day: "Sunday",
    dateStr: "Sep 15",
    meals: [
      {
        type: "Breakfast",
        recipeTitle: "Greek Yogurt Parfait with Toasted Seeds",
        calories: 280,
        prepTime: "5 min",
        imageEmoji: "🍓",
        tags: ["High-Protein", "No-Cook"],
      },
      {
        type: "Lunch",
        recipeTitle: "Sundried Tomato & White Bean Bruschetta",
        calories: 340,
        prepTime: "10 min",
        imageEmoji: "🥖",
        tags: ["Mediterranean"],
      },
      {
        type: "Dinner",
        recipeTitle: "Weekly Fridge-Cleanout Roasted Harvest Bowl",
        calories: 410,
        prepTime: "25 min",
        imageEmoji: "🥗",
        tags: ["Zero Waste Goal", "Detox"],
      },
    ],
  },
];

export interface GroceryItem {
  id: string;
  name: string;
  department: "Fresh Produce" | "Dairy & Cold" | "Pantry & Grains" | "Spices & Oils" | "Proteins";
  amount: string;
  checked: boolean;
}

export const INITIAL_GROCERY_LIST: GroceryItem[] = [
  { id: "g1", name: "Avocados", department: "Fresh Produce", amount: "3 pcs", checked: false },
  { id: "g2", name: "Cherry Tomatoes", department: "Fresh Produce", amount: "1 pint", checked: true },
  { id: "g3", name: "Baby Spinach", department: "Fresh Produce", amount: "250g pack", checked: false },
  { id: "g4", name: "Fresh Scallions / Green Onions", department: "Fresh Produce", amount: "1 bunch", checked: false },
  { id: "g5", name: "Lemons & Limes", department: "Fresh Produce", amount: "4 pcs", checked: true },
  { id: "g6", name: "Free-Range Farm Eggs", department: "Dairy & Cold", amount: "1 dozen", checked: false },
  { id: "g7", name: "Mozzarella or Feta Cheese", department: "Dairy & Cold", amount: "200g", checked: false },
  { id: "g8", name: "Cannellini or Chickpeas (Canned)", department: "Pantry & Grains", amount: "3 cans", checked: true },
  { id: "g9", name: "Ramen / Sourdough Bread", department: "Pantry & Grains", amount: "1 pack", checked: false },
  { id: "g10", name: "Toasted Sesame Oil & Soy Sauce", department: "Spices & Oils", amount: "1 bottle", checked: true },
  { id: "g11", name: "Chicken Breasts or Tofu Block", department: "Proteins", amount: "500g", checked: false },
];
