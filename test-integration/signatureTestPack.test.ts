import bigInteger, {BigInteger} from 'big-integer';
import {CastingContext} from 'csv-parse';
// tslint:disable-next-line:import-name
import parseCsv from 'csv-parse/lib/sync';
import fs from 'fs';
import HexCoder from 'gt-js-common/lib/coders/HexCoder';
import DataHash from 'gt-js-common/lib/hash/DataHash';
import * as path from 'path';
import ksiConfig from '../config/ksi-config';
import {
    ExtendingService,
    KeyBasedVerificationPolicy,
    KsiService,
    PublicationBasedVerificationPolicy, PublicationsFileFactory, PublicationsFileService,
    ServiceCredentials,
    SigningService, VerificationContext
} from '../src/common/main';
import {TlvInputStream} from '../src/common/parser/TlvInputStream';
import {PublicationData} from '../src/common/publication/PublicationData';
import {KsiSignature} from '../src/common/signature/KsiSignature';
import {CalendarBasedVerificationPolicy} from '../src/common/signature/verification/policy/CalendarBasedVerificationPolicy';
import {InternalVerificationPolicy} from '../src/common/signature/verification/policy/InternalVerificationPolicy';
import {VerificationPolicy} from '../src/common/signature/verification/policy/VerificationPolicy';
import {VerificationError} from '../src/common/signature/verification/VerificationError';
import {VerificationResult} from '../src/common/signature/verification/VerificationResult';
import {ExtendingServiceProtocol, PublicationsFileServiceProtocol, SigningServiceProtocol} from '../src/nodejs/main';
import {PublicationsFile} from '../src/common/publication/PublicationsFile';

const config: { testDirectory: null | string; ksiService: null | KsiService; publicationsFile: PublicationsFile | null } = {
    publicationsFile: null,
    testDirectory: null,
    ksiService: null
};

type SignatureTestRow = {
    signatureFile: string;
    actionName: string;
    errorCode: string;
    errorMessage: string;
    inputHashLevel: BigInteger;
    inputHash: DataHash | null;
    calendarHashChainInput: DataHash | null;
    calendarHashChainOutput: DataHash | null;
    aggregationTime: BigInteger | null;
    publicationTime: BigInteger | null;
    publicationData: PublicationData | null;
    isExtendingAllowed: boolean;
    resourceFile: string;
    publicationsFilePath: string;
    certFilePath: string;
    rowIndex: number;
};

type CsvCastTypes = string | BigInteger | DataHash | PublicationData | number | boolean | null;

// private static IVerificationContext GetVerificationContext(TestingRow testingRow, IKsiSignature signature, string testDataDir, bool setUserPublication = false)
// {
//     IPublicationsFile publicationsFile = null;
//     IKsiService service;
//
//     if (!setUserPublication)
//     {
//         publicationsFile = GetPublicationsFile(string.IsNullOrEmpty(testingRow.PublicationsFilePath) ? null : testDataDir + testingRow.PublicationsFilePath,
//             string.IsNullOrEmpty(testingRow.CertFilePath) ? null : testDataDir + testingRow.CertFilePath);
//     }
//
//     if (string.IsNullOrEmpty(testingRow.ResourceFile))
//     {
//         service = IntegrationTests.GetHttpKsiService();
//     }
//     else
//     {
//         TestKsiServiceProtocol protocol = new TestKsiServiceProtocol
//         {
//             RequestResult = File.ReadAllBytes(Path.Combine(TestSetup.LocalPath, testDataDir + testingRow.ResourceFile))
//         };
//         service =
//             new TestKsiService(
//                 protocol,
//                 new ServiceCredentials(Properties.Settings.Default.HttpSigningServiceUser, Properties.Settings.Default.HttpSigningServicePass,
//                     TestUtil.GetHashAlgorithm(Properties.Settings.Default.HttpSigningServiceHmacAlgorithm)),
//                 protocol,
//                 new ServiceCredentials(Properties.Settings.Default.HttpExtendingServiceUser, Properties.Settings.Default.HttpExtendingServicePass,
//                     TestUtil.GetHashAlgorithm(Properties.Settings.Default.HttpExtendingServiceHmacAlgorithm)),
//                 protocol,
//                 new PublicationsFileFactory(
//                     new PkiTrustStoreProvider(new X509Store(StoreName.Root),
//                         CryptoTestFactory.CreateCertificateSubjectRdnSelector("E=publications@guardtime.com"))), 1, PduVersion.v2);
//     }
//
//     return new VerificationContext(signature)
//     {
//         DocumentHash = testingRow.InputHash,
//             UserPublication = setUserPublication ? testingRow.PublicationData : null,
//             IsExtendingAllowed = testingRow.IsExtendingAllowed,
//             KsiService = service,
//             PublicationsFile = publicationsFile,
//             DocumentHashLevel = testingRow.InputHashLevel
//     };
// }

/**
 * Signature Test Pack for shared tests over all SDK-s
 */
describe.each(
    [
        path.join(__dirname, './resources/signature-test-pack/internal-policy-signatures/internal-policy-results.csv')
    ]
)('Signature Test Pack', (resultFile: string): void => {
    beforeAll(() => {
        config.ksiService = new KsiService(
            new SigningService(
                new SigningServiceProtocol(ksiConfig.AGGREGATION_URL),
                new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)
            ),
            new ExtendingService(
                new ExtendingServiceProtocol(ksiConfig.EXTENDER_URL),
                new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)
            ),
            new PublicationsFileService(
                new PublicationsFileServiceProtocol(ksiConfig.PUBLICATIONS_FILE_URL),
                new PublicationsFileFactory()
            ));

        return config.ksiService.getPublicationsFile().then((publicationsFile: PublicationsFile) => {
            config.publicationsFile = publicationsFile;
        });
    });

    it.each(
        parseCsv(fs.readFileSync(resultFile).toString(), {
                delimiter: ';',
                columns: (): boolean | string[] => {
                    return [
                        'signatureFile', 'actionName', 'errorCode', 'errorMessage', 'inputHashLevel',
                        'inputHash', 'calendarHashChainInput', 'calendarHashChainOutput', 'aggregationTime',
                        'publicationTime', 'publicationData', 'isExtendingAllowed', 'resourceFile', 'publicationsFilePath',
                        'certFilePath', 'rowIndex'
                    ];
                },
                cast: (value: string, context: CastingContext): CsvCastTypes => {
                    if (context.lines === 0) {
                        return false;
                    }

                    switch (context.index) {
                        case 4:
                            return value ? bigInteger(value, 10) : bigInteger(0);
                        case 5:
                        case 6:
                        case 7:
                            return value ? new DataHash(HexCoder.decode(value)) : null;
                        case 8:
                        case 9:
                            return value ? bigInteger(value, 10) : null;
                        case 10:
                            return value ? PublicationData.CREATE_FROM_PUBLICATION_STRING(value) : null;
                        case 11:
                            return value.toUpperCase() === 'TRUE';
                        case 15:
                            return context.lines;
                        default:
                            return value;
                    }
                }
            }
        ))('Test row nr. %#', (row: SignatureTestRow) => {
            console.log(JSON.stringify(row, null, '  '));

            return testSignature(row, path.dirname(resultFile));
    });

});

async function testSignature(row: SignatureTestRow, testBasePath: string): Promise<void> {
    const signatureBytes: Uint8Array = new Uint8Array(fs.readFileSync(path.join(testBasePath, row.signatureFile)));
    let policy: VerificationPolicy;
    let userPublication: PublicationData | null = null;

    switch (row.actionName.toUpperCase()) {
        case 'USERPUBLICATION':
            userPublication = row.publicationData;
            policy = new PublicationBasedVerificationPolicy();
            break;
        case 'PUBLICATIONSFILE':
            policy = new PublicationBasedVerificationPolicy();
            break;
        case 'KEY':
            policy = new KeyBasedVerificationPolicy();
            break;
        case 'INTERNAL':
            policy = new InternalVerificationPolicy();
            break;
        case 'CALENDAR':
            policy = new CalendarBasedVerificationPolicy();
            break;
        case 'PARSING':
            expect(() => {
                return new KsiSignature(new TlvInputStream(signatureBytes).readTag());
            }).toThrow();

            return;
        case 'NOT-IMPLEMENTED':
            return;
        default:
            throw new Error(`Unknown testing action: ${row.actionName}`);
    }

    const verificationContext: VerificationContext = new VerificationContext(
        new KsiSignature(new TlvInputStream(signatureBytes).readTag()));

    verificationContext.setDocumentHash(row.inputHash);
    verificationContext.setUserPublication(row.publicationData);
    verificationContext.setKsiService(config.ksiService);
    verificationContext.setDocumentHashLevel(row.inputHashLevel);
    verificationContext.setExtendingAllowed(row.isExtendingAllowed);

    if (userPublication === null) {
        if (!row.publicationsFilePath) {
            verificationContext.setPublicationsFile(config.publicationsFile);
        } else {
            verificationContext.setPublicationsFile(new PublicationsFileFactory().create(fs.readFileSync(row.publicationsFilePath)));
        }
    }

    if (row.resourceFile) {
        return;
    } else {
        verificationContext.setKsiService(config.ksiService);
    }

    // GetVerificationContext(testingRow, signature, testDataDir, testingRow.ActionName == "userPublication")

    const result: VerificationResult = await policy.verify(verificationContext);
    const verificationError: VerificationError | null = result.getVerificationError();
    console.log(result.toString());
    expect(verificationError ? verificationError.code : null).toEqual(row.errorCode || null);
}
