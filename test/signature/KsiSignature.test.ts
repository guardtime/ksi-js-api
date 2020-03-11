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

/**
 * Aggregation hash chain TLV tag tests
 */
import {KsiSignature} from '../../src/common/signature/KsiSignature';

describe('KsiSignature', () => {
    it('Check UUID', async () => {
        const signature: KsiSignature = KsiSignature.CREATE_FROM_BASE64(
            'iAAIFIgBAGgCBFylzH8DAQ0DAgHlAwERAwEPAwEDBSEBWc+b8dIW8uIts572ibWuIqIPPqlnMJvXM2fZlLQR09UGAQEHKgQofgEBYQVhbm9uAGIRa3Np' +
            'Z3ctdGVzdHVzZXI6MQBjAGQHBYWw46qSaogBAK8CBFylzH8DAQ0DAgHlAwERAwEPBSEBTMCDDk3HAOQwQt9t3UbHC6lz699K9hDtqpxHW6lEisAGAQEHJAQifg' +
            'IBAWEDR1QAYgtBTGUyLTEtMjo2AGMBDmQHBYWw46snsAcmAQEBAiEBvAvbKyEv+TDNK6qfmPH3/FRDiIkjddDAsqmj1aNiahQHJgEBAQIhAelEtseimPneDgL5' +
            'MvLvgC7h0GNplmu8hK/YimwVBpx2iAEAyQIEXKXMfwMBDQMCAeUDAREFIQG/EZzGBPTOPnf6rr5nC8S6h/6cRls9ER7CRiDOzspvRgYBAQciBCB+AgEBYQNHVA' +
            'BiCUFTZTItMTowAGMBB2QHBYWw46s8DwgjAiEB0YxTvJ6lSqRql25bhCMJL6CvzScw7UdvjGMFPagKlpkIIwIhAf9oxkoB6+TES4o+w5roOZGnDpNSPHmM8OJ7' +
            '+af15gaMCCMCIQFql0S9RjMoVWqh2SSih1L7DSTcyT6fLOgvn0dFTI+nKIgBAVsCBFylzH8DAQ0DAgHlBSEBK0KbfE0FeR4XUPe+aoYBlWcLpOo9Ry3EHQVNop' +
            '9FXDEGAQEHIAQefgIBAWEDR1QAYgdBTmUyOjMAYwEdZAcFhbDjq61xCCMCIQE54fl3TOlyyHIIuPKunHvf7HN7dmJNfsCK8dvQ7m3P2QcjAiEBAfCEBIA5qntc' +
            'QhEQX7rcU4X+Uj1GCT4m665Np2kUgYcIIwIhAdjfxiuQn3Rn2FIAwXsifTIuvLnCWhwYdH86wE9mEKFDCCMCIQHK7YgLDpQNTESJL0yo2foMw///Gd+DxYQ8rY' +
            'ckrRLaJgcjAiEBXhxNnLI1tkM5ppszHmtFOA1neghxJ8NJPeyW1NQOcCQHIwIhAcQi1pukh10AwPUJndQp9cqHVCg3xFxGng9lmmICgwLMByYBAQECIQEC+fdQ' +
            'WiJ6hYkhx6aVo2haLT7VR5rahyLIgM4Soo2LQYgBAKQCBFylzH8DAQ0FIQFtEkkec8m5PM0yuGhJYFSraCtovCYaVLlOqYLtsy/mfwYBAQcmAQE+AiEBAAAAAA' +
            'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJgEBLQIhAexGTTuhhOg8R+xGXw6wFhWD5eqEadKPYs/HosVAZq0KByMCIQEBNMogDVxSdA3vE66kMH8w5/wt' +
            '9SDGJPiPrl8lgn2TiIgCAsgBBFylzH8CBFylzH8FIQGtLfbyc3aAsWemNuoxEcveOp1vRz348gZ1QXUnI1N8owghAWkzybotP81U4ViQkTCuMjmofQ3pBa2HkB' +
            'TuHZjc1oH2CCEB47mEESYS4Vql3m7hh85tB7KZzTYunHMXRf7sbA4/ATgIIQH6DhjUfgRpgO58NyDpcSZrE1I7Q+ZQWK8wWXHUOHfSkAghAeve7CdH17QHLXEK' +
            'XnKrY2jONFeX9sORdXVXcveRmrRrCCEBMNe+RCg/xGPfxQCJWLcGGlip7Xe9JgrmdKla3ZJqrpUIIQF/68B+Zzc0eaT6ytTthW2Mx7kq5JtqcFDczAgaBMxDAA' +
            'ghAdV/fUeFEE0NDKhRTWXu0xRvEm/YWFQd1bzmsA0eH5FUCCEBXIdNcmX6HpmJU7Rl/YbAvkQ3L7yNRDyWqVSvMrRwGJcIIQE0YC57FdsgrlKfdx5WWfF50UTq' +
            'ulLUJ5PDAjP9lbhtBAghAXu0yDwUYRmEQ8UeZWTahGrvRwdim0Jfg3Q0j6qJYabwCCEBz+7G6NEvshNz0+whOe4g+o5qNsbom/Pa/VNtYWw0gnYIIQEvM1wJo0' +
            'HgdqpoLX+D1uTyk5u6G+PmIzvVnzB6j9mB/AghASzBhhWwnHKgZKZW8SFmzEyBdQFOuU8lCaK6m7wZGkIzCCEBSXLkd1FgaTZE6enbzHlsr9YJHaC6hCG+MnbE' +
            'iAnH2ZMIIQE4kE31+AJ/Niz28lK8mrYF1iq0sBmg1JGvuNrjnrOw6gghAVa3tzIQKtuhtdjcQgJLxyisoBQvNWi562VHUHmGtlDXCCEB68OrHYZkFYETCsPHB3' +
            'txtnu6TJFVMOn+SbmHafyNyusIIQFJb8ASDYVOdTS5kqsy7DBFsg1L7hv75FZP0JLOr6CLcgghAbtE/Tal883ue1xt86YJignjUzNbYCnxR3UCWIp+N74AiAUB' +
            'UTApAgRcpcx/BCEBeLI0AM0xMvnNmHLupTjeVScT91B1JUAFPV1hydshzRuACwEiARYxLjIuODQwLjExMzU0OS4xLjEuMTEAgAIBAIlJgwhTOeOZ2hTCgnqnBl' +
            'oaOMP0LDGePdZOO4XQyIANr8uzdJD6t1bJvlIqBBbCbCQJMAkFmbvCEfFd5I81UjU19jxuLl7jlHiI+tK2pwenbCSmQMi/Su7N58mtg/SaL/B2NxyqfZmppZCk' +
            'sx00kSE6+P1+N/82G6CGArnPeBTp4/ytyr+7GXS4Vl0gbw9T2CQeXepkgOXVcnqGYN48aT6p7F+zJL2iFA+JvWpIgLbgIei2/BEL5HYXS2lw514Uh8FYdlIScN' +
            'DJsbb5o9jVplzYJI885qVLrxH4Mt22EZXbc8CFfbR/KXFve+LOcJPrWm73g6KQpEIv2tP1oa0pwpkDBBmLGyc=');

        expect(signature.getUuid()).toEqual('176cb373-5c52-38c4-9296-28b2fb713540');
    });
});
