<script lang="ts">
  import { games } from "../stores/games";
  import RoundScoreModal from "./RoundScoreFormModal.svelte";

  export let gameId: number;

  let roundScoreModalOpen = false;

  $: game = $games[gameId];

  function handleSaveRound(round: Round) {
    game.rounds = [...game.rounds, round];
    game.score.forEach((gamePlayerScore) => {
      gamePlayerScore.score += round[gamePlayerScore.playerId].score;
    });
    games.set($games.map((g, i) => (i === gameId ? game : g)));
  }
</script>

<div class="flex justify-center">
  <button class="btn-primary btn" on:click={() => (roundScoreModalOpen = true)}
    >Add Round</button
  >
</div>

<!-- Condition makes the modal component mount/unmount
     and therefore reset its state. -->
{#if roundScoreModalOpen}
  <RoundScoreModal
    players={game.players}
    bind:open={roundScoreModalOpen}
    onSave={handleSaveRound}
  />
{/if}
