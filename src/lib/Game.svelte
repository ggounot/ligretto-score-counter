<script lang="ts">
  import { setContext } from "svelte";

  import { createRound, getGame } from "../database";
  import type { Round } from "../types";

  import RoundScoreFormModal from "./RoundScoreFormModal.svelte";

  export let gameKey: number;

  let roundScoreFormModalOpen = false;

  setContext("gameKey", gameKey);

  $: gamePromise = getGame(gameKey);

  async function handleSaveRound(round: Round) {
    return createRound(await gamePromise, round);
  }
</script>

{#await gamePromise}
  <p>Loading game...</p>
{:then game}
  <div class="flex justify-center">
    <button
      class="btn-primary btn"
      on:click={() => (roundScoreFormModalOpen = true)}>Add Round</button
    >
  </div>

  <!-- Condition makes the modal component mount/unmount
     and therefore reset its state. -->
  {#if roundScoreFormModalOpen}
    <RoundScoreFormModal
      {game}
      bind:open={roundScoreFormModalOpen}
      onSave={handleSaveRound}
    />
  {/if}
{:catch error}
  <p>Error while loading the game.</p>
{/await}
