import { ICount } from '../parser/CompositeTag';
import { TlvTag } from '../parser/TlvTag';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { RequestResponsePayload } from './RequestResponsePayload';
/**
 * Extend response payload
 */
export declare class ExtendResponsePayload extends RequestResponsePayload {
    private calendarLastTime;
    private calendarHashChain;
    constructor(tlvTag: TlvTag);
    getCalendarHashChain(): CalendarHashChain;
    protected parseChild(tlvTag: TlvTag): TlvTag;
    protected validate(tagCount: ICount): void;
}
