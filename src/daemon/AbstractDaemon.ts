import MqttDaemonRegisterSubscriberConfig from "../config/daemon/MqttDaemonRegisterSubscriberConfig.js";
import AbstractAdapter from "../adapter/interface/AbstractAdapter.js";

export default abstract class AbstractDaemon {
    protected readonly adapter: AbstractAdapter

    protected constructor(adapter: AbstractAdapter) {
        this.adapter = adapter
    }

    public abstract registerSubscriber(config: MqttDaemonRegisterSubscriberConfig): void
    public abstract publishUpdate(device: string, attribute: string, data: string): void
}