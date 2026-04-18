const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");
const chatBox = document.getElementById("chat-box");

// Send message
button.addEventListener("click", sendMessage);
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user");
    input.value = "";

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.reply) {
            addMessage(data.reply, "ai");
        } else {
            addMessage("Error: No response", "ai");
        }

    } catch (error) {
        addMessage("Error connecting to server", "ai");
    }
}

// Add message to UI
function addMessage(text, sender) {
    const div = document.createElement("div");
    div.classList.add("message", sender);
    div.innerText = text;
    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}