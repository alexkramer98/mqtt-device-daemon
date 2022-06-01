import PublishAdapter from "./interface/PublishAdapter.js";
import AbstractAdapter from "./interface/AbstractAdapter.js";
import CecAdapterConfig from "../config/adapter/CecAdapterConfig.js";
import InitiailizableAdapter from "./interface/InitiailizableAdapter.js";
import AdapterNotInitializedError from "../error/AdapterNotInitializedError.js";
import { exec } from "child_process";
import util from 'util'
import AdapterPublishError from "../error/AdapterPublishError.js";
import AdapterInitializationError from "../error/AdapterInitializationError.js";

const execPromise = util.promisify(exec)

export default class CecAdapter extends AbstractAdapter implements InitiailizableAdapter, PublishAdapter {
    declare protected readonly config: CecAdapterConfig
    private isInitialized: boolean

    constructor(config: CecAdapterConfig) {
        super(config)
    }

    async initialize(): Promise<void> {
        try {
            await execPromise(`${this.config.executablePath} --record --skip-info`)
            this.isInitialized = true
        } catch (error) {
            throw new AdapterInitializationError(`Unable to open connection to cec adapter with exec location "${this.config.executablePath}".`)
        }
    }

    deinitialize(): Promise<void> {
        this.isInitialized = false

        return Promise.resolve()
    }

    public async publish(subject: string, data: string): Promise<string> {
        if (!this.isInitialized) {
            throw new AdapterNotInitializedError(`Tried to publish subject "${subject}" but CecAdapter is not initialized.`)
        }

        const command = `${this.config.executablePath} --skip-info --to ${subject} ${data}`

        try {
            const { stdout } = await execPromise(command)

            return stdout
        } catch (error) {
            throw new AdapterPublishError(`Encountered an error while publishing to "${subject}" with data "${data}".`)
        }
    }
}