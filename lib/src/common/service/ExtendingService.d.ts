import { BigInteger } from 'big-integer';
import { CalendarHashChain } from '../signature/CalendarHashChain';
import { IExtendingServiceProtocol } from './IExtendingServiceProtocol';
import { IServiceCredentials } from './IServiceCredentials';
/**
 * Extending service
 */
export declare class ExtendingService {
    private requests;
    private extendingServiceProtocol;
    private extendingServiceCredentials;
    constructor(extendingServiceProtocol: IExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials);
    private static processPayload;
    extend(aggregationTime: BigInteger, publicationTime?: BigInteger | null): Promise<CalendarHashChain>;
}
