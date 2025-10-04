// Define the structure of a message
interface Message {
	role: 'user' | 'model';
	text: string;
}

// Define the environment bindings, specifically for the D1 database.
export interface Env {
	DB: any;
}

// Common CORS headers to be applied to all responses
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

// Function to handle OPTIONS preflight requests for CORS
export const onRequestOptions: any = async () => {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
};

// Function to handle GET requests to fetch chat history
export const onRequestGet: any = async (context: any) => {
    try {
        if (!context || !context.env || !context.env.DB) {
            // This is likely a local development environment without a DB binding.
            // Return a 200 OK with an empty array to prevent frontend errors.
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            });
        }
        const { env } = context;
        const { results } = await env.DB.prepare('SELECT role, text FROM messages ORDER BY id ASC').all();
        
        return new Response(JSON.stringify(results || []), {
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        });

    } catch (e: any) {
        console.error('GET /api/history Error:', e);
        return new Response(`Server error: ${e.message}`, { 
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
        });
    }
};

// Function to handle POST requests to save new messages
export const onRequestPost: any = async (context: any) => {
    try {
         if (!context || !context.env || !context.env.DB) {
            // This is likely a local development environment.
            // Return a 201 Created to simulate a successful save.
            return new Response('Messages saved successfully (mocked)', {
                status: 201,
                headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
            });
        }
        const { request, env } = context;
        const messages: Message[] = await request.json();

        if (!Array.isArray(messages) || messages.length === 0) {
            return new Response('Invalid body: Expected an array of messages.', {
                status: 400,
                headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
            });
        }

        const stmt = env.DB.prepare('INSERT INTO messages (role, text) VALUES (?, ?)');
        const inserts = messages.map(({ role, text }) => stmt.bind(role, text));
        await env.DB.batch(inserts);

        return new Response('Messages saved successfully', {
            status: 201,
            headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
        });

    } catch (e: any) {
        console.error('POST /api/history Error:', e);
        return new Response(`Server error: ${e.message}`, {
            status: 500,
            headers: { ...CORS_HEADERS, 'Content-Type': 'text/plain' }
        });
    }
};
