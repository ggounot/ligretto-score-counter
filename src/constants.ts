import type { PlayerColor } from "./types";

export const databaseName = "ligretto-score-counter";

export const orderedColors: PlayerColor[] = [
  "cyan",
  "orange",
  "purple",
  "lime",
  "gray",
  "brown",
  "pink",
  "emerald",
  "blue",
  "yellow",
  "red",
  "green",
];

export const playerColorName: Record<PlayerColor, string> = {
  gray: "Gray",
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  lime: "Lime",
  green: "Green",
  cyan: "Cyan",
  blue: "Blue",
  purple: "Purple",
  pink: "Pink",
  brown: "Brown",
  emerald: "Emerald",
} as const;

export const playerColorBg: Record<PlayerColor, string> = {
  gray: "bg-gray-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  brown: "bg-yellow-700",
  emerald: "bg-emerald-500",
} as const;

export const minPlayers = 2;
export const maxPlayers = orderedColors.length;

export const maxStackCards = 10;
export const maxTableCards = 37;
