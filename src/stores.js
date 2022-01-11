import { writable } from 'svelte/store';
import {temp} from "./default"

let storedApods = localStorage.getItem("apods");
if (storedApods === null) {
    storedApods = temp;
} else {
    storedApods = JSON.parse(storedApods);
}

export const APODS = writable(storedApods);

APODS.subscribe((value) => {
    localStorage.setItem("apods", JSON.stringify(value))
})

export const api_endpoint = "https://api.nasa.gov/planetary/apod";
export const api_key = "EmctfnsF39isdaldNowR3uk0Js7gnjHoOcmkw135";
