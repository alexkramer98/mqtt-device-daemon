export default new class Logger {
    private readonly isVerbose: boolean

    constructor() {
        this.isVerbose = process.env.LOG_VERBOSE === 'true'
    }

    public log(message: string) {
        if (this.isVerbose) {
            console.log(`[${new Date().toLocaleString()}] ${message}`)
        }
    }
}