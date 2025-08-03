//# allFunctionsCalledOnLoad

import '../shared/app.css'
import { hydrate } from 'svelte'
import App from './App.svelte'

const el = document.getElementById('app')
const raw = el?.getAttribute('data') || '{}'
const data = JSON.parse(decodeURIComponent(raw))

hydrate(App, {
  target: document.getElementById('app'),
    props: {
        data: data
    }
})
