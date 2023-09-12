import { Blog } from "@hyvor/hyvor-blogs-serve-web";

export interface Env {
	BASE_PATH: string,
	DELIVERY_API_KEY: string,
	WEBHOOK_SECRET: string,
	BLOG_CACHE: KVNamespace,
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

		const url = new URL(request.url);
		const path = url.pathname;
		const blogPath = path.replace(env.BASE_PATH, '');
		const blog = getBlog(env);

		if (request.method === 'POST') {
			if (blogPath === '/_hb_webhook') {
				const json = await request.json();
				return await blog.handleWebhookRequest(json, env.WEBHOOK_SECRET);
			} else {
				return notFound();
			}
		}

		return await blog.handleBlogRequest(blogPath);
	},
};

function notFound() {
	return new Response('not found', { status: 404 });
}

function getBlog(env: Env) {

	return new Blog({
        subdomain: 'upload-them-etest',
        deliveryApiKey: env.DELIVERY_API_KEY,
        webhookSecret: env.WEBHOOK_SECRET,

		cache: {
			get: async (key: string) => {
				const val = await env.BLOG_CACHE.get(key);
				if (!val) return null;

				try {
					return JSON.parse(val);
				} catch (e) {
					return null;
				}
			},
			set: async (key: string, value: string) => {
				await env.BLOG_CACHE.put(key, JSON.stringify(value));
			},
			delete: async (key: string) => {
				await env.BLOG_CACHE.delete(key);
			}
		}
    });

}
