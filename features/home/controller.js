const get = async (res, req) => {
  res
    .writeStatus("200 OK")
    .writeHeader("Content-Type", "text/html; charset=utf-8")
    .end("hello");
};

export default {
  get,
};
