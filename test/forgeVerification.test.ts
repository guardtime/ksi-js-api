import {PublicationsFileService} from '../src/common/main';
import {PublicationsFileFactory} from '../src/common/publication/PublicationsFileFactory';
import {PublicationsFileServiceProtocol} from '../src/nodejs/service/PublicationsFileServiceProtocol';
var forge = require('../../forge-pr');
import {ASCIIConverter} from 'gt-js-common';

const crypto = require('crypto');
var util = forge.util;
var asn1 = forge.asn1;
var pkcs7 = forge.pkcs7;
var pki = forge.pki;

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
            //Verifing the pubFile
            var signatureValueAscii = ASCIIConverter.ToString(pubFile.getSignatureValue());
            var signatureBuffer = util.createBuffer(signatureValueAscii);
            var signatureinAsn1 = asn1.fromDer(signatureBuffer);
            var signature = pkcs7.messageFromAsn1(signatureinAsn1);
            signature.content = util.createBuffer(pubFile.getSignedBytes());
            // @todo: better way to get a certificate;
            var certificateRaw = signature.certificates[1];
            var certificate = pki.certificateToPem(certificateRaw);
            var verified = signature.verify(pki.createCaStore([certificate]));

            //testing js-common
            // var verifiedCommon = CMSVerification.verify(pubFile.getSignatureValue(), pubFile.getSignedBytes());
            // expect(verifiedCommon).toEqual(true);


            var certChain2 =   "-----BEGIN CERTIFICATE-----\n" +
                "MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/\n" +
                "MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT\n" +
                "DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow\n" +
                "SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT\n" +
                "GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC\n" +
                "AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF\n" +
                "q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8\n" +
                "SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0\n" +
                "Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA\n" +
                "a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj\n" +
                "/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T\n" +
                "AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG\n" +
                "CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv\n" +
                "bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k\n" +
                "c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw\n" +
                "VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC\n" +
                "ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz\n" +
                "MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu\n" +
                "Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF\n" +
                "AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo\n" +
                "uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/\n" +
                "wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu\n" +
                "X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG\n" +
                "PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6\n" +
                "KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==\n" +
                "-----END CERTIFICATE-----";

            var exampleSignatureDetached = "-----BEGIN PKCS7-----\n" +
                "MIIIGwYJKoZIhvcNAQcCoIIIDDCCCAgCAQExDTALBglghkgBZQMEAgEwCwYJKoZI\n" +
                "hvcNAQcBoIIFcTCCBW0wggRVoAMCAQICEgPM+K/jvmGkyrXWCFNAV2yEfDANBgkq\n" +
                "hkiG9w0BAQsFADBKMQswCQYDVQQGEwJVUzEWMBQGA1UEChMNTGV0J3MgRW5jcnlw\n" +
                "dDEjMCEGA1UEAxMaTGV0J3MgRW5jcnlwdCBBdXRob3JpdHkgWDMwHhcNMTkwODI4\n" +
                "MDgyODIyWhcNMTkxMTI2MDgyODIyWjAcMRowGAYDVQQDDBEqLnouZ3VhcmR0aW1l\n" +
                "LmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM942ZzLsdjF+maU\n" +
                "tjjzwULwhFAvQEdO78hlFYhcHD4k3qF1qEBRygp32Y0OaKJHfci4HeZrNDZXkrI8\n" +
                "dwdHouqQYOBb1kqaPmN/vgK/oNW/DgWcuUDL7hwSsri52ZmkBPwvxhosD6blrVsA\n" +
                "c1/iEbiyF4TiN/4iQnpW1leESmx7D4UWMI0Sa3yVi1FCK1rnBaYQiKLeqI6/+9A+\n" +
                "a1bmaVUKczUzydjktQNUIG0Gak/bi4GJ/+RJSIgRDpbQ+7IBtlsJzU3d6X/IpjVE\n" +
                "qBlye733PAMAzmDIF8NKfkTaMFtuREO1PQsq2ZEsYG0uCigeju0xn6Ep094QE9eP\n" +
                "6ef8/M8CAwEAAaOCAnkwggJ1MA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggr\n" +
                "BgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUjuBEwPiZ\n" +
                "6EbW/drQ3dJHEcd/fJQwHwYDVR0jBBgwFoAUqEpqYwR93brm0Tm3pkVl7/Oo7KEw\n" +
                "bwYIKwYBBQUHAQEEYzBhMC4GCCsGAQUFBzABhiJodHRwOi8vb2NzcC5pbnQteDMu\n" +
                "bGV0c2VuY3J5cHQub3JnMC8GCCsGAQUFBzAChiNodHRwOi8vY2VydC5pbnQteDMu\n" +
                "bGV0c2VuY3J5cHQub3JnLzAtBgNVHREEJjAkghEqLnouZ3VhcmR0aW1lLmNvbYIP\n" +
                "ei5ndWFyZHRpbWUuY29tMEwGA1UdIARFMEMwCAYGZ4EMAQIBMDcGCysGAQQBgt8T\n" +
                "AQEBMCgwJgYIKwYBBQUHAgEWGmh0dHA6Ly9jcHMubGV0c2VuY3J5cHQub3JnMIIB\n" +
                "BgYKKwYBBAHWeQIEAgSB9wSB9ADyAHcA4mlLribo6UAJ6IYbtjuD1D7n/nSI+6SP\n" +
                "KJMBnd3x2/4AAAFs1438UgAABAMASDBGAiEAtdynbNp7XBqWbFv2IsF/4AqEzzdE\n" +
                "5+s1UyDtfvK5z3YCIQDpCdkWs9yzSvViD33BohJAaiKvCXmJVkmxmcjHo3ctRAB3\n" +
                "ACk8UZZUyDlluqpQ/FgH1Ldvv1h6KXLcpMMM9OVFR/R4AAABbNeN/EYAAAQDAEgw\n" +
                "RgIhAKtRg2qRern8nNQawcNPuceuluvngvDZ5vnuPBvF/aL2AiEAvTNnSQe7NXQZ\n" +
                "6htVTyhl3YpO9ZsGgoXoZ084qDSUJ+YwDQYJKoZIhvcNAQELBQADggEBAFdxgiQj\n" +
                "CKV2ch+Rpt6wZJKdMyImmKSeqVGsB9F1AILOZOB4k4e5ZyfMVsiQrWn9ju/WajSr\n" +
                "tq8jg5Ot6+/A2EGpvOAlTlcdMhMOo/J1/piLdwTGAkkSFU/UgZygcX8HWotNKPmx\n" +
                "Q0FCkseHlc6mp+0K1DISeNmsM8sb9fwVv7wtqpbCxkvcY19GzBZeqbtEKmb9RWFo\n" +
                "D/R5iTOq3Vgl90/+v5lXSQmv1FZOF4CgbubbAXywpEbQya97PLsZw2Je/MdlbfNj\n" +
                "nlmsse/oLhP8tZ4PJ92/oyPVIFPpOq5V7ViuqesZTL1S9EsfaDzA+QF7RHdnYvgs\n" +
                "ge0khIm9Krl60eMxggJwMIICbAIBATBgMEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQK\n" +
                "Ew1MZXQncyBFbmNyeXB0MSMwIQYDVQQDExpMZXQncyBFbmNyeXB0IEF1dGhvcml0\n" +
                "eSBYMwISA8z4r+O+YaTKtdYIU0BXbIR8MAsGCWCGSAFlAwQCAaCB5DAYBgkqhkiG\n" +
                "9w0BCQMxCwYJKoZIhvcNAQcBMBwGCSqGSIb3DQEJBTEPFw0xOTA5MTAxMTE1MDFa\n" +
                "MC8GCSqGSIb3DQEJBDEiBCAkktToq4PyBrBz5ZjKmccET0yVxvmUb+UQ1wUlm/UZ\n" +
                "hzB5BgkqhkiG9w0BCQ8xbDBqMAsGCWCGSAFlAwQBKjALBglghkgBZQMEARYwCwYJ\n" +
                "YIZIAWUDBAECMAoGCCqGSIb3DQMHMA4GCCqGSIb3DQMCAgIAgDANBggqhkiG9w0D\n" +
                "AgIBQDAHBgUrDgMCBzANBggqhkiG9w0DAgIBKDANBgkqhkiG9w0BAQEFAASCAQBG\n" +
                "WeWailp/LJe/H9LFc5+Iu1CWjJk6GxOSMI6LVz9kSRc5s6kvna0owpsuvONzeLGM\n" +
                "XBay9NQglnql/uWWQYV/5qYS5Eu/jHagi89cTpn0eZKI1+7SBVqDi7Y4dzNt+8yP\n" +
                "lDwVktf0sCv/Rzg/HPcpU3V6JFl4TgIkWcLxg8n41D60ca5+PeuBCp1Yh/Uzs15J\n" +
                "/fsPeIkz8J/3SyeUHgXIS+OaNchgOdWs1s5vSgRntz8RtztK12CxdxdtWCaaMGZB\n" +
                "uoRITTnXowj01MMzmuKaUose+X46AFc2/7CehdUmj62JV+vANNLOz44/5jANTA4T\n" +
                "ST9CZPFLoyn+4f7R87Pe\n" +
                "-----END PKCS7-----";

            var exampleContent = "my data";

            var p7 = forge.pkcs7.messageFromPem(exampleSignatureDetached);
            p7.content = forge.util.createBuffer(exampleContent, 'utf8');
            var P7verified = p7.verify(forge.pki.createCaStore([certChain2]), { });
            console.log(P7verified);


            expect(verified).toEqual(true);
            expect(P7verified).toEqual(true);

            done();
        });
});
