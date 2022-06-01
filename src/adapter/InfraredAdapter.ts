import PublishAdapter from "./interface/PublishAdapter.js";
import AbstractAdapter from "./interface/AbstractAdapter.js";
import { execSync } from 'child_process'
import InfraredAdapterConfig from "../config/adapter/InfraredAdapterConfig.js";
import AdapterPublishError from "../error/AdapterPublishError.js";

export default class InfraredAdapter extends AbstractAdapter implements PublishAdapter {
    declare protected readonly config: InfraredAdapterConfig

    constructor(config: InfraredAdapterConfig) {
        super(config)
    }

    publish(subject: string, data: string): void {
        try {
            execSync(`${this.config.executablePath} send_once ${subject} ${data}`)
        } catch (error) {
            throw new AdapterPublishError(`Encountered an error while publishing to "${subject}" with data "${data}".`)
        }
    }
}