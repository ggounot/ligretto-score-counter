<script lang="ts">
  import { playerColorBg } from "../constants";

  export let playerColor: PlayerColor;
  export let playerName: string;
  export let stackCards: number = 0;
  export let tableCards: number = 0;
</script>

<div class={`card-compact ${playerColorBg[playerColor]}`}>
  <div class="card-body">
    <h2 class="card-title">
      {playerName}
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
              bind:value={stackCards}
              name="stack-cards"
              class="w-12 text-center"
            /></td
          ><td>{stackCards * -2}</td><td rowspan="2" class="text-4xl"
            >{stackCards * -2 + tableCards}</td
          ></tr
        ><tr
          ><th scope="row">Table</th><td
            ><input
              type="number"
              min="0"
              bind:value={tableCards}
              name="center-cards"
              class="w-12 text-center"
            /></td
          ><td>{tableCards}</td></tr
        ></tbody
      >
    </table>
  </div>
</div>
