import * as http from 'http';

// Add interfaces for request parameters
interface RequestParams {
  [key: string]: string;
}

interface RequestQuery {
  [key: string]: string;
}

interface RequestBody {
  [key: string]: any;
}

// Define types for our request handlers
type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
type NextFunction = () => void;

// Simple route interface to store our routes
interface Route {
  method: string;  // HTTP method (GET, POST, etc)
  path: string;    // URL path
  handler: RequestHandler;  // Function to handle the request
}

// Simple Request class that extends Node's IncomingMessage
class Request {
  params: RequestParams = {};
  query: RequestQuery = {};
  body: RequestBody = {};
  
  constructor(private req: http.IncomingMessage) {
    this.method = req.method;
    this.url = req.url;
  }

  method: string | undefined;
  url: string | undefined;

  async parseBody(): Promise<void> {
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
          } catch {
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
  constructor(private res: http.ServerResponse) {}

  // Send JSON response
  json(data: any) {
    this.res.setHeader('Content-Type', 'application/json');
    this.res.end(JSON.stringify(data));
  }

  // Send text response
  send(text: string) {
    this.res.setHeader('Content-Type', 'text/plain');
    this.res.end(text);
  }

  // Set status code
  status(code: number) {
    this.res.statusCode = code;
    return this;
  }
}

// Main framework class
export class GoogleisimaExpress {
  // Store routes and middleware
  private routes: Route[] = [];
  private middlewares: RequestHandler[] = [];

  // Add middleware
  use(handler: RequestHandler) {
    this.middlewares.push(handler);
  }

  // Handle GET requests
  get(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'GET', path, handler });
  }

  // Handle POST requests
  post(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'POST', path, handler });
  }

  // Add PUT request handler
  put(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'PUT', path, handler });
  }

  // Add DELETE request handler
  delete(path: string, handler: RequestHandler) {
    this.routes.push({ method: 'DELETE', path, handler });
  }

  private parseParams(routePath: string, requestUrl: string): RequestParams {
    const routeParts = routePath.split('/');
    const urlParts = requestUrl.split('/');
    const params: RequestParams = {};

    if (routeParts.length === urlParts.length) {
      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
          const paramName = routeParts[i].slice(1);
          params[paramName] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
          return {};
        }
      }
    }

    return params;
  }

  // Start the server
  listen(port: number, callback?: () => void) {
    const server = http.createServer((req, res) => {
      const request = new Request(req);
      const response = new Response(res);

      // Find matching route with params first
      const route = this.routes.find(r => {
        if (r.method !== req.method) return false;
        
        const routeParts = r.path.split('/');
        const urlParts = request.url?.split('/') || [];
        
        if (routeParts.length !== urlParts.length) return false;
        
        for (let i = 0; i < routeParts.length; i++) {
          const isParam = routeParts[i].startsWith(':');
          if (!isParam && routeParts[i] !== urlParts[i]) {
            return false;
          }
        }
        return true;
      });

      // Set route params if found
      if (route && request.url) {
        request.params = this.parseParams(route.path, request.url);
      }

      // Parse body then handle request
      request.parseBody().then(() => {
        let currentMiddleware = 0;
        const next = () => {
          if (currentMiddleware < this.middlewares.length) {
            this.middlewares[currentMiddleware++](request, response, next);
          } else if (route) {
            route.handler(request, response, () => {});
          } else {
            response.status(404).send('Page not found 😢');
          }
        };
        next();
      });
    });

    // Start listening on specified port
    server.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
      if (callback) callback();
    });
  }
}

// Export a default instance
export default new GoogleisimaExpress();
