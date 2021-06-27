import { Application } from "https://deno.land/x/oak@v7.6.3/mod.ts"

const app = new Application()
const PORT = 8000


app.use(async(ctx,next)=>{
  await next()
  const time = ctx.response.headers.get("X-response-time")
  console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`)
})

app.use(async(ctx,next)=>{
  const startTime = Date.now()
  await next()
  const delta = Date.now()-startTime
  ctx.response.headers.set("X-response-time", `${delta}ms`)
})

app.use((ctx)=>{
  ctx.response.body = `Hello NASA`
})

if(import.meta.main){
 await app.listen({
    port: PORT
  })
}
