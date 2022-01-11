<script>
  import { APODS, preview } from "./stores";

  import { fly, fade, slide } from "svelte/transition";
  export let apod;

  let i = apod.index;
  // $: liked = $APODS[i].liked;
  function like() {
    $APODS[i].liked = !$APODS[i].liked;
    APODS.set($APODS);
  }

  function full_preview() {
    preview.set(apod);
  }

  // remove unwated info
  apod.explanation = apod.explanation.replace(
    /digg_url = 'http:\/\/.+\/apod\/.+\.html'; digg_skin = '.+';/g,
    ""
  );

  const options = { year: "numeric", month: "long", day: "numeric" };
</script>

<div transition:fly class="card" style={`background-image: url(${apod.url})`}>
  <i class={`fa${apod.liked ? "s" : "r"} fa-heart`} on:click={like} />
  <i class="fas fa-expand exp" on:click={full_preview} />

  <div class="info">
    <h2>{apod.title}</h2>
    <p class="desc">
      {apod.explanation}
    </p>
  </div>

  <span class="date">
    {#if apod.copyright}
      <span class="cp">
        <i class="far fa-copyright" />
        {apod.copyright}<br />
      </span>
    {/if}
    {apod.date.toLocaleDateString("en-US", options)}
  </span>

  <!-- {#if apod.copyright}
    <span class="copyright">

    </span>
  {/if} -->

  <p class="placeholder">{apod.explanation}</p>
</div>

<style>
  .placeholder {
    /* padding: 8rem 0.5rem; */
    padding: 6rem 0.5rem;
    text-align: left;
    visibility: hidden;
    transition: all 200ms;
  }

  .card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--good-shadow);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
  }

  .card * {
    user-select: none;
  }

  .card .fa-heart {
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;
    color: white;
    font-size: 1.5rem;
    transition: 200ms;
    cursor: pointer;
    filter: drop-shadow(0 0 0.75rem black);
  }

  .card .fa-heart:hover {
    transform: scale(1.2);
  }

  .card .fa-heart:active {
    transform: scale(0.9);
  }

  .card:hover:before {
    opacity: 1;
  }
  .card::before {
    content: "";
    display: block;
    background: linear-gradient(
      180deg,
      rgba(86, 97, 108, 0.1) 0%,
      rgba(33, 52, 69, 0.8) 100%
    );
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: 500ms cubic-bezier(0.7, 0, 0.3, 1);
  }

  .info {
    position: absolute;
    padding: 0;
    margin: 0;
    bottom: calc(-100% + 12rem);
    padding: 0.5rem;
    transition: 500ms cubic-bezier(0.7, 0, 0.3, 1);
  }

  .info * {
    transition: 500ms cubic-bezier(0.7, 0, 0.3, 1);
    text-align: left;
  }

  .info h2 {
    color: rgba(255, 255, 255, 0.779);
    margin-bottom: 0;
  }

  .info p {
    text-align: justify;
    color: rgba(255, 255, 255, 0.43);
  }

  .card:hover > .info * {
    transition-delay: 200ms;
    color: white;
    text-shadow: var(--good-shadow);
  }

  .card:hover > .info {
    bottom: 10%;
  }

  .card .date {
    text-shadow: var(--good-shadow);
    position: absolute;
    color: rgba(255, 255, 255, 0.279);
    bottom: 0.5rem;
    right: -100%;
    transition: 500ms cubic-bezier(0.7, 0, 0.3, 1);
    text-align: right;
    font-weight: 200;
  }

  .card:hover > .date {
    animation-delay: 500ms;
    /* bottom: 0.5rem; */
    right: 0.5rem;
    color: white;
  }

  .card .copyright {
    text-shadow: var(--good-shadow);
    position: absolute;
    color: rgba(255, 255, 255, 0.279);
    bottom: 0.5rem;
    left: -100%;
    transition: 500ms cubic-bezier(0.7, 0, 0.3, 1);
    text-align: right;
  }

  .card:hover > .copyright {
    animation-delay: 500ms;
    /* bottom: 0.5rem; */
    left: 0.5rem;
    color: white;
    text-align: left;
  }

  .cp {
    font-size: 0.8rem;
  }

  .exp {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    color: white;
    font-size: 1.5rem;
    transition: 200ms;
    cursor: pointer;
    filter: drop-shadow(0 0 0.75rem black);
    transition: 200ms;
    opacity: 0;
  }

  .card:hover > .exp {
    opacity: 1;
  }

  .exp:hover {
    transform: scale(1.2);
  }

  .exp:active {
    transform: scale(0.9);
  }
</style>
