<script lang="ts">
  import getPictureURLUtil from "../../utils/get-picture-URL.util";
  import {
    copy,
    cross,
    login,
    modeComment,
    moreVert,
    redirect,
    share,
    thumbDown,
    thumbDownAlt,
    thumbUp,
    thumbUpAlt
  } from "../../utils/app-icon.util";
  import {
    AppReactionType,
    AttributeKeyType
  } from "../../config/app-constants.config";
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import Autolinker from "autolinker";
  import DOMPurify from "dompurify";
  import getLinkPreviewHtmlHelperUtil from "../../utils/helper/get-link-preview-html.helper.util";
  import Icon from "$lib/Icon.svelte";
  import { page } from "$app/stores";
  import { isLoggedInUserStore } from "../../stores/user/is-logged-in.user.store";
  import addReactionLensService from "../../services/lens/add-reaction.lens.service";
  import removeReactionLensService from "../../services/lens/remove-reaction.lens.service";
  import getReactionBasedOnLoginStatusHelperUtil from "../../utils/helper/get-reaction-based-on-login-status.helper.util";
  import type { ReactionDetailsModel } from "../../models/reactionDetails.model";
  import getCommentByProfileIdPublicationUtil from "../../utils/publications/get-comment-by-profileId.publication.util";
  import { LimitType } from "../../gql/graphql";
  import MediaQuery from "$lib/MediaQuery.svelte";
  import getImageCommentLensService from "../../services/lens/get-image-comment.lens.service";
  import Login from "../Login.svelte";
  import { getNotificationsContext } from "svelte-notifications";
  import { reloadAPublication } from "../../stores/reload-publication.store";
  import { onMount } from "svelte";
  import type { CommentsPublicationLensModel } from "../../models/lens/comments-publication.lens.model";
  import NoWebPageImg from "$lib/assets/NoWebPageImg.png";

  type PostMoreStatus = {
    [key: string]: boolean;
  };

  const { addNotification } = getNotificationsContext();
  let reactionDetails: ReactionDetailsModel = {};
  let promiseOfGetComments = getCommentByProfileIdPublicationUtil(
    $page.data.profileId,
    LimitType.Fifty,
    true
  );
  let showLoginModal = false;
  let isPostMoreOpen: PostMoreStatus = {};

  onMount(() => {
    reloadAPublication.subscribe(() => {
      promiseOfGetComments = getCommentByProfileIdPublicationUtil(
        $page.data.profileId,
        LimitType.Fifty,
        true
      );
    });
  });

  const openClosePostMore = (event: Event, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    isPostMoreOpen[id] = !isPostMoreOpen[id];
  };

  const callAddReaction = async (
    event: Event,
    pubID: string,
    reaction: AppReactionType
  ) => {
    event.preventDefault();
    event.stopPropagation();

    let isUserLoggedIn = false;
    const unsub = isLoggedInUserStore.subscribe((status) => {
      isUserLoggedIn = status;
    });
    unsub();

    if (!isUserLoggedIn) {
      openLoginNotification();
    } else {
      try {
        if (reactionDetails[pubID]["reaction"] !== null) {
          await callRemoveReaction(
            event,
            pubID,
            reactionDetails[pubID]["reaction"]
          );
        }

        const localUpVoteCount =
          reaction === AppReactionType.UpVote
            ? reactionDetails[pubID]["upVoteCount"] + 1
            : reactionDetails[pubID]["upVoteCount"];
        const localDownVoteCount =
          reaction === AppReactionType.DownVote
            ? reactionDetails[pubID]["downVoteCount"] + 1
            : reactionDetails[pubID]["downVoteCount"];
        reactionDetails[pubID] = {
          reaction: reaction,
          upVoteCount: localUpVoteCount,
          downVoteCount: localDownVoteCount
        };

        await addReactionLensService(pubID, reaction);
      } catch (error) {
        console.log("Error while reacting", error);

        addNotification({
          position: "top-right",
          heading: "Error while reacting",
          description: "Please try again .",
          type: cross,
          removeAfter: 4000
        });
      }
    }
  };

  const callRemoveReaction = async (
    event: Event,
    pubID: string,
    reaction: AppReactionType
  ) => {
    event.preventDefault();
    event.stopPropagation();

    let isUserLoggedIn = false;
    const unsub = isLoggedInUserStore.subscribe((status) => {
      isUserLoggedIn = status;
    });
    unsub();

    if (!isUserLoggedIn) {
      openLoginNotification();
    } else {
      try {
        const localUpVoteCount =
          reaction === AppReactionType.UpVote
            ? reactionDetails[pubID]["upVoteCount"] - 1
            : reactionDetails[pubID]["upVoteCount"];
        const localDownVoteCount =
          reaction === AppReactionType.DownVote
            ? reactionDetails[pubID]["downVoteCount"] - 1
            : reactionDetails[pubID]["downVoteCount"];
        reactionDetails[pubID] = {
          reaction: AppReactionType.NoReaction,
          upVoteCount: localUpVoteCount,
          downVoteCount: localDownVoteCount
        };

        await removeReactionLensService(pubID, reaction);
      } catch (error) {
        console.log("Error while reacting", error);

        addNotification({
          position: "top-right",
          heading: "Error removing",
          description: "Error while removing your reaction. Please try again .",
          type: cross,
          removeAfter: 4000
        });
      }
    }
  };

  const openLoginNotification = () => {
    addNotification({
      position: "top-right",
      heading: "Please Login",
      description:
        'Kindly log-in to react to this post. Simply click on "Login" button to proceed with your login.',
      type: login,
      removeAfter: 10000,
      ctaBtnName: "Login",
      ctaFunction: () => {
        showLoginModal = true;
      }
    });
  };

  const updateReactionDetails = (post: CommentsPublicationLensModel) => {
    const pubID = post?.id;
    const passedUpVoteStatus = post?.operations?.hasUpVoted;
    const passedDownVoteStatus = post?.operations?.hasDownVoted;
    const upVoteCount = post?.stats?.upvotes;
    const downVoteCount = post?.stats?.downvotes;

    reactionDetails[pubID] = {
      reaction: getReactionBasedOnLoginStatusHelperUtil(
        passedUpVoteStatus,
        passedDownVoteStatus
      ),
      upVoteCount: upVoteCount,
      downVoteCount: downVoteCount
    };
    return "";
  };

  const sharePost = (event: Event, mainPostId: string, postId: string) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(
      window.location.origin + "/posts/" + mainPostId + "/" + postId
    );
    addNotification({
      position: "top-right",
      heading: "Copied to clipboard",
      description: "The link to this post has been copied to your clipboard.",
      type: copy,
      removeAfter: 5000
    });
  };

  const getMainPostUrl = (post: CommentsPublicationLensModel) => {
    const url = post?.metadata?.attributes.find(
      (item) => item.key === AttributeKeyType.mainPostUrl
    )?.value;

    if (url === "empty") return undefined;

    return url;
  };
</script>

<!----------------------------- HTML ----------------------------->
<MediaQuery query="(max-width: 1024px)" let:matches>
  <section>
    {#await promiseOfGetComments}
      <div class="card">
        <div class="card__left card__left-loader" />
        <div class="card__right card__right-loader" />
      </div>
      <div class="card">
        <div class="card__left card__left-loader" />
        <div class="card__right card__right-loader" />
      </div>
    {:then postData}
      {#if postData.length > 0}
        {#each postData as post}
          <a href={`/posts/${post?.root?.id}/${post?.id}`} class="card">
            {#await getImageCommentLensService(post?.root?.id)}
              <div class="card__left card__left-loader" />
            {:then imageUrl}
              <div class="card__left">
                <div
                  class="card__left__image"
                  style="background-image: url({imageUrl
                    ? imageUrl
                    : NoWebPageImg})"
                />
              </div>
            {:catch _error}
              <div class="card__left">
                <div
                  class="card__left__image"
                  style="background-image: url({NoWebPageImg})"
                />
              </div>
            {/await}
            <div class="card__right">
              <div class="card__right__content">
                <div class="card__right__content__pic">
                  <img
                    src={getPictureURLUtil(
                      post?.by?.metadata?.picture?.optimized?.uri,
                      post?.by?.ownedBy?.address
                    )}
                    alt="avatar"
                  />
                </div>
                <div class="card__right__content__body">
                  <div class="CenterRowFlex card__right__content__body__top">
                    <div
                      class="CenterRowFlex card__right__content__body__top__left"
                    >
                      {#if post?.by?.metadata?.displayName !== undefined && post?.by?.metadata?.displayName !== null}
                        <div
                          class="card__right__content__body__top__left__name"
                        >
                          {#if matches}
                            {post?.by?.metadata?.displayName.substring(0, 5)}
                            {#if post?.by?.metadata?.displayName.length > 5}..{/if}
                          {:else}
                            {post?.by?.metadata?.displayName.substring(0, 15)}
                            {#if post?.by?.metadata?.displayName.length > 15}..{/if}
                          {/if}
                        </div>
                        <div
                          class="card__right__content__body__top__left__dot"
                        />
                      {/if}

                      <div
                        class="card__right__content__body__top__left__handle"
                      >
                        {post?.by?.handle?.fullHandle.substring(5)}
                      </div>
                      <div class="card__right__content__body__top__left__dot" />
                      <div class="card__right__content__body__top__left__date">
                        {getFormattedDateHelperUtil(post?.createdAt)}
                      </div>
                    </div>
                    <div
                      class="CenterRowFlex card__right__content__body__top__right"
                    >
                      <div class="card__right__content__body__top__right__more">
                        <button
                          on:click={(event) =>
                            openClosePostMore(event, post?.id)}
                        >
                          <Icon d={moreVert} size="1.65em" />
                        </button>
                        {#if isPostMoreOpen[post?.id]}
                          <div
                            class="CenterColumnFlex card__right__content__body__more"
                          >
                            <button
                              on:click={(event) =>
                                sharePost(event, post?.root?.id, post?.id)}
                              class="CenterRowFlex card__right__content__body__more__share"
                            >
                              <span
                                class="CenterRowFlex card__right__content__body__more__share__icon"
                              >
                                <Icon d={share} size="1.2em" />
                              </span>
                              Share
                            </button>
                          </div>
                        {/if}
                      </div>
                    </div>
                  </div>

                  <div class="card__right__content__body__content">
                    <!--eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html Autolinker.link(
                      DOMPurify.sanitize(post?.metadata?.content),
                      {
                        className: "links"
                      }
                    )}
                    <blockquote
                      class="twitter-tweet"
                      data-conversation="none"
                      data-theme="dark"
                    >
                      <a
                        href={`https://twitter.com/username/status/${getLinkPreviewHtmlHelperUtil(
                          DOMPurify.sanitize(post?.metadata?.content)
                        )}`}>&nbsp;</a
                      >
                    </blockquote>
                    <script
                      async
                      src="https://platform.twitter.com/widgets.js"
                      charset="utf-8"
                    ></script>
                  </div>
                </div>
              </div>
              <div class="CenterRowFlex card__footer">
                <div class="CenterRowFlex card__footer__left">
                  <div class="CenterRowFlex card__footer__left__reaction">
                    {updateReactionDetails(post)}
                    {#if reactionDetails[post?.id]["reaction"] === AppReactionType.UpVote}
                      <button
                        on:click={(event) =>
                          callRemoveReaction(
                            event,
                            post?.id,
                            AppReactionType.UpVote
                          )}
                        class="CenterRowFlex card__footer__left__reaction__val"
                      >
                        <Icon d={thumbUp} />
                        {reactionDetails[post?.id]["upVoteCount"]}
                      </button>
                    {:else}
                      <button
                        on:click={(event) =>
                          callAddReaction(
                            event,
                            post?.id,
                            AppReactionType.UpVote
                          )}
                        class="CenterRowFlex card__footer__left__reaction__val"
                      >
                        <Icon d={thumbUpAlt} />
                        {reactionDetails[post?.id]["upVoteCount"]}
                      </button>
                    {/if}
                    <div class="card__footer__left__reaction__vertical-line" />
                    {#if reactionDetails[post?.id]["reaction"] === AppReactionType.DownVote}
                      <button
                        on:click={(event) =>
                          callRemoveReaction(
                            event,
                            post?.id,
                            AppReactionType.DownVote
                          )}
                        class="CenterRowFlex card__footer__left__reaction__val"
                      >
                        <Icon d={thumbDown} />
                        {reactionDetails[post?.id]["downVoteCount"]}
                      </button>
                    {:else}
                      <button
                        on:click={(event) =>
                          callAddReaction(
                            event,
                            post?.id,
                            AppReactionType.DownVote
                          )}
                        class="CenterRowFlex card__footer__left__reaction__val"
                      >
                        <Icon d={thumbDownAlt} />
                        {reactionDetails[post?.id]["downVoteCount"]}
                      </button>
                    {/if}
                  </div>
                  <div class="CenterRowFlex card__footer__left__posts-count">
                    <Icon d={modeComment} />
                    {post?.stats?.comments}
                  </div>
                </div>
                <div class="card__footer__right">
                  {#if getMainPostUrl(post)}
                    <a
                      href={getMainPostUrl(post)}
                      target="_blank"
                      class="CenterRowFlex card__footer__right__url"
                    >
                      <Icon d={redirect} />
                      {getMainPostUrl(post)?.substring(0, 30)}...
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </a>
        {/each}
      {:else}
        <div class="msg">This profile has no LensView posts yet!</div>
      {/if}
    {:catch _error}
      <div class="msg">Something went wrong!</div>
    {/await}
  </section>
</MediaQuery>

<Login bind:showLoginModal />

<!----------------------------------------------------------------->

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-solid-1);
    backdrop-filter: blur(10px);
    padding: 1rem 1.5rem;
    border-radius: 10px;
    margin: 2rem;
  }

  .msg {
    font-size: var(--medium-font-size);
    color: var(--text-accent);
    display: flex;
    justify-content: center;
    padding: 5rem 0;
  }

  .card {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    border-bottom: 1.5px solid #3f494e;
    padding: 1.5rem 0;
  }

  .card__left {
    width: 30%;
  }

  .card__left-loader {
    height: 15.5rem;
    border-radius: 10px;
  }

  .card__left__image {
    width: 100%;
    height: 100%;
    max-height: 50rem;
    background-color: #000;
    overflow: hidden;
    padding-bottom: 50%; /* Adjust this value to control the aspect ratio */
    background-size: cover;
    border-radius: 10.8px;
    transition: background-position 1s ease;
  }

  .card__left__image:hover {
    animation: scrollBackground 9s linear infinite;
  }

  @keyframes scrollBackground {
    0% {
      background-position: top center;
    }
    100% {
      background-position: bottom center;
    }
  }

  .card__right {
    width: 70%;
  }

  .card__right-loader {
    height: 15.5rem;
    border-radius: 10px;
  }

  .card__right__content {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
    background: #1e4748;
    border-radius: 10px 10px 0 0;
    width: 100%;
    min-height: 10rem;
  }

  .card__right__content__pic {
    margin-bottom: auto;
  }

  .card__right__content__pic img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid #32f9ff;
  }

  .card__right__content__body {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }

  .card__right__content__body__top {
    justify-content: space-between;
  }

  .card__right__content__body__top__left {
    gap: 0.6rem;
  }

  .card__right__content__body__top__left__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
  }

  .card__right__content__body__top__left__name {
    font-weight: var(--medium-font-weight);
  }

  .card__right__content__body__top__left__handle {
    padding: 0.2rem 0.5rem;
    background: var(--bg-solid-2);
    border-radius: 5px;
    color: var(--primary);
  }

  .card__right__content__body__top__left__date {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__right__content__body__top__right {
    gap: 0.5rem;
  }

  .card__right__content__body__top__right__more {
    position: relative;
  }

  .card__right__content__body__more {
    align-items: flex-start;
    width: 10rem;
    background: #185359;
    padding: 0.45rem;
    border-radius: 5.8px;
    margin-left: auto;
    margin-right: 0.5rem;
    position: absolute;
    right: 0;
    margin-top: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
  }

  .card__right__content__body__more__share {
    gap: 0.5rem;
  }

  .card__right__content__body__more__share__icon {
    background: #2c4042;
    padding: 0.5rem;
    border-radius: 50%;
  }

  .card__right__content__body__content {
    overflow-wrap: anywhere;
    overflow: hidden;
    max-width: 75rem;
  }

  .card__footer {
    padding: 1rem;
    background: var(--bg-solid-2);
    border-radius: 0 0 10px 10px;
    justify-content: space-between;
  }

  .card__footer__left {
    gap: 0.5rem;
  }

  .card__footer__left__reaction {
    background: var(--bg-solid-3);
    border-radius: 6.8px;
    opacity: 70%;
  }

  .card__footer__left__reaction__val {
    padding: 0.5rem 0.7rem;
    gap: 0.4rem;
  }

  .card__footer__left__reaction__vertical-line {
    border-left: 2px solid #ffffff45;
    height: 21px;
  }

  .card__footer__left__posts-count {
    background: var(--bg-solid-3);
    padding: 0.5rem 0.7rem;
    gap: 0.5rem;
    border-radius: 5.8px;
    opacity: 85%;
  }

  .card__footer__right__url {
    gap: 0.5rem;
  }

  .card__left-loader,
  .card__right-loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }

  @media only screen and (max-width: 1024px) {
    section {
      background-color: transparent;
      padding: 0;
      margin: 2rem;
    }

    .card {
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1.5px solid #3f494e;
      padding: 1.5rem 0;
    }

    .card__left {
      width: 100%;
    }

    .card__left-loader {
      height: 20rem;
    }

    .card__left__image {
      height: 20rem;
    }

    .card__right {
      width: 100%;
    }

    .card__right__content {
      min-height: unset;
    }
  }
</style>
