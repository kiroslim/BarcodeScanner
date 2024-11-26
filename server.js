const https = require('https');
const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.static('build')); // Serves files from the 'build' folder

const options = {
  key: fs.readFileSync('./cert.key'), // Your private key file
  cert: fs.readFileSync('./cert.crt'), // Your certificate file
};

const PORT = 62835; // Replace with your desired port

https.createServer(options, app).listen(PORT, () => {
  console.log(`App is running at https://192.168.0.111:${PORT}`);
});
