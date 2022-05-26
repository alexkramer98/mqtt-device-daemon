import CommunicatorConfig from "../../../types/communicator/CommunicatorConfig.js";

export default abstract class AbstractCommunicator {
    protected config: CommunicatorConfig

    protected constructor(config: CommunicatorConfig) {
        this.config = config
    }
}