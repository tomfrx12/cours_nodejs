require('dotenv').config();

var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express()

const authentification = require('./middlewares/authentification');
const validation = require('./middlewares/validation');

const SigninSchema = require('./validators/signin');
const LoginSchema = require('./validators/login');


if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET manquant en production — arrêt du processus.')
    process.exit(1)
}

// const data = [
//     {
//         id: 1,
//         email: "test@test.fr",
//         username: "a",
//         password: "aa"
//     }
// ]

app.use(express.json())

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db')

// db.serialize(() => {
//     db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(256), username TEXT NOT NULL, password TEXT NOT NULL)')
//     // const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)')

//     // for (let i = 0; i < data.length; i++) {
//     //     stmt.run(data[i].id, data[i].email, data[i].username, data[i].password)
//     // }

//     // stmt.finalize()

//     // db.each('SELECT * FROM users', (err, row) => {
//     //     console.log(`${row.id}: ${row.email} ${row.username} ${row.password}`)
//     // })
// })

// app.get('/api/', (req, res) => {
//     res.json(data)
// })

app.get('/api/protected', authentification, (req, res) => {
    db.all('SELECT * FROM users', (err, row) => {
        if (err) {
            return res.status(401)
        }
        return res.send({ message: 'Accès autorisé', user: req.user })
    })
})

// app.get('/api/:id', (req, res) => {
//     const id = parseInt(req.params.id)
//     const item = data.find(item => item.id === id)
    
//     if (!item) {
//         return res.status(404).json({ error: 'Ressource introuvable' })
//     }
//     res.json(item)
// })

app.get('/api/:id', (req, res) => {
    db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ erreur: err.message });
        }
        res.json(row);
    });
});

// app.post('/api/:id', (req, res) => {
//     db.run('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [req.body.id, req.body.username, req.body.password], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ erreur: err.message });
//         }
//         res.send(`L'id ${req.body.id} avec comme username ${req.body.username} et password ${req.body.password} à été ajouté`)
//     })
// })

app.post('/api/signin', validation(SigninSchema), async (req, res) => {
    try {
        const hash = await bcrypt.hashSync(req.validated.password, 10);
    
        db.get('SELECT * FROM users WHERE username = ? OR email = ?', [req.validated.username, req.validated.email], (err, row) => {
            if (err) return res.statusMessage(500).json({erreur: err.message})
            if (row) return res.send(`L'email ou le username existe déjà`)
    
            db.run('INSERT INTO users (email, password, username) VALUES (?, ?, ?)', [req.validated.email, hash, req.validated.username], (err) => {
                if (err) return res.status(500).json({ erreur: err.message })
                else {
                    res.send(`L'username ${req.validated.username} à été ajouté`)
                }
            })
        })
    } catch (err) {
        return res.status(500).json({ erreur: err.message });
    }
});

app.post('/api/login', validation(LoginSchema), async (req, res) => {
    await db.get('SELECT * FROM users WHERE email = ?', [req.validated.email], async (err, row) => {
        if (!row) {
            return res.status(401).json({message: "Email incorrect"});
        }

        const valide = await bcrypt.compare(req.validated.password, row.password);
        if (!valide) {
            return res.status(401).json({ message: "Mot de passe incorrect"});
        }
    
        const token = jwt.sign({users: req.validated.email}, process.env.JWT_SECRET, { expiresIn: '2h'})
        res.send(token)
    });
})

app.put('/api/:id', (req, res) => {
    db.run('UPDATE users SET username = ? WHERE id = ?', [req.body.username, req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ erreur: err.message });
        }
        res.send(`L'username ${req.body.username} à été modifié avec comme id ${req.params.id}`)
    })
})

app.delete('/api/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ erreur: err.message });
        }
        res.send(`L'id: ${req.params.id} à été supprimé`)
    });
});

app.listen(process.env.PORT, () => {})