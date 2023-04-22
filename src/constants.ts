import type { PlayerColor } from "./types";

export const databaseName = "ligretto-score-counter";

export const playerColorBg: Record<PlayerColor, string> = {
  orange: "bg-[#ea765d]",
  blue: "bg-[#56b4e7]",
  green: "bg-[#6a7378]",
  yellow: "bg-[#e3ab16]",
} as const;

export const maxStackCards = 10;
export const maxTableCards = 37;
