export type ProductIcon =
  | "cpu"
  | "board"
  | "memory"
  | "storage"
  | "gpu"
  | "mouse"
  | "keyboard"
  | "headset"
  | "cooler"
  | "monitor";

export type DemoProduct = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  condition: "new" | "used";
  featured?: boolean;
  icon: ProductIcon;
  accent: "blue" | "violet" | "mint" | "orange";
  description: string;
  specs: string[];
};
