import { CompositeTag } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
/**
 * PDU header class
 */
export declare class PduHeader extends CompositeTag {
    private loginId;
    private instanceId;
    private messageId;
    constructor(tlvTag: TlvTag);
    static CREATE_FROM_LOGIN_ID(loginId: string): PduHeader;
    private parseChild;
    private validate;
}
