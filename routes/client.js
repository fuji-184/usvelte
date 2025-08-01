//# allFunctionsCalledOnLoad

// we can set whatever name when importing the ui

import about from "../features/about/ui.svelte";
import home from "../features/home/ui.svelte";

export const routes = {
  "/": home,
  "/about": about,
};
