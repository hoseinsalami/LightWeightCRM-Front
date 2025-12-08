export class ServerResponseType<T>
{
    statusCode?: number;
    errors: string[];
    data?: T;

    constructor(model?: ServerResponseType<T>) {
        Object.assign(this, model);
    }
}
