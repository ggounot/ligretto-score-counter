<script lang="ts">
  import { navigate } from "svelte-routing";

  import type { GameWithoutKey } from "../types";
  import { allGames } from "../stores";

  import ErrorModal from "./ErrorModal.svelte";
  import ColorSelect from "./ColorSelect.svelte";
  import { maxPlayers, minPlayers, orderedColors } from "../constants";

  const playerTemplate = { name: "", color: undefined };

  let players = Array.from(Array(minPlayers).keys()).map((i) => ({
    ...playerTemplate,
    color: orderedColors[i],
  }));

  let errors = [];
  let errorModalOpen = false;

  function getFirstUnusedColor() {
    const usedColors = new Set(players.map((player) => player.color));
    for (const color of orderedColors) {
      if (!usedColors.has(color)) {
        return color;
      }
    }
  }

  function addPlayer() {
    const color = getFirstUnusedColor();
    players = [...players, { ...playerTemplate, color }];
  }

  function deletePlayer(playerIndex) {
    players = players.filter((_, i) => i !== playerIndex);
  }

  function checkErrors() {
    errors = [];

    // Check empty name
    for (let player of players) {
      if (player.name.trim() === "") {
        errors.push("Players cannot have an empty name.");
        break;
      }
    }

    // Check color duplicate
    const selectedColors = new Set();
    for (let player of players) {
      if (selectedColors.has(player.color)) {
        errors.push("Players cannot share the same color.");
        break;
      }
      selectedColors.add(player.color);
    }

    if (errors.length > 0) {
      errorModalOpen = true;
    }
  }

  async function startGame() {
    // Check errors
    checkErrors();
    if (errors.length > 0) {
      return;
    }

    // Create game object
    const game: GameWithoutKey = {
      date: new Date(),
      players: players.map((player, i) => ({ id: i.toString(), ...player })),
      score: Object.fromEntries(players.map((_, i) => [i.toString(), 0])),
    };

    // Store game object
    const gameKey = await allGames.addGame(game);

    // Redirect to game page
    navigate(`/game/${gameKey}`, { replace: true });
  }
</script>

<!-- Player configuration form -->
<form class="flex flex-col gap-6">
  <ul class="flex flex-col gap-4">
    {#each players as player, i (player)}
      <li class="flex flex-row items-center gap-4">
        <!-- Name input -->
        <!-- svelte-ignore a11y-autofocus -->
        <input
          class="input-bordered input w-full"
          type="text"
          name="name"
          placeholder="Name"
          bind:value={player.name}
          required
          autofocus={i === 0}
        />

        <!-- Color selector -->
        <ColorSelect bind:value={player.color} />

        <!-- Delete button -->
        <button
          class="btn-outline btn-sm btn-circle btn"
          title="Delete player"
          on:click|preventDefault={() => deletePlayer(i)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            /></svg
          >
        </button>
      </li>
    {/each}
  </ul>

  <div class="flex justify-between gap-4">
    <button
      class="btn-outline btn"
      on:click|preventDefault={addPlayer}
      disabled={players.length >= maxPlayers}>Add Player</button
    >
    <button
      type="submit"
      class="btn-primary btn"
      on:click|preventDefault={startGame}
      disabled={players.length < minPlayers}>Start Game</button
    >
  </div>
</form>

<!-- Error modal -->
<ErrorModal {errors} bind:open={errorModalOpen} />
