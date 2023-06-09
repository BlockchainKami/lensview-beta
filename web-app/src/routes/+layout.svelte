<script lang="ts">
  import "../global.scss";
  import { userAddress } from "../services/userAddress";
  import { userAuthentication } from "../utils/frontend/authenticate";
  import { goto } from "$app/navigation";
  import createHash from "../utils/frontend/createURLHash";
  import { isSignedIn } from "../services/signInStatus";
  import { userEnteredURL } from "../services/userEnteredURL";
  import getDefaultUserProfile from "../utils/frontend/getDefaultUserProfile";
  import CreateLensHandle from "../components/main-page/CreateLensHandle.svelte";
  import { userProfile } from "../services/profile";
  import getUserProfiles from "../utils/frontend/getUserProfiles";
  import { onMount } from "svelte";
  import { PUBLIC_IS_PROD } from "$env/static/public";

  let isConnected = false;
  let signingIn = false;
  let userEnteredLink = "";
  let showCreateLensHandleModal = false;
  let isHandleCreated = true;
  let isThisConnectWalletAccountChange = false;
  let chainIDToBeUsed: string;


  onMount(async () => {

    if (PUBLIC_IS_PROD === "false") {
      chainIDToBeUsed = "0x13881";
    } else {
      chainIDToBeUsed = "0x89";
    }

    if (typeof window.ethereum === "undefined") {
      alert("Please install metamask to interact with this application, but you can still view the others posts");
    }

    window.ethereum.on("chainChanged", (chainId) => {
      if (chainId !== chainIDToBeUsed) {
        window.location.reload();
      }
    });

    window.ethereum.on("accountsChanged", (switchedAddress) => {
      if (!isThisConnectWalletAccountChange) {
        window.location.reload();
      } else {
        isThisConnectWalletAccountChange = false;
      }
    });
  });

  /**TODO: 1. Check for chain and if it is not polygon testnet then do necessary changes
   *       2. Check if there is any stored address in local storage if yes then do not ask for connect wallet
   *       3. Check if refresh token is present in local storage and not expired, if yes then do not ask for sign in
   *       4. Handle scenarios when user switches network
   */
  async function connect() {
    if (typeof window.ethereum === "undefined") {
      alert("Please install metamask to interact with this application, but you can still view the others posts");
    } else {
      /* this allows the user to connect their wallet */
      try {
        await switchUserToCorrectChain();

        isThisConnectWalletAccountChange = true;

        const account = await window.ethereum.request({ method: "eth_requestAccounts" });

        isThisConnectWalletAccountChange = false;
        if (account.length) {
          userAddress.setUserAddress(account[0]);
          isConnected = true;
        } else {
          isConnected = false;
        }
        console.log("Account : " + JSON.stringify(account));
      } catch (error) {
        isThisConnectWalletAccountChange = false;
        console.log(error);
      }
    }
  }

  const switchUserToCorrectChain = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    console.log("Chain Id : " + chainId);

    if (chainId !== chainIDToBeUsed) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIDToBeUsed }]
        });

      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {

            if (PUBLIC_IS_PROD === "false") {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x13881",
                    chainName: "Mumbai",
                    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18
                    }
                  }
                ]
              });
            } else {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x89",
                    chainName: "Polygon",
                    rpcUrls: ["https://polygon-rpc.com"],
                    blockExplorerUrls: ["https://polygonscan.com"],
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18
                    }
                  }
                ]
              });
            }

          } catch (addError) {
            console.log("Error adding chain", addError);
            throw new Error(addError);
          }
        } else {
          console.log("Error switching chain", switchError);
          throw new Error(switchError);
        }
      }
    }
  };

  const signInWithLens = async () => {
    /*** Authenticate **/
    try {
      signingIn = true;
      await userAuthentication();
      const fetchedProfiles = await getUserProfiles();

      if (fetchedProfiles.length === 0) {
        console.log("Fetched Profile : " + JSON.stringify(fetchedProfiles));
        showCreateLensHandleModal = true;
        signingIn = false;
        isHandleCreated = false;
      } else {
        isHandleCreated = true;
        showCreateLensHandleModal = false;
        const defaultProfile = await getDefaultUserProfile();

        if (defaultProfile !== null) {
          userProfile.setUserProfile(defaultProfile);
        } else {
          userProfile.setUserProfile(fetchedProfiles[0]);
        }
        signingIn = false;
        isSignedIn.setSignInStatus(true);
      }

    } catch (error) {
      console.log("Error authenticating user");
      isSignedIn.setSignInStatus(false);
      signingIn = false;
    }
  };

  const redirectToPostsPage = async () => {
    userEnteredURL.set(userEnteredLink);
    const hash = await createHash(userEnteredLink);
    goto(`/posts/${hash}`);
  };
</script>


<!---------------------------------- HTML --------------------------->
<main>
  <div class="menu">
    <div class="menu__logo">
      <a href="/"><img alt="Untitled-presentation-3"
                       src="https://i.postimg.cc/3JG1b9Cv/Lensview-Logo.png"
      />
      </a>
    </div>
    <div class="CenterColumnFlex menu__items">
      <a href="/" class="menu__items__item menu__items__item--home">
        Home
      </a>
      <a href="https://getwaitlist.com/waitlist/8129"
         target="_blank"
         class="menu__items__item menu__items__item--email"
      >
        Get Lensview
        <br>
        Updates
      </a>
    </div>
    <div class="menu__user">
      {#if !isConnected}
        <button on:click="{connect}" class="btn">Connect Wallet</button>
      {:else}
        {#if !$isSignedIn}
          {#if !signingIn }
            {#if isHandleCreated}
              <button on:click="{signInWithLens}" class="btn">Sign-In With Lens</button>
            {:else}
              <button on:click="{() => showCreateLensHandleModal = true}" class="btn">Create Lens Handle</button>
            {/if}
          {:else}
            Signing In ...
          {/if}
        {:else}
          <div class="menu__user__profile">
            {$userProfile.handle}
            <!--{$userAddress.slice(0, 5)} ... {$userAddress.slice(-5)}-->
          </div>
        {/if}
      {/if}
    </div>
  </div>
  <div class="CenterRowFlex search-box">
    <input bind:value={userEnteredLink} type="text" class="search-box__input" placeholder="Search for a link">
    <button on:click={redirectToPostsPage} disabled={userEnteredLink.length === 0} class="btn">
      Search
    </button>
  </div>
  <slot />

</main>

<CreateLensHandle bind:showCreateLensHandleModal>
</CreateLensHandle>


<!------------------------------------------------------------------->

<!---------------------------------- Style --------------------------->
<style lang="scss">
  main {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .menu {
    display: flex;
    flex-direction: column;
    width: 15%;
    height: 100vh;
    padding: 2rem 1rem;
  }

  .menu__logo {
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
  }

  .menu__logo img {
    height: 7rem;
    width: 8rem;
  }

  .menu__user {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: auto;
  }

  .menu__user__profile {
    padding: 1rem;
    background: #38b6ff;
    border-radius: 39px;
  }

  .menu__items {
    width: 100%;
    gap: 1rem;
  }

  .menu__items__item {
    width: 100%;
    background: #38b6ff;
    padding: 0.75rem;
    border-radius: 8px;
  }

  .menu__items__item--email {
    background: deeppink;
    font-weight: bold;
  }

  .search-box {
    position: absolute;
    width: 35%;
    justify-content: space-around;
    top: 2rem;
    left: 15%;
  }

  .search-box__input {
    width: 68%;
    padding: 0.65rem;
    border-radius: 8px;
    border: 1px solid lightgray;
    outline: 0;
  }

  @media only screen and (max-width: 700px) {
    main {
      flex-direction: column;
      background-color: aliceblue;
    }

    .menu {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 10vh;
      width: 100%;
    }

    .menu__logo img {
      height: 4.5rem;
      width: 5rem;
    }

    .menu__logo {
      margin-bottom: 0;
    }

    .menu__items {
      display: none;
      //flex-direction: row;
      //justify-content: flex-end;
      //margin: 0 1rem;
    }

    //.menu__items__item--home{
    //  display: none;
    //}
    //
    //.menu__items__item--email {
    //  width: auto;
    //}

    .menu__user {
      margin-top: 0;
      margin-left: auto;
    }

    .search-box {
      width: 100%;
      top: 6rem;
      left: 0;
    }
  }

</style>
<!-------------------------------------------------------------------->
