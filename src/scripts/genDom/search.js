import { treeMap } from "../d3/treemap";
import { creditsParser } from "../tmdb/data_builder";
import { appendLocalStorage, localStorageManager } from "../utils/browser_utils";
import { addDiv } from "./basicElements";
import '../../styles/search.css'

export const addClearSearchButton = (searchContainer) => {
    const clearSearchButton = document.createElement('button');
    clearSearchButton.setAttribute("id", "clearSearchButton");
    searchContainer.appendChild(clearSearchButton)
}
export const addSearch = () => {
    const makeSearch = document.createElement('input');
    makeSearch.setAttribute("type", "search")
    makeSearch.setAttribute("id", "searchBar")
    makeSearch.setAttribute("placeholder", "look up a director")
    const addDivParams = {
        append: (div) => document.body.appendChild(div),
        type: "class", 
        text: "search-container"}
    let searchContainer = addDiv(addDivParams)
    searchContainer.appendChild(makeSearch);
    addClearSearchButton(searchContainer);
}

addSearch()


const searchBar = document.getElementById("searchBar");

searchBar.addEventListener("keyup", e => { 
    const searchString = e.target.value; 
});

searchBar.addEventListener("keypress", async (e) => {
    if (e.key === "Enter"){
        creditsParser(e.target.value, 'Director').then(resp => { 
            appendLocalStorage({counter: resp.counter, searchQuery: resp.searchQuery})
            treeMap(resp.counter, resp.searchQuery)})
    }
})