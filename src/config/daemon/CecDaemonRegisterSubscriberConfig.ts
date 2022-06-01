export default interface CecDaemonRegisterSubscriberConfig {
    device: string
    attribute: string
    allowedValues: string[]
    acknowledge: boolean
    handler: (data: string) => Promise<void>|void
}