//# allFunctionsCalledOnLoad

import { render as _render } from "svelte/server";
import App from "./App.svelte";

/**
 * @param {string} _url
 */
export function render(_url, _data) {
  return _render(App, {
    props: {
      url: _url,
        data: _data
    },
  });
}
