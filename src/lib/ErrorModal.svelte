<script lang="ts">
  export let errors: string[];
  export let open: boolean;
</script>

<div class="modal" class:modal-open={open}>
  <div class="modal-box">
    <h3 class="text-lg font-bold">
      {errors.length > 1 ? "Errors:" : "Error:"}
    </h3>
    <ul class="list-inside list-disc">
      {#each errors as error}
        <li>{error}</li>
      {/each}
    </ul>
    <div class="modal-action">
      <button class="btn" on:click={() => (open = false)}>OK</button>
    </div>
  </div>
</div>
