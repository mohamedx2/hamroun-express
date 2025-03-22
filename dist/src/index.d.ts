/// <reference types="node" />
import * as http from 'http';
interface RequestParams {
    [key: string]: string;
}
interface RequestQuery {
    [key: string]: string;
}
interface RequestBody {
    [key: string]: any;
}
type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
type NextFunction = () => void;
declare class Request {
    private req;
    params: RequestParams;
    query: RequestQuery;
    body: RequestBody;
    constructor(req: http.IncomingMessage);
    method: string | undefined;
    url: string | undefined;
}
declare class Response {
    private res;
    constructor(res: http.ServerResponse);
    json(data: any): void;
    send(text: string): void;
    status(code: number): this;
}
export declare class GoogleisimaExpress {
    private routes;
    private middlewares;
    use(handler: RequestHandler): void;
    get(path: string, handler: RequestHandler): void;
    post(path: string, handler: RequestHandler): void;
    put(path: string, handler: RequestHandler): void;
    delete(path: string, handler: RequestHandler): void;
    listen(port: number, callback?: () => void): void;
}
declare const _default: GoogleisimaExpress;
export default _default;
