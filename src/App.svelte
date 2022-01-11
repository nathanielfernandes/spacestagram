<script>
  import { onMount, tick } from "svelte";
  import { APODS, preview, api_endpoint, api_key } from "./stores";
  import { debounce, clickOutside } from "./helpers";
  import Card from "./Card.svelte";
  import BetterGrid from "./BetterGrid.svelte";

  const fix = (apod) => {
    return apod
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
        a.explanation.toLowerCase().includes(s.toLowerCase())
    );
  }

  function index(ap) {
    for (let i = 0; i < ap.length; i++) {
      ap[i].index = i;
    }

    return ap;
  }

  const likes_filter = (ap) => ap.filter((a) => a.liked);

  APODS.set(index(fix($APODS)));

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

  onMount(async () => {
    // const resp = await fetch(
    //   `${api_endpoint}?api_key=${api_key}&concept_tags=True&count=5&thumbs=True`
    // );
    // let json = await resp.json();
    // console.log(json);
    // APODS.set(json);
  });

  // preview.subscribe((value) => {

  // });
</script>

<main>
  <h1><img class="logo" alt="logo" src="./unspace.svg" />Unspace</h1>
  <h2>Brought to you by NASA's APOD API</h2>

  <input
    placeholder="filter"
    on:input={refreshGrid}
    bind:value={typing_search_term}
  />
  <button
    on:click={() => {
      filter_likes = !filter_likes;
    }}>likes</button
  >
  <!-- back ground stars -->
  <div id="small-stars" />
  <div id="medium-stars" />
  <div id="large-stars" />

  <!-- preview -->
  {#if $preview}
    <div class="modal">
      <img
        class="preview"
        alt={$preview.title}
        src={$preview.hdurl || $preview.url}
        on:load={() => (image_loaded = true)}
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
  <BetterGrid
    gridGap={"1rem"}
    colWidth={"minmax(Min(25rem, 100%), 1fr)"}
    items={apods}
  >
    {#each apods as apod}
      {#if apod}
        <Card {apod} />
      {/if}
    {/each}
  </BetterGrid>
</main>

<svelte:head>
  <!-- <link
    rel="stylesheet"
    href="https://unpkg.com/@shopify/polaris@7.5.0/build/esm/styles.css"
  /> -->
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
  />
</svelte:head>

<style lang="scss">
  // .container {
  //   position: absolute;
  // }

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

    position: relative;

    /* overflow: hidden; */
  }

  h1 {
    color: #ffffff;
    font-size: 4rem;
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
  }

  .logo {
    height: 5rem;
  }

  @function custom-box-shadow($n) {
    $shadows: random(2000) + "px " + random(2000) + "px 2px #FFF";
    @for $i from 2 through $n {
      $shadows: $shadows +
        ", " +
        random(2000) +
        "px " +
        random(2000) +
        "px 2px #FFF";
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
