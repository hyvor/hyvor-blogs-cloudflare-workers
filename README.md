This is a Cloudflare Worker to self-serve a [Hyvor Blogs](https://blogs.hyvor.com) blog.

* [Full Tutorial](https://hyvor.com/blog/cloudflare-workers-blog)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/hyvor/hyvor-blogs-cloudflare-workers)

## Configuration

You need to configure the following variables in the `wrangler.toml` file.

- `BASE_PATH` - The base path of your blog. For example, if you want to serve your blog at `https://example.com/blog`, set this to `/blog`. If you want to serve at the root, set this to `/`.
- `SUBDOMAIN` - The subdomain of your blog. Get this from the Hyvor Blogs Console.
- `DELIVERY_API_KEY` - The Delivery API Key of your blog. Get this from the Hyvor Blogs Console &rarr; Settings &rarr; API Keys.
- `WEBHOOK_SECRET` - The webhook secret of the webhook sent to `_hb_webhook`. Get this from the Hyvor Blogs Console &rarr; Settings &rarr; Webhooks.


## Reserved Routes

These routes are reserved for the worker. You should not create posts in your blog with these paths.

- `{BASE_PATH}/_hb_webhook` (POST only) - Webhook handler for clearing cache
- `{BASE_PATH}/_cache_health` - Cache (KV) health check