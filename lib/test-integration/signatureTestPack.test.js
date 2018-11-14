var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import bigInteger from 'big-integer';
// tslint:disable-next-line:import-name
import parseCsv from 'csv-parse/lib/sync';
import fs from 'fs';
import HexCoder from 'gt-js-common/lib/coders/HexCoder';
import DataHash from 'gt-js-common/lib/hash/DataHash';
import * as path from 'path';
import ksiConfig from '../config/ksi-config';
import { ExtendingService, KeyBasedVerificationPolicy, KsiService, PublicationBasedVerificationPolicy, PublicationsFileFactory, PublicationsFileService, ServiceCredentials, SigningService, VerificationContext } from '../src/common/main';
import { TlvInputStream } from '../src/common/parser/TlvInputStream';
import { PublicationData } from '../src/common/publication/PublicationData';
import { KsiSignature } from '../src/common/signature/KsiSignature';
import { CalendarBasedVerificationPolicy } from '../src/common/signature/verification/policy/CalendarBasedVerificationPolicy';
import { InternalVerificationPolicy } from '../src/common/signature/verification/policy/InternalVerificationPolicy';
import { ExtendingServiceProtocol, PublicationsFileServiceProtocol, SigningServiceProtocol } from '../src/nodejs/main';
var config = {
    publicationsFile: null,
    testDirectory: null,
    ksiService: null
};
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
describe.each([
    // path.join(__dirname, './resources/signature-test-pack/internal-policy-signatures/internal-policy-results.csv'),
    // path.join(__dirname, './resources/signature-test-pack/invalid-signatures/invalid-signature-results.csv'),
    path.join(__dirname, './resources/signature-test-pack/policy-verification-signatures/policy-verification-results.csv')
    // path.join(__dirname, './resources/signature-test-pack/valid-signatures/signature-results.csv')
])('Signature Test Pack: %s', function (resultFile) {
    beforeAll(function () {
        config.ksiService = new KsiService(new SigningService(new SigningServiceProtocol(ksiConfig.AGGREGATION_URL), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)), new ExtendingService(new ExtendingServiceProtocol(ksiConfig.EXTENDER_URL), new ServiceCredentials(ksiConfig.LOGIN_ID, ksiConfig.LOGIN_KEY)), new PublicationsFileService(new PublicationsFileServiceProtocol(ksiConfig.PUBLICATIONS_FILE_URL), new PublicationsFileFactory()));
        return config.ksiService.getPublicationsFile().then(function (publicationsFile) {
            config.publicationsFile = publicationsFile;
        });
    });
    it.each(parseCsv(fs.readFileSync(resultFile).toString(), {
        delimiter: ';',
        columns: function () {
            return [
                'signatureFile', 'actionName', 'errorCode', 'errorMessage', 'inputHashLevel',
                'inputHash', 'calendarHashChainInput', 'calendarHashChainOutput', 'aggregationTime',
                'publicationTime', 'publicationData', 'isExtendingAllowed', 'resourceFile', 'publicationsFilePath',
                'certFilePath', 'rowIndex'
            ];
        },
        cast: function (value, context) {
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
    }))('Test row nr. %#', function (row) {
        console.debug("\nSignatureFile: " + row.signatureFile + "\nActionName:    " + row.actionName + "\nError Code:    " + row.errorCode + "\nError Message: " + row.errorMessage + "\nRow index:     " + row.rowIndex);
        return testSignature(row, path.dirname(resultFile));
    });
});
function testSignature(row, testBasePath) {
    return __awaiter(this, void 0, void 0, function () {
        var signatureBytes, policy, userPublication, verificationContext, result, verificationError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    signatureBytes = new Uint8Array(fs.readFileSync(path.join(testBasePath, row.signatureFile)));
                    userPublication = null;
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
                            expect(function () {
                                return new KsiSignature(new TlvInputStream(signatureBytes).readTag());
                            }).toThrow();
                            return [2 /*return*/];
                        case 'NOT-IMPLEMENTED':
                            return [2 /*return*/];
                        default:
                            throw new Error("Unknown testing action: " + row.actionName);
                    }
                    verificationContext = new VerificationContext(new KsiSignature(new TlvInputStream(signatureBytes).readTag()));
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
                        console.log('broken');
                        expect(5).toBe(4);
                    }
                    else {
                        verificationContext.setKsiService(config.ksiService);
                    }
                    console.debug(verificationContext.getSignature().toString());
                    return [4 /*yield*/, policy.verify(verificationContext)];
                case 1:
                    result = _a.sent();
                    verificationError = result.getVerificationError();
                    console.debug(result.toString());
                    expect(verificationError ? verificationError.code : null).toEqual(row.errorCode || null);
                    return [2 /*return*/];
            }
        });
    });
}
