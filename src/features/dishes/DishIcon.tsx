import {
  Soup,
  Beef,
  Utensils,
  Wheat,
  Croissant,
  CakeSlice,
  Candy,
  Leaf,
  Cookie,
  Flame,
  Drumstick,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps a dish ID to a specific Lucide icon based on its category/ingredients.
 * Returns both the icon component and a semantic color.
 */

interface DishIconInfo {
  Icon: LucideIcon;
  color: string;
  label: { tr: string; en: string };
}

const dishIconMap: Record<string, DishIconInfo> = {
  // Soups
  peskutan_corbasi: { Icon: Soup,       color: "#f59e0b", label: { tr: "Çorba", en: "Soup" } },
  kesme_asi:        { Icon: Soup,       color: "#f59e0b", label: { tr: "Çorba", en: "Soup" } },
  mercimek_badi:    { Icon: Soup,       color: "#f59e0b", label: { tr: "Çorba", en: "Soup" } },

  // Pastries / Breads
  baviko:           { Icon: Croissant,  color: "#A35A42", label: { tr: "Hamur İşi", en: "Pastry" } },
  sirok:            { Icon: Wheat,      color: "#A35A42", label: { tr: "Hamur İşi", en: "Pastry" } },
  sivas_katmeri:    { Icon: Croissant,  color: "#A35A42", label: { tr: "Hamur İşi", en: "Pastry" } },
  sivas_ketesi:     { Icon: Wheat,      color: "#A35A42", label: { tr: "Hamur İşi", en: "Pastry" } },

  // Meat / Main Course
  sivas_kebabi:     { Icon: Flame,      color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },
  icli_kofte:       { Icon: Beef,       color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },
  patlican_pehli:   { Icon: Drumstick,  color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },
  madimak:          { Icon: Utensils,   color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },
  hingel:           { Icon: Beef,       color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },
  divrigi_pilavi:   { Icon: Utensils,   color: "#ef4444", label: { tr: "Ana Yemek", en: "Main Course" } },

  // Side / Pickle / Yogurt
  pezik:            { Icon: Leaf,       color: "#22c55e", label: { tr: "Meze / Turşu", en: "Side / Pickle" } },
  subura:           { Icon: Leaf,       color: "#22c55e", label: { tr: "Meze / Yan", en: "Side Dish" } },

  // Desserts
  gulut:            { Icon: CakeSlice,  color: "#a855f7", label: { tr: "Tatlı", en: "Dessert" } },
  kelle_tatlisi:    { Icon: Candy,      color: "#a855f7", label: { tr: "Tatlı", en: "Dessert" } },
  kalburabastı:     { Icon: Cookie,     color: "#a855f7", label: { tr: "Tatlı", en: "Dessert" } },
};

const defaultInfo: DishIconInfo = {
  Icon: Utensils,
  color: "#4A90E2",
  label: { tr: "Yemek", en: "Dish" },
};

export function getDishIconInfo(dishId: string): DishIconInfo {
  return dishIconMap[dishId] || defaultInfo;
}

export function DishIcon({
  dishId,
  size = 24,
  className = "",
}: {
  dishId: string;
  size?: number;
  className?: string;
}) {
  const { Icon } = getDishIconInfo(dishId);
  return <Icon size={size} strokeWidth={1.75} className={className} />;
}
