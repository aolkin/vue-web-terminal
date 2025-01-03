import './css/scrollbar.css'
import './css/ansi.css'
import './css/style.css'
import 'vue-json-viewer/style.css'
import type {App} from 'vue'
import TerminalApi, {configMaxStoredCommandCountPerInstance, configStoreName, configTheme} from "./common/api"
import Terminal from "./Terminal.vue"
import {TerminalAsk, TerminalFlash, VueWebTerminal} from "./types"
import {getStore, initStore} from "~/common/store";

const install = (app: App): void => {
    initStore()
    app.component(Terminal.__name as string, Terminal)
}

const createTerminal = (): VueWebTerminal => {
    return {
        install,
        configTheme,
        configStoreName,
        configMaxStoredCommandCountPerInstance
    }
}

export * from './types'

export {
    Terminal,
    TerminalApi,
    TerminalAsk,
    TerminalFlash,
    createTerminal,
    getStore
}

export default Terminal
