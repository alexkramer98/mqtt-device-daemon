import AbstractInfraredDevice from "./AbstractInfraredDevice.js";
import InfraredCommunicator from "../communicator/InfraredCommunicator.js";
import SupportedAttributes from "../../../types/client/SupportedAttributes.js";
import MatrixSourceMap from "../../../types/client/MatrixSourceMap.js";

export default class MatrixInfraredDevice extends AbstractInfraredDevice {
    private infraredCommunicator: InfraredCommunicator
    private readonly sourceMap: MatrixSourceMap

    constructor(remoteIdentifier: string, infraredCommunicator: InfraredCommunicator, sourceMap: MatrixSourceMap) {
        super(remoteIdentifier)

        this.infraredCommunicator = infraredCommunicator
        this.sourceMap = sourceMap
    }

    protected invoke(attribute: string, value: string): boolean {
        if (attribute === 'source') {
            return this.switchSource(value)
        }
        return false
    }

    protected getSupportedAttributes(): SupportedAttributes {
        return {
            source: Object.keys(this.sourceMap),
        };
    }

    private switchSource(newSource: string): boolean {
        const keysToSend = this.sourceMap[newSource]

        return this.infraredCommunicator.sendSequential(this.remoteIdentifier, keysToSend, 250)
    }
}