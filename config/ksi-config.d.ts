declare type KsiConfiguration =  Readonly<{
    AGGREGATION_URL: string;
    EXTENDER_URL: string;
    LOGIN_ID: string;
    LOGIN_KEY: Uint8Array;
    PUBLICATIONS_FILE_URL: string;
    PUBLICATIONS_FILE_SIGNATURE_TRUSTED_CERTIFICATES: string;
}>;
/**
 * Config parameters
 */
declare const config: KsiConfiguration;
export = config;
