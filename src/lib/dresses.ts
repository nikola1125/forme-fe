import dress1 from "@/assets/dress-1.jpg";
import dress2 from "@/assets/dress-2.jpg";
import dress3 from "@/assets/dress-3.jpg";
import dress4 from "@/assets/dress-4.jpg";
import dress5 from "@/assets/dress-5.jpg";
import dress6 from "@/assets/dress-6.jpg";
import type { Dress } from "./site";

export const dresses: Dress[] = [
  {
    slug: "aria",
    name: "Aria",
    price: "6.000 L / 3 days",
    sizes: ["XS", "S", "M"],
    mood: "Modern",
    note: "Cowl-neck ivory silk slip with a bias fall.",
    image: dress1,
    exclusive: true,
  },
  {
    slug: "vera",
    name: "Vera",
    price: "5.000 L / 3 days",
    sizes: ["S", "M", "L"],
    mood: "Retro",
    note: "Caramel puff-sleeve midi with a defined waist.",
    image: dress2,
  },
  {
    slug: "olea",
    name: "Olea",
    price: "5.500 L / 3 days",
    sizes: ["XS", "S", "M"],
    mood: "Bohemian",
    note: "Tiered ivory lace maxi with fluted sleeves.",
    image: dress3,
  },
  {
    slug: "dorë",
    name: "Dorë",
    price: "9.000 L / 3 days",
    sizes: ["S", "M"],
    mood: "Modern",
    note: "One-shoulder champagne satin gown, hand-draped.",
    image: dress4,
    exclusive: true,
  },
  {
    slug: "rosa",
    name: "Rosa",
    price: "6.500 L / 3 days",
    sizes: ["XS", "S", "M", "L"],
    mood: "Retro",
    note: "Dusty rose bias-cut column in liquid satin.",
    image: dress5,
  },
  {
    slug: "noir",
    name: "Noir",
    price: "8.000 L / 3 days",
    sizes: ["S", "M"],
    mood: "Modern",
    note: "Asymmetric black column with a gathered hip.",
    image: dress6,
    exclusive: true,
  },
];

export const moods = ["All", "Modern", "Retro", "Bohemian"] as const;
