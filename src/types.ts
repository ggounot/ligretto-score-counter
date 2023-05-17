import type { DBSchema } from "idb";

export type PlayerId = string;

export type PlayerColor =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "cyan"
  | "blue"
  | "purple"
  | "pink"
  | "brown"
  | "emerald";

export type Player = { id: PlayerId; name: string; color: PlayerColor };

type AutoIncrementKey = number;
export type GameKey = AutoIncrementKey;
export type RoundKey = AutoIncrementKey;

export type RoundPlayerScore = {
  stackCards: number;
  tableCards: number;
  stackPoints: number;
  tablePoints: number;
  score: number;
};

export type Round = {
  key: RoundKey;
  gameKey: GameKey;
  playerScores: Record<PlayerId, RoundPlayerScore>;
};

export type RoundWithoutKey = Omit<Round, "key">;

export type GameScore = Record<PlayerId, number>;

export type Game = {
  key: GameKey;
  date: Date;
  players: Player[];
  score: GameScore;
};

export type GameWithoutKey = Omit<Game, "key">;

export interface DatabaseSchema extends DBSchema {
  game: {
    key: GameKey;
    value: Game;
  };
  round: {
    key: RoundKey;
    value: Round;
    indexes: { gameKey: GameKey };
  };
}

type Subscription<T> = (value: T) => void;

export type AllGamesSubscriptions = Set<Subscription<Promise<Game[]>>>;

export type GameSubscriptions = Map<GameKey, Set<Subscription<Promise<Game>>>>;

export type GameRoundsSubscriptions = Map<
  GameKey,
  Set<Subscription<Promise<Round[]>>>
>;

interface Store<T> {
  subscribe: (subscription: Subscription<T>) => () => void;
}

export interface AllGamesStore extends Store<Promise<Game[]>> {
  addGame(game: GameWithoutKey): Promise<GameKey>;
}

export interface GameStore extends Store<Promise<Game>> {
  updateGame(gameKey: GameKey, game: Game): void;
}

export interface GameRoundsStore extends Store<Promise<Round[]>> {
  addRound(round: RoundWithoutKey): Promise<RoundKey>;
  updateRound(roundKey: RoundKey, round: Round): void;
}
