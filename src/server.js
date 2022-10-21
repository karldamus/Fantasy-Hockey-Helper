// Setup the localhost server on port 3000
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static(__dirname + '/public'));


// Send test message to the client
app.get('/', (req, res) => {
    // send index.html from public along with any other files in public
    res.sendFile(path.join(__dirname + '/public/index.html'));
});







// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    }
);
