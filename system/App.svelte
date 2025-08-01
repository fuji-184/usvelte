<script>
//# allFunctionsCalledOnLoad

  import { onMount } from 'svelte';
  import { routes } from '../routes/client.js'

  const { url, data } = $props()

  const fallbackRoute = routes['/'];
  const initialRoute = routes[url] ?? fallbackRoute;
  let Component = $state(initialRoute);

  let currentPath = url;
  let isHydrated = false;

  const resolveRoute = (path) => routes[path] ?? fallbackRoute;

  const navigate = (path) => {
    if (path === currentPath) return;
    currentPath = path;
    history.pushState(null, '', path);
    Component = resolveRoute(path);
  };

  const handleRoute = (path) => {
    if (path !== currentPath) {
      currentPath = path;
      Component = resolveRoute(path);
    }
  };

  onMount(() => {
    const browserPath = window.location.pathname;

    if (browserPath !== url) handleRoute(browserPath);
    isHydrated = true;

    const handlePopstate = () => handleRoute(browserPath);
    const handleClick = (e) => {
      if (e.defaultPrevented) return;

      const a = e.target.closest('a');
      if (!a) return;

      const href = a.href;
      if (!href || !href.startsWith(location.origin)) return;

      const hashIndex = href.indexOf('#');
      const path = href.slice(location.origin.length, hashIndex === -1 ? undefined : hashIndex);

      if (path === currentPath) return;

      e.preventDefault();
      navigate(path);
    };

    window.addEventListener('popstate', handlePopstate);
    document.body.addEventListener('click', handleClick, { passive: false });

    return () => {
      window.removeEventListener('popstate', handlePopstate);
      document.body.removeEventListener('click', handleClick);
    };
  });
</script>

<Component data={data}/>
