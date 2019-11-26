const http = require('http');
const crypto = require('crypto');
const static = require('node-static');
const file = new static.Server('./');

function generateAcceptValue (acceptKey) {
    return crypto
    .createHash('sha1')
    .update(acceptKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'binary')
    .digest('base64');
}

const server = http.createServer((req, res) => {
    req.addListener('end', () => file.serve(req, res)).resume();
});

server.on('upgrade', (req, socket, head) => {
    if (req.headers['upgrade'] !== 'websocket') {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }

    const acceptKey = req.headers['sec-websocket-key']; 
    // Generate the response value to use in the response: 
    const hash = generateAcceptValue(acceptKey); 
    // Write the HTTP response into an array of response lines: 
    const responseHeaders = [ 'HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}` ]; 
    // Write the response back to the client socket, being sure to append two 
    // additional newlines so that the browser recognises the end of the response 
    // header and doesn't continue to wait for more header data: 

    // Read the subprotocol from the client request headers:
    const protocol = req.headers['sec-websocket-protocol'];
    // If provided, they'll be formatted as a comma-delimited string of protocol
    // names that the client supports; we'll need to parse the header value, if
    // provided, and see what options the client is offering:
    const protocols = !protocol ? [] : protocol.split(',').map(s => s.trim());
    // To keep it simple, we'll just see if JSON was an option, and if so, include
    // it in the HTTP response:
    if (protocols.includes('json')) {
        // Tell the client that we agree to communicate with JSON data
        responseHeaders.push(`Sec-WebSocket-Protocol: json`);
    }

    socket.write(responseHeaders.join('\r\n') + '\r\n\r\n');
    
    socket.on('data', data => { 
        console.log(data.toString()) 
        socket.write('data was succesfully received by server')
    })
})
const port = 3210;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));