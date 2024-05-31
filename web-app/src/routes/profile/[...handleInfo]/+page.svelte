<script lang="ts">
  import ProfileInfo from "../../../components/profile-page/ProfileInfo.svelte";
  import ProfilePost from "../../../components/profile-page/ProfilePost.svelte";
  import { feather, modeComment } from "../../../utils/app-icon.util";
  import Icon from "$lib/Icon.svelte";
  import { tooltip } from "@svelte-plugins/tooltips";
</script>

<!----------------------------- HTML ----------------------------->

<main>
  <ProfileInfo />

  <nav>
    <button class="btn">
      <Icon d={feather} color="black" size="1.7em" />
      <span>&nbsp; LV Posts</span>
    </button>
    <button
      class="btn inactive"
      use:tooltip={{
        content: "Coming Soon",
        position: "right",
        autoPosition: true,
        align: "center",
        animation: "slide",
        theme: "custom-tooltip"
      }}
    >
      <Icon d={modeComment} color="#9da1a3" size="1.7em" />
      <span>&nbsp; LV Comments</span>
    </button>
  </nav>
  <ProfilePost />
</main>

<!----------------------------------------------------------------->

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  nav {
    display: flex;
    flex-direction: row;
    padding: 1.5rem 6rem;
    border-bottom: 1.5px solid #3f494e;
    gap: 2rem;
  }

  nav button {
    border-radius: 10px;
  }

  .inactive {
    background: var(--bg-solid-1);
    color: #9da1a3;
  }

  @media only screen and (max-width: 1024px) {
    nav {
      justify-content: center;
      padding: 1.5rem 2rem;
      gap: 1rem;
    }

    nav button {
      width: 100%;
    }
  }
</style>
