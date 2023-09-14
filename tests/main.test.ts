import { UnstableDevOptions, UnstableDevWorker, unstable_dev } from 'wrangler';
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest'; 
import deepmerge from 'deepmerge';

async function getWorker(config: UnstableDevOptions = {}) {
    
    const worker = await unstable_dev("src/index.ts", deepmerge({
        experimental: {disableExperimentalWarning: true},
        //config: 'wrangler.example.toml',
        vars: {
            BASE_PATH: "/blog",
            SUBDOMAIN: "my-subdomain",
            DELIVERY_API_KEY: "my-delivery-api-key",
            WEBHOOK_SECRET: "my-webhook-secret",
        },
        kv: config.kv !== undefined ? config.kv : [
            {binding: "BLOG_CACHE", id: "my-blog-cache"},
        ],
    } as UnstableDevOptions, config))
    return worker;
}

describe('http requests', () => {


    test.each([
        {
            env: {
                vars: {
                    SUBDOMAIN: ""
                }
            }, error: 'SUBDOMAIN is not set'
        },
        {
            env: {
                vars: {
                    DELIVERY_API_KEY: ""
                }
            }, 
            error: 'DELIVERY_API_KEY is not set'
        },
        {
            env: {
                kv: []
            }, 
            error: 'BLOG_CACHE is not set'
        },
        {
            env: {
                vars: {
                    BASE_PATH: "/not-blog"
                }
            },
            error: "Invalid BASE_PATH expecting=/not-blog current=/blog"
        }
    ])('should return $error', async ({env, error} : {env: any, error: string}) => {

        const worker = await getWorker(env);

        const resp = await worker.fetch('https://example.com/blog');
        expect(resp.status).toBe(500);
        const text = await resp.text();
        expect(text).toBe(error);

        worker.stop();

    });

    test('cache health', async () => {

        const worker = await getWorker();
        const resp = await worker.fetch('https://example.com/blog/_cache_health');

        const text = await resp.text();
        expect(text).toBe('Healthy ✅');

    });


    // TODO: add webhook and blog tests
    // needs mocking

});