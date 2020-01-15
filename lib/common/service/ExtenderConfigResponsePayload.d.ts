import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { PduPayload } from './PduPayload';
/**
 * Aggregator configuration response payload.
 */
export declare class ExtenderConfigResponsePayload extends PduPayload {
    private maxRequests;
    private parentUriList;
    private calendarFirstTime;
    private calendarLastTime;
    constructor(tlvTag: TlvTag);
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
