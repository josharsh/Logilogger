import { Request } from 'express';

declare module 'express' {
    export interface Request {
        logger: {
            log: (message: string, ...optionalParams: any[]) => void;
            error: (errr: Error) => void;
        };
    }
}
