export type JsRewriterOutput = any;
export declare const Rewriter: any;
export type Rewriter = any;
import { URLMeta } from "./url";
export declare function asyncSetWasm(): Promise<void>;
export declare const textDecoder: TextDecoder;
export declare function getRewriter(meta: URLMeta): [Rewriter, () => void];
