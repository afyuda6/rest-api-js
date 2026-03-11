const http = require('http');
const url = require('url');
const {userHandler} = require('./handlers/user');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    userHandler(path, req, res);
});

const PORT = process.env.PORT || 6008;
server.listen(PORT, () => {
});