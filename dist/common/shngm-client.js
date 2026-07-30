"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shngmFetch = shngmFetch;
const config_1 = require("./config");
const HEADERS = {
    Accept: 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Content-Type': 'application/json',
    Origin: config_1.SHNGM_ORIGIN,
    Referer: `${config_1.SHNGM_ORIGIN}/`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
};
async function shngmFetch(path) {
    const res = await fetch(`${config_1.SHNGM_BASE_URL}${path}`, { headers: HEADERS });
    if (!res.ok) {
        throw new Error(`GET ${path} -> HTTP ${res.status}`);
    }
    return res.json();
}
//# sourceMappingURL=shngm-client.js.map