export const makeBubbleContainer = (bool) => {
    const container = document.getElementById("d3-container")
    const bubbleContainer = document.createElement('div');
    bubbleContainer.setAttribute("id", "bubble-chart")
    bubbleContainer.setAttribute("class", "d3div")
    container.insertAdjacentElement('beforeend', bubbleContainer);
    return (bool ? bubbleContainer : null )
}

export const titleizeBubbleChart = (title) => {
    const bubbleContainer = document.getElementById('bubble-chart');
    const titleEle = document.createElement('h2');
    titleEle.setAttribute('id', 'bubble-chart-title')
    titleEle.textContent = title
    bubbleContainer.insertAdjacentElement('afterbegin', titleEle);
}