export default interface PublishAdapter {
    publish(subject: string, data: string): void|string|Promise<void|string>
}