import AdapterConfig from "./AdapterConfig.js";

export default interface MqttAdapterConfig extends AdapterConfig {
    url: string
    username?: string
    password?: string
    cert?: string
    key?: string
    connectTimeoutSeconds: number
}