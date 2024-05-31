<script lang="ts">
  import MainPost from "../../../components/posts-page/MainPost.svelte";
  import PostAPublication from "../../../components/posts-page/PostAPublication.svelte";
  import CommentsOfAPublication from "../../../components/posts-page/CommentsOfAPublication.svelte";
  import Publication from "../../../components/posts-page/Publication.svelte";
  import { page } from "$app/stores";
  import MediaQuery from "$lib/MediaQuery.svelte";

  let postPubId = $page.data.postPubId;

  $: if (postPubId !== $page.data.postPubId) {
    postPubId = $page.data.postPubId;
  }
</script>

<!----------------------------- HTML ----------------------------->

<MediaQuery query="(max-width: 1024px)" let:matches>
  {#if matches}
    <main class="tablet">
      <MainPost />
      {#if postPubId !== undefined}
        <Publication />
      {/if}
      <PostAPublication />
      <CommentsOfAPublication />
    </main>
  {:else}
    <main>
      <div class="left">
        <MainPost />
      </div>
      <div class="right">
        {#if postPubId !== undefined && postPubId !== ""}
          <Publication />
        {/if}
        <PostAPublication />
        <CommentsOfAPublication />
      </div>
    </main>
  {/if}
</MediaQuery>

<!----------------------------------------------------------------->

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  .tablet {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #0d171d;
    padding: 2rem;
    margin-top: 4rem;
  }

  main {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    background: #0d171d;
  }

  .left {
    display: flex;
    flex-direction: column;
    width: 45%;
    height: 100dvh;
    overflow: auto;
    padding: 4rem 2rem 0 2rem;
  }

  .right {
    display: flex;
    flex-direction: column;
    width: 55%;
    height: 100dvh;
    overflow: auto;
    padding: 6rem 2rem 2rem 2rem;
    gap: 2rem;
  }
</style>
