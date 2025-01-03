import {App} from "vue";

export type TerminalMessageClass = 'success' | 'error' | 'info' | 'warning' | 'system'

export type TerminalMessageType = 'cmdLine' | 'normal' | 'json' | 'code' | 'table' | 'html' | 'ansi'

export type TerminalCursorStyle = 'block' | 'underline' | 'bar' | 'none'

export interface VueWebTerminal {
    install: (app: App) => void;
    /**
     * 自定义主题设置，也可以覆盖默认的 dark 和 light 主题
     * @param theme 主题名
     * @param css 主题css内容
     */
    configTheme: (theme: string, css: string) => void;
    /**
     * 配置 local storage 存储名
     * @param name 存储名
     */
    configStoreName: (name: string) => void;
    /**
     * 配置每个Terminal实力存储的指令记录数量
     * @param count
     */
    configMaxStoredCommandCountPerInstance: (count: number) => void;
}

export interface EditorConfig {
    open: boolean
    focus: boolean
    value: string
    onClose: null | Function
    onFocus?: Function
    onBlur?: Function
}

export type Position = {
    x: number
    y: number
}

export type DragConfig = {
    width: number | string
    height: number | string
    zIndex?: number
    init?: Position
    pinned?: boolean
}

export type ScreenType = {
    xs?: boolean
    sm?: boolean
    md?: boolean
    lg?: boolean
    xl?: boolean
}

export type Command = {
    key: string
    title?: string
    group?: string
    usage?: string
    description?: string
    example?: Array<CommandExample>
}

export type CommandExample = {
    cmd: string
    des?: string
}

export type CmdHistory = {
    cmdLog: string[],
    cmdIdx: number
}

export type TerminalConfiguration = {
    storeName: string,
    maxStoredCommandCountPerInstance: number,
    themes: Record<string, string>,
}

export type MessageContentTable = {
    head: string[],
    rows: string[][]
}

export type MessageGroup = {
    fold: boolean,
    logs: Message[],
    tag?: string
}

export type Message = {
    type?: TerminalMessageType
    content: string | number | object | MessageContentTable | Array<any>
    class?: TerminalMessageClass
    tag?: string,
    depth?: number
}

export type AskConfig = {
    isPassword: boolean
    question: string,
    autoReview: boolean
    callback?: (value: string) => void
}

export type InputTipItem = {
    content: string,
    description?: string,
    command?: Command
}

export type CharWidth = {
    en?: number,
    cn?: number
}

export type TerminalElementInfo = {
    pos: Position,
    screenWidth: number,
    screenHeight: number,
    clientWidth: number,
    clientHeight: number,
    charWidth: CharWidth
}

export type CommandSortHandlerFunc = (a: any, b: any) => number

export type InputFilterFunc = (str1: string, str2: string, event: InputEvent | CompositionEvent) => string | null

export type CommandFormatterFunc = (cmd: string) => string

export type TerminalApiListenerFunc = (type: string, options?: any) => any | void

export type SuccessFunc = (message?: Message | Array<Message> | string | TerminalFlash | TerminalAsk) => void

export type FailedFunc = (message: string) => void

export type PushMessageBeforeFunc = (message: Message, name: String) => void

/**
 * 提示选择处理函数
 *
 * @param command       当前用户输入的完整命令行
 * @param cursorIndex   当前光标所处位置
 * @param item          用户选择提示项
 * @param callback      填充结束后需调用此函数返回新的命令行
 */
export type InputTipsSelectHandlerFunc = (command: string, cursorIndex: number, item: InputTipItem, callback: (cmd: string) => void) => void

/**
 * 用户自定义命令搜索提示实现
 *
 * @param command       当前用户输入的完整命令行
 * @param cursorIndex   当前光标所处位置
 * @param commandStore  命令集合
 * @param callback      搜索结束回调，回调格式为一个数组
 */
export type InputTipsSearchHandlerFunc = (command: string, cursorIndex: number, commandStore: Command[], callback: (tips: InputTipItem[], openTips?: boolean) => void) => void

class TerminalCallback {

    onFinishListener: Function

    finish() {
        if (this.onFinishListener != null) {
            this.onFinishListener()
        }
    }

    onFinish(callback: Function) {
        this.onFinishListener = callback
    }
}

export class TerminalAsk extends TerminalCallback {
    handler: Function

    ask(options: AskConfig) {
        if (this.handler != null) {
            this.handler(options)
        }
    }

    onAsk(callback: (config: AskConfig) => void) {
        this.handler = callback
    }
}

export class TerminalFlash extends TerminalCallback {
    handler: Function

    flush(msg: string) {
        if (this.handler != null) {
            this.handler(msg)
        }
    }

    onFlush(callback: (msg: string) => void) {
        this.handler = callback
    }
}

export interface TerminalApiData {
    pool: {
        [key: string]: TerminalApiListenerFunc
    },
    configuration: TerminalConfiguration
}

export class TerminalApi {

    data: TerminalApiData

    constructor(data: TerminalApiData) {
        this.data = data
    }

    post(name: string = 'terminal', event: string, options?: any) {
        let listener: TerminalApiListenerFunc = this.data.pool[name]
        if (listener != null) {
            return listener(event, options)
        }
    }

    pushMessage(name: string, message: Message | Array<Message> | string): void {
        this.post(name, 'pushMessage', message)
    }

    appendMessage(name: string, message: string): void {
        this.post(name, 'appendMessage', message)
    }

    fullscreen(name: string): void {
        this.post(name, "fullscreen")
    }

    isFullscreen(name: string): boolean {
        return this.post(name, 'isFullscreen')
    }

    dragging(name: string, position: Position): void {
        this.post(name, 'dragging', position)
    }

    /**
     * Simulate trigger execution instructions
     *
     * @param name name of terminal
     * @param command content of the command
     * @return { boolean } Trigger success
     */
    execute(name: string, command: string): boolean {
        return this.post(name, 'execute', command)
    }

    focus(name: string, enforce?: boolean): void {
        this.post(name, 'focus', enforce)
    }

    elementInfo(name: string): TerminalElementInfo {
        return this.post(name, 'elementInfo')
    }

    textEditorOpen(name: string, setting?: EditorSetting): void {
        this.post(name, 'textEditorOpen', setting)
    }

    textEditorClose(name: string, closeCallbackParams?: any): string | undefined {
        return this.post(name, 'textEditorClose', closeCallbackParams)
    }

    clearLog(name: string, clearHistory?: boolean): void {
        this.post(name, 'clearLog', clearHistory)
    }

    getCommand(name: string): string {
        return this.post(name, 'getCommand')
    }

    setCommand(name: string, newCommand: string): void {
        this.post(name, 'setCommand', newCommand)
    }

    switchAllFoldState(name: string, foldStat: boolean): number {
        return this.post(name, 'switchAllFoldState', foldStat)
    }

    jumpToBottom(name: string, enforce: boolean): void {
        this.post(name, 'jumpToBottom', enforce)
    }
}

export interface EditorSetting {
    content: string,
    onClose: Function
}
