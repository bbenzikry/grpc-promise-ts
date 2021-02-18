'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var grpc = require('grpc');

const promisfyUnaryRpc = (rpc, client) => {
    const originalRpc = rpc;
    return (request, metadata = new grpc.Metadata(), options = {}) => {
        let unaryCall;
        const result = new Promise((resolve, reject) => {
            unaryCall = originalRpc.call(client, request, metadata, options, (e, r) => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve(r);
            });
        });
        result.getUnaryCall = () => unaryCall;
        return result;
    };
};

var RpcType;
(function (RpcType) {
    RpcType[RpcType["UNARY"] = 0] = "UNARY";
    RpcType[RpcType["SERVER_STREAMING"] = 1] = "SERVER_STREAMING";
    RpcType[RpcType["CLIENT_STREAMING"] = 2] = "CLIENT_STREAMING";
    RpcType[RpcType["BIDIRECTIONAL"] = 3] = "BIDIRECTIONAL";
})(RpcType || (RpcType = {}));
/**
 * Creates a gRPC client which extends the grpc.Client input
 * by changing the RPC implemenations to return a promise instead of using
 * a callback to get the response.
 *
 * This function has no side effects (it doesn't modify the RPC passed in).
 */
const convertToPromiseClient = function (client) {
    const result = Object.create(client);
    Object.keys(Object.getPrototypeOf(client)).forEach((methodName) => {
        const methodDefinition = client[methodName];
        if (methodDefinition.requestStream === undefined &&
            methodDefinition.responseStream === undefined) {
            // actual grpc methods will have both of these populated
            return;
        }
        let rpcType;
        switch (methodDefinition.requestStream) {
            case true:
                switch (methodDefinition.responseStream) {
                    case true:
                        rpcType = RpcType.BIDIRECTIONAL;
                        break;
                    case false:
                        rpcType = RpcType.CLIENT_STREAMING;
                        break;
                }
                break;
            case false:
                switch (methodDefinition.responseStream) {
                    case true:
                        rpcType = RpcType.SERVER_STREAMING;
                        break;
                    case false:
                        rpcType = RpcType.UNARY;
                        break;
                }
                break;
            default:
                throw new Error("unreachable");
        }
        switch (rpcType) {
            case RpcType.UNARY:
                result[methodName] = promisfyUnaryRpc(methodDefinition, client);
                break;
            case RpcType.BIDIRECTIONAL:
                result[methodName] = (metadata = new grpc.Metadata(), options = {}) => methodDefinition.call(client, metadata, options);
                break;
            default:
                throw new Error("Readable/Writeable streams not yet implememnted");
        }
    });
    return result;
};

const convertToPromiseClient$1 = convertToPromiseClient;

exports.convertToPromiseClient = convertToPromiseClient$1;
exports.promisfyUnaryRpc = promisfyUnaryRpc;
//# sourceMappingURL=index.js.map
