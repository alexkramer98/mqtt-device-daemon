import AbstractCommunicator from "./AbstractCommunicator.js";
import { execSync } from "child_process"
import InfraredCommunicatorConfig from "../../../types/communicator/InfraredCommunicatorConfig.js";

export default class InfraredCommunicator extends AbstractCommunicator {
    declare config: InfraredCommunicatorConfig

    constructor(config: InfraredCommunicatorConfig) {
        super(config);
    }

    public send(device: string, key: string): boolean {
        try {
            execSync(`${this.config.executablePath} send_once ${device} ${key}`)
        } catch (error) {
            return false
        }
        return true
    }

    public sendSequential(device: string, keys: string[], intervalMs: number): boolean {
        keys.forEach((key, index) => {
            setTimeout(() => {
                if (!this.send(device, key)) {
                    return false
                }
            }, index * intervalMs);
        });
        return true
    }
}