interface KsiConfig {
  AGGREGATION_URL: string;
  EXTENDER_URL: string;
  LOGIN_ID: string;
  LOGIN_KEY: Uint8Array;
  PUBLICATIONS_FILE_URL: string;
}

declare const ksiConfig: KsiConfig;
export default ksiConfig;

