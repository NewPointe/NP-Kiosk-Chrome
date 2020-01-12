
export class TcpError extends Error {
    constructor(public readonly resultCode: number) {
        super(`Network Error: ${resultCode}`);
    }
}
