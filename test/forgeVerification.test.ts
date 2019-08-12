import {PublicationsFileService} from '../src/common/main';
import {PublicationsFileFactory} from '../src/common/publication/PublicationsFileFactory';
import {PublicationsFileServiceProtocol} from '../src/nodejs/service/PublicationsFileServiceProtocol';
var forge = require('node-forge');

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
            var b64encoded = btoa(String.fromCharCode.apply(null, pubFile.getSignatureValue()));
            var utf8encoded = String.fromCharCode.apply(null, pubFile.getSignatureValue());

            var signature = "-----BEGIN PKCS7-----" + utf8encoded + "-----END PKCS7-----";
            console.log('signature bytes', signature);
            // console.log(pubFile.getSignedBytes());
            // console.log(pubFile.getSignatureValue());
            var bytes = pubFile.getSignatureValue();
            var obj = forge.asn1.fromDer(Array.from(bytes));
            var verify = forge.pkcs7.messageFromAsn1(obj).verify();
            console.log(verify);
            done();
        });
});
