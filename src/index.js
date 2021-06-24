import "regenerator-runtime/runtime";
import { addDiv } from "./scripts/genDom/basicElements";
addDiv({
    append: (div) => document.body.appendChild(div),
    type: "id",
    text: "d3-container"
})
import { creditsParser } from "./scripts/tmdb/data_builder";
import { treeMap } from "./scripts/d3/treemap";
import './scripts/genDom/search'
import './scripts/genDom/basicElements'
import { addSearch } from "./scripts/genDom/search";
import './styles/index.scss'
import './styles/d3.css'

// import fs from "fs";


