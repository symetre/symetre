// Welcome to symetre
// It seems you are a developer?

import { Application, Router } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { etaEngine } from './middleware/eta.ts'
import * as path from "https://deno.land/std@0.134.0/path/mod.ts"

const __dirname = new URL(".", import.meta.url).pathname
const app = new Application();

app.use(
    etaEngine({
      views: path.join(__dirname, "views"),
      cache: false
    })
  )

const router = new Router();

router.get('/', (ctx) => {
    ctx.render('index')
})

app.use(router.routes());

await app.listen({ port: 8000 })
