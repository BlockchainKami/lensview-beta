<script lang="ts">
  import {
    ai,
    copy,
    cross,
    login,
    modeComment,
    moreVert,
    person,
    share,
    thumbDown,
    thumbDownAlt,
    thumbUp,
    thumbUpAlt
  } from "../../utils/app-icon.util";
  import Icon from "$lib/Icon.svelte";
  import { page } from "$app/stores";
  import { reloadCommentOfAPublication } from "../../stores/reload-publication.store";
  import { onMount } from "svelte";
  import DOMPurify from "dompurify";
  import { getNotificationsContext } from "svelte-notifications";
  import { Tooltip } from "@svelte-plugins/tooltips";
  import Login from "../Login.svelte";
  import type { ReactionDetailsModel } from "../../models/reactionDetails.model";
  import Autolinker from "autolinker";
  import { metaTagsDescription } from "../../services/metaTags";
  import getCommentBasedOnParameterPublicationUtil from "../../utils/publications/get-comment-based-on-parameter.publication.util";
  import { LimitType } from "../../gql/graphql";
  import {
    AppReactionType,
    CommentFilterType
  } from "../../config/app-constants.config";
  import getReactionBasedOnLoginStatusHelperUtil from "../../utils/helper/get-reaction-based-on-login-status.helper.util";
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import getPictureURLUtil from "../../utils/get-picture-URL.util";
  import getLinkPreviewHtmlHelperUtil from "../../utils/helper/get-link-preview-html.helper.util";
  import { totalPostsStore } from "../../stores/total-posts.store";
  import { totalCommentsStore } from "../../stores/total-comments.store";
  import { isLoggedInUserStore } from "../../stores/user/is-logged-in.user.store";
  import addReactionLensService from "../../services/lens/add-reaction.lens.service";
  import removeReactionLensService from "../../services/lens/remove-reaction.lens.service";
  import MediaQuery from "$lib/MediaQuery.svelte";
  import type { CommentsPublicationLensModel } from "../../models/lens/comments-publication.lens.model";
  import SummarizePublications from "./SummarizePublications.svelte";
  import { TotalImagePostsStore } from "../../stores/total-image-posts.store";
  const { VITE_APP_LENS_ID } = import.meta.env;
  const { VITE_IMAGE_PUB } = import.meta.env;

  type CommentMoreStatus = {
    [key: string]: boolean;
  };

  const { addNotification } = getNotificationsContext();
  let commentPubId = $page.data.commentPubId;
  let isCommentMoreOpen: CommentMoreStatus = {};
  let selectedFilterType = CommentFilterType.LatestComments;
  let showLoginModal = false;
  let reactionDetails: ReactionDetailsModel = {};
  let isSummaryOpen = false;
  let totalImagePostCount = 0;

  let promiseOfGetComments = getCommentBasedOnParameterPublicationUtil(
    commentPubId,
    LimitType.Fifty
  );

  const updatedpromiseOfGetComments = () => {
    resetTotalImagePosts();
    promiseOfGetComments = getCommentBasedOnParameterPublicationUtil(
      commentPubId,
      LimitType.Fifty,
      selectedFilterType
    );
  };

  $: if (commentPubId !== $page.data.commentPubId) {
    resetTotalImagePosts();
    commentPubId = $page.data.commentPubId;
    promiseOfGetComments = getCommentBasedOnParameterPublicationUtil(
      commentPubId,
      LimitType.Fifty,
      selectedFilterType
    );
    console.log("Changed commentPubId : ", $page.data.commentPubId);
  }

  onMount(() => {
    console.log("On Mount called for commentsOfPublication");
    resetTotalImagePosts();
    reloadCommentOfAPublication.subscribe((val) => {
      console.log("Reloaded comment of a publication" + val);
      promiseOfGetComments = getCommentBasedOnParameterPublicationUtil(
        commentPubId,
        LimitType.Fifty,
        selectedFilterType
      );
    });
  });

  const openCloseCommentMore = (event: Event, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    isCommentMoreOpen[id] = !isCommentMoreOpen[id];
  };

  const sharePost = (event: Event, id: string) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(
      window.location.origin + "/posts/" + $page.data.mainPostPubId + "/" + id
    );
    addNotification({
      position: "top-right",
      heading: "Copied to clipboard",
      description: "The link to this post has been copied to your clipboard.",
      type: copy,
      removeAfter: 5000
    });
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

  const updateReactionDetails = (
    pubID: string,
    passedUpVoteStatus: boolean,
    passedDownVoteStatus: boolean,
    upVoteCount: number,
    downVoteCount: number
  ) => {
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

  const updateMetaTagsDescription = (description: string) => {
    metaTagsDescription.setMetaTagsDescription(description);
    return "";
  };

  const getHandle = (comment: CommentsPublicationLensModel) => {
    return comment.by?.handle?.fullHandle.substring(5);
  };

  const updateTotalImagePosts = () => {
    totalImagePostCount++;
    TotalImagePostsStore.setTotalImagePosts(totalImagePostCount);
    return "";
  };

  const resetTotalImagePosts = () => {
    isSummaryOpen = false;
    totalImagePostCount = 0;
    TotalImagePostsStore.setTotalImagePosts(0);
  };
</script>

<!----------------------------- HTML ----------------------------->
<MediaQuery query="(max-width: 1024px)" let:matches>
  <section>
    <div class="CenterRowFlex filter">
      <div class="filter__label">Sorted By:</div>
      <div class="filter__type">
        <select
          bind:value={selectedFilterType}
          on:change={updatedpromiseOfGetComments}
        >
          <option value={CommentFilterType.MostLikedComments}>Most liked</option
          >
          <option value={CommentFilterType.LatestComments}>Latest</option>
        </select>
      </div>
      <hr class="filter__line" />
      {#if $page.data.postPubId === undefined}
        <button
          on:click={() => {
            isSummaryOpen = true;
          }}
          disabled={isSummaryOpen ||
            $totalPostsStore - $TotalImagePostsStore === 0}
          class="CenterRowFlex filter__comment-count btn-alt"
        >
          <span class="CenterRowFlex">
            <Icon d={ai} size="1.7em" viewBox="-2 -2 24 24" />
          </span>
          Summarize
          {$totalPostsStore - $TotalImagePostsStore} Posts
        </button>
      {:else}
        <div class="filter__comment-count">
          {$totalCommentsStore} &nbsp;Comment(s)
        </div>
      {/if}
    </div>
    <div class="CenterColumnFlex body">
      {#if isSummaryOpen}
        <SummarizePublications mainPubId={commentPubId} bind:isSummaryOpen />
      {/if}
      {#await promiseOfGetComments}
        <div class="comment">
          <div class="comment__pic__loader" />
          <div class="comment__body">
            <div class="CenterRowFlex comment__body__top">
              <div class="CenterRowFlex comment__body__top__left__loader" />
              <div class="CenterRowFlex comment__body__top__right__loader" />
            </div>
            <div class="comment__body__content__loader" />
          </div>
        </div>
        <div class="comment">
          <div class="comment__pic__loader" />
          <div class="comment__body">
            <div class="CenterRowFlex comment__body__top">
              <div class="CenterRowFlex comment__body__top__left__loader" />
              <div class="CenterRowFlex comment__body__top__right__loader" />
            </div>
            <div class="comment__body__content__loader" />
          </div>
        </div>
        <div class="comment">
          <div class="comment__pic__loader" />
          <div class="comment__body">
            <div class="CenterRowFlex comment__body__top">
              <div class="CenterRowFlex comment__body__top__left__loader" />
              <div class="CenterRowFlex comment__body__top__right__loader" />
            </div>
            <div class="comment__body__content__loader" />
          </div>
        </div>
      {:then commentsData}
        {#each commentsData as comment, index}
          {#if !comment?.metadata?.tags.includes(VITE_IMAGE_PUB)}
            <a
              href={`/posts/${$page.data.mainPostPubId}/${comment?.id}`}
              class="comment"
            >
              <a href={`/profile/${getHandle(comment)}`} class="comment__pic">
                <img
                  src={getPictureURLUtil(
                    comment?.by?.metadata?.picture?.optimized?.uri,
                    comment?.by?.ownedBy?.address
                  )}
                  alt="avatar"
                />
              </a>
              <div class="comment__body">
                <div class="CenterRowFlex comment__body__top">
                  <div class="CenterRowFlex comment__body__top__left">
                    {#if comment?.by?.metadata?.displayName !== undefined && comment?.by?.metadata?.displayName !== null}
                      <a
                        href={`/profile/${getHandle(comment)}`}
                        class="comment__body__top__left__name"
                      >
                        {#if matches}
                          {comment?.by?.metadata?.displayName.substring(0, 5)}
                          {#if comment?.by?.metadata?.displayName.length > 5}..{/if}
                        {:else}
                          {comment?.by?.metadata?.displayName.substring(0, 15)}
                          {#if comment?.by?.metadata?.displayName.length > 15}..{/if}
                        {/if}
                      </a>
                      <div class="comment__body__top__left__dot" />
                    {/if}
                    <a
                      href={`/profile/${getHandle(comment)}`}
                      class="comment__body__top__left__handle"
                    >
                      {getHandle(comment)}
                    </a>
                    {#if comment?.by?.id === VITE_APP_LENS_ID}
                      <Tooltip
                        content="This post was made by an anonymous user!"
                        position="right"
                        autoPosition
                        align="left"
                        theme="custom-tooltip"
                        maxWidth="150"
                        animation="slide"
                      >
                        <span
                          class="CenterRowFlex comment__body__top__left__anon-comment"
                        >
                          <Icon d={person} size="1.05em" />
                        </span>
                      </Tooltip>
                    {/if}
                  </div>
                  <div class="CenterRowFlex comment__body__top__right">
                    <div
                      class="CenterRowFlex comment__body__top__right__reaction"
                    >
                      {updateReactionDetails(
                        comment?.id,
                        comment?.operations?.hasUpVoted,
                        comment?.operations?.hasDownVoted,
                        comment?.stats?.upvotes,
                        comment?.stats?.downvotes
                      )}
                      {#if reactionDetails[comment?.id]["reaction"] === AppReactionType.UpVote}
                        <button
                          on:click={(event) =>
                            callRemoveReaction(
                              event,
                              comment?.id,
                              AppReactionType.UpVote
                            )}
                          class="CenterRowFlex comment__body__top__right__reaction__val"
                        >
                          <Icon d={thumbUp} />
                          {reactionDetails[comment?.id]["upVoteCount"]}
                        </button>
                      {:else}
                        <button
                          on:click={(event) =>
                            callAddReaction(
                              event,
                              comment?.id,
                              AppReactionType.UpVote
                            )}
                          class="CenterRowFlex comment__body__top__right__reaction__val"
                        >
                          <Icon d={thumbUpAlt} />
                          {reactionDetails[comment?.id]["upVoteCount"]}
                        </button>
                      {/if}
                      <div
                        class="comment__body__top__right__reaction__vertical-line"
                      />
                      {#if reactionDetails[comment?.id]["reaction"] === AppReactionType.DownVote}
                        <button
                          on:click={(event) =>
                            callRemoveReaction(
                              event,
                              comment?.id,
                              AppReactionType.DownVote
                            )}
                          class="CenterRowFlex comment__body__top__right__reaction__val"
                        >
                          <Icon d={thumbDown} />
                          {reactionDetails[comment?.id]["downVoteCount"]}
                        </button>
                      {:else}
                        <button
                          on:click={(event) =>
                            callAddReaction(
                              event,
                              comment?.id,
                              AppReactionType.DownVote
                            )}
                          class="CenterRowFlex comment__body__top__right__reaction__val"
                        >
                          <Icon d={thumbDownAlt} />
                          {reactionDetails[comment?.id]["downVoteCount"]}
                        </button>
                      {/if}
                    </div>
                    <div
                      class="CenterRowFlex comment__body__top__right__posts-count"
                    >
                      <Icon d={modeComment} />
                      {comment?.stats?.comments}
                    </div>
                    <div class="comment__body__top__right__more">
                      <button
                        on:click={(event) =>
                          openCloseCommentMore(event, comment?.id)}
                      >
                        <Icon d={moreVert} size="1.65em" />
                      </button>
                      {#if isCommentMoreOpen[comment?.id]}
                        <div class="CenterColumnFlex comment__body__more">
                          <button
                            on:click={(event) => sharePost(event, comment?.id)}
                            class="CenterRowFlex comment__body__more__share"
                          >
                            <span
                              class="CenterRowFlex comment__body__more__share__icon"
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
                <div class="comment__body__time">
                  {getFormattedDateHelperUtil(comment?.createdAt)}
                </div>
                <div class="comment__body__content">
                  {#if index === 0}
                    {updateMetaTagsDescription(comment?.metadata?.content)}
                  {/if}
                  <!--eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html Autolinker.link(
                    DOMPurify.sanitize(comment?.metadata?.content),
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
                        DOMPurify.sanitize(comment?.metadata?.content)
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
            </a>
          {:else}
            {updateTotalImagePosts()}
          {/if}
        {/each}
      {/await}
    </div>
  </section>
</MediaQuery>

<Login bind:showLoginModal />

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 33rem;
  }

  .filter {
    gap: 1rem;
  }

  .filter__label {
    min-width: fit-content;
  }

  .filter__type {
    padding: 0.5rem;
    background: #0a1217;
    border-radius: 5px;
  }

  .filter__line {
    border: 0.5px solid #3d454a;
    width: 100%;
  }

  .filter__comment-count {
    gap: 0.7rem;
    padding: 0.3em 1.2em;
    margin-left: auto;
    min-width: fit-content;
  }

  .body {
    gap: 1rem;
  }

  .comment {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
    background: #1e4748;
    border-radius: 10px;
    width: 100%;
  }

  .comment__pic {
    margin-bottom: auto;
  }

  .comment__pic__loader {
    height: 4rem;
    width: 4.7rem;
    margin-bottom: auto;
    border-radius: 50%;
  }

  .comment__pic img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid #32f9ff;
  }

  .comment__body {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .comment__body__top {
    justify-content: space-between;
  }

  .comment__body__top__left {
    gap: 0.6rem;
  }

  .comment__body__top__left__loader {
    width: 9rem;
    height: 2rem;
    border-radius: 5px;
  }

  .comment__body__top__left__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #fff;
  }

  .comment__body__top__left__name {
    font-weight: var(--medium-font-weight);
  }

  .comment__body__top__left__handle {
    padding: 0.2rem 0.5rem;
    background: var(--bg-solid-2);
    border-radius: 5px;
    color: var(--primary);
  }

  .comment__body__top__left__anon-comment {
    background: var(--bg-solid-3);
    border-radius: 50%;
    padding: 0.25rem;
  }

  .comment__body__top__right {
    gap: 0.5rem;
  }

  .comment__body__top__right__loader {
    width: 15rem;
    height: 2rem;
    border-radius: 5px;
  }

  .comment__body__top__right__reaction {
    background: var(--bg-solid-2);
    border-radius: 6.8px;
    opacity: 70%;
  }

  .comment__body__top__right__reaction__val {
    padding: 0.5rem 0.7rem;
    gap: 0.4rem;
  }

  .comment__body__top__right__reaction__vertical-line {
    border-left: 2px solid #ffffff45;
    height: 21px;
  }

  .comment__body__top__right__posts-count {
    background: var(--bg-solid-2);
    padding: 0.5rem 0.7rem;
    gap: 0.5rem;
    border-radius: 5.8px;
    opacity: 85%;
  }

  .comment__body__top__right__more {
    position: relative;
  }

  .comment__body__more {
    align-items: flex-start;
    width: 10rem;
    background: #185359;
    padding: 0.45rem;
    border-radius: 5.8px;
    margin-left: auto;
    margin-right: 0.5rem;
    position: absolute;
    right: 0;
    margin-top: 1rem;
    box-shadow: rgba(0, 0, 0, 0.35) 0 5px 15px;
  }

  .comment__body__more__share {
    width: 100%;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .comment__body__more__share__icon {
    background: #2c4042;
    padding: 0.5rem;
    border-radius: 50%;
  }

  .comment__body__time {
    font-size: var(--small-font-size);
    color: var(--text-accent);
    margin-top: -0.2rem;
    margin-bottom: 0.5rem;
  }

  .comment__body__content {
    overflow-wrap: anywhere;
  }

  .comment__body__content__loader {
    width: 100%;
    height: 5rem;
    border-radius: 10px;
    margin-top: 1rem;
  }

  .comment__body__top__left__loader,
  .comment__body__top__right__loader,
  .comment__body__content__loader,
  .comment__pic__loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }
</style>
