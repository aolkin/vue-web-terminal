import './css/scrollbar.css'
import './css/ansi.css'
import './css/style.css'
import 'vue-json-viewer/style.css'
import type {App} from 'vue'
import TerminalStore from "./common/store"
import TerminalApi, {configCodemirror, configHighlight, configTheme, setOptions} from "./common/api"
import Terminal from "./Terminal.vue"
import {Options, TerminalAsk, TerminalFlash} from "./types"

const install = (app: App, options?: Options): void => {
    if (options) {
        setOptions(options)
    }
    app.component(Terminal.__name as string, Terminal)
}

//  兼容老版本
Terminal.install = install

export * from './types'

export {
    Terminal,
    TerminalStore,
    TerminalApi,
    TerminalAsk,
    TerminalFlash,
    configHighlight,
    configCodemirror,
    configTheme
}

const VueWebTerminal = {
    install
}

export default VueWebTerminal
