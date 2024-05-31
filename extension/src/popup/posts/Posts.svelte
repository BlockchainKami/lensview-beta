<script lang="ts">
  import PostsList from "../../components/popup/posts/PostsList.svelte";
  import PostsListLoader from "../../components/popup/posts/PostsListLoader.svelte";
  import getPublicationIdAppService from "../../services/app/get-publication-id.app.service";
  import NoPost from "../../components/popup/posts/NoPost.svelte";
  import Stats from "../../components/popup/posts/Stats.svelte";
  import StatsLoader from "../../components/popup/posts/StatsLoader.svelte";
</script>

<!---------------------------- HTML -------------------------------->

{#await getPublicationIdAppService()}
  <StatsLoader />
  <PostsListLoader />
{:then pubId}
  {#if pubId}
    <Stats {pubId} />
    <PostsList {pubId} />
  {:else}
    <NoPost />
  {/if}
{/await}
