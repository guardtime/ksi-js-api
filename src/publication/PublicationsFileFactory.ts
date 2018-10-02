import RawTag from "../parser/RawTag";
import PublicationsFile from "./PublicationsFile";
import PublicationsFileError from "./PublicationsFileError";

export default class PublicationsFileFactory {

    public create(publicationFileBytes: Uint8Array): PublicationsFile {
        if (JSON.stringify(publicationFileBytes.slice(0, PublicationsFile.FileBeginningMagicBytes.length - 1)) ===
            JSON.stringify(PublicationsFile.FileBeginningMagicBytes)) {
            throw new PublicationsFileError(
                "Publications file header is incorrect. Invalid publications file magic bytes.");
        }

        const publicationsFile = new PublicationsFile(
            RawTag.create(
                0x0,
                false,
                false,
                publicationFileBytes.slice(PublicationsFile.FileBeginningMagicBytes.length)));

        // TODO: Verification

        return publicationsFile;
    }
}
