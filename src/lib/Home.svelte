<script lang="ts">
  import { Link } from "svelte-routing";
  import { allGames } from "../stores";
</script>

<div class="flex flex-col gap-4">
  <div class="text-center">
    <Link class="btn-primary btn" to="/game/new">New Game</Link>
  </div>

  {#await $allGames}
    <p>Loading previous games...</p>
  {:then allGames}
    {#if allGames.length > 0}
      <h2 class=" text-lg font-bold">Previous games</h2>
      <ol class="menu menu-compact">
        {#each allGames.reverse() as game}
          <li class="hover-bordered flex justify-between border-b-2">
            <Link
              class="flex flex-col items-start gap-0"
              to={`/game/${game.key}`}
            >
              <span class="text-base font-semibold"
                >{game.players
                  .map((player) => `${player.name} (${game.score[player.id]})`)
                  .join(", ")}</span
              >
              <span>{game.date.toLocaleString()}</span>
            </Link>
          </li>
        {/each}
      </ol>
    {/if}
  {:catch error}
    <p>Error while loading previous games.</p>
  {/await}
</div>
