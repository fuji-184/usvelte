import { render } from "../build/server/entry-server.js";
import { templateHtml } from "../server.js";
//import { cache } from "./utils.js"

// i think there is copy here :( because the map is always recreated :(

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
export const ui = async(url, data, res) => {
   const type = "text/html; charset=utf-8"
/*
    const cached = await cache.get(url)
    if (cached !== null){
        res.cork(()=>{
            res.writeStatus("200 OK")
            .writeHeader("Content-Type", type)
            .end(cached)
        })
    } else {
*/
       const rendered = await render(url,data);
        data = encodeURIComponent(data)
    const html = templateHtml
          .replace("<!--app-head-->", rendered.head || "")
          .replace("<!--app-html-->", rendered.body || "")
        .replace('usvelte_data', data)



    res.cork(() => {
          res
            .writeStatus("200 OK")
            .writeHeader("Content-Type", type)
            .end(html)
        })

  //  }

}
