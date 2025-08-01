import { async } from "../system/handler.js";
import home from "../features/home/controller.js";

export const routes = (app) => {
  app.get("/api/user", async(home.get_json));
  app.get("/", async(home.get_ui));
}
