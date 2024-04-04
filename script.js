const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = "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" 
const initialHeight = chatInput.scrollHeight;

const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("theme-color");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class= "default-text">
                        <h1>Talk2meGPT, the Chatgpt Clone</h1>
                        <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);

}

loadDataFromLocalstorage ();

//Create a div
const createElement = (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add ("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //return the chat div
}

const getChatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p");


    //define API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
    },

    body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: userText,
        max_tokens: 2048,
        temperature: 0.2,
        n: 1,
        stop: null
    })

}

    try{
        const response = await (await fetch(API_URL, requestOptions )).json();
        pElement.textContent = response.choices[0].text.trim();
    } catch(error){
        pElement.classList.add("error");
        pElement.textContent = "Oops something went wrong. Please try again. ";
    }

    //remove typin animation and saving chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}

const copyResponse = (copyBtn) => {
    //Copy the content of the response to the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
     copyBtn.textContent = "done";
     setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                     <div class="chat-details">
                            <img src="images/chatbot.jpg" alt="chatbot-img">
                            <div class="typing-animation">
                                <div class="typing-dot" style="--delay: 0.2s"></div>
                                <div class="typing-dot" style="--delay: 0.3s"></div>
                                <div class="typing-dot" style="--delay: 0.4s"></div>
                        </div>
                    </div>
                        <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;

        //create a chat div with the user container
const incomingChatDiv = createElement(html, "incoming");
chatContainer.appendChild(incomingChatDiv);
getChatResponse(incomingChatDiv);

}

const handleOutgoingChat = () => {
    userText =  chatInput.value.trim(); //get input and remove extra spaces
    if(!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialHeight}px`;

        const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="images/Raf-user - Copia_resized.jpg" alt="user-img">
                                <p></p>
                        </div>
                    </div>`;

        //create a chat div with the user container
const outgoingChatDiv = createElement(html, "outgoing");
outgoingChatDiv.querySelector("p").textContent = userText;
document.querySelector(".default-text")?.remove();
chatContainer.appendChild(outgoingChatDiv);
chatContainer.scrollTo(0, chatContainer.scrollHeight);
setTimeout(showTypingAnimation, 500);
}

themeButton.addEventListener("click", () => {
    // Toggle body class for theme button and update theme on Localstorage
    document.body.classList.toggle("light-mode")
    localStorage.setItem("theme-color", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

deleteButton.addEventListener("click", () =>{
    //remove the chats from local storage and  loadDataFromLocalstorage function
    if (confirm("Are you sure you want to delete all the chat?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
})



chatInput.addEventListener("input", () =>{
    //Adjust the height of the input  field dynamically based on its content
    chatInput.style.height = `${initialHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) =>{
    //enter key and enter key + shift for add another line ... if its >> 800 pxs , handle the outgoing chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleOutgoingChat();
    }
});


sendButton.addEventListener("click", handleOutgoingChat);