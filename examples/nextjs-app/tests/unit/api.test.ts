import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/hello/route';

describe('API Route Handler', () => {
  it('GET handler returns a valid response', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data.message).toBe('Hello from the API!');
  });

  it('POST handler processes request body', async () => {
    const testData = { name: 'Test User' };

    // Create mock request with JSON body
    const request = {
      json: () => Promise.resolve(testData),
    } as unknown as NextRequest;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('data');
    expect(data.message).toBe('Data received successfully');
    expect(data.data).toEqual(testData);
  });
});
