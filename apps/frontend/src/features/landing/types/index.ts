export interface Product {
  id: string;
  name: string;
  meta: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface Benefit {
  id: string;
  icon: "gluten-free" | "preservative-free" | "fresh" | "protein";
  title: string;
  body: string;
}

export interface NavLink {
  label: string;
  href: string;
}
