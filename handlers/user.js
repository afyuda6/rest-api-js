const db = require('../database/sqlite');

const userHandler = (req, res) => {
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
};

const handleReadUsers = (req, res) => {
    db.all('SELECT * FROM users', [], (err, users) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({status: 'OK', code: 200, users: users}));
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

        if (name === null) {
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

        if (name === null || id === null) {
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

        if (id === null) {
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

module.exports = {userHandler};
