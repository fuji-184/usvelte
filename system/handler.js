export const async = (handler) => {
  return (res, req) => {
    res.onAborted(() => {
    //  aborted = true;
    });
res.cork(() => {
    (async () => {

    await handler(res, req)
    })()
  })
}
}

export const sync = (handler) => {
  return (res, req) => {
    res.onAborted(() => {
    //  aborted = true;
    });
res.cork(() => {
    handler(res, req)
  })
}
}

