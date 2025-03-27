# Hamroun Express

A lightweight Express-like web framework for Node.js.

## Installation

```bash
npm install hamroun-express
```

## Usage

```typescript
const likeExpress = require('hamroun-express').default;
// Middleware example
likeExpress.use((req, res, next) => {
  console.log('Request received:', req.url);
  next();
});

// Route handlers
likeExpress.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

likeExpress.post('/api/data', (req, res) => {
  res.json({ message: 'Data received' });
});

// Start the server
likeExpress.listen(3000, () => {
  console.log('Server running on port 3000');
});
```






## Features

- Express-like API
- Middleware support
- Basic routing
- JSON response helper
- TypeScript support

## License

MIT
