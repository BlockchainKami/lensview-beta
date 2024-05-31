<script lang="ts">
  import {
    clock,
    cross,
    followers,
    login,
    personAdd,
    star
  } from "../../utils/app-icon.util";
  import Icon from "$lib/Icon.svelte";
  import { page } from "$app/stores";
  import getPictureURLUtil from "../../utils/get-picture-URL.util";
  import getFormattedDateHelperUtil from "../../utils/helper/get-formatted-date.helper.util";
  import { DateType } from "../../config/app-constants.config";
  import getProfileUsingIdLensService from "../../services/lens/get-profile-using-id.lens.service";
  import { profileUserStore } from "../../stores/user/profile.user.store";
  import LensLogo from "$lib/assets/LensLogo.svg";
  import LensviewLogoFlat from "$lib/assets/LensviewLogoFlat.svg";
  import Login from "../Login.svelte";
  import { isLoggedInUserStore } from "../../stores/user/is-logged-in.user.store";
  import followFollowUtil from "../../utils/follow/follow.follow.util";
  import { getNotificationsContext } from "svelte-notifications";
  import { reloadAPublication } from "../../stores/reload-publication.store";
  import { onMount } from "svelte";
  import unfollowFollowUtil from "../../utils/follow/unfollow.follow.util";
  import followLensProfileManagerFollowUtil from "../../utils/follow/follow-lens-profile-manager.follow.util";
  import unfollowLensProfileManagerFollowUtil from "../../utils/follow/unfollow-lens-profile-manager.follow.util";

  let showLoginModal = false;
  const { addNotification } = getNotificationsContext();
  let promiseOfGetProfile = getProfileUsingIdLensService($page.data.profileId);
  let isFollowing = false;
  let disableActive = false;

  onMount(() => {
    reloadAPublication.subscribe(() => {
      promiseOfGetProfile = getProfileUsingIdLensService($page.data.profileId);
    });
  });

  const callFollow = async () => {
    let isUserLoggedIn = false;
    const unsub = isLoggedInUserStore.subscribe((status) => {
      isUserLoggedIn = status;
    });
    unsub();

    if (!isUserLoggedIn) {
      openLoginNotification();
    } else {
      disableActive = true;
      try {
        let isSignLessEnabled = false;
        const unsub3 = profileUserStore.subscribe((_profile) => {
          isSignLessEnabled = !!_profile?.signless;
        });
        unsub3;

        if (isSignLessEnabled) {
          await followLensProfileManagerFollowUtil($page.data.profileId);
        } else {
          await followFollowUtil($page.data.profileId);
        }
        isFollowing = true;
        disableActive = false;
      } catch (_error) {
        console.log("Error following user", _error);
        disableActive = false;
        addNotification({
          position: "top-right",
          heading: "Error while following",
          description: "Please try again .",
          type: cross,
          removeAfter: 4000
        });
      }
    }
  };

  const callUnfollow = async () => {
    let isUserLoggedIn = false;
    const unsub = isLoggedInUserStore.subscribe((status) => {
      isUserLoggedIn = status;
    });
    unsub();

    if (!isUserLoggedIn) {
      openLoginNotification();
    } else {
      disableActive = true;
      try {
        let isSignLessEnabled = false;
        const unsub3 = profileUserStore.subscribe((_profile) => {
          isSignLessEnabled = !!_profile?.signless;
        });
        unsub3;

        if (isSignLessEnabled) {
          await unfollowLensProfileManagerFollowUtil($page.data.profileId);
        } else {
          await unfollowFollowUtil($page.data.profileId);
        }
        isFollowing = false;
        disableActive = false;
      } catch (_error) {
        console.log("Error following user", _error);
        disableActive = false;
        addNotification({
          position: "top-right",
          heading: "Error while unfollowing",
          description: "Please try again .",
          type: cross,
          removeAfter: 4000
        });
      }
    }
  };

  const updateIsFollowing = (status: boolean | undefined) => {
    if (!status) isFollowing = false;
    else isFollowing = status;
    return "";
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
</script>

<!----------------------------- HTML ----------------------------->

<section>
  {#await promiseOfGetProfile}
    <div class="cover-image-loader" />
    <div class="profile-details">
      <div class="CenterColumnFlex profile-details__left">
        <div class="profile-details__left__picture-loader" />
      </div>
      <div class="profile-details__right">
        <div class="CenterRowFlex profile-details__right__top-loader" />
        <div class="CenterRowFlex profile-details__right__middle-loader" />
        <div class="profile-details__right__bottom-loader" />
      </div>
    </div>
    <div class="stats">
      <div class="CenterRowFlex stats__box stats__followers">
        <div class="CenterColumnFlex stats__box__icon">
          <Icon d={followers} size="1.7em" />
        </div>
        <div class="CenterRowFlex stats__box__right">
          <div class="stats__box__right__title">Followers</div>
          <div class="stats__box__right__value-loader" />
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__posts">
        <div class="stats__box__img">
          <img src={LensLogo} alt="" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">Lens Contributions</div>
          <div class="stats__box__right__value-loader" />
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__comments">
        <div class="stats__box__img">
          <img src={LensviewLogoFlat} alt="" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">LensView Contributions</div>
          <div class="stats__box__right__value-loader" />
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__reactions">
        <div class="stats__box__icon">
          <Icon d={star} size="1.7em" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">Impressions</div>
          <div class="stats__box__right__value-loader" />
        </div>
      </div>
    </div>
  {:then response}
    <div
      class="cover-image"
      style="background-image: url({response?.data?.profile?.metadata
        ?.coverPicture?.optimized?.uri})"
    />
    <div class="profile-details">
      <div class="CenterColumnFlex profile-details__left">
        <div class="profile-details__left__picture">
          <img
            src={getPictureURLUtil(
              response?.data?.profile?.metadata?.picture?.__typename ===
                "ImageSet"
                ? response?.data?.profile?.metadata?.picture?.optimized?.uri
                : "",
              response?.data?.profile?.ownedBy?.address
            )}
            alt="avatar"
          />
        </div>
      </div>
      <div class="profile-details__right">
        <div class="CenterRowFlex profile-details__right__top">
          {#if response?.data?.profile?.metadata?.displayName}
            <div class="profile-details__right__top__name">
              {response?.data?.profile?.metadata?.displayName}
            </div>
          {/if}
          {#if $page.data.profileId !== $profileUserStore?.id}
            <div class="profile-details__right__top__follow">
              {updateIsFollowing(
                response?.data?.profile?.operations?.isFollowedByMe?.value
              )}
              {#if !isFollowing}
                <button
                  on:click={() => callFollow()}
                  disabled={disableActive}
                  class="CenterRowFlex btn"
                >
                  <Icon d={personAdd} color="black" />
                  &nbsp; &nbsp;Follow
                </button>
              {:else}
                <button
                  on:click={() => callUnfollow()}
                  disabled={disableActive}
                  class="CenterRowFlex btn"
                >
                  <Icon d={personAdd} color="black" />
                  &nbsp; &nbsp;Following
                </button>
              {/if}
            </div>
          {/if}
        </div>
        <div class="CenterRowFlex profile-details__right__middle">
          <div class="profile-details__right__middle__handle">
            {response?.data?.profile?.handle?.fullHandle
              ? response?.data?.profile?.handle?.fullHandle
              : ""}
          </div>
          <div class="CenterRowFlex profile-details__right__middle__right">
            <div
              class="CenterRowFlex profile-details__right__middle__right__grey-text"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Icon d={clock} color="#a1a1a1" />
              &nbsp; Joined {getFormattedDateHelperUtil(
                response?.data?.profile?.createdAt,
                DateType.ExactDate
              )}
            </div>
            <div
              class="CenterRowFlex profile-details__right__middle__right__grey-text"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Icon d={followers} color="#a1a1a1" />
              &nbsp; {response?.data?.profile?.stats?.following
                ? response?.data?.profile?.stats?.following
                : 0} Following
            </div>
            {#if response?.data?.profile?.operations?.isFollowingMe?.value}
              <div class="profile-details__right__middle__right__follows-you">
                Follows You
              </div>
            {/if}
          </div>
        </div>
        <div class="profile-details__right__bottom">
          {response?.data?.profile?.metadata?.bio
            ? response?.data?.profile?.metadata?.bio
            : ""}
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="CenterRowFlex stats__box stats__followers">
        <div class="CenterColumnFlex stats__box__icon">
          <Icon d={followers} size="1.7em" />
        </div>
        <div class="CenterRowFlex stats__box__right">
          <div class="stats__box__right__title">Followers</div>
          <div class="stats__box__right__value">
            {response?.data?.profile?.stats?.followers}
          </div>
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__posts">
        <div class="stats__box__img">
          <img src={LensLogo} alt="" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">Lens Contributions</div>
          <div class="stats__box__right__value">
            {response?.data?.profile?.stats?.publications}
          </div>
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__comments">
        <div class="stats__box__img">
          <img src={LensviewLogoFlat} alt="" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">LensView Contributions</div>
          <div class="stats__box__right__value">
            {response?.data?.profile?.lensviewStats?.publications}
          </div>
        </div>
      </div>
      <div class="CenterRowFlex stats__box stats__reactions">
        <div class="stats__box__icon">
          <Icon d={star} size="1.7em" />
        </div>
        <div class="CenterColumnFlex stats__box__right">
          <div class="stats__box__right__title">Impressions</div>
          <div class="stats__box__right__value">
            {response?.data?.profile?.stats?.reactions}
          </div>
        </div>
      </div>
    </div>
  {:catch _error}
    <div>Failed to load profile</div>
  {/await}
</section>

<Login bind:showLoginModal />

<!---------------------------------------------------------------->

<!----------------------------- STYLE ----------------------------->
<style lang="scss">
  .cover-image {
    width: 100%;
    height: 15rem;
    background-size: cover;
    background-position: center;
    background-color: var(--secondary);
  }

  .cover-image-loader {
    width: 100%;
    height: 15rem;
  }

  .profile-details {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 4rem;
  }

  .profile-details__left__picture img {
    width: 15rem;
    height: 15rem;
    border-radius: 50%;
    border: 3px solid #32f9ff;
    margin-top: -5rem;
  }

  .profile-details__left__picture-loader {
    width: 15rem;
    height: 15rem;
    border-radius: 50%;
    margin-top: -5rem;
  }

  .profile-details__right {
    display: flex;
    gap: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    width: 100%;
  }

  .profile-details__right__top {
    gap: 3rem;
    width: 100%;
    justify-content: flex-start;
  }

  .profile-details__right__top-loader {
    width: 25rem;
    height: 2rem;
    border-radius: 10px;
  }

  .profile-details__right__top__name {
    font-size: var(--semi-large-font-size);
    font-weight: var(--semi-medium-font-weight);
    font-family: var(--special-font);
    line-height: 1em;
    text-align: center;
  }

  .profile-details__right__middle {
    gap: 1rem;
  }

  .profile-details__right__middle-loader {
    width: 25rem;
    height: 1rem;
    border-radius: 10px;
  }

  .profile-details__right__middle__handle {
    padding: 0.2rem 0.5rem;
    background: #113232;
    border-radius: 5px;
    color: var(--primary);
  }

  .profile-details__right__middle__right {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  .profile-details__right__middle__right__grey-text {
    font-size: var(--small-font-size);
    color: var(--text-accent);
  }

  .profile-details__right__middle__right__follows-you {
    border-radius: 5px;
    background-color: var(--bg-solid-2);
    font-size: var(--small-font-size);
    color: var(--text-accent);
    padding: 0.2rem 0.5rem;
  }

  .profile-details__right__bottom {
    max-width: 50rem;
  }

  .profile-details__right__bottom-loader {
    width: 40rem;
    height: 1.5rem;
    border-radius: 10px;
  }

  .stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 1.5rem 1.5rem 0.5rem 1.5rem;
    margin: 1rem 5rem;
    background: #0c151a;
    border-radius: 15px;
    justify-content: space-evenly;
    flex-wrap: wrap;
    min-width: 33rem;
  }

  .stats__box {
    width: 25%;
    flex-grow: 1;
    flex-shrink: 1;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stats__box__right__value-loader {
    width: 4rem;
    height: 1.5rem;
    border-radius: 5px;
  }

  .stats__box__icon {
    border-radius: 50%;
    background: var(--bg-solid-3);
    padding: 0.9rem 1rem;
  }

  .stats__box__img img {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
  }

  .stats__box__right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .stats__box__right__title {
    font-size: var(--small-font-size);
  }

  .stats__box__right__value {
    font-size: var(--medium-font-size);
  }

  .cover-image-loader,
  .profile-details__left__picture-loader,
  .profile-details__right__top-loader,
  .profile-details__right__middle-loader,
  .profile-details__right__bottom-loader,
  .stats__box__right__value-loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }

  @media only screen and (max-width: 1024px) {
    .profile-details {
      flex-direction: column;
      padding: 0 2rem;
    }

    .profile-details__right {
      width: 100%;
      align-items: center;
      padding: 2rem 1rem;
    }

    .profile-details__right__top {
      flex-direction: column;
    }

    .profile-details__right__top-loader {
      width: 15rem;
    }

    .profile-details__right__top__follow {
      width: 100%;
    }

    .profile-details__right__top__follow button {
      width: 90%;
    }

    .profile-details__right__middle {
      flex-direction: column;
      width: 100%;
    }

    .profile-details__right__middle__right {
      gap: 0.2rem;
    }

    .profile-details__right__middle__right__follows-you {
      background-color: var(--bg-solid-1);
    }

    .profile-details__right__middle-loader {
      width: 20rem;
    }

    .profile-details__right__bottom-loader {
      width: 10rem;
    }

    .stats {
      margin: 0 2rem 1rem 2rem;
    }

    .stats__box {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      padding-left: 3.5rem;
    }
  }
</style>
