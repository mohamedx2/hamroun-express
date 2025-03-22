import googleisima from '../src/index';

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

// Simple in-memory data store for testing
const users: User[] = [];

// Middleware to log requests
googleisima.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// GET routes
googleisima.get('/users', (_req, res) => {
  res.json(users);
});

googleisima.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send('User not found');
  }
});

// POST route
googleisima.post('/users', (req, res) => {
  const newUser: User = {
    id: String(users.length + 1),
    name: req.body.name || '',
    email: req.body.email || '',
    ...req.body
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT route
googleisima.put('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params['id']);
  if (index >= 0) {
    users[index] = { 
      ...users[index],
      ...req.body,
      id: users[index].id // preserve id
    };
    res.json(users[index]);
  } else {
    res.status(404).send('User not found');
  }
});

// DELETE route
googleisima.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params['id']);
  if (index >= 0) {
    const [deleted] = users.splice(index, 1);
    res.json(deleted);
  } else {
    res.status(404).send('User not found');
  }
});

googleisima.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
