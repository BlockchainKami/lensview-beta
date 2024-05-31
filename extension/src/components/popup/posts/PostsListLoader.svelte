<!---------------------------- HTML -------------------------------->

<ul>
  <li>
    <article class="CenterColumnFlex card" aria-hidden="true">
      <header class="card__header">
        <div class="card__header__profile-pic__loader" />
        <div class="card__header__info__loader" />
      </header>
      <p class="card__body__loader" />
    </article>
  </li>

  <li>
    <article class="CenterColumnFlex card" aria-hidden="true">
      <header class="card__header">
        <div class="card__header__profile-pic__loader" />
        <div class="card__header__info__loader" />
      </header>
      <p class="card__body__loader" />
    </article>
  </li>

  <li>
    <article class="CenterColumnFlex card" aria-hidden="true">
      <header class="card__header">
        <div class="card__header__profile-pic__loader" />
        <div class="card__header__info__loader" />
      </header>
      <p class="card__body__loader" />
    </article>
  </li>
</ul>

<!----------------------------------- style -------------------------------->

<style lang="scss">
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
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
  }

  .card__header__profile-pic__loader {
    width: 4rem;
    height: 3.5rem;
    border-radius: 50%;
  }

  .card__header__info__loader {
    height: 3rem;
    width: 100%;
    border-radius: 5px;
  }

  .card__body__loader {
    width: 100%;
    height: 5rem;
    border-radius: 5px;
  }

  .card__header__profile-pic__loader,
  .card__header__info__loader,
  .card__body__loader {
    background: linear-gradient(110deg, #0d9397 8%, #63bdc8 18%, #0d9397 33%);
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
  }
</style>
