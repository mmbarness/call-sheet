// export const LinkedInSVG = ({id = 3}) => {
//     return(
//         <svg id={id} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//             <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//         </svg>
//     )
// }

export const renderLinkedIn = (node) => {
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
    );

    iconSvg.setAttribute('fill', '#2867B2');
    iconSvg.setAttribute('viewBox', '0 0 24 24');
    iconSvg.setAttribute('width', '50');
    iconSvg.setAttribute('height', '50');
    iconSvg.classList.add('post-icon');

    iconPath.setAttribute(
        'd',
        'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
    );
    iconPath.setAttribute('stroke-linecap', 'round');
    iconPath.setAttribute('stroke-linejoin', 'round');
    iconPath.setAttribute('stroke-width', '2');

    iconSvg.appendChild(iconPath);

    let linkedInLink = document.createElement('a'); 
    linkedInLink.setAttribute('id', "linkedIn-link");
    linkedInLink.classList.add('professional-links')
    linkedInLink.href = "https://www.linkedin.com/in/matthew-barnes-61162b64/"
    linkedInLink.target = "_blank";
    linkedInLink.rel = "noopener noreferrer"
    node.appendChild(linkedInLink);

    return linkedInLink.appendChild(iconSvg);
}

{/* <a href="https://www.linkedin.com/in/matthew-barnes-61162b64/" id="linkedIn-checkout-link" target="_blank" rel="noopener noreferrer">
    {<LinkedInSVG id="linkedin-checkout-svg"/>}
</a> */}