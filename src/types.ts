type PlayerId = number;

type PlayerColor = "orange" | "blue" | "green" | "yellow";

type Player = { id: PlayerId; name: string; color: PlayerColor };

type RoundPlayerScore = {
  playerId: PlayerId;
  playerstackCards: number;
  tableCards: number;
  stackPoints: number;
  tablePoints: number;
  score: number;
};

type Round = RoundPlayerScore[];

type GamePlayerScore = { playerId: PlayerId; score: number };

type GameScore = GamePlayerScore[];

type Game = {
  date: Date;
  players: Player[];
  rounds: Round[];
  score: GameScore;
};
