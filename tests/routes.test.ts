import * as http from 'http';

interface TestUser {
  name: string;
  email: string;
}

interface TestResponse {
  status: number;
  body: any;
}

const BASE_URL = 'http://localhost:3000';

describe('Route Tests', () => {
  const testUser: TestUser = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  let userId: string;

  // Helper function to make HTTP requests
  const makeRequest = (method: string, path: string, data?: any): Promise<TestResponse> => {
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
          } catch {
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
