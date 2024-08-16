<?php
$filename = 'messages.txt';

// Function to get messages
function getMessages() {
    global $filename;
    if (file_exists($filename)) {
        return file_get_contents($filename);
    } else {
        return '';
    }
}

// Function to save messages
function saveMessage($username, $message) {
    global $filename;
    $formattedMessage = htmlspecialchars($username) . ": " . htmlspecialchars($message);
    file_put_contents($filename, $formattedMessage . PHP_EOL, FILE_APPEND);
}

// Handle AJAX request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $message = $_POST['message'] ?? '';
    $username = $_POST['username'] ?? 'Anonymous';
    if ($message) {
        saveMessage($username, $message);
    }
    echo getMessages();
} else {
    echo getMessages();
}
?>
