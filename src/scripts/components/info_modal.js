import '../../styles/infoModal.css'
import { addDiv } from "../utils/basicElementGen";

export const infoModal = (props) => {

    let isVisible = true;

    const handleClick = (e) => {
        e.preventDefault
        let modal = document.getElementById('infoDiv')
        if (modal.style.display === "none") {modal.removeAttribute("style")}
        isVisible? modal.className = "info-container close" : modal.className = "info-container is-open"
        isVisible = !isVisible
    }

    const openModalBtn = () => {
        let btn = document.createElement('button')
        btn.addEventListener("click", handleClick);
        btn.setAttribute('id', 'info-btn')
        btn.innerText = "Hire Me!"
        document.body.appendChild(btn)
    }

    const genChildElements = (container) => {
        const infoBoxParams = {
            append: div => container.appendChild(div),
            type: 'class',
            text: 'info-box'
        }
        let infoBox = addDiv(infoBoxParams)
        infoBox.setAttribute('id', 'info-box')

        let span = document.createElement('span')
        span.innerHTML = '&times;'
        span.setAttribute('class', 'info-container-close')
        span.addEventListener("click", handleClick);

        let h3 = document.createElement('h3');
        h3.innerText = 'How this works:'
        h3.setAttribute('id', 'info-modal-title')

        let screen = document.createElement('div');
        screen.className="modal-screen js-modal-close";

        infoBox.appendChild(span)
        infoBox.appendChild(h3)

        let infoBoxBodyParams = {
            append: (div) => infoBox.appendChild(div),
            type: "class", 
            text: "info-box-body"
        }
        let infoBoxBody = addDiv(infoBoxBodyParams)

        // infoBoxBody.innerText=
        // "Use the search bar to search for any film director you like. A few of my favorite directors are preloaded for you to the left—click on those to get a sense of what this vizualization produces. What you'll see displayed represents those cast and crew members with whom the director's worked with more than once, with the size of each bubble corresponding to the number of times they've collaborated. Make sense?"

        const list = document.createElement('ul')
        list.setAttribute('id','info-text')
        const listEleOne = document.createElement('li')
        listEleOne.innerText = "Use the search bar to search for any film director you like."
        listEleOne.setAttribute('class','info-list-ele')
        const listEleTwo = document.createElement('li')
        listEleTwo.innerText = "A few of my favorite directors are preloaded for you to the left—click on those to get a sense of what this vizualization produces."
        listEleTwo.setAttribute('class','info-list-ele')
        const listEleThree = document.createElement('li')
        listEleThree.innerText = "What you'll see displayed represents those cast and crew members with whom the director's worked with more than once. The size of each bubble corresponds to the number of times they've collaborated. Make sense?"
        listEleThree.setAttribute('class','info-list-ele')
        const listEleFour = document.createElement('li')

        infoBox.appendChild(list)
        list.appendChild(listEleOne)
        list.appendChild(listEleTwo)
        list.appendChild(listEleThree)
        list.appendChild(listEleFour)

        let closeButton = document.createElement('button');
        closeButton.addEventListener("click", handleClick);
        closeButton.setAttribute('id', 'close-info-btn')
        closeButton.innerText = "Yes!"
        infoBox.appendChild(closeButton)
        container.appendChild(screen)
    }

    const genSVGs = (container) => {
        let svgContainer = document.createElement('div')
        svgContainer.setAttribute('id', 'svg-container');
        container.appendChild(svgContainer)
        renderLinkedIn(svgContainer);
        renderGithub(svgContainer);
    }

    const addInfoDiv = () => {
        const addDivParams = {
            append: (div) => document.body.appendChild(div),
            type: "class", 
            text: "info-container is-open"}
        let infoDiv = (addDiv(addDivParams))
        infoDiv.setAttribute('id', 'infoDiv')    
        return infoDiv
    }
    let infoDivContainer = addInfoDiv()
    genChildElements(infoDivContainer)

    document.addEventListener("click", e => {
        const infoBox = document.getElementById("info-box")
        const clickOutside = (!infoBox.contains(e.target));
        let modal = document.getElementById('infoDiv')
        if (modal.className === "info-container is-open"){
            if(clickOutside) {
                let modal = document.getElementById('infoDiv')
                if (modal.style.display === "none") {modal.removeAttribute("style")}
                isVisible? modal.className = "info-container close" : modal.className = "info-container is-open"
                isVisible = !isVisible
            }
        }
    })
}

