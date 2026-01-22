var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express')
const app = express()
const port = 3000


// const data = [
//     {
//         id: 1,
//         email: "test@test.fr",
//         username: "a",
//         mdp: "aa"
//     }
// ]

app.use(express.json())

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./database.db')

// db.serialize(() => {
//     db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR(256), username TEXT NOT NULL, mdp TEXT NOT NULL)')
//     const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?, ?)')

//     for (let i = 0; i < data.length; i++) {
//         stmt.run(data[i].id, data[i].email, data[i].username, data[i].mdp)
//     }

//     stmt.finalize()

//     db.each('SELECT * FROM users', (err, row) => {
//         console.log(`${row.id}: ${row.email} ${row.username} ${row.mdp}`)
//     })
// })

// app.get('/api', (req, res) => {
//     res.json(data)
// })

app.get('/api', (req, res) => {
    db.all('SELECT * FROM users', (err, row) => {
        res.json(row)
    })
})

// SELECT * FROM users

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

// SELECT * FROM users WHERE id=1

app.post('/api/singin', async (req, res) => {
    const salt = 10;
    const PlainPassword = (`${req.body.mdp}`)
    const hash = await bcrypt.hashSync(PlainPassword, salt);

    db.get('SELECT * FROM users WHERE username= ?', [req.body.username], (err, row) => {
        if (err) {
            return res.statusMessage(500).json({erreur: err.message});
        } 
        else if (row) {
            res.send(`L'utilisateur ${req.body.username} existe déjà`)
        } 
        else {
            db.run('INSERT INTO users (username, mdp) VALUES (?, ?)', [req.body.username, hash], (err, row) => {
                if (err) {
                    return res.status(500).json({ erreur: err.message });
                }
                else {
                    res.send(`L'username ${req.body.username} à été ajouté`)
                }
            })
        }
    })
});

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
        return res.status(401).json({message: "Email ou mot de passe incorrect"});
    }

    const valide = await bcrypt.compare(password, user.password);
    if (!valide) {
        return res.statue(401).json({ message: "Email ou mot de passe incorrect"});
    }

    const token = jwt.sign({foo: "bar"}, "shhhhhh", { expiresIn: '4h'})
    console.log(token)
})

// app.post('/api/:id', (req, res) => {
//     db.run('INSERT INTO users (id, username, mdp) VALUES (?, ?, ?)', [req.body.id, req.body.username, req.body.mdp], (err, rows) => {
//         if (err) {
//             return res.status(500).json({ erreur: err.message });
//         }
//         res.send(`L'id ${req.body.id} avec comme username ${req.body.username} et mdp ${req.body.mdp} à été ajouté`)
//     })
// })

// INSERT INTO users (username, mdp) VALUES ('d', 'dd')

app.put('/api/:id', (req, res) => {
    db.run('UPDATE users SET username = ? WHERE id = ?', [req.body.username, req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ erreur: err.message });
        }
        res.send(`L'username ${req.body.username} à été modifié avec comme id ${req.params.id}`)
    })
})

// UPDATE users SET username='e' WHERE id=1

app.delete('/api/:id', (req, res) => {
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ erreur: err.message });
        }
        res.send(`L'id: ${req.params.id} à été supprimé`)
    });
});

// DELETE FROM users WHERE id=1

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})