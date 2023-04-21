<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { Router, Link, Route } from "svelte-routing";
  import { globalHistory } from "svelte-routing/src/history";

  import Home from "./lib/Home.svelte";
  import NewGame from "./lib/NewGame.svelte";
  import Game from "./lib/Game.svelte";

  export let url = "";

  let pathname = window.location.pathname;
  let unsub;

  onMount(() => {
    // Listen to location change and update the pathname
    unsub = globalHistory.listen(({ location }) => {
      pathname = location.pathname;
    });
  });

  // If the current pathname is not root, display the back button
  $: backButton = pathname !== "/";

  onDestroy(() => {
    unsub();
  });
</script>

<Router {url}>
  <header class="navbar justify-between">
    <img src="/vite.svg" alt="Ligretto Score Counter" />
    <nav>
      {#if backButton}
        <Link class="btn-ghost btn-sm btn" to="/">Back to Game List</Link>
      {/if}
    </nav>
  </header>
  <main class="m-4">
    <Route path="/"><Home /></Route>
    <Route path="/game/new"><NewGame /></Route>
    <Route path="/game/:gameKey" let:params
      ><Game gameKey={parseInt(params.gameKey)} /></Route
    >
  </main>
</Router>
