<script lang="ts">
  import { setContext } from "svelte";

  import { makeGameStore, makeGameRoundsStore } from "../stores";
  import type { RoundWithoutKey } from "../types";
  import { playerColorBg } from "../constants";

  import RoundScoreFormModal from "./RoundScoreFormModal.svelte";

  export let gameKey: number;

  let roundScoreFormModalOpen = false;

  setContext("gameKey", gameKey);

  let game = makeGameStore(gameKey);
  let gameRounds = makeGameRoundsStore(gameKey);

  async function handleSaveRound(round: RoundWithoutKey) {
    gameRounds.addRound(round);
  }
</script>

{#await $game}
  <p>Loading game...</p>
{:then game}
  {#await $gameRounds}
    <p>Loading rounds...</p>
  {:then gameRounds}
    <div class="overflow-x-scroll">
      <table class="table-compact table w-full">
        <thead>
          <tr>
            <th />
            {#each game.players as player}
              <th scope="col" class="text-center"
                ><div
                  class={`m-auto mr-1 inline-block h-4 w-4 rounded-full align-sub ${
                    playerColorBg[player.color]
                  }`}
                />
                {player.name}</th
              >
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each gameRounds as round, i}
            <tr class="hover">
              <th scope="row">Round {i + 1}</th>
              {#each game.players as player}
                <td class="text-center"
                  >{round.playerScores[player.id].score}</td
                >
              {/each}
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr
            ><th>Total</th>
            {#each game.players as player}
              <td class="text-center text-lg">{game.score[player.id]}</td>
            {/each}
          </tr>
        </tfoot>
      </table>
    </div>
  {:catch error}
    <p>Error while loading the rounds.</p>
  {/await}

  <div class="mt-4 flex justify-center">
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
