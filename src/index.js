import "regenerator-runtime/runtime";
import {addDiv} from "./scripts/utils/basicElementGen";
addDiv({
    append: (div) => document.body.appendChild(div),
    type: "id",
    text: "d3-container"
})
import { siteTitle } from "./scripts/components/site-title";
import { creditsParser } from "./scripts/tmdb/data_builder";
import { treeMap } from "./scripts/d3/treemap";
import './scripts/components/search'
import './scripts/components/typeahead'
import './styles/index.scss'
import './styles/d3.css'
import { deleteLocalStorage, manageLocalStorage } from "./scripts/utils/browser_utils";
import { HireMeModal } from "./scripts/components/hireMeModal";
import { infoModal } from "./scripts/components/info_modal";
import { bubbleMaker } from "./scripts/d3/bubble";

window.onload = () => {
    deleteLocalStorage();
}

const directorPreload = (directors) => {
    
    infoModal()
    HireMeModal()

    directors.forEach(director => {
        creditsParser(director, 'Director').then(resp => { 
            manageLocalStorage({
                cast: resp.castFamiliars,
                crew: resp.crewFamiliars,
                counter: resp.counter, 
                searchQuery: resp.searchQuery,
            })
            treeMap(director);
        })
    })

}

// directorPreload(['michael mann' ])
const pageLoader = async () => {
    directorPreload(['claire denis', 'Spike Lee', 'martin scorsese' ])
    await new Promise(resolve => setTimeout(resolve, 2000))
    bubbleMaker('Spike Lee')
}

pageLoader();
