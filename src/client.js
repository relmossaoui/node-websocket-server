const ws = new WebSocket('ws://localhost:3210');

ws.addEventListener('open', () => {
    // Send a message to the WebSocket server
    ws.send('Hello!');
});

ws.addEventListener('message', event => {
    // The `event` object is a typical DOM event object, and the message data sent
    // by the server is stored in the `data` property
    console.log('Received:', event.data);
});




