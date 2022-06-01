import DeviceControllerConfig from "./DeviceControllerConfig.js";

export default interface MatrixDeviceControllerConfig extends DeviceControllerConfig {
    remoteName: string
    sourceMap: {
        [device: string]: string[]
    }
}