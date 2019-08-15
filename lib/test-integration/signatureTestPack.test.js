var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// tslint:disable-next-line:no-submodule-imports
import HexCoder from '@guardtime/gt-js-common/lib/coders/HexCoder';
// tslint:disable-next-line:no-submodule-imports
import DataHash from '@guardtime/gt-js-common/lib/hash/DataHash';
import bigInteger from 'big-integer';
// tslint:disable-next-line:import-name
import parseCsv from 'csv-parse/lib/sync';
import { EventEmitter } from 'events';
import fs from 'fs';
import * as path from 'path';
import ksiConfig from '../config/ksi-config';
import { ExtendingService, KeyBasedVerificationPolicy, KsiService, PublicationBasedVerificationPolicy, PublicationsFileFactory, PublicationsFileService, ServiceCredentials, SigningService, VerificationContext } from '../src/common/main';
import { TlvInputStream } from '../src/common/parser/TlvInputStream';
import { PublicationData } from '../src/common/publication/PublicationData';
import { KsiSignature } from '../src/common/signature/KsiSignature';
import { CalendarBasedVerificationPolicy } from '../src/common/signature/verification/policy/CalendarBasedVerificationPolicy';
import { InternalVerificationPolicy } from '../src/common/signature/verification/policy/InternalVerificationPolicy';
import { ExtendingServiceProtocol, PublicationsFileServiceProtocol, SigningServiceProtocol } from '../src/nodejs/main';
import { KsiRequest } from '../src/nodejs/service/KsiRequest';
const config = {
    publicationsFile: null,
    testDirectory: null,
    ksiService: null
};
/**
 * Signature Test Pack for shared tests over all SDK-s
 */
describe.each([
    path.join(__dirname, './resources/signature-test-pack/internal-policy-signatures/internal-policy-results.csv'),
    path.join(__dirname, './resources/signature-test-pack/invalid-signatures/invalid-signature-results.csv'),
    path.join(__dirname, './resources/signature-test-pack/policy-verification-signatures/policy-verification-results.csv'),
    path.join(__dirname, './resources/signature-test-pack/valid-signatures/signature-results.csv')
])('Signature Test Pack: %s', (resultFile) => {
    beforeAll(() => {
        config.ksiService = new KsiService(new SigningService(new SigningServiceProtocol(ksiConfig.AGGREGATION_URL), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)), new ExtendingService(new ExtendingServiceProtocol(ksiConfig.EXTENDER_URL), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)), new PublicationsFileService(new PublicationsFileServiceProtocol(ksiConfig.PUBLICATIONS_FILE_URL), new PublicationsFileFactory()));
        return config.ksiService.getPublicationsFile().then((publicationsFile) => {
            config.publicationsFile = publicationsFile;
        });
    });
    it.each(parseCsv(fs.readFileSync(resultFile).toString(), {
        delimiter: ';',
        columns: () => {
            return [
                'signatureFile', 'actionName', 'errorCode', 'errorMessage', 'inputHashLevel',
                'inputHash', 'calendarHashChainInput', 'calendarHashChainOutput', 'aggregationTime',
                'publicationTime', 'publicationData', 'isExtendingAllowed', 'resourceFile', 'publicationsFilePath',
                'certFilePath', 'rowIndex'
            ];
        },
        cast: (value, context) => {
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
    }).map((row) => [path.basename(row.signatureFile), row]))('%s', (filename, row) => {
        console.debug(`
SignatureFile: ${row.signatureFile}
ActionName:    ${row.actionName}
Error Code:    ${row.errorCode}
Error Message: ${row.errorMessage}
Row index:     ${row.rowIndex}`);
        return testSignature(row, path.dirname(resultFile));
    });
});
function testSignature(row, testBasePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const signatureBytes = new Uint8Array(fs.readFileSync(path.join(testBasePath, row.signatureFile)));
        let policy;
        let userPublication = null;
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
        const verificationContext = new VerificationContext(new KsiSignature(new TlvInputStream(signatureBytes).readTag()));
        verificationContext.setDocumentHash(row.inputHash);
        verificationContext.setUserPublication(row.publicationData);
        verificationContext.setKsiService(config.ksiService);
        verificationContext.setDocumentHashLevel(row.inputHashLevel);
        verificationContext.setExtendingAllowed(row.isExtendingAllowed);
        if (userPublication === null) {
            if (!row.publicationsFilePath) {
                verificationContext.setPublicationsFile(config.publicationsFile);
            }
            else {
                verificationContext.setPublicationsFile(new PublicationsFileFactory().create(new Uint8Array(fs.readFileSync(path.join(testBasePath, row.publicationsFilePath)))));
            }
        }
        if (row.resourceFile) {
            verificationContext.setKsiService(new KsiService(new SigningService(new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)), new TestExtendingService(new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY), bigInteger(1)), new PublicationsFileService(new TestServiceProtocol(fs.readFileSync(path.join(testBasePath, row.resourceFile))), new PublicationsFileFactory())));
        }
        else {
            verificationContext.setKsiService(config.ksiService);
        }
        console.debug(verificationContext.getSignature().toString());
        const result = yield policy.verify(verificationContext);
        const verificationError = result.getVerificationError();
        console.debug(result.toString());
        expect(verificationError ? verificationError.code : null).toEqual(row.errorCode || null);
    });
}
/**
 * Test service protocol for mocking queries to server
 */
class TestServiceProtocol {
    constructor(resultBytes) {
        this.resultBytes = resultBytes;
    }
    extend() {
        return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
    }
    getPublicationsFile() {
        return Promise.resolve(this.resultBytes);
    }
    sign() {
        return new KsiRequest(Promise.resolve(this.resultBytes), new EventEmitter());
    }
}
/**
 * Test extending service to mock request id
 */
class TestExtendingService extends ExtendingService {
    constructor(extendingServiceProtocol, extendingServiceCredentials, requestId) {
        super(extendingServiceProtocol, extendingServiceCredentials);
        this.requestId = requestId;
    }
    generateRequestId() {
        return this.requestId;
    }
}
