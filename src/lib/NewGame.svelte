<script lang="ts">
  import { navigate } from "svelte-routing";

  import type { Game } from "../types";
  import { createGame } from "../database";

  import ErrorModal from "./ErrorModal.svelte";

  const colors = [
    { name: "Blue", color: "blue" },
    { name: "Green", color: "green" },
    { name: "Orange", color: "orange" },
    { name: "Yellow", color: "yellow" },
  ];

  const playerTemplate = { name: "", color: undefined };

  let players = [{ ...playerTemplate }, { ...playerTemplate }];
  let errors = [];
  let errorModalOpen = false;

  function addPlayer() {
    players = [...players, { ...playerTemplate }];
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
    const game: Game = {
      date: new Date(),
      players: players.map((player, i) => ({ id: i.toString(), ...player })),
      score: Object.fromEntries(players.map((_, i) => [i.toString(), 0])),
    };

    // Store game object
    const gameKey = await createGame(game);

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
        <input
          class="input-bordered input w-full"
          type="text"
          name="name"
          placeholder="Name"
          bind:value={player.name}
          required
        />

        <!-- Color selector -->
        <select
          class="select-bordered select"
          name="color"
          bind:value={player.color}
        >
          {#each colors as { name, color }}
            <option value={color}>{name}</option>
          {/each}
        </select>

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

  <div class="flex justify-between">
    <button class="btn-outline btn" on:click|preventDefault={addPlayer}
      >Add Player</button
    >
    <button
      type="submit"
      class="btn-primary btn"
      on:click|preventDefault={startGame}>Start Game</button
    >
  </div>
</form>

<!-- Error modal -->
<ErrorModal {errors} bind:open={errorModalOpen} />
