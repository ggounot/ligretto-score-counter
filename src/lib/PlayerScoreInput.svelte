<script lang="ts">
  import { playerColorBg } from "../constants";
  import type { Player, RoundPlayerScore } from "../types";

  export let player: Player;
  export let roundPlayerScore: RoundPlayerScore;

  $: roundPlayerScore.stackPoints = roundPlayerScore.stackCards * -2;
  $: roundPlayerScore.tablePoints = roundPlayerScore.tableCards;
  $: roundPlayerScore.score =
    roundPlayerScore.stackPoints + roundPlayerScore.tablePoints;
</script>

<div class={`card-compact ${playerColorBg[player.color]}`}>
  <div class="card-body">
    <h2 class="card-title">
      {player.name}
    </h2>
    <table class="text-center">
      <thead
        ><tr
          ><th /><th scope="col">Cards</th><th scope="col">Points</th><th
            scope="col">Total</th
          ></tr
        ></thead
      >
      <tbody
        ><tr
          ><th scope="row">Stack</th><td
            ><input
              type="number"
              min="0"
              bind:value={roundPlayerScore.stackCards}
              name="stack-cards"
              class="w-12 text-center"
            /></td
          ><td>{roundPlayerScore.stackPoints}</td><td
            rowspan="2"
            class="text-4xl">{roundPlayerScore.score}</td
          ></tr
        ><tr
          ><th scope="row">Table</th><td
            ><input
              type="number"
              min="0"
              bind:value={roundPlayerScore.tableCards}
              name="center-cards"
              class="w-12 text-center"
            /></td
          ><td>{roundPlayerScore.tablePoints}</td></tr
        ></tbody
      >
    </table>
  </div>
</div>
