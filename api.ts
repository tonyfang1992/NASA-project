import { Router } from "https://deno.land/x/oak@v7.6.3/mod.ts"

const router = new Router

router.get("/",(ctx)=>{
  ctx.response.body = `Hello NASA`
})

export default router