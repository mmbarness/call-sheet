import emailjs from 'emailjs-com';

export const EmailMe = (container, handleClick) => {

    const sendEmail = async (e) => {
        let sendBtn = document.getElementById("send-email-btn")
        e.preventDefault();
        emailjs.sendForm('service_sjnz7oq', 'template_6dj2gbm', e.target, 'user_qq0BsoTqEV0SBv3Iw0Lvk')
            .then((result) => {
                
            }, (error) => {
                
        });
        sendBtn.value = "Sending..."
        await new Promise(r => setTimeout(r, 1000));
        sendBtn.value = "Sent!"
        await new Promise(r => setTimeout(r, 250));
        handleClick(e);
        sendBtn.value = "Send"
    }

    const makeForm = (formContainer) => {

        //form
        let form = document.createElement('form');
        form.id = "email-form"
        form.onsubmit = e => sendEmail(e);
        formContainer.appendChild(form);

        //hidden input
        let hiddenInput = document.createElement('input')
        hiddenInput.type = 'hidden';
        hiddenInput.name= 'contact_number';
        form.appendChild(hiddenInput);

        //Name Label/Input
        let nameLabel = document.createElement('label');
        nameLabel.classList.add('email-label-inputs')
        nameLabel.innerText = "Name:"
        let nameLabelInput = document.createElement('input');
        nameLabelInput.classList.add('email-inputs')
        nameLabelInput.type = "text";
        nameLabelInput.name = "user_name";
        nameLabel.appendChild(nameLabelInput);
        form.appendChild(nameLabel);

        //Email Label/Input
        let emailLabel = document.createElement('label');
        emailLabel.classList.add('email-label-inputs')
        emailLabel.innerText = "(Your) Email:"
        let emailLabelInput = document.createElement('input');
        emailLabelInput.classList.add('email-inputs')
        emailLabelInput.type = "text";
        emailLabelInput.name = "user_email";
        emailLabel.appendChild(emailLabelInput);
        form.appendChild(emailLabel);

        //Message Label/Input
        let messageLabel = document.createElement('label');
        messageLabel.classList.add('email-label-inputs')
        messageLabel.innerText = "Message:"
        let messageLabelInput = document.createElement('textarea');
        messageLabelInput.classList.add('email-inputs')
        messageLabelInput.name = "message";
        messageLabel.appendChild(messageLabelInput);
        form.appendChild(messageLabel);

        let inputSubmit = document.createElement('input');
        inputSubmit.type = "submit";
        inputSubmit.value = "Send";
        inputSubmit.id = "send-email-btn";
        form.appendChild(inputSubmit);
    }

    makeForm(container);

}
