import AbstractAdapterConfig from "../../config/adapter/AdapterConfig.js";

export default abstract class AbstractAdapter {
    protected readonly config: AbstractAdapterConfig

    constructor(config: AbstractAdapterConfig) {
        this.config = config
    }
}