import type { Product, Benefit, NavLink } from "../types";

export const navLinks: NavLink[] = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "ABOUT US", href: "/about" },
];

export const heroContent = {
  headline: "Real Food Protein Treats",
  subline: "Gluten-Free \u2022 No Preservatives \u2022 Made Fresh.",
  ctaText: "SHOP NOW",
};

export const freshnessContent = {
  headline: "Real Ingredients. No Preservatives. Made Fresh \u2014 Not Forever.",
  body: "Our treats are baked fresh. That\u2019s why they don\u2019t last forever.",
};

export const benefits: Benefit[] = [
  {
    id: "gluten-free",
    icon: "gluten-free",
    title: "Gluten-Free by Design",
    body: "Made with almond flour\u2014 no fillers, no wheat tricks.",
  },
  {
    id: "preservative-free",
    icon: "preservative-free",
    title: "No Preservatives. Ever.",
    body: "We don\u2019t make food that lasts months.",
  },
  {
    id: "fresh",
    icon: "fresh",
    title: "Fresh Ingredients Only.",
    body: "Grass-fed whey, real fruit, real nuts, real fats.",
  },
  {
    id: "protein",
    icon: "protein",
    title: "Protein You Can Trust",
    body: "20\u201325g protein from real sources\u2014not lab sludge.",
  },
];

export const products: Product[] = [
  {
    id: "blueberry-lemon",
    name: "Blueberry Lemon\nCrumble",
    meta: "Up to 25g Protein \u00b7 Gluten Free\nNo Preservatives \u00b7 Real Ingredients.",
    gradientFrom: "#6366F1",
    gradientTo: "#8B5CF6",
  },
  {
    id: "pistachio-matcha",
    name: "Pistachio Matcha\nStrawberry",
    meta: "Up to 25g Protein \u00b7 Gluten-Free\nNo Preservatives \u00b7 Real Ingredients.",
    gradientFrom: "#39C78B",
    gradientTo: "#E1CE71",
  },
  {
    id: "lemon-blueberry",
    name: "Lemon Blueberry\nPieookie",
    meta: "Up to 25g Protein \u00b7 Gluten-Free\nNo Preservatives \u00b7 Real Ingredients.",
    gradientFrom: "#FBBF24",
    gradientTo: "#6366F1",
  },
  {
    id: "apple-cinnamon",
    name: "Apple Cinnamon\nPieookie",
    meta: "Up to 25g Protein \u00b7 Gluten-Free\nNo Preservatives \u00b7 Real Ingredients.",
    gradientFrom: "#F59E0B",
    gradientTo: "#B45309",
  },
];
