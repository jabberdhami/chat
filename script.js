document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Generate a random username
    const username = `User${Math.floor(Math.random() * 1000)}`;

    // Function to fetch messages
    const fetchMessages = () => {
        fetch('chat.php')
            .then(response => response.text())
            .then(messages => {
                messagesDiv.innerHTML = '';
                messages.trim().split('\n').forEach(msg => {
                    if (msg) {
                        const messageElement = document.createElement('div');
                        messageElement.textContent = msg;
                        messagesDiv.appendChild(messageElement);
                    }
                });
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            })
            .catch(error => console.error('Error fetching messages:', error));
    };

    // Function to send a message
    const sendMessage = () => {
        const message = messageInput.value.trim();
        if (message) {
            fetch('chat.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ message: message, username: username })
            })
            .then(response => response.text())
            .then(() => {
                messageInput.value = '';
                fetchMessages();
            })
            .catch(error => console.error('Error sending message:', error));
        }
    };

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });

    // Fetch messages every 2 seconds
    setInterval(fetchMessages, 2000);

    // Initial fetch
    fetchMessages();
});
