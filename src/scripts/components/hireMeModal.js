import '../../styles/topBar/hireMeModal.css'
import { addDiv } from "../utils/basicElementGen";
import { EmailMe } from './email_me';
import { renderGithub } from './svg/github';
import { renderLinkedIn } from './svg/linkedIn';

export const hireMeModal = (props) => {

    let isVisible = false;

    const handleClick = (e) => {
        e.preventDefault
        let modal = document.getElementById('hireMeDiv')
        if (modal.style.display === "none") {modal.removeAttribute("style")}
        isVisible? modal.className = "hire-me-container close" : modal.className = "hire-me-container is-open"
        isVisible = !isVisible
    }

    const openModalBtn = (container) => {
        let btn = document.createElement('button')
        btn.addEventListener("click", handleClick);
        btn.setAttribute('id', 'hire-me-btn')
        btn.innerText = "Hire Me!"
        container.appendChild(btn)
    }

    const genChildElements = (container) => {
        let span = document.createElement('span')
        span.innerHTML = '&times;'
        span.setAttribute('class', 'hire-me-container-close')
        span.addEventListener("click", handleClick);
        let h3 = document.createElement('h3');
        h3.innerText = 'Hire Me'
        h3.setAttribute('id', 'modal-title')
        let screen = document.createElement('div');
        screen.className="modal-screen js-modal-close"
        let hireMeBox = document.createElement('div');
        hireMeBox.setAttribute('class', 'hire-me-box')
        hireMeBox.setAttribute('id', 'hire-me-box')
        container.appendChild(hireMeBox)
        hireMeBox.appendChild(span)
        hireMeBox.appendChild(h3)
        genSVGs(hireMeBox)
        EmailMe(hireMeBox, handleClick);
        container.appendChild(screen)
    }

    const genSVGs = (container) => {
        let svgContainer = document.createElement('div')
        svgContainer.setAttribute('id', 'svg-container');
        container.appendChild(svgContainer)
        renderLinkedIn(svgContainer);
        renderGithub(svgContainer);
    }

    const addHireDiv = (container) => {
        const addDivParams = {
            append: (div) => container.appendChild(div),
            type: "class", 
            text: "hire-me-container"}
        let hireMeDiv = (addDiv(addDivParams))
        hireMeDiv.setAttribute('id', 'hireMeDiv')    
        return hireMeDiv
    }
    let openBtn = openModalBtn(props.container) 
    let hireMeContainer = addHireDiv(props.container)
    genChildElements(hireMeContainer)

    document.addEventListener("click", e => {
        const hireMeBox = document.getElementById("hire-me-box")
        const openBtn = document.getElementById("hire-me-btn")
        const clickOutside = (!hireMeBox.contains(e.target)) && (!openBtn.contains(e.target));
        let modal = document.getElementById('hireMeDiv')
        if (modal.className === "hire-me-container is-open"){
            if(clickOutside) {
                let modal = document.getElementById('hireMeDiv')
                if (modal.style.display === "none") {modal.removeAttribute("style")}
                isVisible? modal.className = "hire-me-container close" : modal.className = "hire-me-container is-open"
                isVisible = !isVisible
            }
        }
    })
}

