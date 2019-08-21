import {PublicationsFileService} from '../src/common/main';
import {PublicationsFileFactory} from '../src/common/publication/PublicationsFileFactory';
import {PublicationsFileServiceProtocol} from '../src/nodejs/service/PublicationsFileServiceProtocol';
var forge = require('node-forge');
import {ASCIIConverter} from 'gt-js-common';

const crypto = require('crypto');

const CONFIG = {
    PUBLICATIONS_FILE_URL: 'https://verify.guardtime.com/ksi-publications.bin'
};

test('example pub file receiving', (done) => {
    let pubFileService: PublicationsFileService;
    pubFileService = new PublicationsFileService(
        new PublicationsFileServiceProtocol(CONFIG.PUBLICATIONS_FILE_URL),
        new PublicationsFileFactory()
    );

    pubFileService.getPublicationsFile()
        .then(pubFile => {
            const oids = forge.pki.oids;

            //Näidis allkiri openssl'iga tehtud
            var testSignature = "MIID7wYJKoZIhvcNAQcCoIID4DCCA9wCAQExCzAJBgUrDgMCGgUAMD4GCSqGSIb3\n" +
                "DQEHAaAxBC9UaGlzIG1lc3NhZ2UgY291bGQgb25seSBoYXZlIGJlZW4gc2VudCBi\n" +
                "eSBtZS4NCqCCAa0wggGpMIIBEgIJAOSSBYx+DVt5MA0GCSqGSIb3DQEBCwUAMBkx\n" +
                "FzAVBgNVBAMMDlBLQ1MjNyBleGFtcGxlMB4XDTE5MDgwNjA4MTUwMVoXDTE5MDkw\n" +
                "NTA4MTUwMVowGTEXMBUGA1UEAwwOUEtDUyM3IGV4YW1wbGUwgZ8wDQYJKoZIhvcN\n" +
                "AQEBBQADgY0AMIGJAoGBALQeYGT5g9LXXmMIPIYyYH8rW9CzXeEpaMZRt99Y7fOI\n" +
                "TxfIg+H7s/h+A4Xgn6MLzFCZaCdaI+jBIlJLGHD9kcBpUj7be4HuCwCQyTYYYsZF\n" +
                "o+0DXuREDKsrPRMtz8q3Vv1As9YRkrNBfoNDVaxVLnnXLm/63mkDDxlICgPqVWuX\n" +
                "AgMBAAEwDQYJKoZIhvcNAQELBQADgYEAUASiZsDdUoeQWGrf6bjzsxTOp1W52hAx\n" +
                "bpXdUaxzEHwF2UIfOgGYLxnswFRxACYL4AdSgXInNP7JjYWIwg9qQpV9W9V8wNJB\n" +
                "dp6jk4W1nkg97ZMzCd+bpubn2KYueTrp0H1GNVrLkx/NvK1isV8ny1lFcqsnCIyO\n" +
                "5fR6DI1OxZIxggHXMIIB0wIBATAmMBkxFzAVBgNVBAMMDlBLQ1MjNyBleGFtcGxl\n" +
                "AgkA5JIFjH4NW3kwCQYFKw4DAhoFAKCCAQcwGAYJKoZIhvcNAQkDMQsGCSqGSIb3\n" +
                "DQEHATAcBgkqhkiG9w0BCQUxDxcNMTkwODA2MDgxNjMzWjAjBgkqhkiG9w0BCQQx\n" +
                "FgQUtCoWIVpMUZ7wlMmr1C1sG0V2hdYwgacGCSqGSIb3DQEJDzGBmTCBljALBglg\n" +
                "hkgBZQMEASowCAYGKoUDAgIJMAoGCCqFAwcBAQICMAoGCCqFAwcBAQIDMAgGBiqF\n" +
                "AwICFTALBglghkgBZQMEARYwCwYJYIZIAWUDBAECMAoGCCqGSIb3DQMHMA4GCCqG\n" +
                "SIb3DQMCAgIAgDANBggqhkiG9w0DAgIBQDAHBgUrDgMCBzANBggqhkiG9w0DAgIB\n" +
                "KDANBgkqhkiG9w0BAQEFAASBgGDSAcbUdEVjHsY+wP5qsab9znLADTfnJd/0yREh\n" +
                "7d+ReKuffSFZvvALlgqnjF+gJbAkKwdLApzb7qLS1jOPj9ecV+oUpY64Cf5uPKcO\n" +
                "yKt0w3M5voufv1OvEDWRNmLKQ0wasfDqCzb8uMysHxWdtp8Ntx8jokgwNgYTAD40\n" +
                "wn5j\n";
            var testBytes = Uint8Array.from(atob(testSignature), c => c.charCodeAt(0));

            var bytes = pubFile.getSignatureValue();

            //converting the signature to ans asn1 object
            var byteString = ASCIIConverter.ToString(testBytes);
            var obj = forge.asn1.fromDer(byteString);

            //this is wrong
            //var verify = forge.pkcs7.messageFromAsn1(obj);

            //converting the asn1 object to a readable message object
            var msg = forge.pkcs7.messageFromAsn1(obj);

            //Extracting the authenticated attributes from the message and converting them to a buffer to be used for verification later
            var attributes = msg.rawCapture.authenticatedAttributes;
            var attributesSet = forge.asn1.create(forge.asn1.Class.UNIVERSAL, forge.asn1.Type.SET, true, attributes);
            var attributeBuffer = Buffer.from(forge.asn1.toDer(attributesSet).data, 'binary');

            //extracting the signature
            var signature = msg.rawCapture.signature;

            //The algorithm used to hash the message
            var digestAlgorithm = forge.asn1.derToOid(msg.rawCapture.digestAlgorithm);

            //@TODO: Have to fix the certificate part here
            //Extracting the certificate
            var certificate = msg.certificates[0];
            const certificateInPem = forge.pki.certificateToPem(certificate);

            //Does not work correctly for and unknown reason
            //var publicKey = forge.pki.rsa.setPublicKey(certificate.publicKey.n, certificate.publicKey.e);
            // var md = forge.md[forge.pki.oids[digestAlgorithm]].create().update(buf);
            // console.log(forge.pki.oids[digestAlgorithm]);
            // var verified = publicKey.verify(buf, sig, 'RSASSA-PKCS1-V1_5');
            // console.log(verified);

            //verify the authenticated attributes
            const verifier = crypto.createVerify(oids[digestAlgorithm]);
            verifier.update(attributeBuffer);
            const validAuthenticatedAttributes = verifier.verify(certificateInPem, signature, 'binary')
            if (!validAuthenticatedAttributes){
                throw new Error("Authenticated attribute not valid");
            }

            //the original message
            var originalMessage = msg.rawCapture.content.value[0].value;

            //hash the original message
            const hash = forge.md[oids[digestAlgorithm]].create().update(originalMessage);

            //If the authenticated attributes are valid, then validate each of their content separately
            for (var i = 0; i < attributes.length; i++) {
                //@TODO: figure out if this can be made 'prettier' and more flexible
                var attribute = oids[forge.asn1.derToOid(attributes[i].value[0].value)];
                var attributeValue = attributes[i].value[1].value[0].value;
                if (attribute == "contentType"){
                    if (forge.asn1.derToOid(attributeValue) != forge.asn1.derToOid(msg.rawCapture.contentType)){
                        throw new Error("The content type is not valid");
                    }
                }
                if (attribute == "messageDigest"){
                    if(hash.digest().bytes() != attributeValue){
                        throw new Error("The message has been changed");
                    }
                }
                if (attribute == "signingTime"){}
            }

            done();
        });
});
