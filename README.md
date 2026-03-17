# Hamroun Express

A lightweight Express-like web framework for Node.js.

## Build Your Own Express Workshop (Faculty Edition)

This repository is now workshop-ready for teaching students how an Express-style framework works internally.

### Workshop outcomes

By the end of the workshop, students will be able to:

- explain the Node.js HTTP request/response lifecycle
- implement middleware chaining with `next()`
- build method/path route registration
- support dynamic route params (e.g. `/users/:id`)
- return JSON/text responses with helper methods

### Duration options

- **90 minutes**: compact format with instructor-led coding
- **120 minutes**: includes student pair exercises and debugging time

### Prerequisites

- Node.js 16+
- TypeScript basics
- Basic understanding of HTTP verbs/status codes

### Project files used in class

- Core framework: `src/index.ts`
- Example app: `examples/basic.ts`
- Tests: `tests/routes.test.ts`

## Teaching agenda

### Part 1 — HTTP fundamentals (10–15 min)

- Show `http.createServer` lifecycle
- Explain `IncomingMessage` and `ServerResponse`
- Map that model to Express concepts

### Part 2 — Framework skeleton (20 min)

- Introduce `Route` and `RequestHandler` types
- Implement/inspect `use()`, `get()`, `post()`, `put()`, `delete()`
- Explain route storage strategy

### Part 3 — Middleware pipeline (20 min)

- Implement ordered middleware execution
- Teach `next()` semantics
- Demonstrate request logger middleware

### Part 4 — Dynamic routing (20 min)

- Match route templates like `/users/:id`
- Extract params with `parseParams()`
- Return 404 when no route matches

### Part 5 — Body parsing + response helpers (15 min)

- Parse JSON body in `Request.parseBody()`
- Use `res.send()`, `res.json()`, `res.status()`
- Discuss content-type and status-first patterns

### Part 6 — Validation and demo (10–20 min)

- Run the example CRUD app
- Exercise routes with Postman/curl
- Run tests and review assertions

## Instructor flow (step-by-step)

1. Start from `src/index.ts` and follow the `WORKSHOP TODO` markers.
2. After each TODO block, run or demo one behavior (middleware, route match, params, etc.).
3. Use `examples/basic.ts` as the live app students call from Postman.
4. Keep one terminal for server logs and one for test runs.

## Student exercises

### Exercise A — Static route

- Add `GET /hello`
- Return plain text response

### Exercise B — Middleware

- Add logger middleware with timestamp
- Confirm middleware runs before route handlers

### Exercise C — JSON body

- Add `POST /echo`
- Return request body as JSON

### Exercise D — Route params

- Add `GET /products/:id`
- Return `{ id: req.params.id }`

### Exercise E — Error handling behavior

- Verify unknown route returns `404`
- Verify malformed JSON does not crash server

## Commands for workshop day

Install dependencies:

```bash
npm install
```

Run example app:

```bash
npm run start
```

Run tests:

```bash
npm test
```

Build framework:

```bash
npm run build
```

## Quick usage

```typescript
const likeExpress = require('hamroun-express').default;

likeExpress.use((req, res, next) => {
  console.log('Request received:', req.url);
  next();
});

likeExpress.get('/hello', (_req, res) => {
  res.send('Hello, World!');
});

likeExpress.post('/api/data', (_req, res) => {
  res.json({ message: 'Data received' });
});

likeExpress.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Features

- Express-like API
- Middleware support
- Basic routing
- Dynamic route params
- JSON response helper
- TypeScript support

## License

MIT
