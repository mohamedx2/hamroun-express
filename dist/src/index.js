"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleisimaExpress = void 0;
const http = __importStar(require("http"));
// Simple Request class that extends Node's IncomingMessage
class Request {
    constructor(req) {
        this.req = req;
        this.params = {};
        this.query = {};
        this.body = {};
        this.method = req.method;
        this.url = req.url;
    }
}
// Simple Response class with helper methods
class Response {
    constructor(res) {
        this.res = res;
    }
    // Send JSON response
    json(data) {
        this.res.setHeader('Content-Type', 'application/json');
        this.res.end(JSON.stringify(data));
    }
    // Send text response
    send(text) {
        this.res.setHeader('Content-Type', 'text/plain');
        this.res.end(text);
    }
    // Set status code
    status(code) {
        this.res.statusCode = code;
        return this;
    }
}
// Main framework class
class GoogleisimaExpress {
    constructor() {
        // Store routes and middleware
        this.routes = [];
        this.middlewares = [];
    }
    // Add middleware
    use(handler) {
        this.middlewares.push(handler);
    }
    // Handle GET requests
    get(path, handler) {
        this.routes.push({ method: 'GET', path, handler });
    }
    // Handle POST requests
    post(path, handler) {
        this.routes.push({ method: 'POST', path, handler });
    }
    // Add PUT request handler
    put(path, handler) {
        this.routes.push({ method: 'PUT', path, handler });
    }
    // Add DELETE request handler
    delete(path, handler) {
        this.routes.push({ method: 'DELETE', path, handler });
    }
    // Start the server
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            const request = new Request(req);
            const response = new Response(res);
            // Find the matching route
            const route = this.routes.find(r => r.method === req.method && r.path === req.url);
            // Simple function to handle middleware and routing
            const runMiddlewareAndRoute = () => {
                // First run all middleware one by one
                for (const middleware of this.middlewares) {
                    middleware(request, response, () => {
                        // middleware finished, continue to next one
                    });
                }
                // After middleware, handle the route
                if (route) {
                    route.handler(request, response, () => { });
                }
                else {
                    // If no route found, send 404
                    response.status(404).send('Page not found 😢');
                }
            };
            // Start processing the request
            runMiddlewareAndRoute();
        });
        // Start listening on specified port
        server.listen(port, () => {
            console.log(`Server started on http://localhost:${port}`);
            if (callback)
                callback();
        });
    }
}
exports.GoogleisimaExpress = GoogleisimaExpress;
// Export a default instance
exports.default = new GoogleisimaExpress();
