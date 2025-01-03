// @ts-ignore
import App from './App.vue'
import {createApp} from "vue";
import { createTerminal } from '../src'

const app = createApp(App)

const terminal = createTerminal()
terminal.configStoreName("test-terminal")
terminal.configMaxStoredCommandCountPerInstance(2)

//  这行代码是一个错误示例
// terminal.configTheme("custom", "s")

app.use(terminal)

app.mount('#app')
