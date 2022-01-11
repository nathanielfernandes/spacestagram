<script>
  import { onMount } from "svelte";
  import { APODS, api_endpoint, api_key } from "./stores";
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

  APODS.set(fix($APODS));
  onMount(async () => {
    // const resp = await fetch(
    //   `${api_endpoint}?api_key=${api_key}&concept_tags=True&count=5&thumbs=True`
    // );
    // let json = await resp.json();
    // console.log(json);
    // APODS.set(json);
  });
</script>

<main>
  <h1><img class="logo" alt="logo" src="./unspace.svg">Unspace</h1>
  <h2>Brought to you by NASA's APOD API</h2>
  <div id="small-stars" />
  <div id="medium-stars" />
  <div id="large-stars" />
  <BetterGrid gridGap={"2rem"} colWidth={"minmax(Min(25rem, 100%), 1fr)"}>
    {#each $APODS as apod, i}
      <Card {apod} {i} />
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

  main {
    text-align: center;
    /* padding: 1em; */
    /* max-width: 240px; */
    color: white;
    margin: 0;
    padding: 0;
    height: 100%;
    background: radial-gradient(ellipse at bottom, #21284f 0%, #0a0b11 100%);

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

  @function custom-box-shadow ($n) {
    $shadows:  random(2000) + 'px ' + random(2000) + 'px 2px #FFF';
    @for $i from 2 through $n {
      $shadows: $shadows + ', ' + random(2000) + 'px ' + random(2000) + 'px 2px #FFF';
    }
    @return unquote($shadows)
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
