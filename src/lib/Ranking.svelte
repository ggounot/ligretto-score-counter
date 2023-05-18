<script lang="ts">
  import type { Game } from "../types";

  export let game: Game;

  // Rank players by score
  $: rankedPlayers = [...game.players].sort(
    (a, b) => game.score[b.id] - game.score[a.id]
  );

  // Attribute medals
  $: firstPlayerMedal = "🥇";
  $: secondPlayerMedal =
    game.score[rankedPlayers[1].id] === game.score[rankedPlayers[0].id]
      ? firstPlayerMedal
      : "🥈";
  $: thirdPlayerMedal =
    rankedPlayers.length > 2 &&
    game.score[rankedPlayers[2].id] === game.score[rankedPlayers[1].id]
      ? secondPlayerMedal
      : "🥉";

  // Build medal array to use in template
  $: medals = [firstPlayerMedal, secondPlayerMedal, thirdPlayerMedal];
</script>

{rankedPlayers
  .map(
    (p, i) => `${i <= 2 ? `${medals[i]}` : ""}${p.name} (${game.score[p.id]})`
  )
  .join(", ")}
