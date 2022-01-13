// CF Worker

addEventListener("fetch", (event) => {
    event.respondWith(
      handleRequest(event.request).catch(
        (err) => new Response(err.stack, { status: 500 })
      )
    );
});
  
const api_endpoint = "https://api.nasa.gov/planetary/apod";
const api_key = "<API_KEY>";

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "GET",
}

async function handleRequest(request) {
const { searchParams } = new URL(request.url);
const count = searchParams.get("count") || 5;

const resp = await fetch(`${api_endpoint}?api_key=${api_key}&count=${count}`);
const json = await resp.json();

    return new Response(JSON.stringify(json), {
    headers: {
        ...corsHeaders,
        "content-type": "application/json;charset=UTF-8"
    }
    })
}