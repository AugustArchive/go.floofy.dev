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

declare const LIBRARY_PATHS: WorkerGlobalScope;

class Worker {
  private readonly app: Hono;

  constructor() {
    this.app = new Hono();

    this.app.use('*', logger());
    this._addRoutes();
  }

  private _addRoutes() {
    console.log('[info] adding routes...');
    this.app.get('/', (ctx) =>
      ctx.json({
        message: 'hello world',
      })
    );
  }

  start() {
    console.log('cf worker has started! :D');
    this.app.fire();
  }
}

const worker = new Worker();
worker.start();
