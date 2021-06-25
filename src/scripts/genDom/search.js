import { treeMap } from "../d3/treemap";
import { creditsParser } from "../tmdb/data_builder";
import { deleteLocalStorage, manageLocalStorage } from "../utils/browser_utils";
import { addDiv } from "./basicElements";
import '../../styles/search.scss'
import { bubbleMaker } from "../d3/bubble";
import { deleteSVGs } from "../utils/d3_utils";
import { d3Relay } from "../d3/d3Relay";


export const addClearSearchButton = (searchContainer) => {
    const clearSearchButton = document.createElement('button');
    clearSearchButton.setAttribute("id", "clearSearchButton");
    clearSearchButton.textContent = "reset search"
    clearSearchButton.style.display = "none"
    searchContainer.appendChild(clearSearchButton)
}
export const addSearch = () => {
    const makeSearch = document.createElement('input');
    makeSearch.setAttribute("type", "search")
    makeSearch.setAttribute("id", "searchBar")
    makeSearch.setAttribute("placeholder", "look up a director - enter to search")
    const addDivParams = {
        append: (div) => document.body.appendChild(div),
        type: "class", 
        text: "search-container"}
    let searchContainer = addDiv(addDivParams)
    searchContainer.appendChild(makeSearch);
    addClearSearchButton(searchContainer);
}

addSearch()

const sleep = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
}

const searchContainer = document.getElementsByClassName("search-container")
const searchBar = document.getElementById("searchBar");
const clearSearch = document.getElementById("clearSearchButton");

searchBar.addEventListener("keyup", e => { 
    const searchString = e.target.value; 
});

const loadingIcon = addDiv({
    append: div => searchContainer[0].insertAdjacentElement('afterend',div),
    type: 'class',
    text: 'loader'
})

loadingIcon.style.display = "none"

searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter"){
        creditsParser(e.target.value, 'Director').then(resp => { 
            manageLocalStorage({
                cast: resp.castFamiliars,
                crew: resp.crewFamiliars,
                counter: resp.counter, 
                searchQuery: resp.searchQuery,
            })
            d3Relay(resp.searchQuery.input, loadingIcon);
            clearSearch.style.display = "block";
            loadingIcon.style.display = "block"
        })
        sleep().then(() => {searchBar.value = ""})
    }
})


clearSearch.addEventListener("click", e => {
    e.preventDefault();
    const d3s = document.getElementsByClassName("d3div")
    deleteSVGs([...d3s]);
    deleteLocalStorage();
})



// (document.getElementById('bubble') === null) ? null : clearSearch.style.display = "block"