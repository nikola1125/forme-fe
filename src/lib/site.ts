export const site = {
  name: "Formë",
  tagline: "Defined by form",
  phone: "+355 69 730 0400",
  phoneRaw: "355697300400",
  whatsapp: "355697300400",
  instagram: "https://www.instagram.com/formestudio.al",
  instagramHandle: "@formestudio.al",
  maps: "https://maps.apple/p/mf0wgueDDGskPx",
  city: "Tiranë, Albania",
  rental: {
    duration: "3 days",
    deposit: "Refundable deposit of 5.000 L per dress",
    fitting: "Complimentary fitting at the studio",
  },
} as const;

export type Dress = {
  slug: string;
  name: string;
  price: string;
  sizes: string[];
  mood: "Modern" | "Retro" | "Bohemian";
  note: string;
  image: string;
  exclusive?: boolean;
};
