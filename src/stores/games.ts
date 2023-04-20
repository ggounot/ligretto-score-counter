import { persisted } from "svelte-local-storage-store";

export const games = persisted<Game[]>("games", []);
