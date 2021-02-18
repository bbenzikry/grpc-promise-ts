import { Client } from "grpc";
/**
 * Creates a gRPC client which extends the grpc.Client input
 * by changing the RPC implemenations to return a promise instead of using
 * a callback to get the response.
 *
 * This function has no side effects (it doesn't modify the RPC passed in).
 */
declare const convertToPromiseClient: <TPromiseClient extends Client>(client: Client) => TPromiseClient;
export default convertToPromiseClient;
