import { treeMap } from "../d3/treemap";
import { creditsParser } from "../tmdb/data_builder";
import { deleteLocalStorage, manageLocalStorage } from "../utils/browser_utils";
import { addDiv } from "./basicElements";
import '../../styles/search.scss'
import { bubbleMaker } from "../d3/bubble";
import { deleteSVGs } from "../utils/d3_utils";
import { d3Relay } from "../d3/d3Relay";
import { clearTitle, handleIcon, loadingIcon, useIcon, waitOrNot } from "./bubbleStuff";


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

// const loadingIcon = addDiv({
//     append: div => searchContainer[0].insertAdjacentElement('afterend',div),
//     type: 'class',
//     text: 'loader'
// })

// loadingIcon.style.display = "none"

searchBar.addEventListener("keypress", async (e) => {
    if (e.key === "Enter"){
        const resp = await creditsParser(e.target.value, 'Director').then(resp => { 
            manageLocalStorage({
                cast: resp.castFamiliars,
                crew: resp.crewFamiliars,
                counter: resp.counter, 
                searchQuery: resp.searchQuery,
            }); 
            return resp; 
        })
        // debugger
        if (waitOrNot(e.target.value)){
            const bubbleContainer = document.getElementById('bubble-chart')
            let icon = (document.getElementsByClassName('loader').length > 0) ? document.getElementsByClassName('loader') : loadingIcon(bubbleContainer, true)  //same idea- passing it bubbleContainer so that it can append loading Icon to it
            if (HTMLCollection.prototype.isPrototypeOf(icon)){
                icon = icon[0]
            }
            document.getElementById("bubble").remove()
            clearTitle();
            icon.style.display="block"
            await new Promise(resolve => setTimeout(resolve, 1000))
            icon.style.display = "none"
        }
        // handleIcon(resp.searchQuery)
        d3Relay(resp.searchQuery.input);
        clearSearch.style.display = "block";
        async () => await new Promise(resolve => setTimeout(resolve, 1000))
        searchBar.value = ""
    }
})


clearSearch.addEventListener("click", e => {
    e.preventDefault();
    const d3s = document.getElementsByClassName("d3div")
    deleteSVGs([...d3s]);
    clearTitle();
    deleteLocalStorage();
})



// (document.getElementById('bubble') === null) ? null : clearSearch.style.display = "block"