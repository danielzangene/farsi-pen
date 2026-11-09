// node worker/test.mjs — checks the reply parser.
import assert from "node:assert";
import { parseReply } from "./src/index.js";
assert.deepEqual(parseReply('Sure!\n```json\n{"fa":"سلام","tr":"salâm","en":"Hi","fix":""}\n```'), { fa: "سلام", tr: "salâm", en: "Hi", fix: "" });
assert.equal(parseReply("سلام، خوبی؟").fa, "سلام، خوبی؟");
console.log("worker ok");
