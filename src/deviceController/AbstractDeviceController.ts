import DeviceControllerConfig from "../config/device/DeviceControllerConfig.js";

export default abstract class AbstractDeviceController {
    protected readonly config: DeviceControllerConfig

    protected constructor(config: DeviceControllerConfig) {
        this.config = config
    }
}