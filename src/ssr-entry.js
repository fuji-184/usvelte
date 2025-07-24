import App from './App.svelte';

export default function ssrEntry(props) {
  const { html, head } = App.render(props);
return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        ${head}
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
  `;
};
