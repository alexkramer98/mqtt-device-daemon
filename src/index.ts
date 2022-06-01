import 'dotenv/config'
import MqttDaemon from "./daemon/MqttDaemon.js";
import MqttAdapter from "./adapter/MqttAdapter.js";
import TvDeviceController from "./deviceController/TvDeviceController.js";
import MatrixDeviceController from "./deviceController/MatrixDeviceController.js";
import CecAdapter from "./adapter/CecAdapter.js";
import logger from "./logger/logger.js";
import MatrixSourceMap from "./enum/MatrixSourceMap.js";
import InfraredAdapter from "./adapter/InfraredAdapter.js";
import OnOffPair from "./enum/OnOffPair.js";

logger.log('Starting up.')

const mqttAdapter = new MqttAdapter({
    url: process.env.MQTT_HUB_URL,
    connectTimeoutSeconds: Number(process.env.MQTT_CONNECT_TIMEOUT_SECONDS)
})
const cecAdapter = new CecAdapter({
    executablePath: process.env.CEC_CTL_EXECUTABLE_PATH
})
const infraredAdapter = new InfraredAdapter({
    executablePath: process.env.IRSEND_EXECUTABLE_PATH
})

const tvDeviceController = new TvDeviceController({
    cecLogicalAddress: process.env.CEC_TV_LOGICAL_ADDRESS,
    hisenseMqttHubUrl: process.env.HISENSE_MQTT_HUB_URL,
    hisenseMqttCertPath: process.env.HISENSE_MQTT_CERT_PATH,
    hisenseMqttKeyPath: process.env.HISENSE_MQTT_KEY_PATH,
    hisenseMqttUsername: process.env.HISENSE_MQTT_USERNAME,
    hisenseMqttPassword: process.env.HISENSE_MQTT_PASSWORD,
    hisenseMqttPowerStateTopic: process.env.HISENSE_MQTT_POWER_STATE_TOPIC,
    hisenseMqttPowerStateValue: process.env.HISENSE_MQTT_POWER_STATE_VALUE,
    hisenseMqttConnectTimeoutSeconds: Number(process.env.MQTT_CONNECT_TIMEOUT_SECONDS)
}, cecAdapter)
const matrixDeviceController = new MatrixDeviceController({
    remoteName: process.env.MATRIX_LIRC_REMOTE_NAME,
    sourceMap: Object.fromEntries(Object.entries(MatrixSourceMap))
}, infraredAdapter)

await mqttAdapter.initialize()
await cecAdapter.initialize()

const mqttDaemon = new MqttDaemon(mqttAdapter)

mqttDaemon.registerSubscriber({
    device: 'home/living/tv',
    attribute: 'power',
    allowedValues: Object.values(OnOffPair).map(item => item.toString()),
    acknowledge: false,
    async handler(data: string): Promise<void> {
        if (data === OnOffPair.On.toString()) {
            await tvDeviceController.powerOn()
        } else {
            await tvDeviceController.powerOff()
        }
    }
})
mqttDaemon.registerSubscriber({
    device: 'home/living/matrix',
    attribute: 'source',
    allowedValues: Object.keys(MatrixSourceMap),
    acknowledge: true,
    handler(data: string): void {
        matrixDeviceController.changeSource(data)
    }
})

logger.log('Registering TV power state watcher.')

let lastTvPowerState: OnOffPair = OnOffPair.Off
setInterval(async (): Promise<void> => {
    const newPowerState = await tvDeviceController.getPowerState()
    if (newPowerState === lastTvPowerState) {
        return
    }
    let newStateString: string
    if (newPowerState === undefined) {
        logger.log(`New state for tv: "undefined". Retaining last known state.`)
        return
    }
    //either on or standby
    logger.log(`New state for tv: "${newPowerState}".`)
    newStateString = newPowerState.toString()
    lastTvPowerState = newPowerState
    mqttDaemon.publishUpdate('home/living/tv', 'power', newStateString)


}, 1000)

logger.log('Daemon ready to conquer the world!')