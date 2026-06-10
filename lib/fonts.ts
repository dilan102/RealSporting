import {
  Playfair_Display,
  Barlow_Condensed,
  Bebas_Neue,
  Fraunces,
  Inter,
  Newsreader,
  Rajdhani,
  Sora,
} from "next/font/google";

// Fuente para cuerpo y UI general
export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

// Fuente para títulos y Hero
export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-hero",
  display: "swap",
});

// Fuente para stadiums/estadios
export const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-stadium",
  display: "swap",
});

// Fuentes opcionales (secondary - lazy loaded si se usan)
export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: false, // No precargar - solo si se usa
});

export const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-news",
  display: "swap",
  preload: false,
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-editorial",
  display: "swap",
  preload: false,
});

export const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-tech",
  display: "swap",
  preload: false,
});

export const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-community",
  display: "swap",
  preload: false,
});

// Combinar todas para aplicar al html
export const allFonts = [inter, bebasNeue, barlowCondensed];
export const optionalFonts = [playfairDisplay, newsreader, fraunces, rajdhani, sora];
