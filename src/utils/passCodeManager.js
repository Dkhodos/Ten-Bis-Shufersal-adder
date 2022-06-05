"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPasscode = exports.getPasscode = exports.savePasscode = void 0;
const sleep_1 = __importDefault(require("./sleep"));
const INTERVAL = 1000;
const TRIES = 45 * 60;
function savePasscode(text) {
    global.passcode = text || undefined;
}
exports.savePasscode = savePasscode;
function getPasscode() {
    return global.passcode;
}
exports.getPasscode = getPasscode;
function fetchPasscode() {
    return __awaiter(this, void 0, void 0, function* () {
        let tries = TRIES;
        while (tries > 0) {
            const passcode = getPasscode();
            if (passcode) {
                savePasscode("");
                return passcode;
            }
            yield (0, sleep_1.default)(1000);
            tries--;
        }
        return "";
    });
}
exports.fetchPasscode = fetchPasscode;
