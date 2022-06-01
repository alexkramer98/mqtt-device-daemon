import SubscribeAdapter from "./interface/SubscribeAdapter.js";
import PublishAdapter from "./interface/PublishAdapter.js";
import AbstractAdapter from "./interface/AbstractAdapter.js";
import MqttAdapterConfig from "../config/adapter/MqttAdapterConfig.js";
import AdapterNotInitializedError from "../error/AdapterNotInitializedError.js";
import InitiailizableAdapter from "./interface/InitiailizableAdapter.js";
import mqtt, {MqttClient} from 'mqtt'
import AdapterInitializationError from "../error/AdapterInitializationError.js";
import AdapterPublishError from "../error/AdapterPublishError.js";
import AdapterSubscribeError from "../error/AdapterSubscribeError.js";

export default class MqttAdapter extends AbstractAdapter implements SubscribeAdapter, PublishAdapter, InitiailizableAdapter {
    declare protected readonly config: MqttAdapterConfig
    private isInitialized: boolean
    private mqttClient: MqttClient
    private handlers: { [topic: string]: (data: string) => void }[] = []

    constructor(config: MqttAdapterConfig) {
        super(config);
    }

    public async initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.mqttClient = mqtt.connect(this.config.url, {
                username: this.config.username,
                password: this.config.password,
                cert: this.config.cert,
                key: this.config.key,
                rejectUnauthorized: false,
            })
            this.mqttClient.on('connect', () => {
                this.mqttClient.on('message', (topic, data) => {
                    if (!this.handlers[topic]) {
                        return
                    }

                    this.handlers[topic](data.toString())
                })

                this.isInitialized = true
                resolve()
            })
            setTimeout(() => {
                if (!this.isInitialized) {
                    this.mqttClient?.end()
                    this.mqttClient = undefined
                    reject(new AdapterInitializationError(`Unable to connect to mqtt url "${this.config.url}".`))
                }
            }, this.config.connectTimeoutSeconds * 1000)
        })
    }

    public async deinitialize(): Promise<void> {
        this.mqttClient.end()
        this.mqttClient = undefined
        this.isInitialized = false
    }

    public publish(subject: string, data: string): void {
        if (!this.isInitialized) {
            throw new AdapterNotInitializedError(`Tried to publish subject "${subject}" but MqttAdapter is not initialized.`)
        }

        try {
            this.mqttClient.publish(subject, data)
        } catch (error) {
            throw new AdapterPublishError(`Encountered an error while publishing to "${subject}" with data "${data}".`)
        }
    }

    public subscribe(subject: string, handler: (data: string) => void): void {
        if (!this.isInitialized) {
            throw new AdapterNotInitializedError(`Tried to subscribe to "${subject}" but MqttAdapter is not initialized.`)
        }

        try {
            this.handlers[subject] = handler
            this.mqttClient.subscribe(subject)
        } catch (error) {
            throw new AdapterSubscribeError(`Encountered an error while subscribing to "${subject}".`)
        }
    }
}