import { addDiv } from "../utils/basicElementGen";
import { hireMeModal } from "./hireMeModal";
import { searchRunner } from "./search";
import { siteTitle } from "./siteTitle";
import '../../styles/topBar/topBar.css'

export const genTopBar = () => {
    const topBarParams = {
        append: div => document.body.appendChild(div),
        type: 'id',
        text: 'top-bar'
    }
    const topBar = addDiv(topBarParams);

    siteTitle({container: topBar})
    searchRunner({container: topBar});
    hireMeModal({container: topBar});
}