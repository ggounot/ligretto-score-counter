import type { DBSchema } from "idb";

export type PlayerId = string;

export type PlayerColor = "orange" | "blue" | "green" | "yellow";

export type Player = { id: PlayerId; name: string; color: PlayerColor };

export type RoundPlayerScore = {
  stackCards: number;
  tableCards: number;
  stackPoints: number;
  tablePoints: number;
  score: number;
};

export type Round = {
  gameKey: number;
  playerScores: Record<PlayerId, RoundPlayerScore>;
};

export type GameScore = Record<PlayerId, number>;

export type Game = {
  date: Date;
  players: Player[];
  score: GameScore;
};

export interface DatabaseSchema extends DBSchema {
  game: {
    key: number;
    value: Game;
  };
  round: {
    key: number;
    value: Round;
    indexes: { gameKey: number };
  };
}
