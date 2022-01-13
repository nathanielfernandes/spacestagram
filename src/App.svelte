<script>
  import { APODS, preview, api_endpoint } from "./stores";
  import { debounce, clickOutside } from "./helpers";
  import Card from "./Card.svelte";
  import BetterGrid from "./BetterGrid.svelte";

  const fix = (apod) => {
    let ogs = {};

    return apod
      .filter((a) =>
        ogs.hasOwnProperty(a.title) ? false : (ogs[a.title] = true)
      )
      .filter((a) => a.media_type === "image")
      .map((a) => {
        if (a.liked === undefined || a.liked === null) {
          a.liked = false;
        }

        if (typeof a.date === "string") {
          a.date = new Date(a.date);
        }

        return a;
      });
  };

  // simple search filter
  function search_filter(ap, s) {
    if (s === undefined || s === null || s === "") {
      return ap;
    }

    return ap.filter(
      (a) =>
        a.title.toLowerCase().includes(s.toLowerCase()) ||
        a.explanation.toLowerCase().includes(s.toLowerCase()) ||
        a.date
          .toLocaleDateString("en-US")
          .toLowerCase()
          .includes(s.toLowerCase())
    );
  }

  function index(ap) {
    for (let i = 0; i < ap.length; i++) {
      ap[i].i = i;
    }

    return ap;
  }

  const likes_filter = (ap) => ap.filter((a) => a.liked);

  let search_term;
  let typing_search_term;
  let filter_likes = false;

  $: apods = filter_likes
    ? search_filter(likes_filter($APODS), search_term)
    : search_filter($APODS, search_term);

  const refreshGrid = debounce(() => {
    search_term = typing_search_term;
  }, 200);
  // apods_filter($APODS, current_filter);
  // APODS.subscribe((value) => {
  //   apods = ;
  // });

  // $: if (grid) {
  //   grid.refreshLayout();
  // }

  let loaded = false;
  async function moreApods() {
    loaded = false;
    const resp = await fetch(`${api_endpoint}?count=50`);
    let json = await resp.json();

    APODS.set(index(fix($APODS.concat(json))));
    loaded = true;
  }

  async function getApods() {
    let json;
    if ($APODS.length == 0) {
      const resp = await fetch(`${api_endpoint}?count=100`);
      json = await resp.json();
    } else {
      json = $APODS;
    }

    APODS.set(index(fix(json)));
    loaded = true;
  }

  const apodPromise = getApods();
</script>

<main>
  <h1><img class="logo" alt="logo" src="./unspace.svg" />Spacestagram</h1>
  <h2>Brought to you by NASA's APOD API</h2>
  <!-- back ground stars -->
  <div id="small-stars" />
  <div id="medium-stars" />
  <div id="large-stars" />

  <div class="top">
    <div class="search-bar">
      <i class="fas fa-search" />
      <input
        placeholder="Search for an image..."
        on:input={refreshGrid}
        bind:value={typing_search_term}
      />
    </div>

    <button
      on:click={() => {
        filter_likes = !filter_likes;
      }}
      ><i class={`fas fa-${filter_likes ? "times" : "heart"} likes`} />
      {filter_likes ? "All Images" : "Liked Images"}</button
    >
  </div>

  <!-- preview -->
  {#if $preview}
    <div class="modal">
      <img
        class="preview"
        alt={$preview.title}
        src={$preview.hdurl || $preview.url}
        use:clickOutside
        on:click_outside={() => {
          preview.set();
        }}
      />
      <h3>{$preview.title}</h3>
      <p>click away to exit view</p>
    </div>
  {/if}

  <!-- tiles -->
  {#await apodPromise}
    <h2 class="loading">
      Performing deep space scan <i class="fas fa-spinner" />
    </h2>
  {:then}
    {#if apods.length > 0}
      <BetterGrid
        gridGap={"1rem"}
        colWidth={"minmax(Min(25rem, 100%), 1fr)"}
        items={apods}
      >
        {#each apods as apod, _}
          <Card {apod} i={apod.i} />
        {/each}
      </BetterGrid>

      {#if loaded}
        <h3 class="more" on:click={moreApods}>Load More</h3>
      {:else}
        <h2 class="loading">
          Performing deep space scan <i class="fas fa-spinner" />
        </h2>
      {/if}
    {:else}
      <div class="loading">No Results :(</div>
    {/if}
  {:catch error}
    <div>
      <h2>Deep space scan failed :(</h2>
    </div>
  {/await}
</main>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
  />
</svelte:head>

<style lang="scss">
  // .container {
  //   position: absolute;
  // }

  .more {
    font-weight: 800;
    cursor: pointer;
    padding: 2rem;
    transition: 200ms;
  }

  .more:hover {
    transform: scale(1.3);
  }

  .more:active {
    transform: scale(1.1);
  }

  .fa-spinner {
    animation: spin 700ms linear infinite;
  }

  .loading {
    margin: 1rem 0rem;
    padding: 2rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
  .search-bar {
    width: 80%;
    background-color: white;
    border-radius: 5px;

    height: 2rem;
    justify-content: left;
    text-align: left;
    padding: 0rem 1rem;
    display: flex;
    align-items: center;

    // overflow: hidden;
    // border-radius: 5px;
    // margin-top: 1rem;
  }

  .search-bar .fa-search {
    color: grey;
  }

  .search-bar input {
    box-sizing: border-box;
    height: 100%;
    width: 95%;
    outline: none;
    border: none;
    padding: 0rem 0.5rem;
    color: rgb(52, 52, 52);
    font-family: "Roboto", sans-serif;
    font-weight: 800;
  }

  .likes {
    width: 1rem;
  }
  .top button {
    height: 2rem;
    margin: 0.5rem;
    border-radius: 5px;
    outline: none;
    border: none;
    color: rgb(107, 107, 107);
    font-family: "Roboto", sans-serif;
    font-weight: 800;
    cursor: pointer;
    background-color: white;
    transition: 200ms;
    width: 8rem;
  }

  .top button:hover {
    background-color: rgb(200, 200, 200);
  }

  .top button:active {
    background-color: rgb(110, 110, 110);
  }

  .modal {
    position: fixed;
    z-index: 5;
    padding-top: 3%;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.9);
    box-shadow: var(--good-shadow);
  }

  .preview {
    margin: auto;
    display: block;
    max-width: 80%;
    max-height: 80%;
    // max-width: 700px;
    border-radius: 10px;
  }

  .modal p {
    margin: 0;
    padding: 0;
    opacity: 0.4;
  }

  // .preview {
  //   position: fixed;
  //   height: 80%;
  //   width: 80%;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  //   z-index: 20;
  // }

  // .preview img {
  //   height: 100%;
  // }

  main {
    text-align: center;
    /* padding: 1em; */
    /* max-width: 240px; */
    color: white;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    position: relative;

    /* overflow: hidden; */
  }

  h1 {
    color: #ffffff;
    font-size: 4vw;
    font-weight: 600;
    padding: 0.5rem 2rem;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
    font-size: 3vw;
  }

  .logo {
    height: 5vw;
  }

  @function custom-box-shadow($n) {
    $shadows: random(2000) + "px " + random(2000) + "px #FFF";
    @for $i from 2 through $n {
      $shadows: $shadows +
        ", " +
        random(2000) +
        "px " +
        random(2000) +
        "px #FFF";
    }
    @return unquote($shadows);
  }

  $small-stars: custom-box-shadow(700);
  $medium-stars: custom-box-shadow(200);
  $large-stars: custom-box-shadow(100);

  .star {
    position: absolute;
    top: 0px;
    background: transparent;
  }

  .star:after {
    content: " ";
  }

  #small-stars {
    width: 1px;
    height: 1px;
    box-shadow: $small-stars;
    animation: risingStar 50s linear infinite;
  }

  #small-stars:after {
    width: 1px;
    height: 1px;
    box-shadow: $small-stars;
  }

  #medium-stars {
    width: 2px;
    height: 2px;
    box-shadow: $medium-stars;
    animation: risingStar 100s linear infinite;
  }

  #medium-stars:after {
    width: 2px;
    height: 2px;
    box-shadow: $medium-stars;
  }

  #large-stars {
    width: 3px;
    height: 3px;
    box-shadow: $large-stars;
    animation: risingStar 150s linear infinite;
  }

  #large-stars:after {
    width: 3px;
    height: 3px;
    box-shadow: $large-stars;
  }

  @keyframes risingStar {
    from {
      transform: translateY(-2000px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
