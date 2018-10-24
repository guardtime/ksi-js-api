export function isIPublicationsFile(object) {
    return 'getNearestPublicationRecord' in object
        && 'getLatestPublication' in object
        && 'findCertificateById' in object;
}
