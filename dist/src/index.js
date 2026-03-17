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
    async parseBody() {
        // WORKSHOP TODO 2: explain why GET/DELETE usually skip body parsing
        if (this.req.method === 'GET' || this.req.method === 'DELETE') {
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            let rawBody = '';
            this.req.on('data', chunk => rawBody += chunk);
            this.req.on('end', () => {
                if (rawBody) {
                    try {
                        this.body = JSON.parse(rawBody);
                    }
                    catch (_a) {
                        this.body = {};
                    }
                }
                resolve();
            });
        });
    }
}
// Simple Response class with helper methods
class Response {
    constructor(res) {
        this.res = res;
    }
    // Send JSON response
    json(data) {
        // WORKSHOP TODO 2: set content type before ending response
        this.res.setHeader('Content-Type', 'application/json');
        this.res.end(JSON.stringify(data));
    }
    // Send text response
    send(text) {
        // WORKSHOP TODO 2: text helper for simple responses
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
        // WORKSHOP TODO 3: register middleware in order
        this.middlewares.push(handler);
    }
    // Handle GET requests
    get(path, handler) {
        // WORKSHOP TODO 3: route registration for GET
        this.routes.push({ method: 'GET', path, handler });
    }
    // Handle POST requests
    post(path, handler) {
        // WORKSHOP TODO 3: route registration for POST
        this.routes.push({ method: 'POST', path, handler });
    }
    // Add PUT request handler
    put(path, handler) {
        // WORKSHOP TODO 3: route registration for PUT
        this.routes.push({ method: 'PUT', path, handler });
    }
    // Add DELETE request handler
    delete(path, handler) {
        // WORKSHOP TODO 3: route registration for DELETE
        this.routes.push({ method: 'DELETE', path, handler });
    }
    parseParams(routePath, requestUrl) {
        // WORKSHOP TODO 4: compare route and URL segments, extract :params
        const routeParts = routePath.split('/');
        const urlParts = requestUrl.split('/');
        const params = {};
        if (routeParts.length === urlParts.length) {
            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    const paramName = routeParts[i].slice(1);
                    params[paramName] = urlParts[i];
                }
                else if (routeParts[i] !== urlParts[i]) {
                    return {};
                }
            }
        }
        return params;
    }
    // Start the server
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            const request = new Request(req);
            const response = new Response(res);
            // WORKSHOP TODO 4: find route match with support for dynamic params
            const route = this.routes.find(r => {
                var _a;
                if (r.method !== req.method)
                    return false;
                const routeParts = r.path.split('/');
                const urlParts = ((_a = request.url) === null || _a === void 0 ? void 0 : _a.split('/')) || [];
                if (routeParts.length !== urlParts.length)
                    return false;
                for (let i = 0; i < routeParts.length; i++) {
                    const isParam = routeParts[i].startsWith(':');
                    if (!isParam && routeParts[i] !== urlParts[i]) {
                        return false;
                    }
                }
                return true;
            });
            // WORKSHOP TODO 4: assign parsed params to request object
            if (route && request.url) {
                request.params = this.parseParams(route.path, request.url);
            }
            // WORKSHOP TODO 5: parse body, execute middleware chain, then route
            request.parseBody().then(() => {
                let currentMiddleware = 0;
                const next = () => {
                    if (currentMiddleware < this.middlewares.length) {
                        this.middlewares[currentMiddleware++](request, response, next);
                    }
                    else if (route) {
                        route.handler(request, response, () => { });
                    }
                    else {
                        // WORKSHOP TODO 5: fallback when no route matches
                        response.status(404).send('Page not found 😢');
                    }
                };
                next();
            });
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
