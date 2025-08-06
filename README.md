About this prototype :
- High performance Svelte SSR
- Automatically create worker thread based on CPU cores total
- While it is high performance than the default SvelteKit SSR or common NodeJS. This comes with cons that is higher memory usage. This is because creating worker thread in NodeJS is not cheap. I have tested with 7 worker threads + 1 main thread, serving 1 row of PostgreSQL data, testing it with wrk 200 concurrent users for 15 s duration, the RAM usage is around 300 MB

How to run this prototype :

1. Clone the repo
2. Open usvelte folder
3. Run `npm install`
4. Run `npm run build`
5. Run the server with `node server.js`

The main listener runs on port 8080, this port is the one that should be exposed to outside
