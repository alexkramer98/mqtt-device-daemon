export default interface MqttDaemonRegisterSubscriberConfig {
    device: string
    attribute: string
    allowedValues: string[]
    acknowledge: boolean
    handler: (data: string) => Promise<void>|void
}