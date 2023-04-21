<script lang="ts">
  import { getContext } from "svelte";

  import type { Game, Round, RoundPlayerScore } from "../types";

  import PlayerScoreInput from "./PlayerScoreInput.svelte";

  export let game: Game;
  export let defaultRoundValue: Round | undefined = undefined;
  export let open: boolean;
  export let onSave: (round: Round) => void;

  const gameKey = getContext<number>("gameKey");

  function createRound(): Round {
    const defaultRoundPlayerScore: RoundPlayerScore = {
      stackCards: 0,
      tableCards: 0,
      stackPoints: 0,
      tablePoints: 0,
      score: 0,
    };
    const playerScores = Object.fromEntries(
      game.players.map((player) => [player.id, { ...defaultRoundPlayerScore }])
    );
    return { gameKey, playerScores };
  }

  let round = (defaultRoundValue && { ...defaultRoundValue }) || createRound();

  function handleCancel() {
    open = false;
  }

  function handleSave() {
    onSave(round);
    open = false;
  }
</script>

<div class="modal" class:modal-open={open}>
  <div class="modal-box">
    <h3 class="mb-4 text-lg font-bold">Round Score</h3>
    <form>
      <ul class="flex flex-col gap-4">
        {#each game.players as player (player.id)}
          <li>
            <PlayerScoreInput
              {player}
              bind:roundPlayerScore={round.playerScores[player.id]}
            />
          </li>
        {/each}
      </ul>
      <div class="modal-action flex justify-between">
        <button class="btn-outline btn" on:click|preventDefault={handleCancel}
          >Cancel</button
        >
        <button
          type="submit"
          class="btn-primary btn"
          on:click|preventDefault={handleSave}>Save</button
        >
      </div>
    </form>
  </div>
</div>
