import { addDiv } from "./basicElements";

export const makeBubbleContainer = (bool) => {
    const container = document.getElementById("d3-container")
    const bubbleContainer = document.createElement('div');
    bubbleContainer.setAttribute("id", "bubble-chart")
    container.insertAdjacentElement('beforeend', bubbleContainer);
    return (bool ? bubbleContainer : null )
}

export const titleizeBubbleChart = (title) => {
    const bubbleContainer = document.getElementById('bubble-chart');
    const titleEle = document.createElement('h2');
    titleEle.setAttribute('id', 'bubble-chart-title')
    titleEle.setAttribute('class', 'd3div')
    titleEle.textContent = title
    bubbleContainer.insertAdjacentElement('afterbegin', titleEle);
}

export const clearTitle = () => {
    const bubbleTitle = document.getElementById('bubble-chart-title');
    if (bubbleTitle) {bubbleTitle.remove()};
}

export const loadingIcon = (bubbleContainer, bool) => {
    const loadingIcon = addDiv({
        append: div => bubbleContainer.insertAdjacentElement('beforeend',div),
        type: 'class',
        text: 'loader'
    })
    loadingIcon.style.display = "none"
    return (bool ? loadingIcon : null )
}

export const waitOrNot = (searchQuery) => {
    const icon = document.getElementById(`${searchQuery.replace(" ", "-")}-treemap`)
    // debugger;
    return ((icon === null) ? true : false);
}

export const useIcon = async (icon) => {
    icon.style.display="block"
    await new Promise(resolve => setTimeout(resolve, 1000))
    icon.style.display = "none"
}

export const handleIcon = async (searchQuery) => {
    const bubbleContainer = document.getElementById('bubble-chart')
    let icon = (document.getElementsByClassName('loader').length > 0) ? document.getElementsByClassName('loader') : loadingIcon(bubbleContainer, true)  //same idea- passing it bubbleContainer so that it can append loading Icon to it
    if (HTMLCollection.prototype.isPrototypeOf(icon)){
        icon = icon[0]
    }
    waitOrNot(searchQuery) ? useIcon(icon) : null
}