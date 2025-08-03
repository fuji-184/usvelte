<script>
import { onMount } from "svelte"

const { data } = $props()

let tes = $state(0)

function klik(){
    tes += 1
}
</script>

<div>Home</div>
<a href="/about">about</a>
<div>data: {data.nama}</div>
<button onclick={()=> klik()}>klik</button>
<div>tes: {tes}</div>
