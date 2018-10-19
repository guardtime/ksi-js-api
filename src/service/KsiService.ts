import bigInteger, {BigInteger} from 'big-integer';
import {DataHash, HashAlgorithm, pseudoRandomLong} from 'gt-js-common';
import {asn1} from 'node-forge';
import {
    AGGREGATION_REQUEST_PAYLOAD_CONSTANTS, AGGREGATION_REQUEST_PDU_CONSTANTS, AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS, PDU_CONSTANTS,
    PDU_HEADER_CONSTANTS,
    PDU_PAYLOAD_CONSTANTS
} from '../Constants';
import {CompositeTag, ITlvCount} from '../parser/CompositeTag';
import {ImprintTag} from '../parser/ImprintTag';
import {IntegerTag} from '../parser/IntegerTag';
import {StringTag} from '../parser/StringTag';
import {TlvError} from '../parser/TlvError';
import {TlvTag} from '../parser/TlvTag';
import {PublicationsFileFactory} from '../publication/PublicationsFileFactory';
import {KsiServiceError} from './KsiServiceError';
import Class = module;

class SigningServiceProtocol {

}

class AggregationRequestPayload extends CompositeTag {
    private requestId: IntegerTag;
    private requestHash: ImprintTag;
    private requestLevel: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE(requestId: BigInteger, hash: DataHash, level: BigInteger = bigInteger(0)): AggregationRequestPayload {
        if (!bigInteger.isInstance(requestId)) {
            throw new TlvError(`Invalid requestId: ${requestId}`);
        }

        if (!(hash instanceof DataHash)) {
            throw new TlvError(`Invalid requestId: ${hash}`);
        }

        if (!bigInteger.isInstance(level)) {
            throw new TlvError(`Invalid level: ${level}`);
        }

        const childTlv: TlvTag[] = [
            IntegerTag.CREATE(PDU_PAYLOAD_CONSTANTS.RequestIdTagType, false, false, requestId),
            ImprintTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType, false, false, hash)
        ];

        if (level.neq(0)) {
            childTlv.push(IntegerTag.CREATE(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType, false, false, level));
        }

        return new AggregationRequestPayload(
            CompositeTag.createCompositeTagTlv(AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType, false, false, childTlv));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_PAYLOAD_CONSTANTS.RequestIdTagType:
                return this.requestId = new IntegerTag(tlvTag);
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType:
                return this.requestHash = new ImprintTag(tlvTag);
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType:
                return this.requestLevel = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PDU_PAYLOAD_CONSTANTS.RequestIdTagType] !== 1) {
            throw new TlvError('Exactly one request id must exist in aggregation request payload.');
        }

        if (tagCount[AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestHashTagType] !== 1) {
            throw new TlvError('Exactly one request hash must exist in aggregation request payload.');
        }

        if (tagCount[AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.RequestLevelTagType] > 1) {
            throw new TlvError('Only one request level is allowed in aggregation request payload.');
        }
    }
}

interface IServiceCredentials {
    getLoginId(): string;

    getLoginKey(): Uint8Array;

    getHmacAlgorithm(): HashAlgorithm;
}

class PduHeader extends CompositeTag {
    private loginId: StringTag;
    private instanceId: IntegerTag;
    private messageId: IntegerTag;

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE_FROM_LOGIN_ID(loginId: string): PduHeader {
        if (!(typeof loginId !== 'string')) {
            throw new TlvError(`Invalid loginId: ${loginId}`);
        }

        return new PduHeader(CompositeTag.createCompositeTagTlv(PDU_HEADER_CONSTANTS.TagType, false, false, [
            StringTag.CREATE(PDU_HEADER_CONSTANTS.LoginIdTagType, false, false, loginId)
        ]));
    }

    private parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.LoginIdTagType:
                return this.loginId = new StringTag(tlvTag);
            case PDU_HEADER_CONSTANTS.InstanceIdTagType:
                return this.instanceId = new IntegerTag(tlvTag);
            case PDU_HEADER_CONSTANTS.MessageIdTagType:
                return this.messageId = new IntegerTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    private validate(tagCount: ITlvCount): void {
        if (tagCount[PDU_HEADER_CONSTANTS.LoginIdTagType] !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.InstanceIdTagType] > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.MessageIdTagType] > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }
}

abstract class Pdu extends CompositeTag {
    protected payloads: TlvTag[] = [];
    private header: PduHeader;
    private hmac: ImprintTag;
//     int _headerIndex;
//     int _macIndex;
//
//     public List<PduPayload> Payloads { get; } = new List<PduPayload>();
//
//
// public ErrorPayload ErrorPayload { get; set; }
//
//
// public PduHeader Header { get; private set; }
//
//
// protected Pdu(ITlvTag tag) : base(tag)
// {
// }

// protected override ITlvTag ParseChild(ITlvTag childTag)
// {
//     foreach (uint tagType in Constants.AllPayloadTypes)
//     {
//         if (tagType == childTag.Type)
//         {
//             return childTag;
//         }
//     }
//
//     switch (childTag.Type)
//     {
//         case Constants.PduHeader.TagType:
//             _headerIndex = Count;
//             return Header = childTag as PduHeader ?? new PduHeader(childTag);
//         case Constants.Pdu.MacTagType:
//             _macIndex = Count;
//             return Mac = GetImprintTag(childTag);
//     }
//
//     return base.ParseChild(childTag);
// }

// protected override void Validate(TagCounter tagCounter)
// {
//     base.Validate(tagCounter);
//
//     if (ErrorPayload == null)
//     {
//         if (Payloads.Count == 0)
//         {
//             throw new TlvException("Payloads are missing in PDU.");
//         }
//
//         if (tagCounter[Constants.PduHeader.TagType] != 1)
//         {
//             throw new TlvException("Exactly one header must exist in PDU.");
//         }
//
//         if (_headerIndex != 0)
//         {
//             throw new TlvException("Header must be the first element in PDU.");
//         }
//
//         if (tagCounter[Constants.Pdu.MacTagType] != 1)
//         {
//             throw new TlvException("Exactly one MAC must exist in PDU");
//         }
//
//         if (_macIndex != Count - 1)
//         {
//             throw new TlvException("MAC must be the last element in PDU");
//         }
//     }
// }

// protected Pdu(uint tagType, PduHeader header, PduPayload payload, HashAlgorithm hmacAlgorithm, byte[] key)
// : base(tagType, false, false, new ITlvTag[] { header, payload, GetEmptyMacTag(hmacAlgorithm) })
// {
//     SetMacValue(hmacAlgorithm, key);
// }

// public ImprintTag Mac { get; private set; }

// protected void SetMacValue(HashAlgorithm macAlgorithm, byte[] key)
// {
//     for (int i = 0; i < Count; i++)
//     {
//         ITlvTag childTag = this[i];
//
//         if (childTag.Type == Constants.Pdu.MacTagType)
//         {
//             this[i] = Mac = CreateMacTag(CalcMacValue(macAlgorithm, key));
//             break;
//         }
//     }
// }

// private DataHash CalcMacValue(HashAlgorithm macAlgorithm, byte[] key)
// {
//     MemoryStream stream = new MemoryStream();
//     using (TlvWriter writer = new TlvWriter(stream))
//     {
//         writer.WriteTag(this);
//
//         return CalcMacValue(stream.ToArray(), macAlgorithm, key);
//     }
// }

// private static DataHash CalcMacValue(byte[] pduBytes, HashAlgorithm macAlgorithm, byte[] key)
// {
//     byte[] target = pduBytes.Length < macAlgorithm.Length ? new byte[0] : new byte[pduBytes.Length - macAlgorithm.Length];
//     Array.Copy(pduBytes, 0, target, 0, target.Length);
//
//     IHmacHasher hasher = KsiProvider.CreateHmacHasher(macAlgorithm);
//     return hasher.GetHash(key, target);
// }

// private static ImprintTag CreateMacTag(DataHash dataHash)
// {
//     return new ImprintTag(Constants.Pdu.MacTagType, false, false, dataHash);
// }

// protected static ImprintTag GetEmptyMacTag(HashAlgorithm macAlgorithm)
// {
//     if (macAlgorithm == null)
//     {
//         throw new ArgumentNullException(nameof(macAlgorithm));
//     }
//
//     byte[] imprintBytes = new byte[macAlgorithm.Length + 1];
//     imprintBytes[0] = macAlgorithm.Id;
//     return CreateMacTag(new DataHash(imprintBytes));
// }
//
// public static bool ValidateMac(byte[] pduBytes, ImprintTag mac, byte[] key)
// {
//     if (pduBytes == null)
//     {
//         throw new ArgumentNullException(nameof(pduBytes));
//     }
//
//     if (mac == null)
//     {
//         throw new ArgumentNullException(nameof(mac));
//     }
//
//     if (pduBytes.Length < mac.Value.Algorithm.Length)
//     {
//         Logger.Warn("PDU MAC validation failed. PDU bytes array is too short to contain given MAC.");
//         return false;
//     }
//
//     DataHash calculatedMac = CalcMacValue(pduBytes, mac.Value.Algorithm, key);
//
//     if (!calculatedMac.Equals(mac.Value))
//     {
//         Logger.Warn("PDU MAC validation failed. Calculated MAC and given MAC do not match.");
//         return false;
//     }
//
//     return true;
// }

    constructor(tlvTag: TlvTag) {
        super(tlvTag);
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case PDU_HEADER_CONSTANTS.TagType:
                // _headerIndex = Count;
                return this.header = new PduHeader(tlvTag);
            case PDU_CONSTANTS.MacTagType:
                // _macIndex = Count;
                return this.hmac = new ImprintTag(tlvTag);
            default:
                return CompositeTag.parseTlvTag(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        if (tagCount[PDU_HEADER_CONSTANTS.LoginIdTagType] !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.InstanceIdTagType] > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.MessageIdTagType] > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }
}

class AggregationRequestPdu extends Pdu {

    constructor(tlvTag: TlvTag) {
        super(tlvTag);

        this.decodeValue(this.parseChild.bind(this));
        this.validateValue(this.validate.bind(this));

        Object.freeze(this);
    }

    public static CREATE(header: PduHeader, payload: AggregationRequestPayload, hmac: ImprintTag): AggregationRequestPdu {
        return new AggregationRequestPdu(
            CompositeTag.createCompositeTagTlv(AGGREGATION_REQUEST_PDU_CONSTANTS.TagType, false, false, [
                header, payload, hmac]));
    }

    protected parseChild(tlvTag: TlvTag): TlvTag {
        switch (tlvTag.id) {
            case AGGREGATION_REQUEST_PAYLOAD_CONSTANTS.TagType:
                const aggregationRequestPayload: AggregationRequestPayload = new AggregationRequestPayload(tlvTag);
                this.payloads.push(aggregationRequestPayload);

                return aggregationRequestPayload;
            case AGGREGATOR_CONFIG_REQUEST_PAYLOAD_CONSTANTS.TagType:
                // TODO: Replace
                return new TlvTag(0, false, false, new Uint8Array(0));
            // AggregatorConfigRequestPayload; aggregatorConfigRequestPayload = childTag as AggregatorConfigRequestPayload ? ? new AggregatorConfigRequestPayload(childTag) ;
            // Payloads.Add(aggregatorConfigRequestPayload);
            // return aggregatorConfigRequestPayload;
            default:
                return super.parseChild(tlvTag);
        }
    }

    protected validate(tagCount: ITlvCount): void {
        super.validate(tagCount);

        if (tagCount[PDU_HEADER_CONSTANTS.LoginIdTagType] !== 1) {
            throw new TlvError('Exactly one login id must exist in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.InstanceIdTagType] > 1) {
            throw new TlvError('Only one instance id is allowed in PDU header.');
        }

        if (tagCount[PDU_HEADER_CONSTANTS.MessageIdTagType] > 1) {
            throw new TlvError('Only one message id is allowed in PDU header.');
        }
    }


}

/**
 * KSI service.
 */
class KsiService {
    private static readonly DEFAULT_HMAC_ALGORITHM: HashAlgorithm = HashAlgorithm.SHA2_256;

    private signingServiceProtocol: SigningServiceProtocol;
    private signingServiceCredentials: IServiceCredentials;
    private extendingServiceProtocol: ExtendingServiceProtocol;
    private extendingServiceCredentials: IServiceCredentials;
    private publicationsFileServiceProtocol: PublicationsFileServiceProtocol;
    private publicationsFileFactory: PublicationsFileFactory;

    constructor(signingServiceProtocol: SigningServiceProtocol, signingServiceCredentials: IServiceCredentials,
                extendingServiceProtocol: ExtendingServiceProtocol, extendingServiceCredentials: IServiceCredentials,
                publicationsFileServiceProtocol: PublicationsFileServiceProtocol, publicationsFileFactory: PublicationsFileFactory) {
        this.signingServiceProtocol = signingServiceProtocol;
        this.signingServiceCredentials = signingServiceCredentials;
        this.extendingServiceProtocol = extendingServiceProtocol;
        this.extendingServiceCredentials = extendingServiceCredentials;
        this.publicationsFileServiceProtocol = publicationsFileServiceProtocol;
        this.publicationsFileFactory = publicationsFileFactory;

    }

    public getSigningHmacAlgorithm(): HashAlgorithm {
        return this.signingServiceCredentials.getHmacAlgorithm() || KsiService.DEFAULT_HMAC_ALGORITHM;
    }

    public async sign(hash: DataHash, level: BigInteger = bigInteger(0)): Promise<void> {
        if (!(hash instanceof DataHash)) {
            throw new KsiServiceError(`Invalid hash: ${hash}`);
        }

        if (!bigInteger.isInstance(level)) {
            throw new KsiServiceError(`Invalid level: ${level}, must be BigInteger`);
        }

        const header: PduHeader = PduHeader.CREATE_FROM_LOGIN_ID(this.signingServiceCredentials.getLoginId());
        const requestId: BigInteger = pseudoRandomLong();
        const payload: AggregationRequestPayload = AggregationRequestPayload.CREATE(requestId, hash, level);

        // TODO: Calculate hmac correctly
        const pdu = AggregationRequestPdu.CREATE(header, payload, this.getSigningHmacAlgorithm(), this.signingServiceCredentials.getLoginId());

        // AggregationRequestPdu pdu = new AggregationRequestPdu(header, payload, _signingMacAlgorithm, _signingServiceCredentials.LoginKey);
        // Logger.Debug("Begin sign (request id: {0}){1}{2}", payload.RequestId, Environment.NewLine, pdu);
        // return BeginSignRequest(pdu.Encode(), requestId, hash, level, callback, asyncState);
    }

}
