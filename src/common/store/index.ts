import {CmdHistory} from "~/types";
import {getConfiguration} from "~/common/api";
import {ref} from "vue";

const store = ref<TerminalStore>()

export class TerminalStore {
    storageKey: string
    maxStoredCommandCountPerInstance: number
    dataMap: Record<string, CmdHistory>

    constructor(key: string, maxStoredCommandCountPerInstance: number) {
        this.storageKey = key
        this.maxStoredCommandCountPerInstance = maxStoredCommandCountPerInstance
        let dataMapStr = window.localStorage.getItem(this.storageKey)
        if (dataMapStr) {
            this.dataMap = JSON.parse(dataMapStr)
        } else {
            this.dataMap = {}
        }
    }

    push(name: string, cmd: string) {
        let data = this.getData(name)
        if (data.cmdLog == null) {
            data.cmdLog = []
        }
        if (data.cmdLog.length === 0 || data.cmdLog[data.cmdLog.length - 1] !== cmd) {
            data.cmdLog.push(cmd)

            console.log(data.cmdLog.length, this.maxStoredCommandCountPerInstance)

            if (data.cmdLog.length > this.maxStoredCommandCountPerInstance) {
                data.cmdLog.splice(0, data.cmdLog.length - this.maxStoredCommandCountPerInstance)
            }
        }

        data.cmdIdx = data.cmdLog.length
        this.store()
    }

    store() {
        window.localStorage.setItem(this.storageKey, JSON.stringify(this.dataMap))
    }

    getData(name: string): CmdHistory {
        let data = this.dataMap[name]
        if (data == null) {
            data = {
                cmdLog: [],
                cmdIdx: 0
            }
            this.dataMap[name] = data
        }
        return data
    }

    getLog(name: string) {
        let data = this.getData(name)
        if (!data.cmdLog) {
            data.cmdLog = []
        }
        return data.cmdLog
    }

    clear(name: string) {
        let data = this.getData(name)
        data.cmdLog = []
        data.cmdIdx = 0
        this.store()
    }

    clearAll() {
        this.dataMap = {}
        this.store()
    }

    getIdx(name: string) {
        let data = this.getData(name)
        return data.cmdIdx | 0
    }

    setIdx(name: string, idx: number) {
        this.getData(name).cmdIdx = idx
    }
}

export function initStore() {
    const configuration = getConfiguration();
    store.value = new TerminalStore(configuration.storeName, configuration.maxStoredCommandCountPerInstance)
}

export function getStore(): TerminalStore {
    if (store.value) {
        return store.value
    }
    throw new Error("The store must be initialized before reading")
}
