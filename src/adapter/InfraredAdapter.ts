import PublishAdapter from "./interface/PublishAdapter.js";
import AbstractAdapter from "./interface/AbstractAdapter.js";
import { exec } from 'child_process'
import InfraredAdapterConfig from "../config/adapter/InfraredAdapterConfig.js";
import AdapterPublishError from "../error/AdapterPublishError.js";

export default class InfraredAdapter extends AbstractAdapter implements PublishAdapter {
    declare protected readonly config: InfraredAdapterConfig

    constructor(config: InfraredAdapterConfig) {
        super(config)
    }

    async publish(subject: string, data: string): Promise<void> {
        try {
            exec(`${this.config.executablePath} send_once ${subject} ${data}`, {
                //lirc has issues on newer Debian distro's: sometimes the command never returns (but ir is always emitted).
                //adding a timeout works around this issue.
                timeout: 1000
            })
        } catch (error) {
            throw new AdapterPublishError(`Encountered an error while publishing to "${subject}" with data "${data}".`)
        }
    }
}