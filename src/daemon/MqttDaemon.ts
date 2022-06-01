import AbstractDaemon from "./AbstractDaemon.js";
import MqttDaemonRegisterSubscriberConfig from "../config/daemon/MqttDaemonRegisterSubscriberConfig.js";
import MqttAdapter from "../adapter/MqttAdapter.js";
import AttributeNotSupportedError from "../error/AttributeNotSupportedError.js";
import logger from "../logger/logger.js";

export default class MqttDaemon extends AbstractDaemon {
    declare protected adapter: MqttAdapter

    constructor(adapter: MqttAdapter) {
        super(adapter);
    }

    public registerSubscriber(config: MqttDaemonRegisterSubscriberConfig): void {
        logger.log(`Registering subscriber for device "${config.device}", attribute "${config.attribute}".`)

        const baseTopic = `${config.device}/${config.attribute}`

        this.adapter.subscribe(`${baseTopic}/set`, (data: string) => {
            logger.log(`Handling message for topic "${baseTopic}/set", attribute "${config.attribute}", data "${data}".`)

            if (!config.allowedValues.includes(data)) {
                throw new AttributeNotSupportedError(
                    `Value "${data}" for attribute "${config.attribute}" is not supported by device "${config.device}"`
                )
            }
            config.handler(data)

            if (config.acknowledge) {
                logger.log(`Acknowledging update for device "${config.device}", attribute "${config.attribute}", data "${data}".`)
                this.adapter.publish(baseTopic, data)
            }
        })
    }

    public publishUpdate(device: string, attribute: string, data: string): void {
        logger.log(`Publishing update to device "${device}", attribute "${attribute}", data "${data}".`)

        this.adapter.publish(`${device}/${attribute}`, data)
    }
}