import { log, Application, send} from "./deps.ts";
import api from "./api.ts"

const app = new Application()
const PORT = 8000

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },
  loggers: {
    // configure default logger available via short-hand methods above.
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error",(event)=>{
  log.error(event.error)
})

app.use(async(ctx,next)=>{
  try{
    await next()
  }catch(err){
    ctx.response.body = "Internal server error"
    throw err
  }
})

app.use(async(ctx,next)=>{
  await next()
  const time = ctx.response.headers.get("X-response-time")
  log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`)
})

app.use(async(ctx,next)=>{
  const startTime = Date.now()
  await next()
  const delta = Date.now()-startTime
  ctx.response.headers.set("X-response-time", `${delta}ms`)
})

app.use(api.routes())
app.use(api.allowedMethods())

app.use(async(ctx)=>{
  const filePath = ctx.request.url.pathname
  const fileWhitelist=[
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
  ];
  if (fileWhitelist.includes(filePath)){
    await send(ctx, filePath,{
      root:`${Deno.cwd()}/public`,
    })
  }
})



if(import.meta.main){
  log.info(`Starting server on ${PORT}... `)
 await app.listen({
    port: PORT
  })
}
