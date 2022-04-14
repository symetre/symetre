import { renderFile } from "https://deno.land/x/eta@v1.7.0/mod.ts"

import type { Context } from "https://deno.land/x/oak@v10.5.1/mod.ts"

declare module "https://deno.land/x/oak@v10.5.1/mod.ts" {
  interface Context {
    render: (fileName: string, data?: object) => void
  }
}

export function etaEngine(opts: object) {
  return async function (ctx: Context, next: Function) {
    ctx.render = async function (filepath: string, data?: object) {
      try {
        ctx.response.type = "html"
        ctx.response.headers.set("Content-Type", "text/html; charset=utf-8")

        ctx.response.body = await renderFile(filepath, data || {}, opts)
      } catch (e) {
        ctx.response.status = 404
        console.log(e.message)
      }
    }

    await next()
  }
}