//# allFunctionsCalledOnLoad

import About from './src/About.svelte';
import Home from './src/Home.svelte';

export const routes = {
  '/': Home,
  '/about': About,
};
