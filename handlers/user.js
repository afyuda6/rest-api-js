const db = require('../database/sqlite');

const handleReadUsers = (req, res) => {
    db.all('SELECT * FROM users', [], (err, users) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'OK', code: 200, data: users}));
    });
};

const handleCreateUser = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = new URLSearchParams(body);
        const name = parsedBody.get('name');
        if (name == null || name.trim() === '') {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Bad Request', code: 400, errors: 'Missing \'name\' parameter'}));
            return;
        }
        db.run('INSERT INTO users (name) VALUES (?)', [name], function (err) {
            res.writeHead(201, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Created', code: 201}));
        });
    });
};

const handleUpdateUser = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = new URLSearchParams(body);
        const name = parsedBody.get('name');
        const id = parsedBody.get('id');
        if (name == null || id == null) {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Bad Request', code: 400, errors: 'Missing \'id\' or \'name\' parameter'}));
            return;
        }
        if (name.trim() === '' || id.trim() === '') {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Bad Request', code: 400, errors: 'Missing \'id\' or \'name\' parameter'}));
            return;
        }
        db.run('UPDATE users SET name = ? WHERE id = ?', [name, id], function (err) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'OK', code: 200}));
        });
    });
};

const handleDeleteUser = (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const parsedBody = new URLSearchParams(body);
        const id = parsedBody.get('id');
        if (id == null || id.trim() === '') {
            res.writeHead(400, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Bad Request', code: 400, errors: 'Missing \'id\' parameter'}));
            return;
        }
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'OK', code: 200}));
        });
    });
};

const userHandler = (path, req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    if (path === "/users/" || path === "/users") {
        const method = req.method;
        if (method === 'GET') {
            handleReadUsers(req, res);
        } else if (method === 'POST') {
            handleCreateUser(req, res);
        } else if (method === 'PUT') {
            handleUpdateUser(req, res);
        } else if (method === 'DELETE') {
            handleDeleteUser(req, res);
        } else {
            res.writeHead(405, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({status: 'Method Not Allowed', code: 405}));
        }
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'Not Found', code: 404}));
    }
};

module.exports = {userHandler};
