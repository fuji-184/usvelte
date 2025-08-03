import { ui } from "../../system/handler.js"
import { parentPort, workerData } from "worker_threads"
//import { cache } from "../../system/utils.js"

const get_data = ()=>{

    const data = JSON.stringify({
        nama: "fuji"
    })
    return data
}

const get_ui = async (res, req) => {

    const data = JSON.stringify({
        nama: "fuji"
    })
    await ui("/", data, res)
}

const get_json = async (res, req) => {
    res
        .writeStatus("200 OK")
        .writeHeader("Content-Type", "application/json")
        .end(get_data())

}

export default {
    get_ui,
    get_json,
};

// i think this can be implemented in user code space, no need for framework abstraction :v
