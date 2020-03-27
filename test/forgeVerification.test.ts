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

import CMSVerification from '@guardtime/gt-js-common/lib/crypto/CMSVerification';
import { PublicationsFileService } from '../src/common/main';
import { PublicationsFileFactory } from '../src/common/publication/PublicationsFileFactory';
import { PublicationsFileServiceProtocol } from '../src/nodejs/service/PublicationsFileServiceProtocol';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const CONFIG = {
  PUBLICATIONS_FILE_URL: 'https://verify.guardtime.com/ksi-publications.bin'
};

const certChain =
  '-----BEGIN CERTIFICATE-----\n' +
  'MIIEkjCCA3qgAwIBAgIQCgFBQgAAAVOFc2oLheynCDANBgkqhkiG9w0BAQsFADA/\n' +
  'MSQwIgYDVQQKExtEaWdpdGFsIFNpZ25hdHVyZSBUcnVzdCBDby4xFzAVBgNVBAMT\n' +
  'DkRTVCBSb290IENBIFgzMB4XDTE2MDMxNzE2NDA0NloXDTIxMDMxNzE2NDA0Nlow\n' +
  'SjELMAkGA1UEBhMCVVMxFjAUBgNVBAoTDUxldCdzIEVuY3J5cHQxIzAhBgNVBAMT\n' +
  'GkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5IFgzMIIBIjANBgkqhkiG9w0BAQEFAAOC\n' +
  'AQ8AMIIBCgKCAQEAnNMM8FrlLke3cl03g7NoYzDq1zUmGSXhvb418XCSL7e4S0EF\n' +
  'q6meNQhY7LEqxGiHC6PjdeTm86dicbp5gWAf15Gan/PQeGdxyGkOlZHP/uaZ6WA8\n' +
  'SMx+yk13EiSdRxta67nsHjcAHJyse6cF6s5K671B5TaYucv9bTyWaN8jKkKQDIZ0\n' +
  'Z8h/pZq4UmEUEz9l6YKHy9v6Dlb2honzhT+Xhq+w3Brvaw2VFn3EK6BlspkENnWA\n' +
  'a6xK8xuQSXgvopZPKiAlKQTGdMDQMc2PMTiVFrqoM7hD8bEfwzB/onkxEz0tNvjj\n' +
  '/PIzark5McWvxI0NHWQWM6r6hCm21AvA2H3DkwIDAQABo4IBfTCCAXkwEgYDVR0T\n' +
  'AQH/BAgwBgEB/wIBADAOBgNVHQ8BAf8EBAMCAYYwfwYIKwYBBQUHAQEEczBxMDIG\n' +
  'CCsGAQUFBzABhiZodHRwOi8vaXNyZy50cnVzdGlkLm9jc3AuaWRlbnRydXN0LmNv\n' +
  'bTA7BggrBgEFBQcwAoYvaHR0cDovL2FwcHMuaWRlbnRydXN0LmNvbS9yb290cy9k\n' +
  'c3Ryb290Y2F4My5wN2MwHwYDVR0jBBgwFoAUxKexpHsscfrb4UuQdf/EFWCFiRAw\n' +
  'VAYDVR0gBE0wSzAIBgZngQwBAgEwPwYLKwYBBAGC3xMBAQEwMDAuBggrBgEFBQcC\n' +
  'ARYiaHR0cDovL2Nwcy5yb290LXgxLmxldHNlbmNyeXB0Lm9yZzA8BgNVHR8ENTAz\n' +
  'MDGgL6AthitodHRwOi8vY3JsLmlkZW50cnVzdC5jb20vRFNUUk9PVENBWDNDUkwu\n' +
  'Y3JsMB0GA1UdDgQWBBSoSmpjBH3duubRObemRWXv86jsoTANBgkqhkiG9w0BAQsF\n' +
  'AAOCAQEA3TPXEfNjWDjdGBX7CVW+dla5cEilaUcne8IkCJLxWh9KEik3JHRRHGJo\n' +
  'uM2VcGfl96S8TihRzZvoroed6ti6WqEBmtzw3Wodatg+VyOeph4EYpr/1wXKtx8/\n' +
  'wApIvJSwtmVi4MFU5aMqrSDE6ea73Mj2tcMyo5jMd6jmeWUHK8so/joWUoHOUgwu\n' +
  'X4Po1QYz+3dszkDqMp4fklxBwXRsW10KXzPMTZ+sOPAveyxindmjkW8lGy+QsRlG\n' +
  'PfZ+G6Z6h7mjem0Y+iWlkYcV4PIWL1iwBi8saCbGS5jN2p8M+X+Q7UNKEkROb3N6\n' +
  'KOqkqm57TH2H3eDJAkSnh6/DNFu0Qg==\n' +
  '-----END CERTIFICATE-----';

const exampleSignatureDetached =
  '-----BEGIN PKCS7-----\n' +
  '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\n' +
  'ST9CZPFLoyn+4f7R87Pe\n' +
  '-----END PKCS7-----';

const exampleContent = 'my data\r\n';

const exampleSignatureAttached =
  '-----BEGIN PKCS7-----\n' +
  'MIIIKAYJKoZIhvcNAQcCoIIIGTCCCBUCAQExDTALBglghkgBZQMEAgEwGAYJKoZI\n' +
  'hvcNAQcBoAsECW15IGRhdGENCqCCBXEwggVtMIIEVaADAgECAhIDzPiv475hpMq1\n' +
  '1ghTQFdshHwwDQYJKoZIhvcNAQELBQAwSjELMAkGA1UEBhMCVVMxFjAUBgNVBAoT\n' +
  'DUxldCdzIEVuY3J5cHQxIzAhBgNVBAMTGkxldCdzIEVuY3J5cHQgQXV0aG9yaXR5\n' +
  'IFgzMB4XDTE5MDgyODA4MjgyMloXDTE5MTEyNjA4MjgyMlowHDEaMBgGA1UEAwwR\n' +
  'Ki56Lmd1YXJkdGltZS5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\n' +
  'AQDPeNmcy7HYxfpmlLY488FC8IRQL0BHTu/IZRWIXBw+JN6hdahAUcoKd9mNDmii\n' +
  'R33IuB3mazQ2V5KyPHcHR6LqkGDgW9ZKmj5jf74Cv6DVvw4FnLlAy+4cErK4udmZ\n' +
  'pAT8L8YaLA+m5a1bAHNf4hG4sheE4jf+IkJ6VtZXhEpsew+FFjCNEmt8lYtRQita\n' +
  '5wWmEIii3qiOv/vQPmtW5mlVCnM1M8nY5LUDVCBtBmpP24uBif/kSUiIEQ6W0Puy\n' +
  'AbZbCc1N3el/yKY1RKgZcnu99zwDAM5gyBfDSn5E2jBbbkRDtT0LKtmRLGBtLgoo\n' +
  'Ho7tMZ+hKdPeEBPXj+nn/PzPAgMBAAGjggJ5MIICdTAOBgNVHQ8BAf8EBAMCBaAw\n' +
  'HQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYD\n' +
  'VR0OBBYEFI7gRMD4mehG1v3a0N3SRxHHf3yUMB8GA1UdIwQYMBaAFKhKamMEfd26\n' +
  '5tE5t6ZFZe/zqOyhMG8GCCsGAQUFBwEBBGMwYTAuBggrBgEFBQcwAYYiaHR0cDov\n' +
  'L29jc3AuaW50LXgzLmxldHNlbmNyeXB0Lm9yZzAvBggrBgEFBQcwAoYjaHR0cDov\n' +
  'L2NlcnQuaW50LXgzLmxldHNlbmNyeXB0Lm9yZy8wLQYDVR0RBCYwJIIRKi56Lmd1\n' +
  'YXJkdGltZS5jb22CD3ouZ3VhcmR0aW1lLmNvbTBMBgNVHSAERTBDMAgGBmeBDAEC\n' +
  'ATA3BgsrBgEEAYLfEwEBATAoMCYGCCsGAQUFBwIBFhpodHRwOi8vY3BzLmxldHNl\n' +
  'bmNyeXB0Lm9yZzCCAQYGCisGAQQB1nkCBAIEgfcEgfQA8gB3AOJpS64m6OlACeiG\n' +
  'G7Y7g9Q+5/50iPukjyiTAZ3d8dv+AAABbNeN/FIAAAQDAEgwRgIhALXcp2zae1wa\n' +
  'lmxb9iLBf+AKhM83ROfrNVMg7X7yuc92AiEA6QnZFrPcs0r1Yg99waISQGoirwl5\n' +
  'iVZJsZnIx6N3LUQAdwApPFGWVMg5ZbqqUPxYB9S3b79Yeily3KTDDPTlRUf0eAAA\n' +
  'AWzXjfxGAAAEAwBIMEYCIQCrUYNqkXq5/JzUGsHDT7nHrpbr54Lw2eb57jwbxf2i\n' +
  '9gIhAL0zZ0kHuzV0GeobVU8oZd2KTvWbBoKF6GdPOKg0lCfmMA0GCSqGSIb3DQEB\n' +
  'CwUAA4IBAQBXcYIkIwildnIfkabesGSSnTMiJpiknqlRrAfRdQCCzmTgeJOHuWcn\n' +
  'zFbIkK1p/Y7v1mo0q7avI4OTrevvwNhBqbzgJU5XHTITDqPydf6Yi3cExgJJEhVP\n' +
  '1IGcoHF/B1qLTSj5sUNBQpLHh5XOpqftCtQyEnjZrDPLG/X8Fb+8LaqWwsZL3GNf\n' +
  'RswWXqm7RCpm/UVhaA/0eYkzqt1YJfdP/r+ZV0kJr9RWTheAoG7m2wF8sKRG0Mmv\n' +
  'ezy7GcNiXvzHZW3zY55ZrLHv6C4T/LWeDyfdv6Mj1SBT6TquVe1YrqnrGUy9UvRL\n' +
  'H2g8wPkBe0R3Z2L4LIHtJISJvSq5etHjMYICcDCCAmwCAQEwYDBKMQswCQYDVQQG\n' +
  'EwJVUzEWMBQGA1UEChMNTGV0J3MgRW5jcnlwdDEjMCEGA1UEAxMaTGV0J3MgRW5j\n' +
  'cnlwdCBBdXRob3JpdHkgWDMCEgPM+K/jvmGkyrXWCFNAV2yEfDALBglghkgBZQME\n' +
  'AgGggeQwGAYJKoZIhvcNAQkDMQsGCSqGSIb3DQEHATAcBgkqhkiG9w0BCQUxDxcN\n' +
  'MTkwOTAzMTAzODIzWjAvBgkqhkiG9w0BCQQxIgQgJJLU6KuD8gawc+WYypnHBE9M\n' +
  'lcb5lG/lENcFJZv1GYcweQYJKoZIhvcNAQkPMWwwajALBglghkgBZQMEASowCwYJ\n' +
  'YIZIAWUDBAEWMAsGCWCGSAFlAwQBAjAKBggqhkiG9w0DBzAOBggqhkiG9w0DAgIC\n' +
  'AIAwDQYIKoZIhvcNAwICAUAwBwYFKw4DAgcwDQYIKoZIhvcNAwICASgwDQYJKoZI\n' +
  'hvcNAQEBBQAEggEAH+drkNfXK2uR6TmE02NriCHkf5PLN0kZGm/Mg2mhDWSt5b1f\n' +
  'RULwJZC5SYSNlpXnCnE0uyrZVrgcOz0W10ZisztASvzr0MRdQvx1nrlOMi79x2kw\n' +
  'RYlI1VD5NkhIIAxU1Tmn+xBM5GjqUOuEEphByknam+NEYC513vBxcSm1RR0zSOcB\n' +
  'q5yBv7JuAw7RHcqS9L5npJQ/KkrIwxUTFTr0kbl6739U2VbUlb/mPOGXNqZdWTsn\n' +
  'GZJDMT1xHDCP4vtE/0HVXjdSJirmI2loVGgarKc3QaJ36rOUcvPyCswk5CnIwcX9\n' +
  'rm3VxOUwDh4LkEorBaya68TOeycBgXcPxqPeOg==\n' +
  '-----END PKCS7-----';

describe('Testing signature verification', () => {
  it('verify publication file', async () => {
    const pubFileService: PublicationsFileService = new PublicationsFileService(
      new PublicationsFileServiceProtocol(CONFIG.PUBLICATIONS_FILE_URL),
      new PublicationsFileFactory()
    );

    const pubFile = await pubFileService.getPublicationsFile();
    const certfile = 'test/certificate.txt';
    const certfileData = fs.readFileSync(certfile, 'utf8');
    const certificates = certfileData.split(';');
    const signature = pubFile.getSignatureValue();
    const signedBytes = pubFile.getSignedBytes();
    const verifyPubFile = CMSVerification.verifyFromBytes(
      signature,
      signedBytes,
      certificates,
      'E=publications@guardtime.com'
    );

    expect(verifyPubFile).toEqual(true);
  });

  it('verify attached signature', () => {
    const verifyAttached = CMSVerification.verifyFromPem(
      exampleSignatureAttached,
      null,
      [certChain],
      'CN=*.z.guardtime.com'
    );
    expect(verifyAttached).toBe(true);
  });

  it('verify detached signature', () => {
    const verifyDetached = CMSVerification.verifyFromPem(
      exampleSignatureDetached,
      exampleContent,
      [certChain],
      'CN=*.z.guardtime.com'
    );
    expect(verifyDetached).toBe(true);
  });
});
