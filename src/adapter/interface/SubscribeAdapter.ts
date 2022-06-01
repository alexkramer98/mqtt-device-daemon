export default interface SubscribeAdapter {
    subscribe(subject: string, handler: (data: string) => void): void
}