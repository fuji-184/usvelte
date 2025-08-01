import { render } from "../build/server/entry-server.js";
import { templateHtml } from "../server.js";

export const async = (handler) => {
  return (res, req) => {
    res.onAborted(() => {
      //  aborted = true;
    });
    res.cork(() => {
      (async () => {
        await handler(res, req);
      })();
    });
  };
};

export const sync = (handler) => {
  return (res, req) => {
    res.onAborted(() => {
      //  aborted = true;
    });
    res.cork(() => {
      handler(res, req);
    });
  };
};

export const get_with_ui = async (url, app, handler) => {
   app.get(url, (res, req) => {
    (async () => {
        try {
    const data = await handler(req, res)
    const rendered = await render(req.getUrl(), data);
    const html = templateHtml
      .replace("<!--app-head-->", rendered.head || "")
      .replace("<!--app-html-->", rendered.body || "");

    res
      .writeStatus("200 OK")
      .writeHeader("Content-Type", "text/html; charset=utf-8")
      .end(html);
  } catch (err) {
    console.error("Render error for", url, ":", err);
    res.cork(() => {
      res
        .writeStatus("500 Internal Server Error")
        .writeHeader("Content-Type", "text/plain")
        .end("Internal Server Error");
    });
  }
        })()
        })
};

export const ui = async(url, data, res) => {
     const rendered = await render(url, data);
        const html = templateHtml
          .replace("<!--app-head-->", rendered.head || "")
          .replace("<!--app-html-->", rendered.body || "");


        res.cork(() => {
          res
            .writeStatus("200 OK")
            .writeHeader("Content-Type", "text/html; charset=utf-8")
            .end(html);
        });

}
