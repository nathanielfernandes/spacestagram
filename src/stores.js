import { writable } from 'svelte/store';
import {temp} from "./default"

let storedApods = localStorage.getItem("apods");
if (storedApods === null) {
    storedApods = [];
} else {
    storedApods = JSON.parse(storedApods);
}

export const APODS = writable(storedApods);


APODS.subscribe((value) => {
    localStorage.setItem("apods", JSON.stringify(value))
})

export const preview = writable();

export const api_endpoint = "https://apod.nathaniel-fernandes.workers.dev/";

