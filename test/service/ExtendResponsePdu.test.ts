/**
 * Aggregation Response PDU tests
 */
import bigInteger from 'big-integer';
import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import HashAlgorithm from '@guardtime/gt-js-common/lib/hash/HashAlgorithm';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { ExtendingService } from '../../src/common/service/ExtendingService';
import { ExtendResponsePdu } from '../../src/common/service/ExtendResponsePdu';
import { KsiService } from '../../src/common/service/KsiService';
import { ServiceCredentials } from '../../src/common/service/ServiceCredentials';
import { TestServiceProtocol } from './TestServiceProtocol';

describe('ExtendResponsePdu', () => {
  it('Throw error on header not being first in pdu', () => {
    const responseBytes = Base64Coder.decode(
      'gyEEXoACBCQBCB/9nyjciSsRBAAFCU5vIGVycm9yABIEWATQxogCBAMBBFPtTYACBFOMOkcFIQGjDcGPm2zbvxXAuq7/sapTa5Sc93g7NQZrTvuyGPc81wghAUpX17BGWLTjECum8hXLwX65TLXCxg26PtgD8ffCFoSWCCEBXxDj7ysPMifSH9tan81HMUKQ11z0ClLqQkIXNnkfRkkIIQHrhrNdVIR8sONuzUDA/CE+HRelQXPYMxHnr7GvKDE0sQchAc82GIZB0DCFd+Jb+4o8pqDpffYlnVYAHgUwXtJNCFmnByEBdQ+hlp/IR0RfzxRB1AM+xIgVTN1f44TDpvSOrOf4gUcHIQG0ePHaHfpk4ywNGyDuNKIzKtnMZVdkHYMZctA7XuNH2QghAQIfs6N6Ijy22CCVVKy70JPkhdAsVmFcaNr3jtcWVnhaByEBKzMIYXIZq/CP9+zt+4healGbX/v7ReG0ZThGx9eaxqYHIQHo0qY+lKs77pUGJAmOFXVRcgJNGlFvZjxDoWim8SFb/QghASmHov804I0YAZwMa+dEQgWxB3ED/K7ji7sk9fyRq2CfByEBxE6M8oVIiqVXsl9sPcYYCnInHYtzRCn0TaN2py/bIzYIIQHpb45AxVoeRO/BpqEPug2So8oR9cW7zolVIBmK1ZGsOwghASV8Jm3qDZ7D6RE1W4a9Q2X+Dhk2nuh4lGb82eWi8BmNCCEByIr3lyWBwLrAInRuMZIISJGREeBmS1otUwxduGOvPQEHIQEvR/dxR/fL1urBQjZhdxH+okQaEVyZNego2pmy1Ip3qwchATczHSjQBGOh6NgshrKRNQTtfHELo6UuoPUdIqUmVH96ByEBt7mKXGs/vBPZ8MyOuBp3HdQhElFAcK/lAmaqxddzticHIQFZUV1ZFxspq73k4cxdxOC/pBZKDYoF/7PgWwd/h+EaBgghAcZYW0AeNZIYB/zX5zEuXzF91nphXYrKUW89xHzVhNFSCCEBS+tTe1nalX33h/C0izE6sVZf8AWyPyOjxrF+rEOk7C8HIQFPkexTiGgGkX+VtrkBp5MqGsszDmUGhmm4aQjDAlCd3wchAXEkfTWXNPz53HBrGxEW15Jm3NTKxqhMMvV1s082bz6hByEBZhQqCkyjO2nE+RYjT9WbkT/5ISj0anh0gJT9zjwGz7kIIQFrMDSGzmOBHsz4+17gceRxxXTmYfvK42b49Nxqz8ecQAghARwQJmesT7yNkbme9KfHi+4kSP9SqmzR1VdZXyNRDpjqCCEB+3m0PgqmvukXODnAUdPQ2sb4771IczG1uGohTEL6qBwIIQFJb8ASDYVOdTS5kqsy7DBFsg1L7hv75FZP0JLOr6CLcgghAbtE/Tal883ue1xt86YJignjUzNbYCnxR3UCWIp+N74AAREBBWFub24AAgRYBIJOAwICgh8hAauuDR7O4WgQeoyaLpEggOaG/7XP7NvUfB2/KYT1Ua2B'
    );

    expect(() => {
      return new ExtendResponsePdu(new TlvInputStream(responseBytes).readTag());
    }).toThrow('Header must be the first element in PDU.');
  });

  it('Missing HMAC', () => {
    const responseBytes = Base64Coder.decode(
      'gyEEOwERAQVhbm9uAAIEWASCTgMCAoKAAgQkAQgf/Z8o3IkrEQQABQlObyBlcnJvcgASBFgE0MaIAgQDAQRT7U2AAgRTjDpHBSEBow3Bj5ts278VwLqu/7GqU2uUnPd4OzUGa077shj3PNcIIQFKV9ewRli04xArpvIVy8F+uUy1wsYNuj7YA/H3whaElgghAV8Q4+8rDzIn0h/bWp/NRzFCkNdc9ApS6kJCFzZ5H0ZJCCEB64azXVSEfLDjbs1AwPwhPh0XpUFz2DMR56+xrygxNLEHIQHPNhiGQdAwhXfiW/uKPKag6X32JZ1WAB4FMF7STQhZpwchAXUPoZafyEdEX88UQdQDPsSIFUzdX+OEw6b0jqzn+IFHByEBtHjx2h36ZOMsDRsg7jSiMyrZzGVXZB2DGXLQO17jR9kIIQECH7OjeiI8ttgglVSsu9CT5IXQLFZhXGja947XFlZ4WgchASszCGFyGavwj/fs7fuIXmpRm1/7+0XhtGU4RsfXmsamByEB6NKmPpSrO+6VBiQJjhV1UXICTRpRb2Y8Q6FopvEhW/0IIQEph6L/NOCNGAGcDGvnREIFsQdxA/yu44u7JPX8katgnwchAcROjPKFSIqlV7JfbD3GGApyJx2Lc0Qp9E2jdqcv2yM2CCEB6W+OQMVaHkTvwaahD7oNkqPKEfXFu86JVSAZitWRrDsIIQElfCZt6g2ew+kRNVuGvUNl/g4ZNp7oeJRm/NnlovAZjQghAciK95clgcC6wCJ0bjGSCEiRkRHgZktaLVMMXbhjrz0BByEBL0f3cUf3y9bqwUI2YXcR/qJEGhFcmTXoKNqZstSKd6sHIQE3Mx0o0ARjoejYLIaykTUE7XxxC6OlLqD1HSKlJlR/egchAbe5ilxrP7wT2fDMjrgadx3UIRJRQHCv5QJmqsXXc7YnByEBWVFdWRcbKau95OHMXcTgv6QWSg2KBf+z4FsHf4fhGgYIIQHGWFtAHjWSGAf81+cxLl8xfdZ6YV2KylFvPcR81YTRUgghAUvrU3tZ2pV994fwtIsxOrFWX/AFsj8jo8axfqxDpOwvByEBT5HsU4hoBpF/lba5AaeTKhrLMw5lBoZpuGkIwwJQnd8HIQFxJH01lzT8+dxwaxsRFteSZtzUysaoTDL1dbNPNm8+oQchAWYUKgpMoztpxPkWI0/Vm5E/+SEo9Gp4dICU/c48Bs+5CCEBazA0hs5jgR7M+Pte4HHkccV05mH7yuNm+PTcas/HnEAIIQEcECZnrE+8jZG5nvSnx4vuJEj/Uqps0dVXWV8jUQ6Y6gghAft5tD4Kpr7pFzg5wFHT0NrG+O+9SHMxtbhqIUxC+qgcCCEBSW/AEg2FTnU0uZKrMuwwRbINS+4b++RWT9CSzq+gi3IIIQG7RP02pfPN7ntcbfOmCYoJ41MzW2Ap8Ud1AliKfje+AA=='
    );

    expect(() => {
      return new ExtendResponsePdu(new TlvInputStream(responseBytes).readTag());
    }).toThrow('Exactly one MAC must exist in PDU.');
  });

  it('Invalid HMAC', async () => {
    const responseBytes = Base64Coder.decode(
      'gyEAaQERAQVhbm9uAAIEWASCTgMCAdoCMQEDAYHNBAIBAwUmVGhlIHJlcXVlc3QgY29udGFpbmVkIGludmFsaWQgcGF5bG9hZAAfIQG5u4HTgCjdtQwpZZPzU2/br2vLCxJxlsYyYHULVXjj3A=='
    );

    const ksiService = new KsiService(
      null,
      new ExtendingService(
        new TestServiceProtocol(responseBytes),
        new ServiceCredentials('anon', new Uint8Array([0x61, 0x6e, 0x6f, 0x6e]), HashAlgorithm.SHA2_256)
      ),
      null
    );

    await expect(ksiService.extend(bigInteger.zero)).rejects.toThrow('Response HMAC is not correct.');
  });
});
