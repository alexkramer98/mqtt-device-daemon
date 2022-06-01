import AbstractDeviceController from "./AbstractDeviceController.js";
import MatrixDeviceControllerConfig from "../config/device/MatrixDeviceControllerConfig.js";
import InfraredAdapter from "../adapter/InfraredAdapter.js";
import DeviceControllerError from "../error/DeviceControllerError.js";

export default class MatrixDeviceController extends AbstractDeviceController {
    declare protected readonly config: MatrixDeviceControllerConfig
    private readonly infraredAdapter: InfraredAdapter

    constructor(config: MatrixDeviceControllerConfig, infraredAdapter: InfraredAdapter) {
        super(config);

        this.infraredAdapter = infraredAdapter
    }

    public changeSource(source: string): void {
        try {
            this.infraredAdapter.publish(this.config.remoteName, source)
        } catch (error) {
            throw new DeviceControllerError(`Unable to change source for "${this.config.remoteName}" to source "${source}".`)
        }
    }
}