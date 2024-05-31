<script lang="ts">
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import Icon from "$lib/Icon.svelte";
  import {
    positiveSentiment,
    neutralSentiment,
    negativeSentiment,
    cross
  } from "../../utils/app-icon.util";
  import LensViewAI from "$lib/assets/lensview-ai.jpg";
  import summarizePublicationsAppService from "../../services/app/summarize-publications.app.service";
  import {
    SentimentColor,
    summarySentiment
  } from "../../config/app-constants.config";
  import { getNotificationsContext } from "svelte-notifications";

  export let mainPubId;
  export let isSummaryOpen;
  let sentimentColor = SentimentColor.neutral;
  let sentimentIcon = neutralSentiment;
  const promiseOfSummarizePublications =
    summarizePublicationsAppService(mainPubId);
  const { addNotification } = getNotificationsContext();

  const updateSentimentVariable = (sentiment: summarySentiment) => {
    if (sentiment === summarySentiment.positive) {
      sentimentIcon = positiveSentiment;
      sentimentColor = SentimentColor.positive;
    } else if (sentiment === summarySentiment.negative) {
      sentimentIcon = negativeSentiment;
      sentimentColor = SentimentColor.negative;
    } else {
      sentimentIcon = neutralSentiment;
      sentimentColor = SentimentColor.neutral;
    }

    return "";
  };

  const showErrorNotification = () => {
    isSummaryOpen = false;
    addNotification({
      position: "top-right",
      heading: "Failed To Summarize",
      description: "Please try again to get the summary",
      type: cross,
      removeAfter: 20000
    });
  };
</script>

<!----------------------------- HTML ----------------------------->
{#await promiseOfSummarizePublications}
  <article
    class="card"
    aria-labelledby={"post-title"}
    aria-describedby={"post-content"}
    style="--sentiment-color: {sentimentColor};"
  >
    <header class="card__header">
      <img
        class="card__header__profile-pic"
        src={LensViewAI}
        alt={"LensView's AI profile picture"}
      />
      <div class="card__header__info">
        <div class="CenterRowFlex card__header__info__top">
          <div class="card__header__info__top__name" id={"post-title"}>
            LensView AI
          </div>
        </div>
        <div class="card__header__info__bottom">
          <div class="card__header__info__bottom__time-loader" />
        </div>
      </div>
      <div class="CenterRowFlex card__header__sentiment-loader" />
    </header>
    <div class="card__body-loader" id={"post-content"} />
  </article>
{:then summaryResponse}
  {updateSentimentVariable(summaryResponse.sentiment)}
  <article
    class="card"
    aria-labelledby={"post-title"}
    aria-describedby={"post-content"}
    style="--sentiment-color: {sentimentColor};"
  >
    <header class="card__header">
      <img
        class="card__header__profile-pic"
        src={LensViewAI}
        alt={"LensView's AI profile picture"}
      />
      <div class="card__header__info">
        <div class="CenterRowFlex card__header__info__top">
          <div class="card__header__info__top__name" id={"post-title"}>
            LensView AI
          </div>
        </div>
        <div class="card__header__info__bottom">
          <div class="card__header__info__bottom__time">
            Last Generated {getFormattedDateHelperUtil(
              summaryResponse.lastUpdatedAt
            )} ago
          </div>
        </div>
      </div>
      <div class="CenterRowFlex card__header__sentiment">
        <Icon d={sentimentIcon} fill="black" />
      </div>
    </header>
    <div class="card__body" id={"post-content"}>
      {summaryResponse.summary}
    </div>
  </article>
{:catch _error}
  {showErrorNotification()}
{/await}

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  .card {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 10px;
    gap: 0.7rem;
    border: 1.5px solid var(--sentiment-color);
    width: 100%;
  }

  .card__header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
    align-items: center;
  }

  .card__header__profile-pic {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
  }

  .card__header__info {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.3rem;
  }

  .card__header__info__top {
    justify-content: space-between;
  }

  .card__header__info__top__name {
    font-size: var(--semi-medium-font-size);
    font-weight: var(--medium-font-weight);
  }

  .card__header__info__bottom__time {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .card__header__info__bottom__time-loader {
    height: 1.5rem;
    width: 6rem;
    border-radius: 5px;
  }

  .card__header__sentiment {
    background: var(--sentiment-color);
    border-radius: 5px;
    padding: 0.3rem 0.5rem;
  }

  .card__header__sentiment-loader {
    height: 2rem;
    width: 3rem;
    border-radius: 5px;
  }

  .card__body {
    overflow-wrap: anywhere;
    overflow: hidden;
    font-size: var(--semi-medium-font-size);
    margin-left: 4.5rem;
  }

  .card__body-loader {
    height: 5.2rem;
    border-radius: 5px;
  }

  .card__header__info__bottom__time-loader,
  .card__header__sentiment-loader,
  .card__body-loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }
</style>
