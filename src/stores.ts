import { openDB } from "idb";

import { databaseName } from "./constants";
import type {
  AllGamesStore,
  AllGamesSubscriptions,
  DatabaseSchema,
  Game,
  GameKey,
  GameRoundsStore,
  GameRoundsSubscriptions,
  GameStore,
  GameSubscriptions,
  GameWithoutKey,
  Round,
  RoundKey,
  RoundWithoutKey,
} from "./types";

// Database

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

// Cached data

let allGamesRetrieved = false;
const cachedGames: Map<GameKey, Game> = new Map();
const cachedGameRounds: Map<GameKey, Round[]> = new Map();

// Subscriptions

const allGamesSubscriptions: AllGamesSubscriptions = new Set();
const gameSubscriptions: GameSubscriptions = new Map();
const gameRoundsSubscriptions: GameRoundsSubscriptions = new Map();

// Notifiers

function notifyAllGamesSubscriptions(games: Game[]) {
  allGamesSubscriptions.forEach((subscription) =>
    subscription(Promise.resolve(games))
  );
}

function notifyGameSubscriptions(gameKey: GameKey, game: Game) {
  gameSubscriptions
    .get(gameKey)
    .forEach((subscription) => subscription(Promise.resolve(game)));
}

function notifyGameRoundsSubscriptions(gameKey: GameKey, rounds: Round[]) {
  gameRoundsSubscriptions
    .get(gameKey)
    .forEach((subscription) => subscription(Promise.resolve(rounds)));
}

// Queries

async function getAllGamesQuery() {
  // If all games have already been retrieved,
  // return them directly from the cache
  if (allGamesRetrieved) {
    return Array.from(cachedGames.values());
  }

  // Otherwise, fetch them, cache them and return them
  let cursor = await (await db).transaction("game").store.openCursor();

  while (cursor) {
    cachedGames.set(cursor.key, { ...cursor.value, key: cursor.key });
    cursor = await cursor.continue();
  }

  allGamesRetrieved = true;

  return Array.from(cachedGames.values());
}

async function getGameQuery(gameKey: GameKey) {
  // If the game is already cached, return it directly
  if (cachedGames.has(gameKey)) {
    return cachedGames.get(gameKey);
  }

  // Otherwise, fetch it, cache it and return it
  const game = await (await db).get("game", gameKey);
  cachedGames.set(gameKey, game);
  return game;
}

async function getGameRoundsQuery(gameKey: GameKey) {
  // If the game rounds are already cached, return them directly
  if (cachedGameRounds.has(gameKey)) {
    return cachedGameRounds.get(gameKey);
  }

  // Otherwise, fetch them, catch them and return them
  const gameRounds = await (
    await db
  ).getAllFromIndex("round", "gameKey", gameKey);
  cachedGameRounds.set(gameKey, gameRounds);
  return gameRounds;
}

// Mutations

async function createGameMutation(game: GameWithoutKey) {
  // Create game
  const gameKey = await (await db).add("game", game as Game);
  // Cache game
  cachedGames.set(gameKey, { key: gameKey, ...game });
  // Notify subscriptions
  notifyAllGamesSubscriptions(Array.from(cachedGames.values()));
  // Return game key
  return gameKey;
}

async function updateGameMutation(gameKey: GameKey, game: Game) {
  // Update game
  await (await db).put("game", game, gameKey);
  // Cache game
  cachedGames.set(gameKey, game);
  // Notify subscriptions
  notifyGameSubscriptions(gameKey, game);
  notifyAllGamesSubscriptions(Array.from(cachedGames.values()));
}

async function createRoundMutation(round: RoundWithoutKey) {
  // Create round
  const roundKey = await (await db).add("round", round as Round);
  // Cache round
  const oldCachedGameRounds = cachedGameRounds.get(round.gameKey) || [];
  const newGameRounds = [...oldCachedGameRounds, { key: roundKey, ...round }];
  cachedGameRounds.set(round.gameKey, newGameRounds);

  // Get game
  const game = await getGameQuery(round.gameKey);
  // Update game score
  for (let player of game.players) {
    game.score[player.id] += round.playerScores[player.id].score;
  }
  // Update game
  updateGameMutation(round.gameKey, game);

  // Notify subscriptions
  notifyGameRoundsSubscriptions(round.gameKey, newGameRounds);
  notifyGameSubscriptions(round.gameKey, game);

  // Return round key
  return roundKey;
}

async function updateRoundMutation(roundKey: RoundKey, round: Round) {
  // Update round
  await (await db).put("round", round, roundKey);
  // Cache round
  const oldCachedGameRounds = cachedGameRounds.get(round.gameKey) || [];
  const newGameRounds = oldCachedGameRounds.map((round) => round);
  cachedGameRounds.set(round.gameKey, newGameRounds);

  // Get game
  const game = await getGameQuery(round.gameKey);
  // Update game score
  for (let player of game.players) {
    game.score[player.id] = newGameRounds.reduce(
      (playerScore, round) => playerScore + round.playerScores[player.id].score,
      0
    );
  }
  // Update game
  updateGameMutation(round.gameKey, game);

  // Notify subscriptions
  notifyGameRoundsSubscriptions(round.gameKey, newGameRounds);
  notifyGameSubscriptions(round.gameKey, game);
}

// All Games store

export const allGames: AllGamesStore = {
  subscribe(subscription) {
    // Get and return all games
    const allGames = getAllGamesQuery();
    subscription(allGames);

    // Process subscription to all games
    allGamesSubscriptions.add(subscription);

    // Return unsubscription function
    return function unsubscribe() {
      allGamesSubscriptions.delete(subscription);
    };
  },
  addGame(game: GameWithoutKey) {
    return createGameMutation(game);
  },
};

// Game store factory

export function makeGameStore(gameKey: GameKey): GameStore {
  return {
    subscribe(subscription) {
      // Get and return current game
      const currentGame = getGameQuery(gameKey);
      subscription(currentGame);

      // Process subscription to game
      if (gameSubscriptions.has(gameKey)) {
        gameSubscriptions.get(gameKey).add(subscription);
      } else {
        gameSubscriptions.set(gameKey, new Set([subscription]));
      }

      // Return unsubscription function
      return function unsubscribe() {
        gameSubscriptions.get(gameKey).delete(subscription);
      };
    },
    updateGame(gameKey: GameKey, game: Game) {
      updateGameMutation(gameKey, game);
    },
  };
}

// Game Rounds store factory

export function makeGameRoundsStore(gameKey: GameKey): GameRoundsStore {
  return {
    subscribe(subscription) {
      // Get and return current game rounds
      const currentGameRounds = getGameRoundsQuery(gameKey);
      subscription(currentGameRounds);

      // Process subscription to game rounds
      if (gameRoundsSubscriptions.has(gameKey)) {
        gameRoundsSubscriptions.get(gameKey).add(subscription);
      } else {
        gameRoundsSubscriptions.set(gameKey, new Set([subscription]));
      }

      // Return unsubscription function
      return function unsubscribe() {
        gameRoundsSubscriptions.get(gameKey).delete(subscription);
      };
    },
    addRound(round: Round) {
      return createRoundMutation(round);
    },
    updateRound(roundKey: RoundKey, round: Round) {
      updateRoundMutation(roundKey, round);
    },
  };
}
