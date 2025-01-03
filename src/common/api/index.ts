import {TerminalApi, TerminalApiData, TerminalApiListenerFunc, TerminalConfiguration} from "~/types";

const data: TerminalApiData = {
    pool: {},
    configuration: {
        maxStoredCommandCountPerInstance: 100,
        storeName: 'terminal',
        themes: {}
    }
}

export function register(name: string, listener: TerminalApiListenerFunc) {
    if (data.pool[name]) {
        throw Error(`Unable to register an existing terminal: ${name}`)
    }
    data.pool[name] = listener
}

export function unregister(name: string) {
    delete data.pool[name]
}

export function rename(newName: string, oldName: string, listener: TerminalApiListenerFunc) {
    unregister(oldName)
    register(newName, listener);
}

export function configTheme(theme: string, css: string) {
    let res = css.match(/^.*\{(.*)}\s*$/s)
    if (!res || res.length != 2) {
        throw new Error(`Incorrect theme style format, correct format example:
:root {
    --t-main-background-color: #191b24;
    --t-main-font-color: #fff;
    ...
}
        `)
    }
    let themes = data.configuration.themes
    if (!themes) {
        data.configuration.themes = themes = {}
    }
    themes[theme] = css
}

export function configStoreName(name: string) {
    data.configuration.storeName = name
    console.debug("Configured storeName", name)
}

export function configMaxStoredCommandCountPerInstance(count: number) {
    if (count <= 1) {
        throw new Error("The value of 'maxStoredLogCountPerInstance' must be a valid positive number")
    }
    data.configuration.maxStoredCommandCountPerInstance = count
    console.debug("Configured maxStoredCommandCountPerInstance", count)
}

export function getConfiguration(): TerminalConfiguration {
    return data.configuration
}

export default new TerminalApi(data)
