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

const { Logger } = require('tslog');
const { build } = require('esbuild');
const { join } = require('path');
const os = require('os');

const log = new Logger({});

const main = async () => {
  log.info(`Now building go.floofy.dev under ${os.type()}/${os.arch()}...`);

  /** @type {import('esbuild').BuildOptions} */
  const options = {
    bundle: true,
    entryPoints: [join(process.cwd(), 'src', 'worker.ts')],
    outfile: join(process.cwd(), 'build', 'worker.js'),
    tsconfig: join(process.cwd(), 'tsconfig.json')
  };

  if (process.env.SHOULD_MINIFY === 'true') options.minify = true;

  await build(options);
  log.info('Done! You should see a file under the build directory.');
};

main().catch((ex) => {
  log.fatal(ex);
  process.exit(1);
});
