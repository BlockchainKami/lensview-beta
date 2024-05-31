<script lang="ts">
  import { person, thumbDown, thumbUp } from "../../../utils/app-icon.util";
  import Icon from "../../../lib/Icon.svelte";
  import getCommentBasedOnParameterPublicationUtil from "../../../utils/publications/get-comment-based-on-parameter.publication.util";
  import { LimitType } from "../../../gql/graphql";
  import PostsListLoader from "./PostsListLoader.svelte";
  import getPictureURLUtil from "../../../utils/get-picture-URL.util";
  import type { CommentsPublicationLensModel } from "../../../models/lens/comments-publication.lens.model";
  import getFormattedDateHelperUtil from "../../../utils/helper/get-formatted-date.helper.util";
  import Autolinker from "autolinker";
  import DOMPurify from "dompurify";
  import { tooltip } from "@svelte-plugins/tooltips";
  import { TotalImagePostsStore } from "../../../stores/total-image-posts.store";
  const { VITE_APP_LENS_ID } = import.meta.env;
  const { VITE_IMAGE_PUB } = import.meta.env;
  const { VITE_DOMAIN_NAME } = import.meta.env;

  export let pubId;
  let totalImagePostCount = 0;

  let promiseOfGetComments = getCommentBasedOnParameterPublicationUtil(
    pubId,
    LimitType.Fifty
  );

  const getHandle = (comment: CommentsPublicationLensModel) => {
    return comment.by?.handle?.fullHandle.substring(5);
  };

  const redirectToPost = () => {
    window.open(`https://${VITE_DOMAIN_NAME}/posts/${pubId}`, "_blank");
  };

  const updateTotalImagePosts = () => {
    totalImagePostCount++;
    TotalImagePostsStore.setTotalImagePosts(totalImagePostCount);
    return "";
  };
</script>

<!---------------------------- HTML -------------------------------->

{#await promiseOfGetComments}
  <PostsListLoader />
{:then commentsData}
  <ul>
    {#each commentsData as comment, index}
      {#if !comment?.metadata?.tags.includes(VITE_IMAGE_PUB)}
        <li>
          <a
            class="card"
            href={`https://${VITE_DOMAIN_NAME}/posts/${pubId}/${comment?.id}`}
            target="_blank"
            aria-labelledby={"post-title-" + index}
            aria-describedby={"post-content-" + index}
          >
            <header class="card__header">
              <img
                class="card__header__profile-pic"
                src={getPictureURLUtil(
                  comment?.by?.metadata?.picture?.optimized?.uri,
                  comment?.by?.ownedBy?.address
                )}
                alt={getHandle(comment) + "'s profile picture"}
              />
              <div class="card__header__info">
                <div class="CenterRowFlex card__header__info__top">
                  <div
                    class="card__header__info__top__name"
                    id={"post-title-" + index}
                  >
                    {comment?.by?.metadata?.displayName
                      ? comment?.by?.metadata?.displayName
                      : ""}
                  </div>
                </div>
                <div class="CenterRowFlex card__header__info__bottom">
                  <div
                    class="card__header__info__bottom__username"
                    aria-label="username"
                  >
                    {getHandle(comment)}
                  </div>
                  {#if comment?.by?.id === VITE_APP_LENS_ID}
                    <div
                      use:tooltip={{
                        content: "This post was made by an anonymous user!",
                        position: "bottom",
                        autoPosition: true,
                        align: "center",
                        animation: "slide",
                        theme: "custom-tooltip"
                      }}
                      class="CenterRowFlex card__header__info__bottom__anon-comment"
                    >
                      <Icon d={person} size="1.05em" />
                    </div>
                  {/if}
                  <div class="dot" aria-hidden="true" />
                  <div
                    class="card__header__info__bottom__time"
                    aria-label={comment?.createdAt + "ago"}
                  >
                    {getFormattedDateHelperUtil(comment?.createdAt)}
                  </div>
                </div>
              </div>
              <div class="CenterRowFlex card__header__reaction">
                <div
                  class="CenterRowFlex card__header__reaction__val"
                  aria-label="6 likes"
                >
                  <Icon d={thumbUp} />
                  {comment?.stats?.upvotes}
                </div>
                <div
                  class="card__header__reaction__vertical-line"
                  aria-hidden="true"
                />
                <div
                  class="CenterRowFlex card__header__reaction__val"
                  aria-label="6 dislikes"
                >
                  <Icon d={thumbDown} />
                  {comment?.stats?.downvotes}
                </div>
              </div>
            </header>
            <div class="card__body" id={"post-content-" + index}>
              <!--eslint-disable-next-line svelte/no-at-html-tags -->
              {@html Autolinker.link(
                DOMPurify.sanitize(comment?.metadata?.content),
                {
                  className: "links"
                }
              )}
            </div>
          </a>
        </li>
      {:else}
        {updateTotalImagePosts()}
      {/if}
    {/each}
  </ul>
  <div class="add-post">
    <button on:click={redirectToPost} class="btn">Add your post</button>
  </div>
{/await}

<!----------------------------------- style -------------------------------->

<style lang="scss">
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1rem 5rem 1rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: var(--bg-solid-4);
    border-radius: 10px;
    gap: 0.7rem;
  }

  .card__header {
    display: flex;
    flex-direction: row;
    gap: 0.7rem;
    width: 100%;
    align-items: center;
  }

  .card__header__profile-pic {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    border: 1.5px solid var(--primary);
  }

  .card__header__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .card__header__info__top {
    justify-content: space-between;
  }

  .card__header__info__top__name {
    font-size: var(--semi-medium-font-size);
    font-weight: var(--medium-font-weight);
  }

  .card__header__reaction {
    gap: 0.5rem;
    border-radius: 6.8px;
    opacity: 70%;
    max-width: fit-content;
  }

  .card__header__reaction__val {
    gap: 0.4rem;
  }

  .card__header__reaction__vertical-line {
    border-left: 1px solid #ffffff45;
    height: 21px;
  }

  .card__header__info__bottom {
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .card__header__info__bottom__username {
    padding: 0.2rem 0.5rem;
    background: #113232;
    border-radius: 5px;
    color: var(--primary);
  }

  .card__header__info__bottom__anon-comment {
    background: var(--bg-solid-3);
    border-radius: 50%;
    padding: 0.25rem;
  }

  .card__header__info__bottom__time {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__body {
    overflow-wrap: anywhere;
    overflow: hidden;
    font-size: var(--semi-medium-font-size);
  }

  .add-post {
    position: fixed;
    bottom: 0;
    padding: 4rem 1.5rem 1.5rem 1.5rem;
    width: 100%;
    background: linear-gradient(360deg, #0d171d 39.31%, #22454b12 82%);
  }

  .add-post button {
    width: 94%;
  }
</style>
