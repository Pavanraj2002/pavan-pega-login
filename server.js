const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// ✅ Signup Route - Save to users.json
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const usersFile = path.join(__dirname, 'users.json');

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const userExists = users.find(u => u.username === username);
  if (userExists) return res.status(409).send("Username already exists.");

  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.send("Signup success");
});

// ✅ Login Route - Read from users.json
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const usersFile = path.join(__dirname, 'users.json');

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  } else {
    res.status(401).send("❌ Invalid credentials");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Pavan's PEGA Server is running at http://localhost:${PORT}`);
});
