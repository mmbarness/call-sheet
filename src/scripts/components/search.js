import { creditsParser } from "../tmdb/data_builder";
import { deleteLocalStorage, manageLocalStorage } from "../utils/browser_utils";
import { addDiv } from "../utils/basicElementGen";
import '../../styles/search.scss'
import { deleteSVGs, fetchIcon } from "../utils/d3/d3_utils";
import { d3Relay } from "../d3/d3Relay";
import { clearTitle, waitOrNot } from "./bubbleStuff";
import { addSearch, capitalizeCorrectly, handleNoSearch, queryChecker } from "../utils/searchUtils";

addSearch()

const searchBar = document.getElementById("searchBar");
const clearSearch = document.getElementById("clearSearchButton");

searchBar.addEventListener("keyup", e => { 
    const searchString = e.target.value; 
});

searchBar.addEventListener("keypress", async (e) => { //search functionality here
    if (e.key === "Enter"){
        const query = capitalizeCorrectly(e.target.value)
        let searchValid = await queryChecker(query)
        if (searchValid.error === "none") {
            null 
        } else {
            return handleNoSearch(searchBar, searchValid)
        }
        creditsParser(e.target.value, 'Director').then(resp => { 
            if (resp === "nothing found") {handleNoSearch()}
            manageLocalStorage({
                cast: resp.castFamiliars,
                crew: resp.crewFamiliars,
                counter: resp.counter, 
                searchQuery: resp.searchQuery,
            }); 
        })
        if (waitOrNot(e.target.value)){
            const icon = fetchIcon()
            clearTitle();
            icon.style.display="block"
            await new Promise(resolve => setTimeout(resolve, 1500))
            icon.style.display = "none"
        }
        d3Relay(e.target.value);
        clearSearchButton.style.display = "block";
        async () => await new Promise(resolve => setTimeout(resolve, 1000))
        searchBar.value = ""
    }
})


clearSearch.addEventListener("click", e => { //clears search bar
    e.preventDefault();
    const d3s = document.getElementsByClassName("d3div")
    deleteSVGs([...d3s]);
    clearTitle();
    deleteLocalStorage();
})

