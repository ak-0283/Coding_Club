
const responses = {
    "hello": "Hi there! How can I assist you today?",
    "how are you": "I'm just a bot, but I'm doing great! How about you?",
    "what's your name": "I'm an AI chatbot created to help you!",
    "tell me a joke": "Why don't programmers like nature? It has too many bugs!",
    "bye": "Goodbye! Have a great day!",
    "what is your purpose": "I am here to assist you with basic queries and chat with you!",
    "who created you": "I was created by a developer who loves coding!",
    "what is the meaning of life": "The meaning of life is subjective, but staying happy and learning is a good start!",
    "what is ai": "Artificial Intelligence is the simulation of human intelligence in machines that can learn and make decisions!",
    "what is javascript": "JavaScript is a programming language used to make web pages interactive!",
    "tell me a fun fact": "Did you know that honey never spoils? Archaeologists found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat!",
    "what is html": "HTML stands for HyperText Markup Language. It is the standard language for creating web pages!",
    "what is css": "CSS stands for Cascading Style Sheets. It is used to style and design web pages!",
    "recommend a book": "I recommend 'Clean Code' by Robert C. Martin if you're into programming!",
    "who is the best superhero": "That's subjective! Some say Batman, others say Spider-Man. What do you think?",
    "what is your favorite color": "I like all colors, but blue is quite nice!",
    "who won the last world cup": "You'll have to check the latest updates for that, but historically, Brazil and Germany have won many!",
    "default": "I'm not sure how to respond to that, but I'm here to chat!"
};

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
}

function showTypingIndicator() {
    const chat = document.getElementById("chat");
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot");
    typingDiv.id = "typing-indicator";
    
    typingDiv.innerHTML = `
        <div class="avatar">
            <img src="https://robohash.org/ribot.png" alt="User Avatar">
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chat.appendChild(typingDiv);
    chat.scrollTop = chat.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById("typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function appendMessage(sender, text) {
    const chat = document.getElementById("chat");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    
    const time = getCurrentTime();
    
    if (sender === "user") {
        msgDiv.innerHTML = `
            <div class="avatar">
                <img src="https://robohash.org/user.png" alt="User Avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="avatar">
                <img src="https://robohash.org/ribot.png" alt="Bot Avatar">
            </div>
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
    }
    
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;
    
    appendMessage("user", message);
    input.value = "";
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate thinking and typing time
    const typingTime = Math.min(1000 + message.length * 30, 3000);
    
    setTimeout(() => {
        removeTypingIndicator();
        const response = responses[message.toLowerCase()] || responses["default"];
        appendMessage("bot", response);
    }, typingTime);
}

// Handle enter key press
document.getElementById("userInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Show a welcome message when the page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        appendMessage("bot", "Hello! I'm your AI assistant. How can I help you today?");
    }, 500);
});
