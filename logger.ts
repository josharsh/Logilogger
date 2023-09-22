import { Storage } from '@google-cloud/storage';
import { Request, Response, NextFunction } from 'express';

class LogicalLogger {
    private storage?: Storage;
    private bucketName?: string;
    private currentRoute: string = '';

    // constructor(bucketName: string, keyFilename: string) {
    //     this.storage = new Storage({ keyFilename });
    //     this.bucketName = bucketName;
    // }

    initialize(bucketName: string, keyFilename: string) {
        this.storage = new Storage({ keyFilename });
        this.bucketName = bucketName;
    }

    setCurrentRoute(route: string) {
        this.currentRoute = route;
    }
    
    private async writeToGCS(message: string) {
        try {
            const date = new Date().toISOString();
            const fileName = `${date}.log`;
            console.log(`LogiLog file name is ${fileName}`)
            const file = this.storage!.bucket(this.bucketName!).file(`${this.currentRoute}/${fileName}`);
            console.log(`LogiLog file saved in ${file}`)
            await file.save(message);
        }
        catch (error) {
            console.error('[LogicLog Error] Failed to write to GCS:', error);
        }
    }

    log(message: any, ...optionalParams: any[]) {
        const logMessage = `[LogicLog] ${message} ${optionalParams.join(' ')}`;
        console.log(logMessage);
        console.log("[LogiLog] Current route has been set to ", this.currentRoute)
        if (this.currentRoute) {
            this.writeToGCS(logMessage);
        }
    }
    // log(route: string, message: any, ...optionalParams: any[]) {
    //     const logMessage = `[LogicalLog] ${message} ${optionalParams.join(' ')}`;
    //     console.log(logMessage);
    //     this.writeToGCS(route, logMessage);
    // }
}

const logilogger = new LogicalLogger();

export function attachLogger(req: Request, res: Response, next: NextFunction) {
    const route = req.path.replace(/\/:[a-zA-Z0-9_]+/g, (match) => {
        const paramKey = match.slice(2); // remove "/:"
        return `/${req.params[paramKey]}`;
    });

    req.logger = {
        log: (message: string, ...optionalParams: any[]) => {
            logilogger.log(route, message, ...optionalParams);
        },
        error: (error: Error) => {
            logilogger.log(route, error.message);
        }
    };

    next();
}

export function setCurrentRoute(req: Request, res: Response, next: NextFunction) {
    const route = req.path.replace(/\/:[a-zA-Z0-9_]+/g, (match) => {
        const paramKey = match.slice(2); // remove "/:"
        return `/${req.params[paramKey]}`;
    });

    logilogger.setCurrentRoute(route);
    next();
}

export default logilogger;
