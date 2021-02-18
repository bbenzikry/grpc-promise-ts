import { CallOptions, Client, ClientUnaryCall, Metadata, MethodDefinition } from "grpc";
export interface TUnaryResult<TResponse> extends Promise<TResponse> {
    getUnaryCall: () => ClientUnaryCall;
}
export declare type TUnaryRpc<TRequest, TResponse> = (request: TRequest, metadata?: Metadata, options?: Partial<CallOptions>) => TUnaryResult<TResponse>;
export declare const promisfyUnaryRpc: <TRequest, TResponse>(rpc: MethodDefinition<TRequest, TResponse> & Function, client: Client) => TUnaryRpc<TRequest, TResponse>;
