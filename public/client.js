const socket = io();

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const fileInput = document.getElementById('file-input');

chatInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const message = chatInput.value.trim();
        if (message !== '') {
            socket.emit('chat message', message);
            chatInput.value = '';
        }
    }
});

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            socket.emit('file upload', data.filePath);
        })
        .catch(error => console.error('Error uploading file:', error));
    }
});

socket.on('chat message', (msg) => {
    const messageElement = document.createElement('div');
    messageElement.textContent = msg;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

socket.on('file upload', ({ username, filePath }) => {
    const fileElement = document.createElement('div');
    fileElement.innerHTML = `<strong>${username}</strong>: <a href="${filePath}" target="_blank">Download File</a>`;
    
    // Handle displaying images, videos, or other files appropriately
    if (/\.(jpg|jpeg|png|gif)$/i.test(filePath)) {
        fileElement.innerHTML += `<br><img src="${filePath}" alt="Image" style="max-width: 100%;">`;
    } else if (/\.(mp4|webm|ogg)$/i.test(filePath)) {
        fileElement.innerHTML += `<br><video src="${filePath}" controls style="max-width: 100%;"></video>`;
    }
    
    chatBox.appendChild(fileElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});
