
export interface Env {
	DB: any;
}

// Define the structure of a message
interface Message {
	role: 'user' | 'model';
	text: string;
}

// Helper to handle CORS preflight requests and add CORS headers to responses
const handleCors = (request: Request, response: Response): Response => {
    const headers = new Headers(response.headers);
    const origin = request.headers.get('Origin');
    
    // In a production environment, you should restrict this to your specific frontend URL.
    headers.set('Access-Control-Allow-Origin', origin || '*');
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return new Response(response.body, {
        status: response.status,
        headers: headers,
    });
};

export default {
	async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

		const { pathname } = new URL(request.url);

		try {
			// Route to get chat history
			if (pathname === '/api/history' && request.method === 'GET') {
				const { results } = await env.DB.prepare('SELECT role, text FROM messages ORDER BY id ASC').all();
				const response = new Response(JSON.stringify(results || []), {
					headers: { 'Content-Type': 'application/json' },
				});
                return handleCors(request, response);
			}

			// Route to save new messages
			if (pathname === '/api/history' && request.method === 'POST') {
				const messages = (await request.json()) as Message[];

                if (!Array.isArray(messages) || messages.length === 0) {
                     const response = new Response('Invalid request body, expected an array of messages.', { status: 400 });
                     return handleCors(request, response);
                }

				const stmt = env.DB.prepare('INSERT INTO messages (role, text) VALUES (?, ?)');
				const inserts = messages.map(({ role, text }) => stmt.bind(role, text));
				await env.DB.batch(inserts);

				const response = new Response('Messages saved successfully', { status: 201 });
                return handleCors(request, response);
			}
		} catch (e: any) {
			console.error('Worker error:', e);
			const response = new Response(`Failed to process request: ${e.message}`, { status: 500 });
            return handleCors(request, response);
		}

		const response = new Response('Not Found', { status: 404 });
        return handleCors(request, response);
	},
};
