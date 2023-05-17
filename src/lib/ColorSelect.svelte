<script lang="ts">
  import { orderedColors, playerColorBg, playerColorName } from "../constants";
  import type { PlayerColor } from "../types";

  export let value: PlayerColor;

  function selectColor(playerColor: PlayerColor) {
    value = playerColor;
    const elem = document.activeElement as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  }
</script>

<div class="dropdown dropdown-end">
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label tabindex="0" class={`btn m-1 w-24 ${playerColorBg[value]}`}
    >{playerColorName[value]}</label
  >
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <ul
    tabindex="0"
    class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
  >
    {#each orderedColors as color}
      <li class={`${playerColorBg[color]} font-semibold text-primary-content`}>
        <!-- svelte-ignore a11y-invalid-attribute -->
        <a
          href="javascript:void(0)"
          on:click|preventDefault={() => selectColor(color)}
          >{playerColorName[color]}</a
        >
      </li>
    {/each}
  </ul>
</div>
