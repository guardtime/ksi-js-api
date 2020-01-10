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
import { HashAlgorithm } from '@guardtime/gt-js-common';
/**
 * Service credentials class for KSI service
 */
export class ServiceCredentials {
    constructor(loginId, loginKey, hmacAlgorithm = HashAlgorithm.SHA2_256) {
        this.loginId = loginId;
        this.loginKey = loginKey;
        this.hmacAlgorithm = hmacAlgorithm;
    }
    getHmacAlgorithm() {
        return this.hmacAlgorithm;
    }
    getLoginId() {
        return this.loginId;
    }
    getLoginKey() {
        return this.loginKey;
    }
}
