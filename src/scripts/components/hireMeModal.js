// import { EmailMe } from '../contact/email_form';
// import { GithubSVG } from '../svg/github';
// import { LinkedInSVG } from '../svg/linkedIn';
import '../../styles/hireMeModal.css'
import { addDiv } from "../utils/basicElementGen";
import { EmailMe } from './email_me';
import { renderGithub } from './svg/github';
import { renderLinkedIn } from './svg/linkedIn';

export const HireMeModal = (props) => {

    let isVisible = false;

    const handleClick = (e) => {
        e.preventDefault
        let modal = document.getElementById('hireMeDiv')
        if (modal.style.display === "none") {modal.removeAttribute("style")}
        isVisible? modal.className = "hire-me-container is-open" : modal.className = "hire-me-container close"
        isVisible = !isVisible
    }

    const openModalBtn = () => {
        let btn = document.createElement('button')
        btn.addEventListener("click", handleClick);
        btn.setAttribute('id', 'hire-me-btn')
        btn.innerText = "Hire Me!"
        document.body.appendChild(btn)
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

    const addHireDiv = () => {
        const addDivParams = {
            append: (div) => document.body.appendChild(div),
            type: "class", 
            text: "hire-me-container"}
        let hireMeDiv = (addDiv(addDivParams))
        hireMeDiv.setAttribute('id', 'hireMeDiv')        
        return hireMeDiv
    }
    let openBtn = openModalBtn() 
    let hireMeContainer = addHireDiv()
    genChildElements(hireMeContainer)
    hireMeContainer.style.display = "none";
}

