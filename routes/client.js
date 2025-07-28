//# allFunctionsCalledOnLoad

// dynamic import for only importing what is needed

export const routes = {
  '/':      () => import('../features/home/ui.svelte'),
  '/about': () => import('../features/about/ui.svelte'),
};
