<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { Router, Link, Route } from "svelte-routing";
  import { globalHistory } from "svelte-routing/src/history";

  import Home from "./lib/Home.svelte";
  import NewGame from "./lib/NewGame.svelte";
  import Game from "./lib/Game.svelte";
  import DarkModeToggle from "./lib/DarkModeToggle.svelte";

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
  <header class="mb-10 flex items-center justify-between">
    <Link to="/"
      ><img
        class="h-16 w-auto object-contain"
        src="/logo.webp"
        alt="Ligretto Score Counter"
        height="105"
        width="395"
      /></Link
    >
    <div class="flex">
      {#if backButton}
        <nav>
          <Link class="btn-ghost btn" to="/">Back</Link>
        </nav>
        <div class="divider divider-horizontal" />
      {/if}
      <DarkModeToggle />
    </div>
  </header>
  <main>
    <Route path="/"><Home /></Route>
    <Route path="/game/new"><NewGame /></Route>
    <Route path="/game/:gameKey" let:params
      ><Game gameKey={parseInt(params.gameKey)} /></Route
    >
  </main>
</Router>
