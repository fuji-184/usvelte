import { async } from "../system/handler.js";
import home from "../features/home/controller.js";

export const routes = (app) => {
  app.get("/api/*", async(home.get));
};
