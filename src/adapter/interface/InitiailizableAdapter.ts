export default interface InitiailizableAdapter {
    initialize(): Promise<void>
    deinitialize(): Promise<void>
}