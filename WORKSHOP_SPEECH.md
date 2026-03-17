# Workshop Opening Speech
## "Build Your Own Express.js Framework"

---

Good morning everyone, welcome!

My name is Mohamed, and today we are not going to *use* a framework — we are going to *build* one from scratch.

---

I want to start with a question.

How many of you have used Express.js before?

*(pause)*

Great. And how many of you know what happens *inside* it when you write `app.get('/hello', handler)`?

*(pause)*

That is exactly why we are here today.

---

Every day, millions of Node.js applications run in production using Express. Developers reach for it because it just works. But there is a cost to that convenience — most of us treat it as a black box. We know the API, but we do not know the engine.

Today we change that.

---

Here is what I want you to walk away with.

When you leave this room, you will understand that Express is not magic. It is about 200 lines of clean, deliberate code built on top of one thing Node.js already gives you for free: `http.createServer`.

Everything else — middleware, routing, params, JSON responses — is just careful engineering on top of that single function.

---

Let me paint the picture of what we will build together.

We will start from zero: a raw Node.js HTTP server. You will feel how uncomfortable it is to work with it directly — every request is just a stream of bytes, every response needs manual headers.

Then, step by step, we will add one abstraction at a time.

First, a `Request` object that wraps the raw stream and gives us `req.body`, `req.params`, `req.query`.

Second, a `Response` object with helper methods — `res.send()`, `res.json()`, `res.status()`.

Third, a middleware pipeline. This is the heart of Express. The famous `next()` function. We will implement it, and you will finally understand why calling `next()` matters, and what happens when you forget it.

Fourth, a router. We will match HTTP methods and URL paths. We will support dynamic segments like `/users/:id`. We will return a proper 404 when nothing matches.

And at the end, you will have a working mini-framework — one that you built with your own hands — and you will run real HTTP requests against it.

---

I want to be honest with you about something.

This workshop will not make Express obsolete for you. In production, you will still use battle-tested libraries. That is fine. That is smart.

But here is what changes today.

Next time you hit a bug in your Express app — next time you wonder why that middleware is not executing, or why your route is not matching — you will not be guessing. You will *know*. Because you have seen exactly how the machinery works.

The best developers are not the ones who know the most libraries. They are the ones who are never intimidated by a library, because they understand the principles underneath.

That is what today is about.

---

A few practical notes before we start.

Open the project in your editor. Everything lives in `src/index.ts`. You will see `WORKSHOP TODO` comments scattered throughout the file — those are your milestones. We will hit each one together.

You will also find `examples/basic.ts` — that is our live demo app, a small CRUD API for users. By the end, all those routes will be yours to run.

If you get stuck, ask. There are no stupid questions in a workshop where we are building something from first principles.

---

One last thing.

Every framework you have ever admired — Express, Fastify, Koa, Hono — every one of them started exactly where we are starting right now: with someone looking at `http.createServer` and thinking, *I can make this better*.

Today, that person is you.

Let's build something.

---

*Mohamed Al-Hamroun — Faculty Workshop, March 2026*
