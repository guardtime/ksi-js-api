/*
 * GUARDTIME CONFIDENTIAL
 *
 * Copyright 2008-2020 Guardtime, Inc.
 * All Rights Reserved.
 *
 * All information contained herein is, and remains, the property
 * of Guardtime, Inc. and its suppliers, if any.
 * The intellectual and technical concepts contained herein are
 * proprietary to Guardtime, Inc. and its suppliers and may be
 * covered by U.S. and foreign patents and patents in process,
 * and/or are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Guardtime, Inc.
 * "Guardtime" and "KSI" are trademarks or registered trademarks of
 * Guardtime, Inc., and no license to trademarks is granted; Guardtime
 * reserves and retains all trademark rights.
 */

// tslint:disable-next-line:no-submodule-imports
import HexCoder from '@guardtime/gt-js-common/lib/coders/HexCoder';
// tslint:disable-next-line:no-submodule-imports
import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger, {BigInteger} from 'big-integer';
import {CastingContext, ColumnOption} from 'csv-parse';
// tslint:disable-next-line:import-name
import parseCsv from 'csv-parse/lib/sync';
import {EventEmitter} from 'events';
import fs from 'fs';
import * as path from 'path';
import ksiConfig from '../config/ksi-config';
import {
    ExtendingService,
    KeyBasedVerificationPolicy,
    KsiService,
    PublicationBasedVerificationPolicy,
    PublicationsFileFactory,
    PublicationsFileService,
    ServiceCredentials,
    SigningService,
    VerificationContext
} from '../src/common/main';
import {TlvInputStream} from '../src/common/parser/TlvInputStream';
import {PublicationData} from '../src/common/publication/PublicationData';
import {PublicationsFile} from '../src/common/publication/PublicationsFile';
import {IExtendingServiceProtocol} from '../src/common/service/IExtendingServiceProtocol';
import {IPublicationsFileServiceProtocol} from '../src/common/service/IPublicationsFileServiceProtocol';
import {IServiceCredentials} from '../src/common/service/IServiceCredentials';
import {ISigningServiceProtocol} from '../src/common/service/ISigningServiceProtocol';
import {KsiRequestBase} from '../src/common/service/KsiRequestBase';
import {KsiSignature} from '../src/common/signature/KsiSignature';
import {CalendarBasedVerificationPolicy} from '../src/common/signature/verification/policy/CalendarBasedVerificationPolicy';
import {InternalVerificationPolicy} from '../src/common/signature/verification/policy/InternalVerificationPolicy';
import {VerificationPolicy} from '../src/common/signature/verification/policy/VerificationPolicy';
import {VerificationError} from '../src/common/signature/verification/VerificationError';
import {VerificationResult} from '../src/common/signature/verification/VerificationResult';
import {ExtendingServiceProtocol, PublicationsFileServiceProtocol, SigningServiceProtocol} from '../src/nodejs/main';
import {KsiRequest} from '../src/nodejs/service/KsiRequest';

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

/**
 * Signature Test Pack for shared tests over all SDK-s
 */
describe.each(
    [
        path.join(__dirname, './resources/signature-test-pack/internal-policy-signatures/internal-policy-results.csv'),
        path.join(__dirname, './resources/signature-test-pack/invalid-signatures/invalid-signature-results.csv'),
        path.join(__dirname, './resources/signature-test-pack/policy-verification-signatures/policy-verification-results.csv'),
        path.join(__dirname, './resources/signature-test-pack/valid-signatures/signature-results.csv')
    ]
)('Signature Test Pack: %s', (resultFile: string): void => {
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
        (<SignatureTestRow[]>parseCsv(fs.readFileSync(resultFile).toString(), {
                from_line: 2,
                delimiter: ';',
                columns: (): ColumnOption[] => {
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
        )).map((row: SignatureTestRow)  => [path.basename(row.signatureFile), row]))('%s', (filename: string, row: SignatureTestRow) => {
        console.debug(`
SignatureFile: ${row.signatureFile}
ActionName:    ${row.actionName}
Error Code:    ${row.errorCode}
Error Message: ${row.errorMessage}
Row index:     ${row.rowIndex}`);

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
            verificationContext.setPublicationsFile(
                new PublicationsFileFactory().create(
                    new Uint8Array(fs.readFileSync(path.join(testBasePath, row.publicationsFilePath)))));
        }
    }

    if (row.resourceFile) {
        verificationContext.setKsiService(
            new KsiService(
                new SigningService(
                    new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))),
                    new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)
                ),
                new TestExtendingService(
                    new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))),
                    new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY),
                    bigInteger(1)
                ),
                new PublicationsFileService(
                    new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))),
                    new PublicationsFileFactory()
                )
            )
        );
    } else {
        verificationContext.setKsiService(config.ksiService);
    }

    console.debug(verificationContext.getSignature().toString());
    const result: VerificationResult = await policy.verify(verificationContext);
    const verificationError: VerificationError | null = result.getVerificationError();
    console.debug(result.toString());
    expect(verificationError ? verificationError.code : null).toEqual(row.errorCode || null);
}

/**
 * Test service protocol for mocking queries to server
 */
class TestServiceProtocol implements ISigningServiceProtocol, IExtendingServiceProtocol, IPublicationsFileServiceProtocol {
    private readonly resultBytes: Uint8Array;

    constructor(resultBytes: Uint8Array) {
        this.resultBytes = resultBytes;
    }

    public extend(): KsiRequestBase {
        return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
    }

    public getPublicationsFile(): Promise<Uint8Array> {
        return Promise.resolve(this.resultBytes);
    }

    public sign(): KsiRequestBase {
        return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
    }
}

/**
 * Test extending service to mock request id
 */
class TestExtendingService extends ExtendingService {
    private readonly requestId: BigInteger;

    constructor(extendingServiceProtocol: IExtendingServiceProtocol,
                extendingServiceCredentials: IServiceCredentials,
                requestId: BigInteger) {
        super(extendingServiceProtocol, extendingServiceCredentials);
        this.requestId = requestId;
    }

    protected generateRequestId(): BigInteger {
        return this.requestId;
    }
}
