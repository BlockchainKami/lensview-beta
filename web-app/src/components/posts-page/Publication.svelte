<script lang="ts">
  import {
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
  import { getNotificationsContext } from "svelte-notifications";
  import DOMPurify from "dompurify";
  import { Tooltip } from "@svelte-plugins/tooltips";
  import { onMount } from "svelte";
  import { reloadAPublication } from "../../stores/reload-publication.store";
  import Login from "../Login.svelte";
  import { totalCommentsStore } from "../../stores/total-comments.store";
  import getCommentBasedOnParameterPublicationUtil from "../../utils/publications/get-comment-based-on-parameter.publication.util";
  import { LimitType } from "../../gql/graphql";
  import {
    AppReactionType,
    CommentFilterType
  } from "../../config/app-constants.config";
  import getReactionBasedOnLoginStatusHelperUtil from "../../utils/helper/get-reaction-based-on-login-status.helper.util";
  import Autolinker from "autolinker";
  import getLinkPreviewHtmlHelperUtil from "../../utils/helper/get-link-preview-html.helper.util";
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import addReactionLensService from "../../services/lens/add-reaction.lens.service";
  import removeReactionLensService from "../../services/lens/remove-reaction.lens.service";
  import getPictureURLUtil from "../../utils/get-picture-URL.util";
  import { isLoggedInUserStore } from "../../stores/user/is-logged-in.user.store";
  import type { CommentsPublicationLensModel } from "../../models/lens/comments-publication.lens.model";
  const { VITE_APP_LENS_ID } = import.meta.env;

  const { addNotification } = getNotificationsContext();
  let postPubId = $page.data.postPubId;
  let isPostMoreOpen = false;
  let showLoginModal = false;
  let reaction = AppReactionType.NoReaction;
  let upVoteCount = 0;
  let downVoteCount = 0;

  let promiseOfGetComment = getCommentBasedOnParameterPublicationUtil(
    postPubId,
    LimitType.Ten,
    CommentFilterType.CommentsById
  );

  $: if (postPubId !== $page.data.postPubId) {
    postPubId = $page.data.postPubId;
    if (postPubId !== undefined) {
      promiseOfGetComment = getCommentBasedOnParameterPublicationUtil(
        postPubId,
        LimitType.Ten,
        CommentFilterType.CommentsById
      );
    }
  }

  onMount(() => {
    reloadAPublication.subscribe((val) => {
      console.log("Reloaded a publication" + val);
      promiseOfGetComment = getCommentBasedOnParameterPublicationUtil(
        postPubId,
        LimitType.Ten,
        CommentFilterType.CommentsById
      );
    });
  });

  const getTotalComments = (fetchedTotalComments: number) => {
    totalCommentsStore.setTotalComments(fetchedTotalComments);
    return fetchedTotalComments;
  };

  const sharePost = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    navigator.clipboard.writeText(
      window.location.origin +
        "/posts/" +
        $page.data.postPubId +
        "/" +
        $page.data.postPubId
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
    passedReaction: AppReactionType
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
        if (reaction !== AppReactionType.NoReaction) {
          await callRemoveReaction(event, reaction);
        }

        reaction = passedReaction;
        upVoteCount =
          passedReaction === AppReactionType.UpVote
            ? upVoteCount + 1
            : upVoteCount;
        downVoteCount =
          passedReaction === AppReactionType.DownVote
            ? downVoteCount + 1
            : downVoteCount;

        await addReactionLensService(postPubId, passedReaction);
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
    passedReaction: AppReactionType
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
        reaction = AppReactionType.NoReaction;
        upVoteCount =
          passedReaction === AppReactionType.UpVote
            ? upVoteCount - 1
            : upVoteCount;
        downVoteCount =
          passedReaction === AppReactionType.DownVote
            ? downVoteCount - 1
            : downVoteCount;

        await removeReactionLensService(postPubId, passedReaction);
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
    passedUpVoteStatus: boolean,
    passedDownVoteStatus: boolean,
    passedUpVoteCount: number,
    passedDownVoteCount: number
  ) => {
    reaction = getReactionBasedOnLoginStatusHelperUtil(
      passedUpVoteStatus,
      passedDownVoteStatus
    );
    upVoteCount = passedUpVoteCount;
    downVoteCount = passedDownVoteCount;
    return "";
  };

  const getHandle = (comment: CommentsPublicationLensModel) => {
    return comment.by?.handle?.fullHandle.substring(5);
  };
</script>

<!----------------------------- HTML ----------------------------->
<section>
  {#await promiseOfGetComment}
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
  {:then comments}
    <div class="comment">
      <a href={`/profile/${getHandle(comments[0])}`} class="comment__pic">
        <img
          src={getPictureURLUtil(
            comments[0]?.by?.metadata?.picture?.optimized?.uri,
            comments[0]?.by?.ownedBy?.address
          )}
          alt="avatar"
        />
      </a>
      <div class="comment__body">
        <div class="CenterRowFlex comment__body__top">
          <div class="CenterRowFlex comment__body__top__left">
            {#if comments[0]?.by?.metadata?.displayName !== undefined}
              <a
                href={`/profile/${getHandle(comments[0])}`}
                class="comment__body__top__left__name"
              >
                {comments[0]?.by?.metadata?.displayName}
              </a>
              <div class="comment__body__top__left__dot" />
            {/if}
            <a
              href={`/profile/${getHandle(comments[0])}`}
              class="comment__body__top__left__handle"
            >
              {getHandle(comments[0])}
            </a>
            {#if comments[0]?.by?.id === VITE_APP_LENS_ID}
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
            <button
              on:click={(event) => sharePost(event)}
              class="CenterRowFlex comment__body__top__right__share"
            >
              <Icon d={share} />
            </button>
            <div class="CenterRowFlex comment__body__top__right__reaction">
              {updateReactionDetails(
                comments[0]?.operations?.hasUpVoted,
                comments[0]?.operations?.hasDownVoted,
                comments[0]?.stats?.upvotes,
                comments[0]?.stats?.downvotes
              )}
              {#if reaction === AppReactionType.UpVote}
                <button
                  on:click={(event) =>
                    callRemoveReaction(event, AppReactionType.UpVote)}
                  class="CenterRowFlex comment__body__top__right__reaction__val"
                >
                  <Icon d={thumbUp} />
                  {upVoteCount}
                </button>
              {:else}
                <button
                  on:click={(event) =>
                    callAddReaction(event, AppReactionType.UpVote)}
                  class="CenterRowFlex comment__body__top__right__reaction__val"
                >
                  <Icon d={thumbUpAlt} />
                  {upVoteCount}
                </button>
              {/if}
              <div class="comment__body__top__right__reaction__vertical-line" />
              {#if reaction === AppReactionType.DownVote}
                <button
                  on:click={(event) =>
                    callRemoveReaction(event, AppReactionType.DownVote)}
                  class="CenterRowFlex comment__body__top__right__reaction__val"
                >
                  <Icon d={thumbDown} />
                  {downVoteCount}
                </button>
              {:else}
                <button
                  on:click={(event) =>
                    callAddReaction(event, AppReactionType.DownVote)}
                  class="CenterRowFlex comment__body__top__right__reaction__val"
                >
                  <Icon d={thumbDownAlt} />
                  {downVoteCount}
                </button>
              {/if}
            </div>
            <div class="CenterRowFlex comment__body__top__right__posts-count">
              <Icon d={modeComment} />
              {getTotalComments(comments[0]?.stats?.comments)}
            </div>
            <div class="comment__body__top__right__more">
              <button>
                <Icon d={moreVert} size="1.65em" />
              </button>
              {#if isPostMoreOpen}
                <div class="CenterColumnFlex comment__body__more">
                  <div class="CenterRowFlex comment__body__more__share">
                    <div class="CenterRowFlex comment__body__more__share__icon">
                      <Icon d={share} size="1.2em" />
                    </div>
                    Share
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
        <div class="comment__body__time">
          {getFormattedDateHelperUtil(comments[0]?.createdAt)}
        </div>
        <div class="comment__body__content">
          <!--eslint-disable-next-line svelte/no-at-html-tags -->
          {@html Autolinker.link(
            DOMPurify.sanitize(comments[0]?.metadata?.content),
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
                DOMPurify.sanitize(comments[0]?.metadata?.content)
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
  {/await}
</section>

<Login bind:showLoginModal />

<!----------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
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

  .comment__body__top__right__share {
    border-radius: 50%;
    background: var(--bg-solid-2);
    padding: 0.5rem;
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
