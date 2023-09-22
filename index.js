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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCurrentRoute = void 0;
const storage_1 = require("@google-cloud/storage");
class LogicalLogger {
    constructor() {
        this.currentRoute = '';
        // log(route: string, message: any, ...optionalParams: any[]) {
        //     const logMessage = `[LogicalLog] ${message} ${optionalParams.join(' ')}`;
        //     console.log(logMessage);
        //     this.writeToGCS(route, logMessage);
        // }
    }
    // constructor(bucketName: string, keyFilename: string) {
    //     this.storage = new Storage({ keyFilename });
    //     this.bucketName = bucketName;
    // }
    initialize(bucketName, keyFilename) {
        this.storage = new storage_1.Storage({ keyFilename });
        this.bucketName = bucketName;
    }
    setCurrentRoute(route) {
        this.currentRoute = route;
    }
    writeToGCS(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = new Date().toISOString();
                const fileName = `${date}.log`;
                console.log(`LogiLog file name is ${fileName}`);
                const file = this.storage.bucket(this.bucketName).file(`${this.currentRoute}/${fileName}`);
                console.log(`LogiLog file saved in ${file}`);
                yield file.save(message);
            }
            catch (error) {
                console.error('[LogicLog Error] Failed to write to GCS:', error);
            }
        });
    }
    log(message, ...optionalParams) {
        const logMessage = `[LogicLog] ${message} ${optionalParams.join(' ')}`;
        console.log(logMessage);
        console.log("[LogiLog] Current route has been set to ", this.currentRoute);
        if (this.currentRoute) {
            this.writeToGCS(logMessage);
        }
    }
}
const logilogger = new LogicalLogger();
function setCurrentRoute(req, res, next) {
    const route = req.path.replace(/\/:[a-zA-Z0-9_]+/g, (match) => {
        const paramKey = match.slice(2); // remove "/:"
        return `/${req.params[paramKey]}`;
    });
    logilogger.setCurrentRoute(route);
    next();
}
exports.setCurrentRoute = setCurrentRoute;
exports.default = logilogger;
