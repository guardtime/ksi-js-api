const CONFIG = {
    AGGREGATION_URL: 'http://localhost:8080/gt-signingservice',
    EXTENDER_URL: 'http://localhost:8081/gt-extendingservice',
    // LOGIN_ID: 'ot.9hdXMI',
    // LOGIN_KEY: new Uint8Array([90, 67, 98, 68, 88, 88, 106, 98, 68, 115, 69, 86]),
    LOGIN_ID: 'anon',
    LOGIN_KEY: new Uint8Array([0x61, 0x6E, 0x6F, 0x6E]),
    PUBLICATIONS_FILE_URL: 'http://verify.guardtime.com/ksi-publications.bin'
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CONFIG;
}

