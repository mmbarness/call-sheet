import { addDiv } from "../utils/basicElementGen"

export const siteTitle = (props) => {

    addDiv({
        append: (div) => props.container.appendChild(div),
        type: "id", 
        text: "siteTitle",
        innerText: 'Call Sheet'
    })
}
