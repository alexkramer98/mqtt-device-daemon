import DeviceControllerConfig from "./DeviceControllerConfig.js";

export default interface TvDeviceControllerConfig extends DeviceControllerConfig {
    cecLogicalAddress: string
    hisenseMqttHubUrl: string
    hisenseMqttUsername: string
    hisenseMqttPassword: string
    hisenseMqttCertPath: string
    hisenseMqttKeyPath: string
    hisenseMqttPowerStateTopic: string
    hisenseMqttPowerStateValue: string
    hisenseMqttConnectTimeoutSeconds: number
}