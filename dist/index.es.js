(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('grpc')) :
  typeof define === 'function' && define.amd ? define(['exports', 'grpc'], factory) :
  (global = global || self, factory(global['grpc-promise-ts'] = {}, global.grpc));
}(this, (function (exports, grpc) { 'use strict';

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

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvdW5hcnkudHMiLCIuLi9zcmMvbGliL2NvbnZlcnRUb1Byb21pc2VDbGllbnQudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2FsbE9wdGlvbnMsXG4gIENsaWVudCxcbiAgQ2xpZW50VW5hcnlDYWxsLFxuICBNZXRhZGF0YSxcbiAgTWV0aG9kRGVmaW5pdGlvbixcbn0gZnJvbSBcImdycGNcIjtcblxuZXhwb3J0IGludGVyZmFjZSBUVW5hcnlSZXN1bHQ8VFJlc3BvbnNlPiBleHRlbmRzIFByb21pc2U8VFJlc3BvbnNlPiB7XG4gIC8vIHRoaXMgcHJvbWlzZSB3aWxsIHJlamVjdCB3aXRoIGEgZ3JwYy5TZXJ2aWNlRXJyb3JcbiAgZ2V0VW5hcnlDYWxsOiAoKSA9PiBDbGllbnRVbmFyeUNhbGw7XG59XG5cbmV4cG9ydCB0eXBlIFRVbmFyeVJwYzxUUmVxdWVzdCwgVFJlc3BvbnNlPiA9IChcbiAgcmVxdWVzdDogVFJlcXVlc3QsXG4gIG1ldGFkYXRhPzogTWV0YWRhdGEsXG4gIG9wdGlvbnM/OiBQYXJ0aWFsPENhbGxPcHRpb25zPlxuKSA9PiBUVW5hcnlSZXN1bHQ8VFJlc3BvbnNlPjtcblxuZXhwb3J0IGNvbnN0IHByb21pc2Z5VW5hcnlScGMgPSA8VFJlcXVlc3QsIFRSZXNwb25zZT4oXG4gIHJwYzogTWV0aG9kRGVmaW5pdGlvbjxUUmVxdWVzdCwgVFJlc3BvbnNlPiAmIEZ1bmN0aW9uLFxuICBjbGllbnQ6IENsaWVudFxuKTogVFVuYXJ5UnBjPFRSZXF1ZXN0LCBUUmVzcG9uc2U+ID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxScGMgPSBycGM7XG4gIHJldHVybiA8VFJlcXVlc3QsIFRSZXNwb25zZT4oXG4gICAgcmVxdWVzdDogVFJlcXVlc3QsXG4gICAgbWV0YWRhdGE6IE1ldGFkYXRhID0gbmV3IE1ldGFkYXRhKCksXG4gICAgb3B0aW9uczogUGFydGlhbDxDYWxsT3B0aW9ucz4gPSB7fVxuICApID0+IHtcbiAgICBsZXQgdW5hcnlDYWxsOiBDbGllbnRVbmFyeUNhbGw7XG4gICAgY29uc3QgcmVzdWx0OiBQYXJ0aWFsPFRVbmFyeVJlc3VsdDxUUmVzcG9uc2U+PiA9IG5ldyBQcm9taXNlPFRSZXNwb25zZT4oXG4gICAgICAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHVuYXJ5Q2FsbCA9IG9yaWdpbmFsUnBjLmNhbGwoXG4gICAgICAgICAgY2xpZW50LFxuICAgICAgICAgIHJlcXVlc3QsXG4gICAgICAgICAgbWV0YWRhdGEsXG4gICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAoZSwgcikgPT4ge1xuICAgICAgICAgICAgaWYgKGUpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXNvbHZlKHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgcmVzdWx0LmdldFVuYXJ5Q2FsbCA9ICgpID0+IHVuYXJ5Q2FsbDtcbiAgICByZXR1cm4gcmVzdWx0IGFzIFRVbmFyeVJlc3VsdDxUUmVzcG9uc2U+O1xuICB9O1xufTtcbiIsImltcG9ydCB7XG4gIENhbGxPcHRpb25zLFxuICBDbGllbnQsXG4gIENsaWVudER1cGxleFN0cmVhbSxcbiAgTWV0YWRhdGEsXG4gIE1ldGhvZERlZmluaXRpb24sXG59IGZyb20gXCJncnBjXCI7XG5cbmltcG9ydCB7IHByb21pc2Z5VW5hcnlScGMgfSBmcm9tIFwiLi91bmFyeVwiO1xuXG5lbnVtIFJwY1R5cGUge1xuICBVTkFSWSxcbiAgU0VSVkVSX1NUUkVBTUlORyxcbiAgQ0xJRU5UX1NUUkVBTUlORyxcbiAgQklESVJFQ1RJT05BTCxcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZ1JQQyBjbGllbnQgd2hpY2ggZXh0ZW5kcyB0aGUgZ3JwYy5DbGllbnQgaW5wdXRcbiAqIGJ5IGNoYW5naW5nIHRoZSBSUEMgaW1wbGVtZW5hdGlvbnMgdG8gcmV0dXJuIGEgcHJvbWlzZSBpbnN0ZWFkIG9mIHVzaW5nXG4gKiBhIGNhbGxiYWNrIHRvIGdldCB0aGUgcmVzcG9uc2UuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBoYXMgbm8gc2lkZSBlZmZlY3RzIChpdCBkb2Vzbid0IG1vZGlmeSB0aGUgUlBDIHBhc3NlZCBpbikuXG4gKi9cbmNvbnN0IGNvbnZlcnRUb1Byb21pc2VDbGllbnQgPSBmdW5jdGlvbiA8VFByb21pc2VDbGllbnQgZXh0ZW5kcyBDbGllbnQ+KFxuICBjbGllbnQ6IENsaWVudFxuKTogVFByb21pc2VDbGllbnQge1xuICBjb25zdCByZXN1bHQgPSBPYmplY3QuY3JlYXRlKGNsaWVudCkgYXMgVFByb21pc2VDbGllbnQ7XG4gIE9iamVjdC5rZXlzKE9iamVjdC5nZXRQcm90b3R5cGVPZihjbGllbnQpKS5mb3JFYWNoKFxuICAgIDxUUmVxdWVzdCwgVFJlc3BvbnNlPihtZXRob2ROYW1lKSA9PiB7XG4gICAgICBjb25zdCBtZXRob2REZWZpbml0aW9uOiBNZXRob2REZWZpbml0aW9uPFRSZXF1ZXN0LCBUUmVzcG9uc2U+ICYgRnVuY3Rpb24gPVxuICAgICAgICBjbGllbnRbbWV0aG9kTmFtZV07XG4gICAgICBpZiAoXG4gICAgICAgIG1ldGhvZERlZmluaXRpb24ucmVxdWVzdFN0cmVhbSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgIG1ldGhvZERlZmluaXRpb24ucmVzcG9uc2VTdHJlYW0gPT09IHVuZGVmaW5lZFxuICAgICAgKSB7XG4gICAgICAgIC8vIGFjdHVhbCBncnBjIG1ldGhvZHMgd2lsbCBoYXZlIGJvdGggb2YgdGhlc2UgcG9wdWxhdGVkXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IHJwY1R5cGU6IFJwY1R5cGU7XG4gICAgICBzd2l0Y2ggKG1ldGhvZERlZmluaXRpb24ucmVxdWVzdFN0cmVhbSkge1xuICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgc3dpdGNoIChtZXRob2REZWZpbml0aW9uLnJlc3BvbnNlU3RyZWFtKSB7XG4gICAgICAgICAgICBjYXNlIHRydWU6XG4gICAgICAgICAgICAgIHJwY1R5cGUgPSBScGNUeXBlLkJJRElSRUNUSU9OQUw7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBmYWxzZTpcbiAgICAgICAgICAgICAgcnBjVHlwZSA9IFJwY1R5cGUuQ0xJRU5UX1NUUkVBTUlORztcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGZhbHNlOlxuICAgICAgICAgIHN3aXRjaCAobWV0aG9kRGVmaW5pdGlvbi5yZXNwb25zZVN0cmVhbSkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICBycGNUeXBlID0gUnBjVHlwZS5TRVJWRVJfU1RSRUFNSU5HO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgIHJwY1R5cGUgPSBScGNUeXBlLlVOQVJZO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidW5yZWFjaGFibGVcIik7XG4gICAgICB9XG5cbiAgICAgIHN3aXRjaCAocnBjVHlwZSkge1xuICAgICAgICBjYXNlIFJwY1R5cGUuVU5BUlk6XG4gICAgICAgICAgcmVzdWx0W21ldGhvZE5hbWVdID0gcHJvbWlzZnlVbmFyeVJwYyhtZXRob2REZWZpbml0aW9uLCBjbGllbnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFJwY1R5cGUuQklESVJFQ1RJT05BTDpcbiAgICAgICAgICByZXN1bHRbbWV0aG9kTmFtZV0gPSA8VFJlcXVlc3QsIFRSZXNwb25zZT4oXG4gICAgICAgICAgICBtZXRhZGF0YTogTWV0YWRhdGEgPSBuZXcgTWV0YWRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnM6IFBhcnRpYWw8Q2FsbE9wdGlvbnM+ID0ge31cbiAgICAgICAgICApOiBDbGllbnREdXBsZXhTdHJlYW08VFJlcXVlc3QsIFRSZXNwb25zZT4gPT5cbiAgICAgICAgICAgIG1ldGhvZERlZmluaXRpb24uY2FsbChjbGllbnQsIG1ldGFkYXRhLCBvcHRpb25zKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZWFkYWJsZS9Xcml0ZWFibGUgc3RyZWFtcyBub3QgeWV0IGltcGxlbWVtbnRlZFwiKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb252ZXJ0VG9Qcm9taXNlQ2xpZW50O1xuIiwiZXhwb3J0ICogZnJvbSBcIi4vbGliL3VuYXJ5XCI7XG5cbmltcG9ydCBfY29udmVydFRvUHJvbWlzZUNsaWVudCBmcm9tIFwiLi9saWIvY29udmVydFRvUHJvbWlzZUNsaWVudFwiO1xuXG5leHBvcnQgY29uc3QgY29udmVydFRvUHJvbWlzZUNsaWVudCA9IF9jb252ZXJ0VG9Qcm9taXNlQ2xpZW50O1xuIl0sIm5hbWVzIjpbIk1ldGFkYXRhIiwiY29udmVydFRvUHJvbWlzZUNsaWVudCIsIl9jb252ZXJ0VG9Qcm9taXNlQ2xpZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFtQmEsZ0JBQWdCLEdBQUcsQ0FDOUIsR0FBcUQsRUFDckQsTUFBYztNQUVkLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQztNQUN4QixPQUFPLENBQ0wsT0FBaUIsRUFDakIsV0FBcUIsSUFBSUEsYUFBUSxFQUFFLEVBQ25DLFVBQWdDLEVBQUU7VUFFbEMsSUFBSSxTQUEwQixDQUFDO1VBQy9CLE1BQU0sTUFBTSxHQUFxQyxJQUFJLE9BQU8sQ0FDMUQsQ0FBQyxPQUFPLEVBQUUsTUFBTTtj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
