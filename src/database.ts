import { openDB } from "idb";

import { databaseName } from "./constants";
import type { DatabaseSchema, Game, Round } from "./types";

const db = openDB<DatabaseSchema>(databaseName, 1, {
  upgrade(db) {
    db.createObjectStore("game", {
      autoIncrement: true,
    });
    const roundObjectStore = db.createObjectStore("round", {
      autoIncrement: true,
    });
    roundObjectStore.createIndex("gameKey", "gameKey");
  },
});

export async function createGame(game: Game) {
  return (await db).add("game", game);
}

async function updateGame(gameKey: number, game: Game) {
  return (await db).put("game", game, gameKey);
}

export async function getGame(gameKey: number) {
  return (await db).get("game", gameKey);
}

export async function createRound(game: Game, round: Round) {
  // Create round
  const roundKey = (await db).add("round", round);

  // Update game score
  for (let player of game.players) {
    game.score[player.id] += round.playerScores[player.id].score;
  }
  updateGame(round.gameKey, game);

  return roundKey;
}

export async function updateRound(roundKey: number, round: Round) {
  return (await db).put("round", round, roundKey);
}

export async function getRound(roundKey: number) {
  return (await db).get("round", roundKey);
}

export async function getGameRounds(gameKey: number) {
  return (await db).getAllFromIndex("round", "gameKey", gameKey);
}
