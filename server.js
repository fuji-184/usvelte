//# allFunctionsCalledOnLoad

import uWS from "uWebSockets.js";
import fs from "fs/promises";
import os from "os";
import { Worker, isMainThread, threadId, parentPort } from "worker_threads";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { render } from "./dist/server/entry-server.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 8080;
const isProduction = true;
const base = process.env.BASE || "/";

let templateHtml = "";
if (isProduction) {
  templateHtml = await fs.readFile("./dist/client/index.html", "utf-8");
}

if (isMainThread) {
  const acceptorApp = uWS.App().listen(port, (token) => {
    if (token) {
      console.log(
        `Listening to port ${port} from thread ${threadId} as main acceptor`,
      );
    } else {
      console.error(`❌ Failed to listen on port ${port}`);
    }
  });

  const numCores = os.cpus().length;
  for (let i = 1; i < numCores; i++) {
    new Worker(__filename).on("message", (desc) => {
      acceptorApp.addChildAppDescriptor(desc);
    });
  }
} else {
  const app = uWS.App();

  const cache = new Map();

  app.get("/assets/*", (res, req) => {
    res.onAborted(() => {
 //     console.log("Request aborted");
    });

    (async () => {
      const filePath = path.join(__dirname, "dist/client", req.getUrl());

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

  app.get("/*", (res, req) => {
    const url = req.getUrl();

    res.onAborted(() => {
      //      console.log('Page request aborted for:', url)
    });

    if (cache.has(url)) {
      res.cork(() => {
        res
          .writeStatus("200 OK")
          .writeHeader("Content-Type", "text/html; charset=utf-8")
          .end(cache.get(url));
      });
      return;
    }

    (async () => {
      try {
        const rendered = await render(url);
        const html = templateHtml
          .replace("<!--app-head-->", rendered.head || "")
          .replace("<!--app-html-->", rendered.body || "");

        cache.set(url, html);

        res.cork(() => {
          res
            .writeStatus("200 OK")
            .writeHeader("Content-Type", "text/html; charset=utf-8")
            .end(html);
        });
      } catch (err) {
        console.error("Render error for", url, ":", err);
        res.cork(() => {
          res
            .writeStatus("500 Internal Server Error")
            .writeHeader("Content-Type", "text/plain")
            .end("Internal Server Error");
        });
      }
    })();
  });

  app.listen(4000, (token) => {
    if (token) {
      console.log(`Listening to port 4000 from thread ${threadId}`);
    } else {
      console.error(`❌ Failed to listen on port 4000`);
    }
  });

  parentPort.postMessage(app.getDescriptor());
}
