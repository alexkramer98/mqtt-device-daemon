import AbstractDeviceController from "./AbstractDeviceController.js";
import CecAdapter from "../adapter/CecAdapter.js";
import MqttAdapter from "../adapter/MqttAdapter.js";
import TvDeviceControllerConfig from "../config/device/TvDeviceControllerConfig.js";
import {readFileSync} from 'fs'
import DeviceControllerError from "../error/DeviceControllerError.js";
import OnOffPair from "../enum/OnOffPair.js";

export default class TvDeviceController extends AbstractDeviceController {
    private readonly cecAdapter: CecAdapter
    private readonly hisenseMqttAdapter: MqttAdapter
    declare protected readonly config: TvDeviceControllerConfig

    constructor(config: TvDeviceControllerConfig, cecAdapter: CecAdapter) {
        super(config);

        this.cecAdapter = cecAdapter

        let cert = undefined
        let key = undefined

        try {
            cert = readFileSync(config.hisenseMqttCertPath, {
                encoding: 'utf-8'
            })
            key = readFileSync(config.hisenseMqttKeyPath, {
                encoding: 'utf-8'
            })
        } catch (error) {
            throw new DeviceControllerError(`The file ${config.hisenseMqttCertPath} is not readable.`)
        }

        this.hisenseMqttAdapter = new MqttAdapter({
            url: config.hisenseMqttHubUrl,
            connectTimeoutSeconds: config.hisenseMqttConnectTimeoutSeconds,
            username: config.hisenseMqttUsername,
            password: config.hisenseMqttPassword,
            cert,
            key,
        })
    }

    public async powerOn(): Promise<void> {
        try {
            await this.cecAdapter.publish(this.config.cecLogicalAddress.toString(), '--image-view-on')
        } catch (error) {
            throw new DeviceControllerError(`Unable to power on device with address "${this.config.cecLogicalAddress}".`)
        }
    }

    public async powerOff(): Promise<void> {
        try {
            await this.hisenseMqttAdapter.initialize()
            this.hisenseMqttAdapter.publish(
                this.config.hisenseMqttPowerStateTopic,
                this.config.hisenseMqttPowerStateValue
            )
            await this.hisenseMqttAdapter.deinitialize()
        } catch (error) {
            throw new DeviceControllerError(`Unable to power off device with address "${this.config.cecLogicalAddress}".`)
        }
    }

    public async getPowerState(): Promise<OnOffPair|undefined> {
        try {
            const response = await this.cecAdapter.publish(this.config.cecLogicalAddress.toString(), '--give-device-power-status')
            const matches = response.match(/pwr-state: (on|standby)/)

            if (matches == null) {
                return undefined
            }
            return matches[1] === 'on' ? OnOffPair.On : OnOffPair.Off
        } catch (error) {
            throw new DeviceControllerError(`Unable to get power state for device with address "${this.config.cecLogicalAddress}".`)
        }
    }
}