//# allFunctionsCalledOnLoad

import { render as _render } from 'svelte/server'
import App from './App.svelte'
import About from './About.svelte'
import Home from './Home.svelte'

/**
 * @param {string} _url
 */
export function render(_url) {

 return _render(App, {
    props: {
      url: _url,
    },
  });

}
