/**
 * Aggregation Response PDU tests
 */
import Base64Coder from '@guardtime/gt-js-common/lib/coders/Base64Coder';
import { TlvInputStream } from '../../src/common/parser/TlvInputStream';
import { ExtendResponsePdu } from '../../src/common/service/ExtendResponsePdu';

describe('ExtendResponsePdu', () => {
  it('Throw error on header not being first in pdu', () => {
    const responseBytes = Base64Coder.decode(
      'gyEEXoACBCQBCB/9nyjciSsRBAAFCU5vIGVycm9yABIEWATQxogCBAMBBFPtTYACBFOMOkcFIQGjDcGPm2zbvxXAuq7/sapTa5Sc93g7NQZrTvuyGPc81wghAUpX17BGWLTjECum8hXLwX65TLXCxg26PtgD8ffCFoSWCCEBXxDj7ysPMifSH9tan81HMUKQ11z0ClLqQkIXNnkfRkkIIQHrhrNdVIR8sONuzUDA/CE+HRelQXPYMxHnr7GvKDE0sQchAc82GIZB0DCFd+Jb+4o8pqDpffYlnVYAHgUwXtJNCFmnByEBdQ+hlp/IR0RfzxRB1AM+xIgVTN1f44TDpvSOrOf4gUcHIQG0ePHaHfpk4ywNGyDuNKIzKtnMZVdkHYMZctA7XuNH2QghAQIfs6N6Ijy22CCVVKy70JPkhdAsVmFcaNr3jtcWVnhaByEBKzMIYXIZq/CP9+zt+4healGbX/v7ReG0ZThGx9eaxqYHIQHo0qY+lKs77pUGJAmOFXVRcgJNGlFvZjxDoWim8SFb/QghASmHov804I0YAZwMa+dEQgWxB3ED/K7ji7sk9fyRq2CfByEBxE6M8oVIiqVXsl9sPcYYCnInHYtzRCn0TaN2py/bIzYIIQHpb45AxVoeRO/BpqEPug2So8oR9cW7zolVIBmK1ZGsOwghASV8Jm3qDZ7D6RE1W4a9Q2X+Dhk2nuh4lGb82eWi8BmNCCEByIr3lyWBwLrAInRuMZIISJGREeBmS1otUwxduGOvPQEHIQEvR/dxR/fL1urBQjZhdxH+okQaEVyZNego2pmy1Ip3qwchATczHSjQBGOh6NgshrKRNQTtfHELo6UuoPUdIqUmVH96ByEBt7mKXGs/vBPZ8MyOuBp3HdQhElFAcK/lAmaqxddzticHIQFZUV1ZFxspq73k4cxdxOC/pBZKDYoF/7PgWwd/h+EaBgghAcZYW0AeNZIYB/zX5zEuXzF91nphXYrKUW89xHzVhNFSCCEBS+tTe1nalX33h/C0izE6sVZf8AWyPyOjxrF+rEOk7C8HIQFPkexTiGgGkX+VtrkBp5MqGsszDmUGhmm4aQjDAlCd3wchAXEkfTWXNPz53HBrGxEW15Jm3NTKxqhMMvV1s082bz6hByEBZhQqCkyjO2nE+RYjT9WbkT/5ISj0anh0gJT9zjwGz7kIIQFrMDSGzmOBHsz4+17gceRxxXTmYfvK42b49Nxqz8ecQAghARwQJmesT7yNkbme9KfHi+4kSP9SqmzR1VdZXyNRDpjqCCEB+3m0PgqmvukXODnAUdPQ2sb4771IczG1uGohTEL6qBwIIQFJb8ASDYVOdTS5kqsy7DBFsg1L7hv75FZP0JLOr6CLcgghAbtE/Tal883ue1xt86YJignjUzNbYCnxR3UCWIp+N74AAREBBWFub24AAgRYBIJOAwICgh8hAauuDR7O4WgQeoyaLpEggOaG/7XP7NvUfB2/KYT1Ua2B'
    );

    expect(() => {
      return new ExtendResponsePdu(new TlvInputStream(responseBytes).readTag());
    }).toThrow('Header must be the first element in PDU.');
  });


});
