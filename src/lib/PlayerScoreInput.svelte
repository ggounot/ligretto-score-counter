<script lang="ts">
  import { maxStackCards, maxTableCards, playerColorBg } from "../constants";
  import type { Player, RoundPlayerScore } from "../types";

  export let player: Player;
  export let roundPlayerScore: RoundPlayerScore;

  $: roundPlayerScore.stackPoints = roundPlayerScore.stackCards * -2;
  $: roundPlayerScore.tablePoints = roundPlayerScore.tableCards;
  $: roundPlayerScore.score =
    roundPlayerScore.stackPoints + roundPlayerScore.tablePoints;
</script>

<div class={`card-compact text-neutral-900 ${playerColorBg[player.color]}`}>
  <div class="card-body">
    <h2 class="card-title">
      {player.name}
    </h2>
    <table class="text-center text-lg">
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
            ><select
              class="w-12 text-center text-base-content"
              bind:value={roundPlayerScore.stackCards}
              >{#each Array.from(Array(maxStackCards + 1).keys()) as n}<option
                  >{n}</option
                >{/each}</select
            ></td
          ><td>{roundPlayerScore.stackPoints}</td><td
            rowspan="2"
            class="text-4xl">{roundPlayerScore.score}</td
          ></tr
        ><tr
          ><th scope="row">Table</th><td
            ><select
              class="w-12 text-center text-base-content"
              bind:value={roundPlayerScore.tableCards}
              >{#each Array.from(Array(maxTableCards + 1).keys()) as n}<option
                  >{n}</option
                >{/each}</select
            ></td
          ><td>{roundPlayerScore.tablePoints}</td></tr
        ></tbody
      >
    </table>
  </div>
</div>
