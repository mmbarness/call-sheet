import { addDiv } from "../utils/basicElementGen"

export const siteTitle = () => {

    const addTitle = addDiv({
        append: (div) => document.body.appendChild(div),
        type: "id", 
        text: "siteTitle",
        innerText: 'Call Sheet'
    })

}

siteTitle();