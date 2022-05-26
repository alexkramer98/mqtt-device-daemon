import AttributeNotSupportedError from "../../error/AttributeNotSupportedError.js";
import SupportedAttributes from "../../../types/client/SupportedAttributes.js";

export default abstract class AbstractInfraredDevice {
    protected remoteIdentifier: string

    protected constructor(remoteIdentifier: string) {
        this.remoteIdentifier = remoteIdentifier
    }

    protected abstract getSupportedAttributes(): SupportedAttributes
    protected abstract invoke(attribute: string, value: string): boolean

    public handle(attribute, value): boolean {
        if (!Object.keys(this.getSupportedAttributes()).includes(attribute)) {
            throw new AttributeNotSupportedError(
                `Attribute ${attribute} not supported by class ${(this.constructor as any).name}
            `)
        }
        if (!this.getSupportedAttributes()[attribute].includes(value)) {
            throw new AttributeNotSupportedError(
                `Attribute value ${value} for attribute ${attribute} not supported by class ${(this.constructor as any).name}
            `)
        }
        return this.invoke(attribute, value)
    }
}