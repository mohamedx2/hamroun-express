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
const http = __importStar(require("http"));
const BASE_URL = 'http://localhost:3000';
describe('Route Tests', () => {
    const testUser = {
        name: 'John Doe',
        email: 'john@example.com'
    };
    let userId;
    // Helper function to make HTTP requests
    const makeRequest = (method, path, data) => {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3000,
                path,
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    try {
                        resolve({
                            status: res.statusCode || 0,
                            body: JSON.parse(body)
                        });
                    }
                    catch (_a) {
                        resolve({
                            status: res.statusCode || 0,
                            body
                        });
                    }
                });
            });
            req.on('error', reject);
            if (data) {
                req.write(JSON.stringify(data));
            }
            req.end();
        });
    };
    // Test cases
    test('POST /users should create a new user', async () => {
        const response = await makeRequest('POST', '/users', testUser);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(testUser.name);
        userId = response.body.id;
    });
    test('GET /users should return all users', async () => {
        const response = await makeRequest('GET', '/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    test('PUT /users/:id should update user', async () => {
        const updateData = { name: 'Jane Doe' };
        const response = await makeRequest('PUT', `/users/${userId}`, updateData);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updateData.name);
    });
    test('DELETE /users/:id should delete user', async () => {
        const response = await makeRequest('DELETE', `/users/${userId}`);
        expect(response.status).toBe(200);
    });
});
