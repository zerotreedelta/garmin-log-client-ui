import config from "../config/config";

export function validFileSize(file) {
    return ((file && file.size < config.MAX_ATTACHMENT_SIZE) ? true : false)
}
  