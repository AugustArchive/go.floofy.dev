/*
 * 🎏 go.floofy.dev: Dead simple Cloudflare Worker to redirect Go-related packages to GitHub
 * Copyright (c) 2022 Noel <cutie@floofy.dev>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { logger } from 'hono/logger';
import { Hono } from 'hono';

declare const LIBRARY_PATHS: KVNamespace<string>;

const owo = async () => {
  await LIBRARY_PATHS.put('redis', 'https://github.com/go-redis/redis', {
    metadata: {
      redirects: 0
    }
  });
};

const app = new Hono();
app.use('*', logger());
app.use('*', async (ctx, next) => {
  try {
    await next();
    ctx.res.headers.append('x-powered-by', 'Noel/go-redirect (https://github.com/auguwu/go.floofy.dev)');
  } catch (e) {
    console.error(e);

    ctx.json(
      {
        success: false,
        message: 'Unknown exception has occured while running.'
      },
      500
    );
  }
});

app.get('/', (ctx) =>
  ctx.json({
    success: true,
    message: 'hello world!'
  })
);

app.get('/:name', async (ctx) => {
  // enable if you need mock data
  // await owo();

  const name = ctx.req.param('name');
  const redirectUrl = await LIBRARY_PATHS.get(name);

  if (!redirectUrl)
    return ctx.json(
      {
        success: false,
        message: `Unable to retrieve redirection URL for ${name}.`
      },
      404
    );

  return ctx.redirect(redirectUrl, 308);
});

app.get('/:name/:version{[v]?[0-9]+}', async (ctx) => {
  // enable if you need mock data
  // await owo();

  const name = ctx.req.param('name');
  const version = ctx.req.param('version');

  const redirectUrl = await LIBRARY_PATHS.get(name);
  if (!redirectUrl)
    return ctx.json(
      {
        success: false,
        message: `Unable to retrieve redirection URL for ${name}.`
      },
      404
    );

  return ctx.redirect(`${redirectUrl}/${version}`);
});

app.fire();
