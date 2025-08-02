//# allFunctionsCalledOnLoad

import uWS from "uWebSockets.js";
import fs from "fs/promises";
import os from "os";
import { Worker, isMainThread, threadId, parentPort } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { render } from "./build/server/entry-server.js";
import path from "path";

import { routes as server } from "./routes/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 8080;
const isProduction = true;
const base = process.env.BASE || "/";

export let templateHtml = "";
if (isProduction) {
  templateHtml = await fs.readFile("./build/client/shared/index.html", "utf-8");
}

if (isMainThread) {

const acceptorApp = uWS.App().listen("0.0.0.0", port, (token) => {
    if (token) {
      console.log(
        `Listening to port ${port} from thread ${threadId} as main acceptor`,
      );
    } else {
      console.error(`❌ Failed to listen on port ${port}`);
    }
  });

   const workers = new Set()

  const numCores = os.cpus().length;
  for (let i = 1; i < numCores; i++) {
    const worker = new Worker(__filename, {
            workerData: { id: i }
        })
    worker.on("message", (msg) => {
            if (msg.type === "init"){
      acceptorApp.addChildAppDescriptor(msg.data)
            }
        });

        workers.add(worker)


  }
} else {
  const app = uWS.App();

  app.get("/assets/*", (res, req) => {
    res.onAborted(() => {
      //     console.log("Request aborted");
    });

    (async () => {
      const filePath = path.join(__dirname, "build/client", req.getUrl());

        const url = req.getUrl()
      try {

        const file = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const mime =
          ext === ".js"
            ? "application/javascript"
            : ext === ".css"
              ? "text/css"
              : "application/octet-stream";

        res.cork(() => {
          res.writeHeader("Content-Type", mime).end(file);
        });
      } catch (err) {
        res.cork(() => {
          res.writeStatus("404 Not Found").end("Not Found");
        });
      }
    })();
  });

server(app)

app.listen("0.0.0.0", 4000, (token) => {
    if (token) {
      console.log(`Deployed worker from thread ${threadId}`);
    } else {
      console.error(`❌ Failed to deploy worker`);
    }
  });

  parentPort.postMessage({ type: "init", data: app.getDescriptor() });
}
