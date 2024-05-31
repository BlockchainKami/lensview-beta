<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import {
    modeComment,
    moreVert,
    person,
    redirect,
    thumbDown,
    thumbUp,
    trendingUp
  } from "../../utils/app-icon.util";
  import DOMPurify from "dompurify";
  import { Tooltip } from "@svelte-plugins/tooltips";
  import MediaQuery from "$lib/MediaQuery.svelte";
  import type { ObserverEventDetails, Options } from "svelte-inview";
  import { inview } from "svelte-inview";
  import getLinkPublicationLensService from "../../services/lens/get-link-publication.lens.service";
  import getImageCommentLensService from "../../services/lens/get-image-comment.lens.service";
  import getCommentBasedOnParameterPublicationUtil from "../../utils/publications/get-comment-based-on-parameter.publication.util";
  import { LimitType } from "../../gql/graphql";
  import { CommentFilterType } from "../../config/app-constants.config";
  import getPictureURLUtil from "../../utils/get-picture-URL.util";
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import getRelatedPostPubIdsAppService from "../../services/app/get-related-post-pub-ids.app.service";
  import { page } from "$app/stores";
  import type { CommentsPublicationLensModel } from "../../models/lens/comments-publication.lens.model";
  const { VITE_APP_LENS_ID } = import.meta.env;

  type KeyStringValBoolean = {
    [key: string]: boolean;
  };

  const options: Options = {
    threshold: 1,
    rootMargin: "-10%"
  };
  let isInView: KeyStringValBoolean = {};

  const handleChange = (
    event: CustomEvent<ObserverEventDetails>,
    id: string
  ) => {
    isInView[id] = event.detail.inView;
  };

  const getHandle = (comment: CommentsPublicationLensModel) => {
    return comment.by?.handle?.fullHandle.substring(5);
  };
</script>

<!----------------------------- HTML ----------------------------->
<MediaQuery query="(max-width: 825px)" let:matches>
  {#if matches}
    <section class="mobile">
      {#await getRelatedPostPubIdsAppService($page.data.userEnteredUrlOrKeywords)}
        <div class="mobile__card">
          <div class="mobile__card__image-loader" />
          <div class="mobile__card__info__loader" />
          <div class="CenterRowFlex mobile__card__post">
            <div class="mobile__card__post__user-pic-loader" />
            <div class="mobile__card__post__info">
              <div
                class="CenterRowFlex mobile__card__post__info__head-loader"
              />
              <div class="mobile__card__post__info__body-loader" />
            </div>
          </div>
        </div>
        <div class="mobile__card">
          <div class="mobile__card__image-loader" />
          <div class="mobile__card__info__loader" />
          <div class="CenterRowFlex mobile__card__post">
            <div class="mobile__card__post__user-pic-loader" />
            <div class="mobile__card__post__info">
              <div
                class="CenterRowFlex mobile__card__post__info__head-loader"
              />
              <div class="mobile__card__post__info__body-loader" />
            </div>
          </div>
        </div>
      {:then result}
        {#if result?.publicationIDs.length !== 0}
          <div class="h3 heading">This is what we found</div>
        {/if}
        <div class="mobile__body">
          {#each result?.publicationIDs as mainPostPubId}
            <a
              href={`/posts/${mainPostPubId}`}
              use:inview={options}
              on:inview_change={(event) => handleChange(event, mainPostPubId)}
              class="mobile__card"
            >
              {#await getLinkPublicationLensService(mainPostPubId)}
                <div class="mobile__card__image-loader" />
                <div class="mobile__card__info__loader" />
                <div class="CenterRowFlex mobile__card__post">
                  <div class="mobile__card__post__user-pic-loader" />
                  <div class="mobile__card__post__info">
                    <div
                      class="CenterRowFlex mobile__card__post__info__head-loader"
                    />
                    <div class="mobile__card__post__info__body-loader" />
                  </div>
                </div>
              {:then mainPostPub}
                {#await getImageCommentLensService(mainPostPub?.id)}
                  <div class="mobile__card__image-loader" />
                {:then imageUrl}
                  <div
                    class="mobile__card__image"
                    class:mobile__card__image__hover-effect={isInView[
                      mainPostPubId
                    ]}
                    style="background-image: url({imageUrl})"
                  />
                {:catch _error}
                  <div
                    class="mobile__card__image"
                    style="background-image: url('https://media.istockphoto.com/id/1392182937/vector/no-image-available-photo-coming-soon.jpg?s=170667a&w=0&k=20&c=HOCGNLwt3LkB92ZlyHAupxbwHY5X2143KDlbA-978dE=')"
                  />
                {/await}
                <div class="CenterRowFlex mobile__card__info">
                  <div class="CenterRowFlex mobile__card__info__reaction">
                    <div
                      class="CenterRowFlex mobile__card__info__reaction__val"
                    >
                      <Icon d={thumbUp} />
                      {mainPostPub?.stats?.upvotes}
                    </div>
                    <div class="mobile__card__info__reaction__vertical-line" />
                    <div
                      class="CenterRowFlex mobile__card__info__reaction__val"
                    >
                      <Icon d={thumbDown} />
                      {mainPostPub?.stats?.downvotes}
                    </div>
                  </div>
                  <div class="CenterRowFlex mobile__card__info__posts-count">
                    <Icon d={modeComment} />
                    {mainPostPub?.stats?.comments}
                  </div>
                  <a
                    href={mainPostPub?.metadata?.sharingLink}
                    target="_blank"
                    class="CenterRowFlex mobile__card__info__link"
                  >
                    <Icon
                      d={redirect}
                    />{mainPostPub?.metadata?.sharingLink.substring(0, 15)}
                    ...
                  </a>
                </div>
                {#await getCommentBasedOnParameterPublicationUtil(mainPostPubId, LimitType.Ten, CommentFilterType.FirstMostRelevantComments)}
                  <div class="CenterRowFlex mobile__card__post">
                    <div class="mobile__card__post__user-pic-loader" />
                    <div class="mobile__card__post__info">
                      <div
                        class="CenterRowFlex mobile__card__post__info__head-loader"
                      />
                      <div class="mobile__card__post__info__body-loader" />
                    </div>
                  </div>
                {:then comments}
                  {#if comments[0]?.by?.handle?.fullHandle === undefined}
                    <div class="CenterRowFlex mobile__card__post">
                      No Top Post
                    </div>
                  {:else}
                    <div class="CenterRowFlex mobile__card__post">
                      <a
                        href={`/profile/${getHandle(comments[0])}`}
                        class="mobile__card__post__user-pic"
                      >
                        <img
                          src={getPictureURLUtil(
                            comments[0]?.by?.metadata?.picture?.optimized?.uri,
                            comments[0]?.by?.ownedBy?.address
                          )}
                          alt="avatar"
                        />
                      </a>
                      <div class="mobile__card__post__info">
                        <div
                          class="CenterRowFlex mobile__card__post__info__head"
                        >
                          <a
                            href={`/profile/${getHandle(comments[0])}`}
                            class="mobile__card__post__info__head__username"
                          >
                            {getHandle(comments[0]).substring(0, 12)}
                            {getHandle(comments[0]).length > 12 ? "..." : ""}
                          </a>
                          {#if comments[0]?.by?.id === VITE_APP_LENS_ID}
                            <Tooltip
                              content="This post was made by an anonymous user!"
                              position="top"
                              autoPosition
                              align="left"
                              theme="custom-tooltip"
                              maxWidth="150"
                              animation="slide"
                            >
                              <span
                                class="CenterRowFlex mobile__card__post__info__head__anon-comment"
                              >
                                <Icon d={person} size="1.05em" />
                              </span>
                            </Tooltip>
                          {/if}
                          <div
                            class="CenterRowFlex mobile__card__post__info__head__trend"
                          >
                            <div
                              class="CenterRowFlex mobile__card__post__info__head__trend__icon"
                            >
                              <Icon d={trendingUp} />
                            </div>
                            <div
                              class="mobile__card__post__info__head__trend__count"
                            >
                              {comments[0]?.stats?.upvotes === undefined
                                ? 0
                                : comments[0]?.stats?.upvotes}
                            </div>
                          </div>
                          <div class="mobile__card__post__info__head__time">
                            {getFormattedDateHelperUtil(comments[0]?.createdAt)}
                          </div>
                        </div>
                        <div class="mobile__card__post__info__body">
                          <!--eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html DOMPurify.sanitize(
                            comments[0]?.metadata?.content
                          ).substring(0, 70)}
                        </div>
                      </div>
                    </div>
                  {/if}
                {:catch _error}
                  <div class="CenterRowFlex mobile__card__post">
                    No Top Post
                  </div>
                {/await}
              {/await}
            </a>
          {/each}
        </div>
        <div class="footer">
          Couldn’t find what you were looking for? Maybe you can try a different
          keyword?
        </div>
      {/await}
    </section>
  {:else}
    <section>
      {#await getRelatedPostPubIdsAppService($page.data.userEnteredUrlOrKeywords)}
        <div class="body">
          <div class="card">
            <div class="card__img-box__loader" />
            <div class="card__body">
              <div class="card__body__info__loader" />
              <div class="card__body__post__loader" />
            </div>
          </div>
          <div class="card">
            <div class="card__img-box__loader" />
            <div class="card__body">
              <div class="card__body__info__loader" />
              <div class="card__body__post__loader" />
            </div>
          </div>
        </div>
      {:then result}
        {#if result?.publicationIDs.length !== 0}
          <div class="h2 heading">This is what we found</div>
        {/if}
        <div class="body">
          {#each result?.publicationIDs as mainPostPubId}
            <a href={"/posts/" + mainPostPubId} class="card">
              {#await getLinkPublicationLensService(mainPostPubId)}
                <div class="card__img-box__loader" />
                <div class="card__body">
                  <div class="card__body__info__loader" />
                  <div class="card__body__post__loader" />
                </div>
              {:then mainPostPub}
                {#await getImageCommentLensService(mainPostPub?.id)}
                  <div class="card__img-box__loader" />
                {:then imageUrl}
                  <div class="card__img-box">
                    <div
                      class="card__img-box__image"
                      style="background-image: url({imageUrl})"
                    >
                      <div
                        class="CenterRowFlex card__img-box__image__posts-count"
                      >
                        <Icon d={modeComment} />
                        {mainPostPub?.stats?.comments}
                      </div>
                    </div>
                  </div>
                {/await}
                <div class="card__body">
                  <div class="card__body__info">
                    <div class="CenterRowFlex card__body__info__head">
                      <div
                        class="CenterRowFlex card__body__info__head__url-icon"
                      >
                        <Icon d={redirect} />&nbsp;
                      </div>
                      <a
                        href={mainPostPub?.metadata?.sharingLink}
                        target="_blank"
                        class="card__body__info__head__url-val"
                      >
                        {mainPostPub?.metadata?.sharingLink.substring(0, 30)}
                        ...
                      </a>
                      <button class="card__body__info__head__more">
                        <Icon d={moreVert} />
                      </button>
                    </div>
                    <div class="CenterRowFlex card__body__info__details">
                      <div
                        class="CenterRowFlex card__body__info__details__likes"
                      >
                        <Icon d={thumbUp} />&nbsp;
                        {mainPostPub?.stats?.upvotes} Likes
                      </div>
                      <div class="dot" />
                      <div
                        class="CenterRowFlex card__body__info__details__added-by"
                      >
                        <div class="card__body__info__details__added-by__label">
                          Added by:
                        </div>
                        <div
                          class="card__body__info__details__added-by__handle"
                        >
                          naruto.lens
                        </div>
                      </div>
                      <div class="dot" />
                      <div class="card__body__info__details__time">
                        {getFormattedDateHelperUtil(mainPostPub?.createdAt)}
                      </div>
                    </div>
                  </div>
                  {#await getCommentBasedOnParameterPublicationUtil(mainPostPubId, LimitType.Ten, CommentFilterType.FirstMostRelevantComments)}
                    <div class="CenterRowFlex card__body__post__loader" />
                  {:then comments}
                    <div class="CenterRowFlex card__body__post">
                      <a
                        href={`/profile/${getHandle(comments[0])}`}
                        class="card__body__post__pic"
                      >
                        <img
                          src={getPictureURLUtil(
                            comments[0]?.by?.metadata?.picture?.optimized?.uri,
                            comments[0]?.by?.ownedBy?.address
                          )}
                          alt="avatar"
                        />
                      </a>
                      <div class="card__body__post__info">
                        <div class="CenterRowFlex card__body__post__info__head">
                          <a
                            href={`/profile/${getHandle(comments[0])}`}
                            class="card__body__post__info__head__handle"
                          >
                            {getHandle(comments[0])}
                          </a>
                          {#if comments[0]?.by?.id === VITE_APP_LENS_ID}
                            <Tooltip
                              content="This post was made by an anonymous user!"
                              position="top"
                              autoPosition
                              align="left"
                              theme="custom-tooltip"
                              maxWidth="150"
                              animation="slide"
                            >
                              <span
                                class="CenterRowFlex card__post__info__head__anon-comment"
                              >
                                <Icon d={person} size="1.05em" />
                              </span>
                            </Tooltip>
                          {/if}
                          <div
                            class="CenterRowFlex card__body__post__info__head__trend"
                          >
                            <div
                              class="CenterRowFlex card__body__post__info__head__trend__icon"
                            >
                              <Icon d={trendingUp} />
                            </div>
                            <div
                              class="card__body__post__info__head__trend__count"
                            >
                              {comments[0]?.stats?.upvotes === undefined
                                ? 0
                                : comments[0]?.stats?.upvotes}
                            </div>
                          </div>
                          <div class="dot" />
                          <div class="card__body__post__info__head__time">
                            {getFormattedDateHelperUtil(comments[0]?.createdAt)}
                          </div>
                        </div>
                        <div class="card__body__post__info__content">
                          <!--eslint-disable-next-line svelte/no-at-html-tags -->
                          {@html DOMPurify.sanitize(
                            comments[0]?.metadata?.content
                          ).substring(0, 215)}
                        </div>
                      </div>
                    </div>
                  {/await}
                </div>
              {/await}
            </a>
          {/each}
        </div>
        <div class="footer">
          Couldn’t find what you were looking for? Maybe you can try a different
          keyword?
        </div>
      {/await}
    </section>
  {/if}
</MediaQuery>

<!----------------------------------------------------------------->

<!---------------------------------------------------------------->

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile__body {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    flex-direction: column;
  }

  .mobile__card {
    width: 100%;
    filter: drop-shadow(
      9.600000381469727px 22.80000114440918px 37.20000076293945px
        rgba(0, 0, 0, 0.26)
    );
    font-size: var(--small-font-size);
    transition: all 0.4s ease-in-out;
    border-bottom: 1.5px solid #3f494e;
  }

  .mobile__card:hover {
    transform: scale(1.04);
  }

  .mobile__card__image-loader {
    width: 100%;
    height: 12.3rem;
    border-radius: 10.8px;
  }

  .mobile__card__image {
    width: 100%;
    height: 12.3rem;
    background-color: #000;
    overflow: hidden;
    padding-bottom: 50%; /* Adjust this value to control the aspect ratio */
    background-size: cover;
    border-radius: 10.8px;
    transition: background-position 1s ease;
  }

  .mobile__card__image__hover-effect {
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

  .mobile__card__info {
    width: 100%;
    padding: 0.5rem 0;
    gap: 0.2rem;
  }

  .mobile__card__info__loader {
    width: 100%;
    height: 2rem;
    border-radius: 10.8px;
    margin-top: 1rem;
  }

  .mobile__card__info__reaction {
    padding: 0.5rem;
    background: #132026;
    gap: 0.5rem;
    border-radius: 6.8px;
    opacity: 70%;
  }

  .mobile__card__info__reaction__val {
    gap: 0.4rem;
  }

  .mobile__card__info__reaction__vertical-line {
    border-left: 2px solid #ffffff45;
    height: 15px;
  }

  .mobile__card__info__posts-count {
    background: #132026;
    padding: 0.36rem 0.5rem;
    gap: 0.5rem;
    border-radius: 5.8px;
    opacity: 85%;
  }

  .mobile__card__info__link {
    margin-left: auto;
    gap: 0.3rem;
  }

  .mobile__card__post {
    border-radius: 0 0 10.8px 10.8px;
    gap: 0.8rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .mobile__card__post__user-pic-loader {
    height: 4rem;
    width: 3.4rem;
    margin-bottom: auto;
    border-radius: 50%;
    margin-top: 1rem;
  }

  .mobile__card__post__user-pic {
    margin-bottom: auto;
  }

  .mobile__card__post__user-pic img {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 50%;
    border: 2px solid #32f9ff;
  }

  .mobile__card__post__info {
    width: 100%;
  }

  .mobile__card__post__info__head-loader {
    width: 70%;
    justify-content: flex-start;
    margin-bottom: 0.8rem;
    height: 0.7rem;
    border-radius: 5px;
    margin-top: 1rem;
  }

  .mobile__card__post__info__head {
    gap: 0.5rem;
    justify-content: flex-start;
    margin-bottom: 0.8rem;
  }

  .mobile__card__post__info__head__username {
    padding: 0.14rem 0.36rem;
    background: #122025;
    border-radius: 5px;
    color: #32f9ff;
  }

  .mobile__card__post__info__head__anon-comment {
    background: var(--bg-solid-3);
    border-radius: 50%;
    padding: 0.25rem;
  }

  .mobile__card__post__info__head__trend {
    background: #113232;
    border-radius: 14px;
    font-size: var(--semi-small-font-size);
    opacity: 90%;
  }

  .mobile__card__post__info__head__trend__icon {
    padding: 0.1rem 0.2rem;
    border-radius: 50%;
    background: #0e2828;
  }

  .mobile__card__post__info__head__trend__count {
    padding: 0.07rem 0.26rem;
  }

  .mobile__card__post__info__head__time {
    font-size: var(--semi-small-font-size);
    color: var(--text-accent);
    margin-left: auto;
  }

  .mobile__card__post__info__body-loader {
    height: 3.7rem;
    border-radius: 5px;
  }

  .mobile__card__post__info__body {
    overflow-wrap: anywhere;
    width: 14.8rem;
  }

  .mobile__card__info__loader,
  .mobile__card__post__user-pic-loader,
  .mobile__card__post__info__head-loader,
  .mobile__card__post__info__body-loader,
  .mobile__card__image-loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #fff;
  }

  .card {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    border-bottom: 1.5px solid #3f494e;
    padding: 2rem 0;
  }

  .card__img-box {
    width: 100%;
    max-width: 26rem;
  }

  .card__img-box__loader {
    width: 33rem;
    height: 15rem;
    border-radius: 10px;
  }

  .card__img-box__image {
    width: 100%;
    height: 15.5rem;
    background-color: #000;
    overflow: hidden;
    padding-bottom: 50%; /* Adjust this value to control the aspect ratio */
    background-size: cover;
    border-radius: 10.8px;
    transition: background-position 1s ease;
  }

  .card__img-box__image:hover {
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

  .card__img-box__image__posts-count {
    background: #0e3439;
    padding: 0.5rem 0.7rem;
    gap: 0.5rem;
    border-radius: 5.8px;
    opacity: 85%;
    width: 4.5rem;
    margin: 0.5rem;
  }

  .card__body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 15.5rem;
    padding: 1rem;
    width: 100%;
    min-width: 33rem;
    max-width: 85rem;
  }

  .card__body__info {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .card__body__info__loader {
    width: 100%;
    height: 5rem;
    border-radius: 10px;
  }

  .card__body__info__head {
    justify-content: flex-start;
  }

  .card__body__info__head__url-val {
    font-weight: var(--medium-font-weight);
    font-size: 17px;
  }

  .card__body__info__head__more {
    margin-left: auto;
  }

  .card__body__info__details {
    gap: 0.5rem;
    justify-content: flex-start;
  }

  .card__body__info__details__likes {
    background: #0b151a;
    padding: 0.5rem;
    border-radius: 5px;
  }

  .card__body__info__details__added-by__handle {
    background: #0b151a;
    padding: 0.2rem 0.3rem;
    border-radius: 5px;
    color: var(--primary);
  }

  .card__body__info__details__time {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__body__post {
    gap: 1rem;
    justify-content: flex-start;
  }

  .card__body__post__loader {
    width: 100%;
    height: 10rem;
    border-radius: 10px;
  }

  .card__body__post__pic {
    margin-bottom: auto;
  }

  .card__body__post__pic img {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 2px solid #32f9ff;
  }

  .card__body__post__info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card__body__post__info__head {
    gap: 1rem;
    justify-content: flex-start;
  }

  .card__body__post__info__content {
    overflow-wrap: anywhere;
    max-width: 50rem;
  }

  .card__body__info__details__added-by {
    gap: 0.3rem;
  }

  .card__body__info__details__added-by__label {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__body__post__info__head__handle {
    background: #0b151a;
    padding: 0.2rem 0.3rem;
    border-radius: 5px;
    color: var(--primary);
  }

  .card__post__info__head__anon-comment {
    background: var(--bg-solid-3);
    border-radius: 50%;
    padding: 0.25rem;
  }

  .card__body__post__info__head__trend {
    background: #113232;
    border-radius: 14px;
    font-size: var(--small-font-size);
    opacity: 90%;
  }

  .card__body__post__info__head__trend__icon {
    padding: 0.15rem 0.3rem;
    border-radius: 50%;
    background: #0e2828;
  }

  .card__body__post__info__head__trend__count {
    padding: 0.15rem 0.5rem;
  }

  .card__body__post__info__head__time {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__img-box__loader,
  .card__body__info__loader,
  .card__body__post__loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }
</style>
