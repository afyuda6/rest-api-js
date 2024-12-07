const http = require('http');
const url = require('url');
const {userHandler} = require('./handlers/user');

const notFound = (res) => {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({status: 'Not Found', code: 404}));
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (path === "/users/" || path === "/users") {
        userHandler(req, res);
    } else {
        notFound(res);
    }
});

const PORT = 6008;
server.listen(PORT, () => {
});
