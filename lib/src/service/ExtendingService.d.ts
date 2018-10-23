import { BigInteger } from 'big-integer';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { ExtendingServiceProtocol } from './ExtendingServiceProtocol';
import { IServiceCredentials } from './IServiceCredentials';
/**
 * Extending service
 */
export declare class ExtendingService {
    private requests;
    private extendingServiceProtocol;
    private extendingServiceCredentials;
    constructor(extendingServiceProtocol: ExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials);
    private static processPayload;
    extend(aggregationTime: BigInteger, publicationTime?: BigInteger | null): Promise<CalendarHashChain>;
}
