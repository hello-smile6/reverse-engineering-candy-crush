var Module = typeof Module !== "undefined" ? Module : {};
/* Fix bug
hello-smile6.github.io/:1 
 Uncaught (in promise) TypeError: Module.printWarn is not a function
    at 34367 (candycrushsaga.js:1:23494)
    at _emscripten_asm_const_iii (candycrushsaga.js:1:69671)
    at /reverse-engineering…candycrushsaga.wasm
    at /reverse-engineering…candycrushsaga.wasm
    at /reverse-engineering…candycrushsaga.wasm
    at /reverse-engineering…candycrushsaga.wasm
    at Module._main (candycrushsaga.js:1:285646)
    at callMain (candycrushsaga.js:1:333314)
    at doRun (candycrushsaga.js:1:333892)
    at run (candycrushsaga.js:1:334064)
*/
Module.printWarn = function (text) {
    console.warn(text);
};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function (status, toThrow) {
  throw toThrow;
};
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_IS_NODE =
  typeof process === "object" &&
  typeof process.versions === "object" &&
  typeof process.versions.node === "string";
ENVIRONMENT_IS_SHELL =
  !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var scriptDirectory = "";
function locateFile(path) {
  if (Module["locateFile"]) {
    return Module["locateFile"](path, scriptDirectory);
  }
  return scriptDirectory + path;
}
var read_, readAsync, readBinary, setWindowTitle;
var nodeFS;
var nodePath;
if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require("path").dirname(scriptDirectory) + "/";
  } else {
    scriptDirectory = __dirname + "/";
  }
  read_ = function shell_read(filename, binary) {
    if (!nodeFS) nodeFS = require("fs");
    if (!nodePath) nodePath = require("path");
    filename = nodePath["normalize"](filename);
    return nodeFS["readFileSync"](filename, binary ? null : "utf8");
  };
  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };
  if (process["argv"].length > 1) {
    thisProgram = process["argv"][1].replace(/\\/g, "/");
  }
  arguments_ = process["argv"].slice(2);
  if (typeof module !== "undefined") {
    module["exports"] = Module;
  }
  process["on"]("uncaughtException", function (ex) {
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });
  process["on"]("unhandledRejection", abort);
  quit_ = function (status) {
    process["exit"](status);
  };
  Module["inspect"] = function () {
    return "[Emscripten Module object]";
  };
  if (typeof WebAssembly === "undefined") {
    var fs = require("fs");
    eval(fs.readFileSync(locateFile("candycrushsaga.wasm.js")) + "");
  }
} else if (ENVIRONMENT_IS_SHELL) {
  if (typeof read != "undefined") {
    read_ = function shell_read(f) {
      return read(f);
    };
  }
  readBinary = function readBinary(f) {
    var data;
    if (typeof readbuffer === "function") {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, "binary");
    assert(typeof data === "object");
    return data;
  };
  if (typeof scriptArgs != "undefined") {
    arguments_ = scriptArgs;
  } else if (typeof arguments != "undefined") {
    arguments_ = arguments;
  }
  if (typeof quit === "function") {
    quit_ = function (status) {
      quit(status);
    };
  }
  if (typeof print !== "undefined") {
    if (typeof console === "undefined") console = {};
    console.log = print;
    console.warn = console.error =
      typeof printErr !== "undefined" ? printErr : print;
  }
  if (typeof WebAssembly === "undefined") {
    eval(read(locateFile("candycrushsaga.wasm.js")) + "");
  }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = self.location.href;
  } else if (document.currentScript) {
    scriptDirectory = document.currentScript.src;
  }
  if (scriptDirectory.indexOf("blob:") !== 0) {
    scriptDirectory = scriptDirectory.substr(
      0,
      scriptDirectory.lastIndexOf("/") + 1
    );
  } else {
    scriptDirectory = "";
  }
  {
    read_ = function shell_read(url) {
      var xhr = new XMLHttpRequest();
      console.log(url);
      xhr.open("GET", url, false);
      xhr.send(null);
      return xhr.responseText;
    };
    if (ENVIRONMENT_IS_WORKER) {
      readBinary = function readBinary(url) {
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
        return new Uint8Array(xhr.response);
      };
    }
    readAsync = function readAsync(url, onload, onerror) {
        console.log(url);
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function xhr_onload() {
        if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
          onload(xhr.response);
          return;
        }
        onerror();
      };
      xhr.onerror = onerror;
      xhr.send(null);
    };
  }
  setWindowTitle = function (title) {
    document.title = title;
  };
} else {
}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];
var STACK_ALIGN = 16;
function dynamicAlloc(size) {
  var ret = HEAP32[DYNAMICTOP_PTR >> 2];
  var end = (ret + size + 15) & -16;
  HEAP32[DYNAMICTOP_PTR >> 2] = end;
  return ret;
}
function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN;
  return Math.ceil(size / factor) * factor;
}
function getNativeTypeSize(type) {
  switch (type) {
    case "i1":
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
    default: {
      if (type[type.length - 1] === "*") {
        return 4;
      } else if (type[0] === "i") {
        var bits = Number(type.substr(1));
        assert(
          bits % 8 === 0,
          "getNativeTypeSize invalid bits " + bits + ", type " + type
        );
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}
function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}
function convertJsFunctionToWasm(func, sig) {
  return func;
}
var freeTableIndexes = [];
var functionsInTableMap;
function addFunctionWasm(func, sig) {
  var table = wasmTable;
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    for (var i = 0; i < table.length; i++) {
      var item = table.get(i);
      if (item) {
        functionsInTableMap.set(item, i);
      }
    }
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }
  var ret;
  if (freeTableIndexes.length) {
    ret = freeTableIndexes.pop();
  } else {
    ret = table.length;
    try {
      table.grow(1);
    } catch (err) {
      if (!(err instanceof RangeError)) {
        throw err;
      }
      throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
    }
  }
  try {
    table.set(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }
  functionsInTableMap.set(func, ret);
  return ret;
}
function removeFunctionWasm(index) {
  functionsInTableMap.delete(wasmTable.get(index));
  freeTableIndexes.push(index);
}
var funcWrappers = {};
function getFuncWrapper(func, sig) {
  if (!func) return;
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}
function dynCall(sig, ptr, args) {
  if (args && args.length) {
    return Module["dynCall_" + sig].apply(null, [ptr].concat(args));
  } else {
    return Module["dynCall_" + sig].call(null, ptr);
  }
}
var tempRet0 = 0;
var setTempRet0 = function (value) {
  tempRet0 = value;
};
var getTempRet0 = function () {
  return tempRet0;
};
var GLOBAL_BASE = 1024;
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime;
if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
function setValue(ptr, value, type, noSafe) {
  type = type || "i8";
  if (type.charAt(type.length - 1) === "*") type = "i32";
  switch (type) {
    case "i1":
      HEAP8[ptr >> 0] = value;
      break;
    case "i8":
      HEAP8[ptr >> 0] = value;
      break;
    case "i16":
      HEAP16[ptr >> 1] = value;
      break;
    case "i32":
      HEAP32[ptr >> 2] = value;
      break;
    case "i64":
      (tempI64 = [
        value >>> 0,
        ((tempDouble = value),
        +Math_abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math_ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[ptr >> 2] = tempI64[0]),
        (HEAP32[(ptr + 4) >> 2] = tempI64[1]);
      break;
    case "float":
      HEAPF32[ptr >> 2] = value;
      break;
    case "double":
      HEAPF64[ptr >> 3] = value;
      break;
    default:
      abort("invalid type for setValue: " + type);
  }
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
  initial: 87756,
  maximum: 87756 + 0,
  element: "anyfunc",
});
var ABORT = false;
var EXITSTATUS = 0;
function assert(condition, text) {
  if (!condition) {
    abort("Assertion failed: " + text);
  }
}
function getCFunc(ident) {
  var func = Module["_" + ident];
  assert(
    func,
    "Cannot call unknown function " + ident + ", make sure it is exported"
  );
  return func;
}
function ccall(ident, returnType, argTypes, args, opts) {
  var toC = {
    string: function (str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) {
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    array: function (arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    },
  };
  function convertReturnValue(ret) {
    if (returnType === "string") return UTF8ToString(ret);
    if (returnType === "boolean") return Boolean(ret);
    return ret;
  }
  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}
var ALLOC_STACK = 1;
var ALLOC_NONE = 3;
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === "number") {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }
  var singleType = typeof types === "string" ? types : null;
  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, stackAlloc, dynamicAlloc][allocator](
      Math.max(size, singleType ? 1 : types.length)
    );
  }
  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[ptr >> 2] = 0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[ptr++ >> 0] = 0;
    }
    return ret;
  }
  if (singleType === "i8") {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }
  var i = 0,
    type,
    typeSize,
    previousType;
  while (i < size) {
    var curr = slab[i];
    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }
    if (type == "i64") type = "i32";
    setValue(ret + i, curr, type);
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }
  return ret;
}
function getMemory(size) {
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}
var UTF8Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = "";
    while (idx < endPtr) {
      var u0 = heap[idx++];
      if (!(u0 & 128)) {
        str += String.fromCharCode(u0);
        continue;
      }
      var u1 = heap[idx++] & 63;
      if ((u0 & 224) == 192) {
        str += String.fromCharCode(((u0 & 31) << 6) | u1);
        continue;
      }
      var u2 = heap[idx++] & 63;
      if ((u0 & 240) == 224) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }
      if (u0 < 65536) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 65536;
        str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
      }
    }
  }
  return str;
}
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
}
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) return 0;
  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343) {
      var u1 = str.charCodeAt(++i);
      u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
    }
    if (u <= 127) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 2047) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 192 | (u >> 6);
      heap[outIdx++] = 128 | (u & 63);
    } else if (u <= 65535) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 224 | (u >> 12);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 240 | (u >> 18);
      heap[outIdx++] = 128 | ((u >> 12) & 63);
      heap[outIdx++] = 128 | ((u >> 6) & 63);
      heap[outIdx++] = 128 | (u & 63);
    }
  }
  heap[outIdx] = 0;
  return outIdx - startIdx;
}
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
}
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    var u = str.charCodeAt(i);
    if (u >= 55296 && u <= 57343)
      u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
    if (u <= 127) ++len;
    else if (u <= 2047) len += 2;
    else if (u <= 65535) len += 3;
    else len += 4;
  }
  return len;
}
var UTF16Decoder =
  typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}
function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[buffer++ >> 0] = str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[buffer >> 0] = 0;
}
var WASM_PAGE_SIZE = 65536;
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module["HEAP8"] = HEAP8 = new Int8Array(buf);
  Module["HEAP16"] = HEAP16 = new Int16Array(buf);
  Module["HEAP32"] = HEAP32 = new Int32Array(buf);
  Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
  Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
  Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
  Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
  Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
}
var STACK_BASE = 10407760,
  DYNAMIC_BASE = 10407760,
  DYNAMICTOP_PTR = 5164720;
var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 268435456;
if (Module["wasmMemory"]) {
  wasmMemory = Module["wasmMemory"];
} else {
  wasmMemory = new WebAssembly.Memory({
    initial: INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
    maximum: 2113929216 / WASM_PAGE_SIZE,
  });
}
if (wasmMemory) {
  buffer = wasmMemory.buffer;
}
INITIAL_INITIAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == "function") {
      callback(Module);
      continue;
    }
    var func = callback.func;
    if (typeof func === "number") {
      if (callback.arg === undefined) {
        Module["dynCall_v"](func);
      } else {
        Module["dynCall_vi"](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;
function preRun() {
  if (Module["preRun"]) {
    if (typeof Module["preRun"] == "function")
      Module["preRun"] = [Module["preRun"]];
    while (Module["preRun"].length) {
      addOnPreRun(Module["preRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}
function exitRuntime() {
  runtimeExited = true;
}
function postRun() {
  if (Module["postRun"]) {
    if (typeof Module["postRun"] == "function")
      Module["postRun"] = [Module["postRun"]];
    while (Module["postRun"].length) {
      addOnPostRun(Module["postRun"].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function getUniqueRunDependency(id) {
  return id;
}
function addRunDependency(id) {
  runDependencies++;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module["monitorRunDependencies"]) {
    Module["monitorRunDependencies"](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};
function abort(what) {
  if (Module["onAbort"]) {
    Module["onAbort"](what);
  }
  what += "";
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
  var e = new WebAssembly.RuntimeError(what);
  throw e;
}
var memoryInitializer = "candycrushsaga.js.mem";
function hasPrefix(str, prefix) {
  return String.prototype.startsWith
    ? str.startsWith(prefix)
    : str.indexOf(prefix) === 0;
}
var dataURIPrefix = "data:application/octet-stream;base64,";
function isDataURI(filename) {
  return hasPrefix(filename, dataURIPrefix);
}
var fileURIPrefix = "file://";
function isFileURI(filename) {
  return hasPrefix(filename, fileURIPrefix);
}
var wasmBinaryFile = "candycrushsaga.wasm";
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}
function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  } catch (err) {
    abort(err);
  }
}
function getBinaryPromise() {
  if (
    !wasmBinary &&
    (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
    typeof fetch === "function" &&
    !isFileURI(wasmBinaryFile)
  ) {
    return fetch(wasmBinaryFile, { credentials: "same-origin" })
      .then(function (response) {
        if (!response["ok"]) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response["arrayBuffer"]();
      })
      .catch(function () {
        return getBinary();
      });
  }
  return new Promise(function (resolve, reject) {
    resolve(getBinary());
  });
}
function createWasm() {
  var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module["asm"] = exports;
    removeRunDependency("wasm-instantiate");
  }
  addRunDependency("wasm-instantiate");
  function receiveInstantiatedSource(output) {
    receiveInstance(output["instance"]);
  }
  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise()
      .then(function (binary) {
        return WebAssembly.instantiate(binary, info);
      })
      .then(receiver, function (reason) {
        err("failed to asynchronously prepare wasm: " + reason);
        if (typeof location !== "undefined") {
          var search = location.search;
          if (search.indexOf("_rwasm=0") < 0) {
            location.href += (search ? search + "&" : "?") + "_rwasm=0";
          }
        }
        abort(reason);
      });
  }
  function instantiateAsync() {
    if (
      !wasmBinary &&
      typeof WebAssembly.instantiateStreaming === "function" &&
      !isDataURI(wasmBinaryFile) &&
      !isFileURI(wasmBinaryFile) &&
      typeof fetch === "function"
    ) {
      fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function (
        response
      ) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiatedSource, function (reason) {
          err("wasm streaming compile failed: " + reason);
          err("falling back to ArrayBuffer instantiation");
          return instantiateArrayBuffer(receiveInstantiatedSource);
        });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiatedSource);
    }
  }
  if (Module["instantiateWasm"]) {
    try {
      var exports = Module["instantiateWasm"](info, receiveInstance);
      return exports;
    } catch (e) {
      err("Module.instantiateWasm callback failed with error: " + e);
      return false;
    }
  }
  instantiateAsync();
  return {};
}
var tempDouble;
var tempI64;
var ASM_CONSTS = {
  5040: function () {
    function expand(value) {
      return (value < 10 ? "0" : "") + value;
    }
    var o = new Date().getTimezoneOffset();
    var x = Math.abs(o);
    var h = expand(x / 60);
    var m = expand(x % 60);
    var t = "GMT" + (o < 0 ? "+" : "-") + h + ":" + m;
    return allocate(intArrayFromString(t), "i8", ALLOC_STACK);
  },
  5348: function () {
    return -new Date().getTimezoneOffset() * 60;
  },
  23736: function () {
    Module.idbfsSyncNeeded = true;
  },
  29130: function () {
    var version =
      king && king.ff ? king.ff.Engine.getAppVersion() : "unknown_version";
    return allocate(intArrayFromString(String(version)), "i8", ALLOC_STACK);
  },
  29293: function ($0) {
    var callback = $0;
    if (typeof window.onerror != "function") {
      window.onerror = function (errorMsg, url, line, column, errorObj) {
        var stack = errorMsg.split("\n");
        var message = allocate(
          intArrayFromString(String(stack.shift())),
          "i8",
          ALLOC_STACK
        );
        var backtrace = allocate(
          intArrayFromString(String(stack.join("\n"))),
          "i8",
          ALLOC_STACK
        );
        dynCall("vii", callback, [message, backtrace]);
        return true;
      };
    } else {
      Module.print("External crash writer has been already installed.");
    }
  },
  29816: function () {
    var base = "application_home/";
    var homeDirectory = Module["core.homeDirectory"] || "documents";
    return allocate(
      intArrayFromString(base + homeDirectory + "/"),
      "i8",
      ALLOC_STACK
    );
  },
  30118: function ($0, $1) {
    var mount_folder = UTF8ToString($0);
    var callback = $1;
    FS.mount(IDBFS, {}, mount_folder);
    var start = new Date().getTime();
    var timeoutExecuted = false;
    var timeoutHandler = setTimeout(function () {
      timeoutExecuted = true;
      callRuntimeCallbackAndClearTimeout("Load IDBFS Timeout");
    }, 5e3);
    function callRuntimeCallbackAndClearTimeout(errorMsg) {
      clearTimeout(timeoutHandler);
      setTimeout(function () {
        var errPtr = errorMsg
          ? allocate(intArrayFromString(String(errorMsg)), "i8", ALLOC_STACK)
          : 0;
        dynCall("vii", callback, [errorMsg == null, errPtr]);
      }, 1);
    }
    try {
      if (FS.indexedDB() && Module["core.supportIDBFS"]) {
        FS.syncfs(true, function (err) {
          if (timeoutExecuted) {
            Module.printWarn("IDBFS loaded after timeout");
          } else {
            Module.print(
              "Load IDBFS: " + (new Date().getTime() - start) + "ms"
            );
            callRuntimeCallbackAndClearTimeout(err ? String(err) : null);
          }
        });
      } else {
        callRuntimeCallbackAndClearTimeout(
          "Missing IndexedDB definition, or it's disabled"
        );
      }
    } catch (syncException) {
      callRuntimeCallbackAndClearTimeout("Exception: " + String(syncException));
    }
  },
  31193: function () {
    if (Module["core.supportIDBFS"]) {
      Module.idbfsSyncNeeded = true;
    }
  },
  31265: function () {
    Module.idbfsSyncRetardation = ((Module.idbfsSyncRetardation | 0) + 1) % 60;
    if (
      Module.idbfsSyncNeeded &&
      !Module.idbfsSyncInProgress &&
      !Module.idbfsSyncRetardation
    ) {
      Module.idbfsSyncInProgress = true;
      Module.idbfsSyncNeeded = false;
      var start = new Date().getTime();
      try {
        if (FS.indexedDB() && Module["core.supportIDBFS"]) {
          FS.syncfs(false, function (err) {
            Module.idbfsSyncInProgress = false;
            Module.print(
              "Store IDBFS: " + (new Date().getTime() - start) + "ms"
            );
          });
        } else {
          Module.print(
            "Synchronize IDBFS Error: Missing IndexedDB definition, or it's disabled"
          );
          Module.idbfsSyncInProgress = false;
        }
      } catch (syncException) {
        Module.print("Synchronize IDBFS Error: " + String(syncException));
        Module.idbfsSyncInProgress = false;
      }
    }
  },
  32172: function () {
    var network = Module["core.network"] || "unknown";
    var device =
      "Emscripten-" +
      network.charAt(0).toUpperCase() +
      network.substr(1).toLowerCase();
    return allocate(intArrayFromString(device), "i8", ALLOC_STACK);
  },
  32395: function () {
    var os = "undefined";
    if (typeof navigator !== "undefined") {
      os = navigator.oscpu || navigator.platform;
    }
    return allocate(intArrayFromString(os), "i8", ALLOC_STACK);
  },
  32594: function () {
    var model = "unknown_web_device";
    return allocate(intArrayFromString(model), "i8", ALLOC_STACK);
  },
  32730: function () {
    var metaElement = document.createElement("div");
    metaElement.style =
      "width: 1in; height: 1in; left: -100%; position: absolute; top: -100%;";
    document.body.appendChild(metaElement);
    var devicePixelRatio = window.devicePixelRatio || 1;
    var dpiX = Math.round(metaElement.offsetWidth * devicePixelRatio);
    var dpiY = Math.round(metaElement.offsetHeight * devicePixelRatio);
    document.body.removeChild(metaElement);
    var dpi = (dpiX << 16) | dpiY;
    return dpi;
  },
  33212: function () {
    if (typeof DYNAMICTOP !== "undefined") {
      return DYNAMICTOP;
    }
    if (typeof DYNAMICTOP_PTR !== "undefined") {
      return HEAP32[DYNAMICTOP_PTR >> 2];
    }
    return 0;
  },
  33428: function () {
    var language = "en";
    if (Module.hasOwnProperty("core.locale")) {
      var locales = Module["core.locale"].split("_");
      if (locales.length) {
        language = locales[0].toLowerCase();
      }
    } else {
      if (typeof navigator !== "undefined") {
        var browserLanguage =
          navigator.language || navigator.browserLanguage || "en";
        language = browserLanguage.substr(0, 2).toLowerCase();
      }
      Module.printWarn(
        "GetLanguage. Not languange found, default language setup " + language
      );
    }
    return allocate(intArrayFromString(language), "i8", ALLOC_STACK);
  },
  33961: function () {
    var locale = "en_US";
    if (Module.hasOwnProperty("core.locale")) {
      locale = Module["core.locale"];
    } else {
      if (typeof navigator !== "undefined") {
        var browserLanguage = navigator.language || navigator.browserLanguage;
        locale = browserLanguage;
      }
      Module.printWarn(
        "GetLocale. No locale found, default locale setup " + locale
      );
    }
    return allocate(intArrayFromString(locale), "i8", ALLOC_STACK);
  },
  34367: function () {
    var country = "us";
    if (Module.hasOwnProperty("core.locale")) {
      var locales = Module["core.locale"].split("_");
      if (locales.length > 1) {
        country = locales[1].toLowerCase();
      }
    } else {
      if (typeof navigator !== "undefined") {
        var browserLanguage = navigator.language || navigator.browserLanguage;
        var countryIndex = browserLanguage
          ? Math.max(browserLanguage.indexOf("-"), browserLanguage.indexOf("_"))
          : -1;
        country =
          countryIndex == -1
            ? country
            : browserLanguage.substr(countryIndex + 1, 2).toLowerCase();
      }
      Module.printWarn(
        "GetCountryCode. Not country found, default country setup " + country
      );
    }
    return allocate(intArrayFromString(country), "i8", ALLOC_STACK);
  },
  35184: function ($0, $1) {
    Module.setCanvasSize($0, $1);
  },
  35312: function ($0) {
    function copyFallback(textToCopy) {
      var textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        var successful = document.execCommand("copy");
        if (!successful) {
          Module.printErr("Clipboard fallback unsuccessful");
        }
      } catch (err) {
        Module.printErr("Clipboard fallback exception: " + err);
      }
      document.body.removeChild(textArea);
    }
    var clipboardText = UTF8ToString($0);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(clipboardText).catch(function (err) {
        Module.printErr(
          "navigator clipboard available but copy was unsuccessful: " + err
        );
        copyFallback(clipboardText);
      });
    } else {
      copyFallback(clipboardText);
    }
  },
  470768: function ($0) {
    if (
      typeof king !== "undefined" &&
      typeof king.ff !== undefined &&
      typeof king.ff.Breadcrumbs !== undefined
    ) {
      king.ff.Breadcrumbs.setMaxMessages($0);
    }
  },
  470927: function ($0) {
    if (
      typeof king !== "undefined" &&
      typeof king.ff !== undefined &&
      typeof king.ff.Breadcrumbs !== undefined
    ) {
      king.ff.Breadcrumbs.addBreadcrumbMessage(UTF8ToString($0));
    }
  },
  472580: function () {
    return typeof navigator !== "undefined" ? navigator.onLine : false;
  },
  472656: function () {
    var connection = null;
    if (typeof navigator !== "undefined") {
      connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    }
    if (connection) {
      var type = connection.type;
      if (type == "ethernet") {
        return 2;
      } else if (type == "wifi") {
        return 3;
      } else if (type == "cellular") {
        return 4;
      }
    }
    return 0;
  },
  734068: function ($0) {
    return Module.FictionWebView.canGoBack($0);
  },
  734116: function ($0) {
    Module.FictionWebView.goBack($0);
  },
  734154: function ($0, $1, $2, $3, $4, $5, $6, $7) {
    return Module.FictionWebView.open(
      $0,
      $1,
      $2,
      UTF8ToString($3),
      $4,
      $5,
      $6,
      $7
    );
  },
  734248: function ($0) {
    Module.FictionWebView.show($0);
  },
  734284: function ($0, $1, $2, $3, $4) {
    Module.FictionWebView.reposition($0, $1, $2, $3, $4);
  },
  734387: function ($0, $1) {
    Module.FictionWebView.executeJavaScript($0, UTF8ToString($1));
  },
  734457: function ($0) {
    Module.FictionWebView.hide($0);
  },
  734493: function ($0) {
    Module.FictionWebView.close($0);
  },
  734530: function ($0, $1) {
    var WebView = {};
    Module.FictionWebView = WebView;
    WebView.list = [];
    WebView.type = "Fiction Factory";
    WebView.nativeForwardMessageListener = $0;
    WebView.nativeForwardListener = $1;
    window.addEventListener(
      "message",
      function ff_message_handler(event) {
        if (event.data) {
          if (event.data.type === "bridge") {
            var namespace = allocate(
              intArrayFromString(event.data.namespace),
              "i8",
              ALLOC_STACK
            );
            var message = allocate(
              intArrayFromString(event.data.message),
              "i8",
              ALLOC_STACK
            );
            var params = event.data.params || [];
            var paramsPtr = _malloc(params.length * HEAP32.BYTES_PER_ELEMENT);
            for (var i = 0; i < params.length; i++) {
              HEAP32[(paramsPtr >> 2) + i] = allocate(
                intArrayFromString(params[i]),
                "i8",
                ALLOC_STACK
              );
            }
            dynCall("viiiii", WebView.nativeForwardMessageListener, [
              event.data.handler,
              namespace,
              message,
              params.length,
              paramsPtr,
            ]);
            _free(paramsPtr);
          }
        }
      },
      false
    );
    WebView._getById = function ff_webview_get_by_id(id) {
      var iframe = WebView.list[id];
      if (!iframe) {
        Module.printErr("WebView ID: " + id + " is unavailable");
      }
      return iframe;
    };
    WebView.show = function ff_webview_show(id) {
      WebView._getById(id).style.display = "";
    };
    WebView.hide = function ff_webview_hide(id) {
      WebView._getById(id).style.display = "none";
    };
    WebView.close = function ff_webview_close(id) {
      var iframe = WebView._getById(id);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      WebView.list[id] = null;
    };
    WebView.goBack = function ff_webview_goBack(id) {
      WebView._getById(id).contentWindow.history.back();
    };
    WebView.canGoBack = function ff_webview_canGoBack(id) {
      return WebView._getById(id).contentWindow.history.length > 0;
    };
    WebView.executeJavaScript = function ff_webview_executeJavaScript(
      id,
      script
    ) {
      WebView._getById(id).contentWindow.postMessage(
        { type: "sudo", exec: script },
        "*"
      );
    };
    WebView.reposition = function ff_webview_reposition(id, x, y, w, h) {
      var iframe = WebView._getById(id);
      iframe.width = Math.round(
        Math.min(Module.canvas.width * w, Module.canvas.width * (1 - x))
      );
      iframe.height = Math.round(
        Math.min(Module.canvas.height * h, Module.canvas.height * (1 - y))
      );
      iframe.style.left = Math.round(Module.canvas.width * x) + "px;";
      iframe.style.top = Math.round(Module.canvas.height * y) + "px;";
    };
    WebView.open = function ff_webview_open(
      id,
      nativeMessageListener,
      nativeListener,
      url,
      x,
      y,
      w,
      h
    ) {
      function file_exists(path) {
        var exists = false;
        path = path.split("?")[0];
        try {
          var stat = FS.stat(path);
          exists = FS.isFile(stat.mode);
        } catch (e) {
          exists = false;
        }
        return exists;
      }
      function load_file(base, path) {
        url = base + path.split("?")[0];
        var result = null;
        try {
          result = FS.readFile(url);
        } catch (e) {
          console.warn("Trying to embed non existing file: " + url);
        }
        return result;
      }
      function flattening(base_url, file_path) {
        var content_filename = file_path.split("/").pop();
        var content = UTF8ArrayToString(load_file(base_url, file_path), 0);
        var parts = [];
        var lut = {};
        lut.css = { type: "text/css" };
        lut.css.handler = function (file_path) {
          return flattening(base_url, file_path);
        };
        lut.js = { type: "text/javascript" };
        lut.png = { type: "image/png" };
        lut.gif = { type: "image/gif" };
        lut.jpg = { type: "image/jpg" };
        lut.jpeg = { type: "image/jpeg" };
        lut.webp = { type: "image/webp" };
        var regex_string =
          '(?:src="|href="|url\\(")([^"]*?\\.(' +
          Object.keys(lut).join("|") +
          '))(?=")';
        var regex = new RegExp(regex_string, "gm");
        var m = null;
        while ((m = regex.exec(content)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          var def = lut[m[2]];
          var filename = m[1];
          if (
            filename.startsWith("http://") ||
            filename.startsWith("https://") ||
            filename.startsWith("://")
          ) {
            continue;
          }
          var file_content = load_file(base_url, filename);
          if (!file_content) {
            continue;
          }
          if (def.handler) file_content = def.handler(filename);
          var file_blob = new Blob([file_content], { type: def.type });
          var file_uri = URL.createObjectURL(file_blob);
          var index = content.indexOf(m[1], m.index);
          parts.push({
            start: index,
            end: index + filename.length,
            old: filename,
            new: file_uri,
          });
        }
        parts.sort(function (a, b) {
          return b.start - a.start;
        });
        parts.forEach(function (v) {
          content = content.slice(0, v.start) + v.new + content.slice(v.end);
        });
        return content;
      }
      var src = url;
      if (!url.startsWith("http:") && !url.startsWith("https:")) {
        if (url.startsWith("file://")) {
          url = url.replace("file://", "/");
        }
        if (!file_exists(url) && !url.startsWith("/res_output")) {
          var correctedUrl = "/res_output/" + url;
          Module.printWarn(
            "Path '" +
              url +
              "' isn't rooted in res_output, assuming: " +
              correctedUrl
          );
          url = correctedUrl;
        }
        if (!file_exists(url) && url.startsWith("/res_output/emscripten")) {
          var correctedUrl = url.replace(
            "/res_output/emscripten/",
            "/res_output/"
          );
          Module.printWarn(
            "Path '" +
              url +
              "' is rooted in /res_output/emscripten, assuming: " +
              correctedUrl
          );
          url = correctedUrl;
        }
        var base_url = url.split("/");
        var index_path = base_url.pop();
        base_url = base_url.join("/") + "/";
        var start = Date.now();
        var index_content = flattening(base_url, index_path);
        var raw_init = function (nativeMessageListener) {
          window.FictionFactory = window.FictionFactory || {};
          window.FictionFactory.sendWebViewMessage =
            function ff_webview_bus_sendWebViewMessage(
              namespace,
              message,
              params
            ) {
              window.parent.postMessage(
                {
                  type: "bridge",
                  handler: nativeMessageListener,
                  namespace: namespace,
                  message: message,
                  params: params,
                },
                "*"
              );
            };
          window.addEventListener(
            "message",
            function ff_webview_bus_sudo(event) {
              if (event.data && event.data.type === "sudo") {
                eval(event.data.exec);
              }
            },
            false
          );
        };
        index_content +=
          "\n<script type='text/javascript'> /* Injected code: FFWebViewEmscripten.cpp */";
        index_content += "\nvar init = " + raw_init.toString().trim() + ";";
        index_content += "\ninit(" + nativeMessageListener + ");";
        index_content += "\n</script>";
        var index_blob = new Blob([index_content], { type: "text/html" });
        src = URL.createObjectURL(index_blob);
        if (index_path.indexOf("?") > 0) {
          src += "#" + index_path.split("?").slice(-1);
        }
      }
      var iframe = null;
      if (id < 0) {
        iframe = document.createElement("iframe");
        id = WebView.list.length;
        WebView.list.push(iframe);
      } else {
        iframe = WebView._getById(id);
      }
      iframe.onload = function ff_iframe_onload() {
        dynCall("vii", WebView.nativeForwardListener, [nativeListener, 0]);
      };
      iframe.onerror = function ff_iframe_error(e) {
        var data = allocate(intArrayFromString(e.message), "i8", ALLOC_STACK);
        dynCall("vii", WebView.nativeForwardListener, [nativeListener, data]);
      };
      iframe.src = src;
      iframe.width = Math.round(
        Math.min(Module.canvas.width * w, Module.canvas.width * (1 - x))
      );
      iframe.height = Math.round(
        Math.min(Module.canvas.height * h, Module.canvas.height * (1 - y))
      );
      iframe.scrolling = "no";
      var iframe_style = "";
      iframe_style += "display:none;";
      iframe_style += "position:absolute;";
      iframe_style += "border:none;";
      iframe_style += "z-index:100;";
      iframe_style += "left:" + Math.round(Module.canvas.width * x) + "px;";
      iframe_style += "top:" + Math.round(Module.canvas.height * y) + "px;";
      iframe.style = iframe_style;
      iframe.sandbox =
        "allow-forms allow-scripts allow-same-origin allow-popups allow-modals";
      Module.canvas.parentElement.appendChild(iframe);
      return id;
    };
  },
  755632: function ($0) {
    return window.open(UTF8ToString($0)) !== null;
  },
  764070: function () {
    return Browser.getNextWgetRequestHandle();
  },
  764119: function () {
    return Module["core.gzipPostEnabled"] || 0;
  },
  764171: function () {
    return Module["core.gzipPostThresholdBytes"] || 64 * 1024;
  },
  764300: function () {
    if (ENVIRONMENT_IS_NODE) {
      if (typeof global.XMLHttpRequest == "undefined") {
        global.XMLHttpRequest = require("xhr2");
      }
      if (typeof global.Browser == "undefined") {
        global.Browser = {};
        global.Browser.wgetRequests = {};
        global.Browser.nextWgetRequestHandle = 0;
        global.Browser.getNextWgetRequestHandle = function () {
          var handle = Browser.nextWgetRequestHandle;
          Browser.nextWgetRequestHandle++;
          return handle;
        };
      }
    }
    Browser.pendingXhrEvents = [];
  },
  764750: function () {
    Browser.pendingXhrEvents = [];
    for (var handle in Browser.wgetRequests) {
      if (Browser.wgetRequests.hasOwnProperty(handle)) {
        Browser.wgetRequests[handle].abort();
      }
    }
  },
  764921: function (
    $0,
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12,
    $13,
    $14
  ) {
    var handle = $0;
    var url = UTF8ToString($1);
    var requesttype = UTF8ToString($2);
    var contenttype = UTF8ToString($3);
    var dataPointer = $4;
    var dataLength = $5;
    var compressed = $6;
    var timeOutMiliSeconds = $7;
    var filename = UTF8ToString($8);
    var sender = $9;
    var onload = $10;
    var onerror = $11;
    var onprogress = $12;
    var ontimeout = $13;
    var onloadstart = $14;
    var data = null;
    if (compressed) {
      data = HEAP8.subarray(dataPointer, dataPointer + dataLength);
    } else {
      data = UTF8ToString(dataPointer, dataLength);
    }
    var protocol = /^(https?:)/.exec(url.toLowerCase());
    protocol = protocol ? protocol[1] : null;
    if (
      typeof document != "undefined" &&
      document.location &&
      document.location.protocol != protocol
    ) {
      url = url.replace(/^https?:/, document.location.protocol);
      if ("https:" == document.location.protocol) {
        url = url.replace(new RegExp(":[0-9]+/"), ":443/");
      } else {
        url = url.replace(new RegExp(":[0-9]+/"), ":80/");
      }
    }
    var http = new XMLHttpRequest();
    http.open(requesttype, url, true);
    http.responseType = "arraybuffer";
    http.timeout = timeOutMiliSeconds;
    function http_onload(e) {
      if (
        http.status == 200 ||
        http.status == 304 ||
        http.status == 206 ||
        url.substr(0, 4).toLowerCase() != "http"
      ) {
        var byteArray = new Uint8Array(http.response);
        if (filename) {
          var stream = FS.open(filename, "w");
          assert(stream, "[Error] Unable to create file: " + filename);
          FS.write(stream, byteArray, 0, byteArray.length, 0);
          FS.close(stream);
        }
        if (onload) {
          var httpHeaders = http.getAllResponseHeaders();
          httpHeadersPtr = allocate(
            intArrayFromString(httpHeaders),
            "i8",
            ALLOC_STACK
          );
          var stack = (Module.stackSave || Runtime.stackSave)();
          if (filename) {
            dynCall("viiiii", onload, [
              handle,
              sender,
              allocate(intArrayFromString(filename), "i8", ALLOC_STACK),
              0,
              httpHeadersPtr,
            ]);
          } else {
            var buffer = _malloc(byteArray.length);
            HEAPU8.set(byteArray, buffer);
            dynCall("viiiii", onload, [
              handle,
              sender,
              buffer,
              byteArray.length,
              httpHeadersPtr,
            ]);
            _free(buffer);
          }
          (Module.stackRestore || Runtime.stackRestore)(stack);
        }
      } else {
        if (onerror) {
          dynCall("viiii", onerror, [
            handle,
            sender,
            http.status,
            http.statusText,
          ]);
        }
      }
      delete Browser.wgetRequests[handle];
    }
    function http_onerror(e) {
      if (onerror) {
        dynCall("viiii", onerror, [
          handle,
          sender,
          http.status,
          http.statusText,
        ]);
      }
      delete Browser.wgetRequests[handle];
    }
    function http_onprogress(e) {
      if (onprogress)
        dynCall("viiii", onprogress, [
          handle,
          sender,
          e.loaded,
          e.lengthComputable || e.lengthComputable === undefined ? e.total : 0,
        ]);
    }
    function http_onabort(e) {
      delete Browser.wgetRequests[handle];
    }
    function http_timeout() {
      if (ontimeout) dynCall("vii", ontimeout, [handle, sender]);
      delete Browser.wgetRequests[handle];
    }
    function http_onloadstart() {
      if (onloadstart) dynCall("vii", onloadstart, [handle, sender]);
    }
    function make_deffered_callback(callback) {
      return function () {
        Browser.pendingXhrEvents.push({ f: callback, a: arguments, t: this });
      };
    }
    http.onload = make_deffered_callback(http_onload);
    http.onerror = make_deffered_callback(http_onerror);
    http.onprogress = make_deffered_callback(http_onprogress);
    http.onabort = make_deffered_callback(http_onabort);
    http.ontimeout = make_deffered_callback(http_timeout);
    http.onloadstart = make_deffered_callback(http_onloadstart);
    try {
      if (http.channel instanceof Ci.nsIHttpChannel) {
        http.channel.redirectionLimit = 0;
      }
    } catch (ex) {}
    if (requesttype == "POST") {
      if (compressed) {
        http.setRequestHeader("Content-Encoding", "gzip");
      }
      http.setRequestHeader("Content-Type", contenttype || "application/json");
      http.send(data);
    } else {
      http.send(null);
    }
    Browser.wgetRequests[handle] = http;
  },
  768569: function () {
    Browser.pendingXhrEvents.forEach(function (event) {
      try {
        event.f.apply(event.t, event.a);
      } catch (err) {
        Module.printWarn("XRH wasn't handled correctly due an error: " + err);
      }
    });
    Browser.pendingXhrEvents = [];
  },
  812940: function () {
    if (Module.KingEventSourceInstance) {
      eventSource = Module.KingEventSourceInstance;
      eventSource.onopen = function (e) {};
      eventSource.onerror = function (e) {};
      eventSource.onmessage = function (e) {};
      eventSource.close();
    }
  },
  813166: function ($0, $1, $2, $3) {
    var onMessageCallback = $1;
    var onReadyStateChangedCallback = $2;
    var instance = $3;
    if (typeof EventSource == "undefined") {
      var readyState = 2;
      dynCall("vii", onReadyStateChangedCallback, [instance, readyState]);
    } else {
      var u = UTF8ToString($0);
      var eventSource;
      if (Module.KingEventSourceInstance) {
        eventSource = Module.KingEventSourceInstance;
        eventSource.onopen = function (e) {};
        eventSource.onerror = function (e) {};
        eventSource.close();
      } else {
        Module.KingEventSourceInstance = new EventSource(u);
        eventSource = Module.KingEventSourceInstance;
      }
      eventSource.onmessage = function (e) {
        var event;
        if (e.event === undefined) {
          event = " ";
        } else {
          event = allocate(intArrayFromString(e.event), "i8", ALLOC_STACK);
        }
        var data = allocate(intArrayFromString(e.data), "i8", ALLOC_STACK);
        dynCall("viii", onMessageCallback, [instance, event, data]);
      };
      eventSource.onopen = function (e) {
        dynCall("vii", onReadyStateChangedCallback, [
          instance,
          Module.KingEventSourceInstance.readyState,
        ]);
      };
      eventSource.onerror = function (e) {
        dynCall("vii", onReadyStateChangedCallback, [
          instance,
          Module.KingEventSourceInstance.readyState,
        ]);
      };
    }
  },
  814311: function () {
    if (Module.KingEventSourceInstance) {
      Module.KingEventSourceInstance.close();
    }
  },
  992459: function ($0) {
    var key = UTF8ToString($0);
    var value = Module[key] || "";
    if (!value) {
      Module.printErr("Undefined '" + key + "' in Module");
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  992655: function () {
    var isIndexDBValid = false;
    try {
      isIndexDBValid = typeof indexedDB !== "undefined";
    } catch (error) {
      isIndexDBValid = false;
    }
    return isIndexDBValid;
  },
  994075: function ($0) {
    var apiName = UTF8ToString($0);
    var url = "";
    if (apiName === "server") {
      url = emscriptenvars.apiUrl || "";
    } else if (apiName === "servicelayer") {
      url = Module["ksdk.slayerApiUrl"] || "";
    } else {
      Module.printErr("Unknown API '" + apiName + "'.");
    }
    return allocate(intArrayFromString(url), "i8", ALLOC_STACK);
  },
  1006312: function ($0) {
    clearTimeout($0);
  },
  1006552: function ($0, $1, $2, $3) {
    var self = $0;
    var onTimeoutCpp = $1;
    var timerId = $2;
    var timeoutMs = $3;
    var onTimeout = function () {
      dynCall("vii", onTimeoutCpp, [self, timerId]);
    };
    return setTimeout(onTimeout, timeoutMs);
  },
  1010527: function () {
    var os = "undefined";
    if (typeof navigator !== "undefined") {
      os = navigator.oscpu || navigator.platform;
    }
    return allocate(intArrayFromString(os), "i8", ALLOC_STACK);
  },
  1010708: function () {
    var network = Module["core.network"] || "unknown";
    var device =
      "Emscripten-" +
      network.charAt(0).toUpperCase() +
      network.substr(1).toLowerCase();
    return allocate(intArrayFromString(device), "i8", ALLOC_STACK);
  },
  1010931: function () {
    var model = "unknown_web_device";
    return allocate(intArrayFromString(model), "i8", ALLOC_STACK);
  },
  1011036: function () {
    var country = "us";
    if (Module.hasOwnProperty("core.locale")) {
      var locales = Module["core.locale"].split("_");
      if (locales > 1) {
        country = locales[1].toLowerCase();
      }
    } else {
      if (typeof navigator !== "undefined") {
        var browserLanguage = navigator.language || navigator.browserLanguage;
        var countryIndex = browserLanguage
          ? Math.max(browserLanguage.indexOf("-"), browserLanguage.indexOf("_"))
          : -1;
        country =
          countryIndex == -1
            ? country
            : browserLanguage.substr(countryIndex + 1, 2).toLowerCase();
      }
    }
    return allocate(intArrayFromString(country), "i8", ALLOC_STACK);
  },
  1011612: function () {
    var language = "en";
    if (Module.hasOwnProperty("core.locale")) {
      var locales = Module["core.locale"].split("_");
      if (locales.length) {
        language = locales[0].toLowerCase();
      }
    } else {
      if (typeof navigator !== "undefined") {
        var browserLanguage =
          navigator.language || navigator.browserLanguage || "en";
        language = browserLanguage.substr(0, 2).toLowerCase();
      }
    }
    return allocate(intArrayFromString(language), "i8", ALLOC_STACK);
  },
  1012053: function () {
    function expand(value) {
      return (value < 10 ? "0" : "") + value;
    }
    var o = new Date().getTimezoneOffset();
    var x = Math.abs(o);
    var h = expand(x / 60);
    var m = expand(x % 60);
    var t = "GMT" + (o < 0 ? "+" : "-") + h + ":" + m;
    return allocate(intArrayFromString(t), "i8", ALLOC_STACK);
  },
  1012350: function () {
    var tz = "";
    if (typeof Intl !== "undefined") {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    }
    return allocate(intArrayFromString(tz), "i8", ALLOC_STACK);
  },
  1012527: function () {
    var offset = (new Date().getTimezoneOffset() * 60).toString();
    return allocate(intArrayFromString(offset), "i8", ALLOC_STACK);
  },
  1012660: function () {
    return typeof navigator !== "undefined" ? navigator.onLine : false;
  },
  1012734: function () {
    var connection = null;
    if (typeof navigator !== "undefined") {
      connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
    }
    if (connection) {
      var type = connection.type;
      if (type == "cellular") {
        return 1;
      } else if (type == "wifi") {
        return 2;
      } else if (type == "ethernet") {
        return 3;
      }
    }
    return 4;
  },
  1015317: function () {
    Browser.pendingXhrEvents = [];
    if (ENVIRONMENT_IS_NODE) {
      if (typeof global.XMLHttpRequest == "undefined") {
        global.XMLHttpRequest = require("xhr2");
      }
    }
  },
  1015475: function () {
    Browser.pendingXhrEvents = [];
  },
  1015897: function ($0) {
    var http = Browser.wgetRequests[$0];
    if (http) {
      if (http.payload_size > 0) {
        http.send(http.payload);
      } else {
        http.send();
      }
    }
  },
  1016696: function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) {
    var handle = $0;
    var url = UTF8ToString($1);
    var method = $2;
    var data = $3;
    var data_size = $4;
    var headers = UTF8ToString($5);
    var timeout = $6;
    var onresponse = $7;
    var ondata = $8;
    var onerror = $9;
    var result_code_error = $10;
    var result_code_timeout = $11;
    var result_code_cancelled = $12;
    var protocol = /^(https?:)/.exec(url.toLowerCase());
    protocol = protocol ? protocol[1] : null;
    var http = new XMLHttpRequest();
    http.responseType = "arraybuffer";
    switch (method) {
      case 0:
        http.open("HEAD", url, true);
        break;
      case 1:
        http.open("GET", url, true);
        break;
      case 2:
        http.open("POST", url, true);
        break;
    }
    if (data_size > 0) {
      http.payload = new Uint8Array(HEAP8.buffer, data, data_size);
      http.payload_size = data_size;
    } else {
      http.payload_size = 0;
    }
    if (timeout != 0) {
      http.timeout = timeout;
    }
    var lines = headers.split("\n");
    for (var i = 0; i < lines.length; ++i) {
      var line = lines[i];
      var indx = line.indexOf(":");
      if (indx != -1) {
        var key = line.substr(0, indx).trim();
        var value = line.substr(indx + 1).trim();
        http.setRequestHeader(key, value);
      }
    }
    var safeInt = function (value) {
      if (Number.isNaN(value)) return 0;
      return value;
    };
    http.onreadystatechange = function () {
      if (
        http.readyState == 2 &&
        (http.status == 200 ||
          http.status == 304 ||
          http.status == 206 ||
          url.substr(0, 4).toLowerCase() != "http")
      ) {
        if (onresponse) {
          dynCall("viiiii", onresponse, [
            handle,
            0,
            http.status,
            allocate(
              intArrayFromString(http.getAllResponseHeaders()),
              "i8",
              ALLOC_STACK
            ),
            safeInt(parseInt(http.getResponseHeader("Content-Length"))),
          ]);
        }
      }
    };
    http.onload = function (e) {
      if (
        http.status == 200 ||
        http.status == 304 ||
        http.status == 206 ||
        url.substr(0, 4).toLowerCase() != "http"
      ) {
        if (ondata) {
          var blob = new Uint8Array(http.response);
          var buffer = _malloc(blob.length);
          HEAPU8.set(blob, buffer);
          dynCall("viii", ondata, [handle, buffer, blob.length]);
          _free(buffer);
        }
        if (onresponse) {
          dynCall("viiiii", onresponse, [
            handle,
            1,
            http.status,
            allocate(
              intArrayFromString(http.getAllResponseHeaders()),
              "i8",
              ALLOC_STACK
            ),
            safeInt(parseInt(http.getResponseHeader("Content-Length"))),
          ]);
        }
      } else {
        if (onerror)
          dynCall("viii", onerror, [handle, http.status, result_code_error]);
      }
      delete Browser.wgetRequests[handle];
    };
    http.onerror = function (e) {
      if (onerror)
        dynCall("viii", onerror, [handle, http.status, result_code_error]);
      delete Browser.wgetRequests[handle];
    };
    http.onabort = function (e) {
      if (onerror)
        dynCall("viii", onerror, [handle, http.status, result_code_cancelled]);
      delete Browser.wgetRequests[handle];
    };
    http.ontimeout = function (e) {
      if (onerror)
        dynCall("viii", onerror, [handle, http.status, result_code_timeout]);
      delete Browser.wgetRequests[handle];
    };
    try {
      if (http.channel instanceof Ci.nsIHttpChannel) {
        http.channel.redirectionLimit = 0;
      }
    } catch (ex) {}
    Browser.wgetRequests[handle] = http;
  },
  1021972: function ($0) {
    var http = Browser.wgetRequests[$0];
    if (http) http.abort();
  },
  1036812: function () {
    return Module.BaseSdkWebView.create();
  },
  1036855: function ($0) {
    Module.BaseSdkWebView.close($0);
  },
  1036892: function ($0, $1) {
    Module.BaseSdkWebView.setMessageListener($0, $1);
  },
  1036949: function ($0, $1) {
    Module.BaseSdkWebView.setLoadingListener($0, $1);
  },
  1037006: function ($0) {
    Module.BaseSdkWebView.show($0);
  },
  1037042: function ($0) {
    Module.BaseSdkWebView.hide($0);
  },
  1037078: function ($0) {
    return Module.BaseSdkWebView.isVisible($0);
  },
  1037126: function ($0) {
    Module.BaseSdkWebView.clearCache($0);
  },
  1037176: function ($0, $1) {
    var id = $0;
    var url = UTF8ToString($1);
    Module.BaseSdkWebView.open(id, url, 0, 0, 1, 1);
  },
  1037273: function ($0) {
    Module.BaseSdkWebView.unloadPage($0);
  },
  1037315: function () {
    return Module.BaseSdkWebView.getPageState();
  },
  1037364: function ($0, $1, $2, $3) {
    var params = [];
    params.push(UTF8ToString($1));
    params.push(UTF8ToString($2));
    params.push($3);
    var code =
      "window._messageBus.onMessageReceived.apply(null, " +
      JSON.stringify(params) +
      ");";
    Module.BaseSdkWebView.executeJavaScript($0, code);
  },
  1037724: function () {
    return ENVIRONMENT_IS_NODE ? 0 : 1;
  },
  1037919: function ($0, $1, $2, $3, $4) {
    var params = [];
    params.push($1);
    params.push(UTF8ToString($2));
    params.push($3);
    params.push(UTF8ToString($4));
    var code =
      "window._messageBus.onMessageResponse.apply(null, " +
      JSON.stringify(params) +
      ");";
    Module.BaseSdkWebView.executeJavaScript($0, code);
  },
  1038292: function ($0, $1, $2) {
    if (ENVIRONMENT_IS_NODE) {
      return;
    }
    var WebView = {};
    Module.BaseSdkWebView = WebView;
    WebView.STATE_BLANK = 0;
    WebView.STATE_LOADING = 1;
    WebView.STATE_LOADED = 2;
    WebView.list = [];
    WebView.type = "BaseSDK";
    WebView.nativeForwardMessageListener = $0;
    WebView.nativeForwardLoadingListener = $1;
    WebView.nativeForwardPostMessageResponse = $2;
    window.addEventListener(
      "message",
      function bsdk_message_handler(event) {
        var iframeId = -1;
        WebView.list.some(function (element, index) {
          var match = element && element.contentWindow === event.source;
          if (match) {
            iframeId = index;
          }
          return match;
        });
        if (event.data && iframeId >= 0) {
          var data = null;
          try {
            data = JSON.parse(event.data);
          } catch (e) {
            Module.printErr("Unexpected message: " + event.data);
            return;
          }
          if (typeof data !== "object") {
            Module.printErr("Unexpected message type: " + event.data);
            return;
          }
          var type = null;
          if ("name" in data && "payload" in data && "id" in data) {
            type = "postMessage";
          } else if ("result" in data && "payload" in data && "id" in data) {
            type = "sendMessageResponse";
          } else {
            Module.printErr("Unexpected message format: " + event.data);
          }
          switch (type) {
            case "postMessage": {
              var nativeMessageListener =
                WebView._getById(iframeId)._nativeMessageListener;
              if (nativeMessageListener) {
                var name = allocate(
                  intArrayFromString(data.name),
                  "i8",
                  ALLOC_STACK
                );
                var payload = data.payload
                  ? allocate(
                      intArrayFromString(data.payload),
                      "i8",
                      ALLOC_STACK
                    )
                  : 0;
                var callbackId = data.id;
                dynCall("viiiii", WebView.nativeForwardMessageListener, [
                  nativeMessageListener,
                  name,
                  payload,
                  iframeId,
                  callbackId,
                ]);
              }
              break;
            }
            case "sendMessageResponse": {
              var resultValue = data.result;
              var payload = data.payload
                ? allocate(intArrayFromString(data.payload), "i8", ALLOC_STACK)
                : 0;
              var nativePointer = data.id;
              dynCall("viii", WebView.nativeForwardPostMessageResponse, [
                nativePointer,
                resultValue,
                payload,
              ]);
              break;
            }
            default:
              break;
          }
        }
      },
      false
    );
    WebView._getById = function bsdk_webview_get_by_id(id) {
      var iframe = WebView.list[id];
      if (!iframe) {
        Module.printErr("WebView ID: " + id + " is unavailable");
      }
      return iframe;
    };
    WebView.setLoadingListener = function bsdk_setLoadingListener(
      id,
      nativePtr
    ) {
      WebView._getById(id)._nativeLoadingListener = nativePtr;
    };
    WebView.setMessageListener = function bsdk_setMessageListener(
      id,
      nativePtr
    ) {
      WebView._getById(id)._nativeMessageListener = nativePtr;
    };
    WebView.show = function bsdk_webview_show(id) {
      WebView._getById(id).style.display = "";
    };
    WebView.hide = function bsdk_webview_hide(id) {
      WebView._getById(id).style.display = "none";
    };
    WebView.getPageState = function bsdk_webview_getPageState(id) {
      var iframe = WebView._getById(id);
      return iframe._state;
    };
    WebView.close = function bsdk_webview_close(id) {
      WebView.unloadPage(id);
      var iframe = WebView._getById(id);
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
      WebView.list[id] = null;
    };
    WebView.goBack = function bsdk_webview_goBack(id) {
      WebView._getById(id).contentWindow.history.back();
    };
    WebView.isVisible = function bsdk_webview_isVisible(id) {
      return WebView._getById(id).style.display !== "none";
    };
    WebView.unloadPage = function bsdk_webview_unloadPage(id) {
      var iframe = WebView._getById(id);
      iframe._state = WebView.STATE_BLANK;
      iframe.src = "about:blank";
    };
    WebView.clearCache = function bsdk_webview_clearCache(id) {};
    WebView.canGoBack = function bsdk_webview_canGoBack(id) {
      return WebView._getById(id).contentWindow.history.length > 0;
    };
    WebView.executeJavaScript = function bsdk_webview_executeJavaScript(
      id,
      script
    ) {
      WebView._getById(id).contentWindow.postMessage(
        { type: "sudo", exec: script },
        "*"
      );
    };
    WebView.reposition = function bsdk_webview_reposition(id, x, y, w, h) {
      var iframe = WebView._getById(id);
      iframe.width = Math.round(
        Math.min(Module.canvas.width * w, Module.canvas.width * (1 - x))
      );
      iframe.height = Math.round(
        Math.min(Module.canvas.height * h, Module.canvas.height * (1 - y))
      );
      iframe.style.left = Math.round(Module.canvas.width * x) + "px;";
      iframe.style.top = Math.round(Module.canvas.height * y) + "px;";
    };
    WebView.create = function bsdk_webview_create() {
      var iframe = document.createElement("iframe");
      var id = WebView.list.length;
      WebView.list.push(iframe);
      return id;
    };
    WebView.open = function bsdk_webview_open(id, url, x, y, w, h) {
      function file_exists(path) {
        var exists = false;
        path = path.split("?")[0];
        try {
          var stat = FS.stat(path);
          exists = FS.isFile(stat.mode);
        } catch (e) {
          exists = false;
        }
        return exists;
      }
      function load_file(base, path) {
        url = base + path.split("?")[0];
        var result = null;
        try {
          result = FS.readFile(url);
        } catch (e) {
          Module.print("[WARNING] Trying to embed non existing file: " + url);
        }
        return result;
      }
      function flattening(base_url, file_path) {
        var content_filename = file_path.split("/").pop();
        var content_raw = load_file(base_url, file_path);
        if (!content_raw) {
          return "";
        }
        var content = UTF8ArrayToString(content_raw, 0);
        var parts = [];
        var lut = {};
        lut.css = { type: "text/css" };
        lut.css.handler = function (file_path) {
          return flattening(base_url, file_path);
        };
        lut.js = { type: "text/javascript" };
        lut.png = { type: "image/png" };
        lut.gif = { type: "image/gif" };
        lut.jpg = { type: "image/jpg" };
        lut.jpeg = { type: "image/jpeg" };
        lut.webp = { type: "image/webp" };
        var regex_string =
          '(?:src="|href="|url\\(")([^"]*?\\.(' +
          Object.keys(lut).join("|") +
          '))(?=")';
        var regex = new RegExp(regex_string, "gm");
        var m = null;
        while ((m = regex.exec(content)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          var def = lut[m[2]];
          var filename = m[1];
          if (
            filename.startsWith("http://") ||
            filename.startsWith("https://") ||
            filename.startsWith("://")
          ) {
            continue;
          }
          var file_content = load_file(base_url, filename);
          if (!file_content) {
            continue;
          }
          if (def.handler) file_content = def.handler(filename);
          var file_blob = new Blob([file_content], { type: def.type });
          var file_uri = URL.createObjectURL(file_blob);
          var index = content.indexOf(m[1], m.index);
          parts.push({
            start: index,
            end: index + filename.length,
            old: filename,
            new: file_uri,
          });
        }
        parts.sort(function (a, b) {
          return b.start - a.start;
        });
        parts.forEach(function (v) {
          content = content.slice(0, v.start) + v.new + content.slice(v.end);
        });
        return content;
      }
      var src = url;
      if (!url.startsWith("http:") && !url.startsWith("https:")) {
        if (url.startsWith("file://")) {
          url = url.replace("file://", "/");
        }
        if (!file_exists(url) && !url.startsWith("/res_output")) {
          var correctedUrl = "/res_output/" + url;
          Module.print(
            "[WARNING] Path '" +
              url +
              "' isn't rooted in res_output, assuming: " +
              correctedUrl
          );
          url = correctedUrl;
        }
        if (!file_exists(url) && url.startsWith("/res_output/emscripten")) {
          var correctedUrl = url.replace(
            "/res_output/emscripten/",
            "/res_output/"
          );
          Module.print(
            "[WARNING] Path '" +
              url +
              "' is rooted in /res_output/emscripten, assuming: " +
              correctedUrl
          );
          url = correctedUrl;
        }
        var base_url = url.split("/");
        var index_path = base_url.pop();
        base_url = base_url.join("/") + "/";
        var index_content = flattening(base_url, index_path);
        var raw_init = function () {
          window._messageBus = window._messageBus || {};
          if (window._messageBus.type === "html5") {
            console.debug("Message Bus already created");
            return;
          }
          window._messageBus.type = "html5";
          window._messageBus = window._messageBus || {};
          window._messageBus.postMessage =
            function bsdk_webview_bus_postMessage(
              msgName,
              msgPayload,
              responseCallbackId
            ) {
              window.parent.postMessage(
                JSON.stringify({
                  name: msgName,
                  payload: msgPayload,
                  id: responseCallbackId,
                })
              );
            };
          window._messageBus.sendMessageResponse =
            function bsdk_webview_bus_sendMessageResponse(
              responseCallbackId,
              resultValue,
              respPayload
            ) {
              window.parent.postMessage(
                JSON.stringify({
                  result: resultValue,
                  payload: respPayload,
                  id: responseCallbackId,
                })
              );
            };
          window.addEventListener(
            "message",
            function bsdk_webview_bus_executeJavaScript(event) {
              if (event.data && event.data.type === "sudo") {
                eval(event.data.exec);
              }
            },
            false
          );
        };
        index_content +=
          "\n<script type='text/javascript'> /* Injected code: EmscriptenWebView.cpp */";
        index_content += "\nvar init = " + raw_init.toString().trim() + ";";
        index_content += "\ninit();";
        index_content += "\n</script>";
        var index_blob = new Blob([index_content], { type: "text/html" });
        src = URL.createObjectURL(index_blob);
        if (index_path.indexOf("?") > 0) {
          src += "#" + index_path.split("?").slice(-1);
        }
      }
      var iframe = WebView._getById(id);
      iframe._state = WebView.STATE_LOADING;
      iframe.onload = function bsdk_iframe_onload() {
        iframe._state = WebView.STATE_LOADED;
        var nativeListener = iframe._nativeLoadingListener;
        if (nativeListener) {
          dynCall("vii", WebView.nativeForwardLoadingListener, [
            nativeListener,
            0,
          ]);
        }
      };
      iframe.onerror = function bsdk_iframe_error(e) {
        var nativeListener = iframe._nativeLoadingListener;
        if (nativeListener) {
          var data = allocate(intArrayFromString(e.message), "i8", ALLOC_STACK);
          dynCall("vii", WebView.nativeForwardLoadingListener, [
            nativeListener,
            data,
          ]);
        }
      };
      iframe.src = src;
      iframe.width = Math.round(
        Math.min(Module.canvas.width * w, Module.canvas.width * (1 - x))
      );
      iframe.height = Math.round(
        Math.min(Module.canvas.height * h, Module.canvas.height * (1 - y))
      );
      iframe.scrolling = "no";
      var iframe_style = "";
      iframe_style += "display:none;";
      iframe_style += "position:absolute;";
      iframe_style += "border:none;";
      iframe_style += "z-index:100;";
      iframe_style += "left:" + Math.round(Module.canvas.width * x) + "px;";
      iframe_style += "top:" + Math.round(Module.canvas.height * y) + "px;";
      iframe.style = iframe_style;
      iframe.sandbox =
        "allow-forms allow-scripts allow-same-origin allow-popups allow-modals";
      Module.canvas.parentElement.appendChild(iframe);
      return id;
    };
  },
  1054836: function ($0) {
    return window.open(UTF8ToString($0)) !== null;
  },
  1797176: function () {
    var value = Module["ksdk.sessionKey"] || "";
    if (!value) {
      if (!ENVIRONMENT_IS_NODE) {
        Module.printErr(
          "IdentitySessionGrabber: Undefined 'ksdk.sessionKey' in Module"
        );
      }
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  1797424: function () {
    var value = Module["ksdk.userId"] || "";
    if (!value) {
      if (!ENVIRONMENT_IS_NODE) {
        Module.printErr("IdentityWeGrabber: Undefined 'ksdk.userId' in Module");
      }
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  1797660: function () {
    var value = Module["core.network"] || "";
    value = value.toLowerCase();
    if (!value) {
      if (!ENVIRONMENT_IS_NODE) {
        Module.printErr(
          "IdentitySessionGrabber: Undefined 'core.network' in Module"
        );
      }
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  1797931: function () {
    var accessToken = 0;
    var response = null;
    try {
      response = FB.getAuthResponse();
    } catch (e) {}
    accessToken = response && response.accessToken ? response.accessToken : "";
    var value = accessToken || Module["ksdk.facebook.accessToken"] || "";
    if (!value) {
      if (!ENVIRONMENT_IS_NODE) {
        Module.printErr(
          "IdentitySessionGrabber: Undefined 'ksdk.facebook.accessToken' in Module, and can't be detected"
        );
      }
      return 0;
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  2212404: function ($0, $1, $2, $3, $4, $5, $6) {
    try {
      var dialogId = $2;
      var succeedCallback = $3;
      var canceledCallback = $4;
      var failedCallback = $5;
      var that = $6;
      var params = JSON.parse(UTF8ToString($1));
      params.method = UTF8ToString($0);
      FB.ui(params, function (response) {
        try {
          if (response && !response.error_code) {
            var jsonData = JSON.stringify(response);
            var jsonResponse = allocate(
              intArrayFromString(jsonData),
              "i8",
              ALLOC_STACK
            );
            dynCall("viii", succeedCallback, [dialogId, jsonResponse, that]);
          } else if (response && response.error_code == 4201) {
            dynCall("vii", canceledCallback, [dialogId, that]);
          } else {
            var fbErrorMessage =
              "Facebook show dialog failed " +
              (response ? JSON.stringify(response) : "no response");
            var errorMessage = allocate(
              intArrayFromString(fbErrorMessage),
              "i8",
              ALLOC_STACK
            );
            dynCall("viii", failedCallback, [dialogId, errorMessage, that]);
          }
        } catch (exception) {
          var errorMessage = allocate(
            intArrayFromString("Facebook show dialog exception " + exception),
            "i8",
            ALLOC_STACK
          );
          dynCall("viii", failedCallback, [dialogId, errorMessage, that]);
        }
      });
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString("Facebook show dialog exception " + exception),
        "i8",
        ALLOC_STACK
      );
      dynCall("viii", failedCallback, [dialogId, errorMessage, that]);
    }
  },
  2213906: function ($0, $1, $2) {
    try {
      var succedCallback = $0;
      var failedCallback = $1;
      var that = $2;
      FB.api("/me/permissions", function (response) {
        var error = response && response.error ? response.error.message : 0;
        if (error == 0 && response.data) {
          var permissions = [];
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].permission && response.data[i].status) {
              if (response.data[i].status === "granted") {
                permissions.push(response.data[i].permission);
              } else if (response.data[i].status === "declined") {
              }
            }
          }
          var permissionsData = JSON.stringify(permissions);
          var jsonResponse = allocate(
            intArrayFromString(permissionsData),
            "i8",
            ALLOC_STACK
          );
          dynCall("vii", succedCallback, [that, jsonResponse]);
        } else {
          var errorMessage = allocate(
            intArrayFromString("Facebook get permissions failed " + error),
            "i8",
            ALLOC_STACK
          );
          dynCall("vii", failedCallback, [that, errorMessage]);
        }
      });
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString("Facebook get permissions exception " + exception),
        "i8",
        ALLOC_STACK
      );
      dynCall("vii", failedCallback, [that, errorMessage]);
    }
  },
  2214991: function ($0, $1, $2, $3, $4) {
    var permissionsRequested = UTF8ToString($0);
    var readPermissionsRequest = $1;
    var succedCallback = $2;
    var failedCallback = $3;
    var that = $4;
    try {
      FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          FB.api("/me/permissions", function (response) {
            if (response.error) {
              console.log(response.error.message);
              dynCall("vii", failedCallback, [that, response.error.message]);
            } else {
              var currentPermissions = response.data
                .filter(function (obj) {
                  return obj.status === "granted";
                })
                .map(function (p) {
                  return p.permission;
                });
              var desiredPermissions = permissionsRequested.split(",");
              newPermissions = desiredPermissions.filter(function (p) {
                return currentPermissions.indexOf(p) < 0;
              });
              console.log("Requesting new permissions: " + newPermissions);
              if (newPermissions.length > 0) {
                FB.login(
                  function (response) {
                    var error =
                      response && response.error ? response.error.message : 0;
                    if (
                      error == 0 &&
                      response.authResponse &&
                      response.authResponse.grantedScopes &&
                      response.authResponse.accessToken
                    ) {
                      var grantedScopes = JSON.stringify(
                        response.authResponse.grantedScopes
                      );
                      grantedScopes = grantedScopes.slice(1, -1);
                      var grantedPermissionsList = grantedScopes.split(",");
                      var permissionsRequestedList =
                        permissionsRequested.split(",");
                      var newPermissionsGranted = [];
                      for (var i = 0; i < grantedPermissionsList.length; i++) {
                        if (
                          permissionsRequestedList.indexOf(
                            grantedPermissionsList[i]
                          ) > -1
                        ) {
                          newPermissionsGranted.push(grantedPermissionsList[i]);
                        }
                      }
                      var newPermissionsGrantedData = JSON.stringify(
                        newPermissionsGranted
                      );
                      var jsonResponse = allocate(
                        intArrayFromString(newPermissionsGrantedData),
                        "i8",
                        ALLOC_STACK
                      );
                      var accessToken = JSON.stringify(
                        response.authResponse.accessToken
                      );
                      accessToken = accessToken.slice(1, -1);
                      var accessTokenResponse = allocate(
                        intArrayFromString(accessToken),
                        "i8",
                        ALLOC_STACK
                      );
                      dynCall("viiii", succedCallback, [
                        that,
                        readPermissionsRequest,
                        jsonResponse,
                        accessTokenResponse,
                      ]);
                    } else if (error != 0) {
                      var errorMessage = allocate(
                        intArrayFromString(error),
                        "i8",
                        ALLOC_STACK
                      );
                      dynCall("vii", failedCallback, [that, errorMessage]);
                    } else {
                      error =
                        "User cancelled login or did not fully authorize.";
                      var errorMessage = allocate(
                        intArrayFromString(error),
                        "i8",
                        ALLOC_STACK
                      );
                      dynCall("vii", failedCallback, [that, errorMessage]);
                    }
                  },
                  {
                    scope: newPermissions,
                    auth_type: "rerequest",
                    return_scopes: true,
                  }
                );
              }
            }
          });
        }
      });
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString(
          "Facebook request permissions exception " + exception
        ),
        "i8",
        ALLOC_STACK
      );
      dynCall("vii", failedCallback, [that, errorMessage]);
    }
  },
  2217920: function ($0, $1, $2, $3, $4, $5) {
    try {
      var requestId = $2;
      var succedCallback = $3;
      var failedCallback = $4;
      var listener = $5;
      var graphPath = UTF8ToString($1);
      var apiMethod = graphPath;
      var params = JSON.parse(UTF8ToString($0));
      if (Object.keys(params).length > 0) {
        apiMethod += "?";
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            apiMethod += key + "=" + encodeURIComponent(params[key]) + "&";
          }
        }
        if (apiMethod[apiMethod.length - 1] === "&") {
          apiMethod.slice(0, -1);
        }
      }
      FB.api(apiMethod, function (response) {
        if (response && !response.error) {
          var jsonData = JSON.stringify(response);
          var jsonResponse = allocate(
            intArrayFromString(jsonData),
            "i8",
            ALLOC_STACK
          );
          dynCall("viii", succedCallback, [listener, requestId, jsonResponse]);
        } else {
          var errorMessage = allocate(
            intArrayFromString(
              "Facebook request with graph failed " +
                (response ? JSON.stringify(response) : "no response")
            ),
            "i8",
            ALLOC_STACK
          );
          dynCall("viii", failedCallback, [listener, requestId, errorMessage]);
        }
      });
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString(
          "Facebook request with graph exception " + exception
        ),
        "i8",
        ALLOC_STACK
      );
      dynCall("viii", failedCallback, [listener, requestId, errorMessage]);
    }
  },
  2221632: function () {
    var accessToken = 0;
    var response = null;
    try {
      response = FB.getAuthResponse();
    } catch (e) {}
    accessToken = response && response.accessToken ? response.accessToken : "";
    var value = accessToken || Module["ksdk.facebook.accessToken"] || "";
    if (!value) {
      Module.printErr(
        "JavascriptGetAccessToken: Undefined 'ksdk.facebook.accessToken' in Module, and can't be detected"
      );
      return 0;
    }
    return allocate(intArrayFromString(value), "i8", ALLOC_STACK);
  },
  2222097: function ($0, $1, $2, $3) {
    try {
      var succeedCallback = $1;
      var failedCallback = $2;
      var sessionObject = $3;
      var errorMessage;
      var errorMessageStack;
      var permissionsString = UTF8ToString($0);
      FB.getLoginStatus(function (response) {
        if (response.status === "connected") {
          dynCall("vi", succeedCallback, [sessionObject]);
        } else {
          FB.login(
            function (response) {
              var errorMessage;
              var errorMessageStack;
              try {
                if (response && response.authResponse) {
                  dynCall("vi", succeedCallback, [sessionObject]);
                } else {
                  if (response) {
                    errorMessage = "Error response:" + JSON.stringify(response);
                  } else {
                    errorMessage =
                      "User cancelled login or did not fully authorize. No response.";
                  }
                }
              } catch (exception) {
                errorMessage = "FB.login: " + exception;
              }
              if (!!errorMessage) {
                errorMessageStack = allocate(
                  intArrayFromString(errorMessage),
                  "i8",
                  ALLOC_STACK
                );
                dynCall("vii", failedCallback, [
                  sessionObject,
                  errorMessageStack,
                ]);
                console.log("KingConnectionManager Javascript" + errorMessage);
              }
            },
            { scope: permissionsString }
          );
        }
      });
    } catch (exception) {
      errorMessage = "JavascriptDoLogIn:" + exception;
      errorMessageStack = allocate(
        intArrayFromString(errorMessage),
        "i8",
        ALLOC_STACK
      );
      dynCall("vii", failedCallback, [sessionObject, errorMessageStack]);
      console.log("KingConnectionManager Javascript" + errorMessage);
    }
  },
  2223384: function () {
    try {
      FB.logout(function (response) {});
    } catch (e) {}
  },
  2485940: function ($0) {
    return window.open(UTF8ToString($0)) !== null;
  },
  2521953: function ($0, $1, $2, $3, $4, $5) {
    try {
      var coreUserId = parseInt(Module["ksdk.userId"]) || 0;
      if (coreUserId != 0) {
        var kingTransactionId = UTF8ToString($0);
        var productId = $1;
        var successCallback = $2;
        var failureCallback = $3;
        var purchaseState = $4;
        var placement = UTF8ToString($5);
        var productOrder = {};
        productOrder.productId = productId;
        productOrder.receiverCoreUserId = parseInt(coreUserId);
        king.social.ksdkstoremanager.purchaseMercado3(
          productOrder,
          placement,
          kingTransactionId,
          function (result) {
            var jsonData = JSON.stringify(result);
            var jsonResponse = allocate(
              intArrayFromString(jsonData),
              "i8",
              ALLOC_STACK
            );
            dynCall("viiii", successCallback, [
              purchaseState,
              kingTransactionId,
              productId,
              jsonResponse,
            ]);
          },
          function (error) {
            var jsonData = JSON.stringify(error);
            var jsonResponse = allocate(
              intArrayFromString(jsonData),
              "i8",
              ALLOC_STACK
            );
            dynCall("viiii", failureCallback, [
              purchaseState,
              kingTransactionId,
              productId,
              jsonResponse,
            ]);
          }
        );
      } else {
        var error = {};
        error.code = -1;
        error.message = "Purchase error: cannot get coreUserId";
        var jsonData = JSON.stringify(error);
        var jsonResponse = allocate(
          intArrayFromString(jsonData),
          "i8",
          ALLOC_STACK
        );
        dynCall("viiii", failureCallback, [
          purchaseState,
          kingTransactionId,
          productId,
          jsonResponse,
        ]);
      }
    } catch (exception) {
      var error = {};
      error.code = -1;
      error.message = "Purchase exception: " + exception;
      var jsonData = JSON.stringify(error);
      var jsonResponse = allocate(
        intArrayFromString(jsonData),
        "i8",
        ALLOC_STACK
      );
      dynCall("viiii", failureCallback, [
        purchaseState,
        kingTransactionId,
        productId,
        jsonResponse,
      ]);
    }
  },
  2524338: function ($0, $1, $2, $3, $4, $5) {
    try {
      var purchaseString = JSON.parse(UTF8ToString($0));
      var kingTransactionId = UTF8ToString($1);
      var productId = $2;
      var successCallback = $3;
      var failureCallback = $4;
      var purchaseState = $5;
      var purchaseOutcomes = [];
      purchaseOutcomes.push(purchaseString);
      king.social.ksdkstoremanager.getCapabilities(
        function (capabilities) {
          if (capabilities.displayForOutcome) {
            king.social.ksdkstoremanager.confirmDisplayedToUser(
              purchaseOutcomes,
              function (result) {
                var jsonResponse = allocate(
                  intArrayFromString(result),
                  "i8",
                  ALLOC_STACK
                );
                dynCall("viiii", successCallback, [
                  purchaseState,
                  kingTransactionId,
                  productId,
                  jsonResponse,
                ]);
              },
              function (error) {
                var errorMessage = allocate(
                  intArrayFromString("Consumption error: " + error),
                  "i8",
                  ALLOC_STACK
                );
                dynCall("viiii", failureCallback, [
                  purchaseState,
                  kingTransactionId,
                  productId,
                  errorMessage,
                ]);
              }
            );
          } else {
            var jsonResponse = allocate(
              intArrayFromString("{}"),
              "i8",
              ALLOC_STACK
            );
            dynCall("viiii", successCallback, [
              purchaseState,
              kingTransactionId,
              productId,
              jsonResponse,
            ]);
          }
        },
        function (error) {
          var errorMessage = allocate(
            intArrayFromString(
              "Error getting capabilities for the store: " + error
            ),
            "i8",
            ALLOC_STACK
          );
          dynCall("viiii", failureCallback, [
            purchaseState,
            kingTransactionId,
            productId,
            errorMessage,
          ]);
        }
      );
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString("Consumption exception: " + exception),
        "i8",
        ALLOC_STACK
      );
      dynCall("viiii", failureCallback, [
        purchaseState,
        kingTransactionId,
        productId,
        errorMessage,
      ]);
    }
  },
  2553145: function ($0, $1, $2) {
    try {
      var successCallback = $0;
      var failureCallback = $1;
      var store = $2;
      king.social.ksdkstoremanager.getPurchaseOutcomesToDisplay2(
        "mercado3",
        function (result) {
          var jsonData = JSON.stringify(result);
          var jsonResponse = allocate(
            intArrayFromString(jsonData),
            "i8",
            ALLOC_STACK
          );
          dynCall("vii", successCallback, [store, jsonResponse]);
        },
        function (error) {
          var errorMessage = allocate(
            intArrayFromString("Request pending purchases error " + error),
            "i8",
            ALLOC_STACK
          );
          dynCall("vii", failureCallback, [store, errorMessage]);
        }
      );
    } catch (exception) {
      var errorMessage = allocate(
        intArrayFromString("Request pending purchases exception " + exception),
        "i8",
        ALLOC_STACK
      );
      dynCall("vii", failureCallback, [store, errorMessage]);
    }
  },
  2621086: function ($0, $1) {
    try {
      var text = UTF8ToString($0);
      var link = UTF8ToString($1);
      window.prompt(text, link);
    } catch (error) {
      console.log("Exception in OpenJavaScriptDeeplinkPopup: " + error);
    }
  },
  2677820: function ($0, $1) {
    if (typeof alert === "function") {
      alert(UTF8ToString($0) + "\n\n" + UTF8ToString($1));
    }
  },
  4570076: function ($0, $1, $2, $3) {
    var mouseX = $2;
    var mouseY = $3;
    var scaleFactor = parseFloat(Module.canvas.style.scale) || 1;
    mouseX /= scaleFactor;
    mouseY /= scaleFactor;
    var computedStyle = window.getComputedStyle(Module.canvas);
    mouseX -= parseInt(computedStyle.getPropertyValue("padding-left"));
    mouseY -= parseInt(computedStyle.getPropertyValue("padding-top"));
    setValue($0, mouseX | 0, "i32");
    setValue($1, mouseY | 0, "i32");
  },
  4570600: function ($0, $1, $2, $3) {
    var mouseX = $2;
    var mouseY = $3;
    var bounds = Module.canvas.getBoundingClientRect();
    mouseX -= bounds.x;
    mouseY -= bounds.y;
    var scaleFactor = parseFloat(Module.canvas.style.scale) || 1;
    mouseX /= scaleFactor;
    mouseY /= scaleFactor;
    var computedStyle = window.getComputedStyle(Module.canvas);
    mouseX -= parseInt(computedStyle.getPropertyValue("padding-left"));
    mouseY -= parseInt(computedStyle.getPropertyValue("padding-top"));
    setValue($0, mouseX | 0, "i32");
    setValue($1, mouseY | 0, "i32");
  },
  4573240: function ($0, $1) {
    var playSilence = $0;
    var cleanUp = $1;
    var events = new Array(
      "mousedown",
      "mouseup",
      "keydown",
      "keyup",
      "touchstart",
      "touchend"
    );
    var handler1 = function (event) {
      dynCall("v", cleanUp);
      events.forEach(function (type) {
        document.removeEventListener(type, handler1);
      });
    };
    var handler0 = function (event) {
      dynCall("v", playSilence);
      events.forEach(function (type) {
        document.removeEventListener(type, handler0);
        document.addEventListener(type, handler1);
      });
    };
    events.forEach(function (type) {
      document.addEventListener(type, handler0);
    });
  },
  4573789: function ($0, $1, $2) {
    var userData = $0;
    var useCapture = $1;
    var callback_change_focus = $2;
    canvas = document.getElementById("canvas");
    document.addEventListener(
      "mousedown",
      function (event) {
        dynCall("iii", callback_change_focus, [
          userData,
          event.target == canvas,
        ]);
      },
      useCapture
    );
  },
  4574061: function () {
    var extension = GLctx.getExtension("WEBGL_lose_context");
    if (extension) {
      extension.loseContext();
      setTimeout(function () {
        extension.restoreContext();
      }, 1);
    } else {
      console.warn("Missing required WebGL extension: WEBGL_lose_context");
    }
  },
  4574314: function ($0, $1) {
    var loop = $0;
    var data = $1;
    var timeout = 500;
    setInterval(function () {
      if (
        Browser.mainLoop.scheduler &&
        document &&
        document["visibilityState"] != "visible"
      ) {
        dynCall("vi", loop, [data]);
      }
    }, timeout);
  },
  4574530: function ($0, $1, $2) {
    var contextRestoredCallback = $0;
    var contextLostCallback = $1;
    var emscriptenAppData = $2;
    Module.canvas.addEventListener(
      "webglcontextrestored",
      function (e) {
        e.preventDefault();
        Module.ctx = null;
        dynCall("vi", contextRestoredCallback, [emscriptenAppData]);
      },
      false
    );
    Module.canvas.addEventListener(
      "webglcontextlost",
      function (e) {
        e.preventDefault();
        dynCall("v", contextLostCallback, []);
      },
      false
    );
  },
  4574945: function () {
    if (Module["appStarted"]) {
      if (typeof Module["appStarted"] == "function")
        Module["appStarted"] = [Module["appStarted"]];
      while (Module["appStarted"].length) {
        var call = Module["appStarted"].shift();
        if (typeof call === "function") {
          call();
        }
      }
    }
  },
};
function _emscripten_asm_const_iii(code, sigPtr, argbuf) {
  var args = readAsmConstArgs(sigPtr, argbuf);
  return ASM_CONSTS[code].apply(null, args);
}
__ATINIT__.push({
  func: function () {
    ___wasm_call_ctors();
  },
});
function demangle(func) {
  return func;
}
function demangleAll(text) {
  var regex = /\b_Z[\w\d_]+/g;
  return text.replace(regex, function (x) {
    var y = demangle(x);
    return x === y ? x : y + " [" + x + "]";
  });
}
function jsStackTrace() {
  var err = new Error();
  if (!err.stack) {
    try {
      throw new Error();
    } catch (e) {
      err = e;
    }
    if (!err.stack) {
      return "(no stack trace available)";
    }
  }
  return err.stack.toString();
}
function stackTrace() {
  var js = jsStackTrace();
  if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
  return demangleAll(js);
}
function _atexit(func, arg) {}
function ___cxa_atexit(a0, a1) {
  return _atexit(a0, a1);
}
function ___cxa_thread_atexit(a0, a1) {
  return _atexit(a0, a1);
}
function setErrNo(value) {
  HEAP32[___errno_location() >> 2] = value;
  return value;
}
function ___map_file(pathname, size) {
  setErrNo(63);
  return -1;
}
var PATH = {
  splitPath: function (filename) {
    var splitPathRe =
      /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    return splitPathRe.exec(filename).slice(1);
  },
  normalizeArray: function (parts, allowAboveRoot) {
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
      var last = parts[i];
      if (last === ".") {
        parts.splice(i, 1);
      } else if (last === "..") {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    if (allowAboveRoot) {
      for (; up; up--) {
        parts.unshift("..");
      }
    }
    return parts;
  },
  normalize: function (path) {
    var isAbsolute = path.charAt(0) === "/",
      trailingSlash = path.substr(-1) === "/";
    path = PATH.normalizeArray(
      path.split("/").filter(function (p) {
        return !!p;
      }),
      !isAbsolute
    ).join("/");
    if (!path && !isAbsolute) {
      path = ".";
    }
    if (path && trailingSlash) {
      path += "/";
    }
    return (isAbsolute ? "/" : "") + path;
  },
  dirname: function (path) {
    var result = PATH.splitPath(path),
      root = result[0],
      dir = result[1];
    if (!root && !dir) {
      return ".";
    }
    if (dir) {
      dir = dir.substr(0, dir.length - 1);
    }
    return root + dir;
  },
  basename: function (path) {
    if (path === "/") return "/";
    var lastSlash = path.lastIndexOf("/");
    if (lastSlash === -1) return path;
    return path.substr(lastSlash + 1);
  },
  extname: function (path) {
    return PATH.splitPath(path)[3];
  },
  join: function () {
    var paths = Array.prototype.slice.call(arguments, 0);
    return PATH.normalize(paths.join("/"));
  },
  join2: function (l, r) {
    return PATH.normalize(l + "/" + r);
  },
};
var PATH_FS = {
  resolve: function () {
    var resolvedPath = "",
      resolvedAbsolute = false;
    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path = i >= 0 ? arguments[i] : FS.cwd();
      if (typeof path !== "string") {
        throw new TypeError("Arguments to path.resolve must be strings");
      } else if (!path) {
        return "";
      }
      resolvedPath = path + "/" + resolvedPath;
      resolvedAbsolute = path.charAt(0) === "/";
    }
    resolvedPath = PATH.normalizeArray(
      resolvedPath.split("/").filter(function (p) {
        return !!p;
      }),
      !resolvedAbsolute
    ).join("/");
    return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
  },
  relative: function (from, to) {
    from = PATH_FS.resolve(from).substr(1);
    to = PATH_FS.resolve(to).substr(1);
    function trim(arr) {
      var start = 0;
      for (; start < arr.length; start++) {
        if (arr[start] !== "") break;
      }
      var end = arr.length - 1;
      for (; end >= 0; end--) {
        if (arr[end] !== "") break;
      }
      if (start > end) return [];
      return arr.slice(start, end - start + 1);
    }
    var fromParts = trim(from.split("/"));
    var toParts = trim(to.split("/"));
    var length = Math.min(fromParts.length, toParts.length);
    var samePartsLength = length;
    for (var i = 0; i < length; i++) {
      if (fromParts[i] !== toParts[i]) {
        samePartsLength = i;
        break;
      }
    }
    var outputParts = [];
    for (var i = samePartsLength; i < fromParts.length; i++) {
      outputParts.push("..");
    }
    outputParts = outputParts.concat(toParts.slice(samePartsLength));
    return outputParts.join("/");
  },
};
var TTY = {
  ttys: [],
  init: function () {},
  shutdown: function () {},
  register: function (dev, ops) {
    TTY.ttys[dev] = { input: [], output: [], ops: ops };
    FS.registerDevice(dev, TTY.stream_ops);
  },
  stream_ops: {
    open: function (stream) {
      var tty = TTY.ttys[stream.node.rdev];
      if (!tty) {
        throw new FS.ErrnoError(43);
      }
      stream.tty = tty;
      stream.seekable = false;
    },
    close: function (stream) {
      stream.tty.ops.flush(stream.tty);
    },
    flush: function (stream) {
      stream.tty.ops.flush(stream.tty);
    },
    read: function (stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.get_char) {
        throw new FS.ErrnoError(60);
      }
      var bytesRead = 0;
      for (var i = 0; i < length; i++) {
        var result;
        try {
          result = stream.tty.ops.get_char(stream.tty);
        } catch (e) {
          throw new FS.ErrnoError(29);
        }
        if (result === undefined && bytesRead === 0) {
          throw new FS.ErrnoError(6);
        }
        if (result === null || result === undefined) break;
        bytesRead++;
        buffer[offset + i] = result;
      }
      if (bytesRead) {
        stream.node.timestamp = Date.now();
      }
      return bytesRead;
    },
    write: function (stream, buffer, offset, length, pos) {
      if (!stream.tty || !stream.tty.ops.put_char) {
        throw new FS.ErrnoError(60);
      }
      try {
        for (var i = 0; i < length; i++) {
          stream.tty.ops.put_char(stream.tty, buffer[offset + i]);
        }
      } catch (e) {
        throw new FS.ErrnoError(29);
      }
      if (length) {
        stream.node.timestamp = Date.now();
      }
      return i;
    },
  },
  default_tty_ops: {
    get_char: function (tty) {
      if (!tty.input.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          var BUFSIZE = 256;
          var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
          var bytesRead = 0;
          try {
            bytesRead = nodeFS.readSync(
              process.stdin.fd,
              buf,
              0,
              BUFSIZE,
              null
            );
          } catch (e) {
            if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
            else throw e;
          }
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString("utf-8");
          } else {
            result = null;
          }
        } else if (
          typeof window != "undefined" &&
          typeof window.prompt == "function"
        ) {
          result = window.prompt("Input: ");
          if (result !== null) {
            result += "\n";
          }
        } else if (typeof readline == "function") {
          result = readline();
          if (result !== null) {
            result += "\n";
          }
        }
        if (!result) {
          return null;
        }
        tty.input = intArrayFromString(result, true);
      }
      return tty.input.shift();
    },
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function (tty) {
      if (tty.output && tty.output.length > 0) {
        out(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
  },
  default_tty1_ops: {
    put_char: function (tty, val) {
      if (val === null || val === 10) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      } else {
        if (val != 0) tty.output.push(val);
      }
    },
    flush: function (tty) {
      if (tty.output && tty.output.length > 0) {
        err(UTF8ArrayToString(tty.output, 0));
        tty.output = [];
      }
    },
  },
};
var MEMFS = {
  ops_table: null,
  mount: function (mount) {
    return MEMFS.createNode(null, "/", 16384 | 511, 0);
  },
  createNode: function (parent, name, mode, dev) {
    if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
      throw new FS.ErrnoError(63);
    }
    if (!MEMFS.ops_table) {
      MEMFS.ops_table = {
        dir: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            lookup: MEMFS.node_ops.lookup,
            mknod: MEMFS.node_ops.mknod,
            rename: MEMFS.node_ops.rename,
            unlink: MEMFS.node_ops.unlink,
            rmdir: MEMFS.node_ops.rmdir,
            readdir: MEMFS.node_ops.readdir,
            symlink: MEMFS.node_ops.symlink,
          },
          stream: { llseek: MEMFS.stream_ops.llseek },
        },
        file: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: {
            llseek: MEMFS.stream_ops.llseek,
            read: MEMFS.stream_ops.read,
            write: MEMFS.stream_ops.write,
            allocate: MEMFS.stream_ops.allocate,
            mmap: MEMFS.stream_ops.mmap,
            msync: MEMFS.stream_ops.msync,
          },
        },
        link: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
            readlink: MEMFS.node_ops.readlink,
          },
          stream: {},
        },
        chrdev: {
          node: {
            getattr: MEMFS.node_ops.getattr,
            setattr: MEMFS.node_ops.setattr,
          },
          stream: FS.chrdev_stream_ops,
        },
      };
    }
    var node = FS.createNode(parent, name, mode, dev);
    if (FS.isDir(node.mode)) {
      node.node_ops = MEMFS.ops_table.dir.node;
      node.stream_ops = MEMFS.ops_table.dir.stream;
      node.contents = {};
    } else if (FS.isFile(node.mode)) {
      node.node_ops = MEMFS.ops_table.file.node;
      node.stream_ops = MEMFS.ops_table.file.stream;
      node.usedBytes = 0;
      node.contents = null;
    } else if (FS.isLink(node.mode)) {
      node.node_ops = MEMFS.ops_table.link.node;
      node.stream_ops = MEMFS.ops_table.link.stream;
    } else if (FS.isChrdev(node.mode)) {
      node.node_ops = MEMFS.ops_table.chrdev.node;
      node.stream_ops = MEMFS.ops_table.chrdev.stream;
    }
    node.timestamp = Date.now();
    if (parent) {
      parent.contents[name] = node;
    }
    return node;
  },
  getFileDataAsRegularArray: function (node) {
    if (node.contents && node.contents.subarray) {
      var arr = [];
      for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
      return arr;
    }
    return node.contents;
  },
  getFileDataAsTypedArray: function (node) {
    if (!node.contents) return new Uint8Array(0);
    if (node.contents.subarray)
      return node.contents.subarray(0, node.usedBytes);
    return new Uint8Array(node.contents);
  },
  expandFileStorage: function (node, newCapacity) {
    var prevCapacity = node.contents ? node.contents.length : 0;
    if (prevCapacity >= newCapacity) return;
    var CAPACITY_DOUBLING_MAX = 1024 * 1024;
    newCapacity = Math.max(
      newCapacity,
      (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125)) >>> 0
    );
    if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
    var oldContents = node.contents;
    node.contents = new Uint8Array(newCapacity);
    if (node.usedBytes > 0)
      node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
    return;
  },
  resizeFileStorage: function (node, newSize) {
    if (node.usedBytes == newSize) return;
    if (newSize == 0) {
      node.contents = null;
      node.usedBytes = 0;
      return;
    }
    if (!node.contents || node.contents.subarray) {
      var oldContents = node.contents;
      node.contents = new Uint8Array(newSize);
      if (oldContents) {
        node.contents.set(
          oldContents.subarray(0, Math.min(newSize, node.usedBytes))
        );
      }
      node.usedBytes = newSize;
      return;
    }
    if (!node.contents) node.contents = [];
    if (node.contents.length > newSize) node.contents.length = newSize;
    else while (node.contents.length < newSize) node.contents.push(0);
    node.usedBytes = newSize;
  },
  node_ops: {
    getattr: function (node) {
      var attr = {};
      attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
      attr.ino = node.id;
      attr.mode = node.mode;
      attr.nlink = 1;
      attr.uid = 0;
      attr.gid = 0;
      attr.rdev = node.rdev;
      if (FS.isDir(node.mode)) {
        attr.size = 4096;
      } else if (FS.isFile(node.mode)) {
        attr.size = node.usedBytes;
      } else if (FS.isLink(node.mode)) {
        attr.size = node.link.length;
      } else {
        attr.size = 0;
      }
      attr.atime = new Date(node.timestamp);
      attr.mtime = new Date(node.timestamp);
      attr.ctime = new Date(node.timestamp);
      attr.blksize = 4096;
      attr.blocks = Math.ceil(attr.size / attr.blksize);
      return attr;
    },
    setattr: function (node, attr) {
      if (attr.mode !== undefined) {
        node.mode = attr.mode;
      }
      if (attr.timestamp !== undefined) {
        node.timestamp = attr.timestamp;
      }
      if (attr.size !== undefined) {
        MEMFS.resizeFileStorage(node, attr.size);
      }
    },
    lookup: function (parent, name) {
      throw FS.genericErrors[44];
    },
    mknod: function (parent, name, mode, dev) {
      return MEMFS.createNode(parent, name, mode, dev);
    },
    rename: function (old_node, new_dir, new_name) {
      if (FS.isDir(old_node.mode)) {
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {}
        if (new_node) {
          for (var i in new_node.contents) {
            throw new FS.ErrnoError(55);
          }
        }
      }
      delete old_node.parent.contents[old_node.name];
      old_node.name = new_name;
      new_dir.contents[new_name] = old_node;
      old_node.parent = new_dir;
    },
    unlink: function (parent, name) {
      delete parent.contents[name];
    },
    rmdir: function (parent, name) {
      var node = FS.lookupNode(parent, name);
      for (var i in node.contents) {
        throw new FS.ErrnoError(55);
      }
      delete parent.contents[name];
    },
    readdir: function (node) {
      var entries = [".", ".."];
      for (var key in node.contents) {
        if (!node.contents.hasOwnProperty(key)) {
          continue;
        }
        entries.push(key);
      }
      return entries;
    },
    symlink: function (parent, newname, oldpath) {
      var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
      node.link = oldpath;
      return node;
    },
    readlink: function (node) {
      if (!FS.isLink(node.mode)) {
        throw new FS.ErrnoError(28);
      }
      return node.link;
    },
  },
  stream_ops: {
    read: function (stream, buffer, offset, length, position) {
      var contents = stream.node.contents;
      if (position >= stream.node.usedBytes) return 0;
      var size = Math.min(stream.node.usedBytes - position, length);
      if (size > 8 && contents.subarray) {
        buffer.set(contents.subarray(position, position + size), offset);
      } else {
        for (var i = 0; i < size; i++)
          buffer[offset + i] = contents[position + i];
      }
      return size;
    },
    write: function (stream, buffer, offset, length, position, canOwn) {
      if (buffer.buffer === HEAP8.buffer) {
        canOwn = false;
      }
      if (!length) return 0;
      var node = stream.node;
      node.timestamp = Date.now();
      if (buffer.subarray && (!node.contents || node.contents.subarray)) {
        if (canOwn) {
          node.contents = buffer.subarray(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (node.usedBytes === 0 && position === 0) {
          node.contents = buffer.slice(offset, offset + length);
          node.usedBytes = length;
          return length;
        } else if (position + length <= node.usedBytes) {
          node.contents.set(buffer.subarray(offset, offset + length), position);
          return length;
        }
      }
      MEMFS.expandFileStorage(node, position + length);
      if (node.contents.subarray && buffer.subarray) {
        node.contents.set(buffer.subarray(offset, offset + length), position);
      } else {
        for (var i = 0; i < length; i++) {
          node.contents[position + i] = buffer[offset + i];
        }
      }
      node.usedBytes = Math.max(node.usedBytes, position + length);
      return length;
    },
    llseek: function (stream, offset, whence) {
      var position = offset;
      if (whence === 1) {
        position += stream.position;
      } else if (whence === 2) {
        if (FS.isFile(stream.node.mode)) {
          position += stream.node.usedBytes;
        }
      }
      if (position < 0) {
        throw new FS.ErrnoError(28);
      }
      return position;
    },
    allocate: function (stream, offset, length) {
      MEMFS.expandFileStorage(stream.node, offset + length);
      stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
    },
    mmap: function (stream, address, length, position, prot, flags) {
      assert(address === 0);
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      var ptr;
      var allocated;
      var contents = stream.node.contents;
      if (!(flags & 2) && contents.buffer === buffer) {
        allocated = false;
        ptr = contents.byteOffset;
      } else {
        if (position > 0 || position + length < contents.length) {
          if (contents.subarray) {
            contents = contents.subarray(position, position + length);
          } else {
            contents = Array.prototype.slice.call(
              contents,
              position,
              position + length
            );
          }
        }
        allocated = true;
        ptr = FS.mmapAlloc(length);
        if (!ptr) {
          throw new FS.ErrnoError(48);
        }
        HEAP8.set(contents, ptr);
      }
      return { ptr: ptr, allocated: allocated };
    },
    msync: function (stream, buffer, offset, length, mmapFlags) {
      if (!FS.isFile(stream.node.mode)) {
        throw new FS.ErrnoError(43);
      }
      if (mmapFlags & 2) {
        return 0;
      }
      var bytesWritten = MEMFS.stream_ops.write(
        stream,
        buffer,
        0,
        length,
        offset,
        false
      );
      return 0;
    },
  },
};
var IDBFS = {
  dbs: {},
  indexedDB: function () {
    if (typeof indexedDB !== "undefined") return indexedDB;
    var ret = null;
    if (typeof window === "object")
      ret =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB;
    assert(ret, "IDBFS used, but indexedDB not supported");
    return ret;
  },
  DB_VERSION: 21,
  DB_STORE_NAME: "FILE_DATA",
  mount: function (mount) {
    return MEMFS.mount.apply(null, arguments);
  },
  syncfs: function (mount, populate, callback) {
    IDBFS.getLocalSet(mount, function (err, local) {
      if (err) return callback(err);
      IDBFS.getRemoteSet(mount, function (err, remote) {
        if (err) return callback(err);
        var src = populate ? remote : local;
        var dst = populate ? local : remote;
        IDBFS.reconcile(src, dst, callback);
      });
    });
  },
  getDB: function (name, callback) {
    var db = IDBFS.dbs[name];
    if (db) {
      return callback(null, db);
    }
    var req;
    try {
      req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
    } catch (e) {
      return callback(e);
    }
    if (!req) {
      return callback("Unable to connect to IndexedDB");
    }
    req.onupgradeneeded = function (e) {
      var db = e.target.result;
      var transaction = e.target.transaction;
      var fileStore;
      if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
        fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
      } else {
        fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
      }
      if (!fileStore.indexNames.contains("timestamp")) {
        fileStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
    req.onsuccess = function () {
      db = req.result;
      IDBFS.dbs[name] = db;
      callback(null, db);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  getLocalSet: function (mount, callback) {
    var entries = {};
    function isRealDir(p) {
      return p !== "." && p !== "..";
    }
    function toAbsolute(root) {
      return function (p) {
        return PATH.join2(root, p);
      };
    }
    var check = FS.readdir(mount.mountpoint)
      .filter(isRealDir)
      .map(toAbsolute(mount.mountpoint));
    while (check.length) {
      var path = check.pop();
      var stat;
      try {
        stat = FS.stat(path);
      } catch (e) {
        return callback(e);
      }
      if (FS.isDir(stat.mode)) {
        check.push.apply(
          check,
          FS.readdir(path).filter(isRealDir).map(toAbsolute(path))
        );
      }
      entries[path] = { timestamp: stat.mtime };
    }
    return callback(null, { type: "local", entries: entries });
  },
  getRemoteSet: function (mount, callback) {
    var entries = {};
    IDBFS.getDB(mount.mountpoint, function (err, db) {
      if (err) return callback(err);
      try {
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
        transaction.onerror = function (e) {
          callback(this.error);
          e.preventDefault();
        };
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
        var index = store.index("timestamp");
        index.openKeyCursor().onsuccess = function (event) {
          var cursor = event.target.result;
          if (!cursor) {
            return callback(null, { type: "remote", db: db, entries: entries });
          }
          entries[cursor.primaryKey] = { timestamp: cursor.key };
          cursor.continue();
        };
      } catch (e) {
        return callback(e);
      }
    });
  },
  loadLocalEntry: function (path, callback) {
    var stat, node;
    try {
      var lookup = FS.lookupPath(path);
      node = lookup.node;
      stat = FS.stat(path);
    } catch (e) {
      return callback(e);
    }
    if (FS.isDir(stat.mode)) {
      return callback(null, { timestamp: stat.mtime, mode: stat.mode });
    } else if (FS.isFile(stat.mode)) {
      node.contents = MEMFS.getFileDataAsTypedArray(node);
      return callback(null, {
        timestamp: stat.mtime,
        mode: stat.mode,
        contents: node.contents,
      });
    } else {
      return callback(new Error("node type not supported"));
    }
  },
  storeLocalEntry: function (path, entry, callback) {
    try {
      if (FS.isDir(entry["mode"])) {
        FS.mkdir(path, entry["mode"]);
      } else if (FS.isFile(entry["mode"])) {
        FS.writeFile(path, entry["contents"], { canOwn: true });
      } else {
        return callback(new Error("node type not supported"));
      }
      FS.chmod(path, entry["mode"]);
      FS.utime(path, entry["timestamp"], entry["timestamp"]);
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  removeLocalEntry: function (path, callback) {
    try {
      var lookup = FS.lookupPath(path);
      var stat = FS.stat(path);
      if (FS.isDir(stat.mode)) {
        FS.rmdir(path);
      } else if (FS.isFile(stat.mode)) {
        FS.unlink(path);
      }
    } catch (e) {
      return callback(e);
    }
    callback(null);
  },
  loadRemoteEntry: function (store, path, callback) {
    var req = store.get(path);
    req.onsuccess = function (event) {
      callback(null, event.target.result);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  storeRemoteEntry: function (store, path, entry, callback) {
    var req = store.put(entry, path);
    req.onsuccess = function () {
      callback(null);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  removeRemoteEntry: function (store, path, callback) {
    var req = store.delete(path);
    req.onsuccess = function () {
      callback(null);
    };
    req.onerror = function (e) {
      callback(this.error);
      e.preventDefault();
    };
  },
  reconcile: function (src, dst, callback) {
    var total = 0;
    var create = [];
    Object.keys(src.entries).forEach(function (key) {
      var e = src.entries[key];
      var e2 = dst.entries[key];
      if (!e2 || e["timestamp"] > e2["timestamp"]) {
        create.push(key);
        total++;
      }
    });
    var remove = [];
    Object.keys(dst.entries).forEach(function (key) {
      var e = dst.entries[key];
      var e2 = src.entries[key];
      if (!e2) {
        remove.push(key);
        total++;
      }
    });
    if (!total) {
      return callback(null);
    }
    var errored = false;
    var db = src.type === "remote" ? src.db : dst.db;
    var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
    var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
    function done(err) {
      if (err && !errored) {
        errored = true;
        return callback(err);
      }
    }
    transaction.onerror = function (e) {
      done(this.error);
      e.preventDefault();
    };
    transaction.oncomplete = function (e) {
      if (!errored) {
        callback(null);
      }
    };
    create.sort().forEach(function (path) {
      if (dst.type === "local") {
        IDBFS.loadRemoteEntry(store, path, function (err, entry) {
          if (err) return done(err);
          IDBFS.storeLocalEntry(path, entry, done);
        });
      } else {
        IDBFS.loadLocalEntry(path, function (err, entry) {
          if (err) return done(err);
          IDBFS.storeRemoteEntry(store, path, entry, done);
        });
      }
    });
    remove
      .sort()
      .reverse()
      .forEach(function (path) {
        if (dst.type === "local") {
          IDBFS.removeLocalEntry(path, done);
        } else {
          IDBFS.removeRemoteEntry(store, path, done);
        }
      });
  },
};
var FS = {
  root: null,
  mounts: [],
  devices: {},
  streams: [],
  nextInode: 1,
  nameTable: null,
  currentPath: "/",
  initialized: false,
  ignorePermissions: true,
  trackingDelegate: {},
  tracking: { openFlags: { READ: 1, WRITE: 2 } },
  ErrnoError: null,
  genericErrors: {},
  filesystems: null,
  syncFSRequests: 0,
  handleFSError: function (e) {
    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
    return setErrNo(e.errno);
  },
  lookupPath: function (path, opts) {
    path = PATH_FS.resolve(FS.cwd(), path);
    opts = opts || {};
    if (!path) return { path: "", node: null };
    var defaults = { follow_mount: true, recurse_count: 0 };
    for (var key in defaults) {
      if (opts[key] === undefined) {
        opts[key] = defaults[key];
      }
    }
    if (opts.recurse_count > 8) {
      throw new FS.ErrnoError(32);
    }
    var parts = PATH.normalizeArray(
      path.split("/").filter(function (p) {
        return !!p;
      }),
      false
    );
    var current = FS.root;
    var current_path = "/";
    for (var i = 0; i < parts.length; i++) {
      var islast = i === parts.length - 1;
      if (islast && opts.parent) {
        break;
      }
      current = FS.lookupNode(current, parts[i]);
      current_path = PATH.join2(current_path, parts[i]);
      if (FS.isMountpoint(current)) {
        if (!islast || (islast && opts.follow_mount)) {
          current = current.mounted.root;
        }
      }
      if (!islast || opts.follow) {
        var count = 0;
        while (FS.isLink(current.mode)) {
          var link = FS.readlink(current_path);
          current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
          var lookup = FS.lookupPath(current_path, {
            recurse_count: opts.recurse_count,
          });
          current = lookup.node;
          if (count++ > 40) {
            throw new FS.ErrnoError(32);
          }
        }
      }
    }
    return { path: current_path, node: current };
  },
  getPath: function (node) {
    var path;
    while (true) {
      if (FS.isRoot(node)) {
        var mount = node.mount.mountpoint;
        if (!path) return mount;
        return mount[mount.length - 1] !== "/"
          ? mount + "/" + path
          : mount + path;
      }
      path = path ? node.name + "/" + path : node.name;
      node = node.parent;
    }
  },
  hashName: function (parentid, name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
    }
    return ((parentid + hash) >>> 0) % FS.nameTable.length;
  },
  hashAddNode: function (node) {
    var hash = FS.hashName(node.parent.id, node.name);
    node.name_next = FS.nameTable[hash];
    FS.nameTable[hash] = node;
  },
  hashRemoveNode: function (node) {
    var hash = FS.hashName(node.parent.id, node.name);
    if (FS.nameTable[hash] === node) {
      FS.nameTable[hash] = node.name_next;
    } else {
      var current = FS.nameTable[hash];
      while (current) {
        if (current.name_next === node) {
          current.name_next = node.name_next;
          break;
        }
        current = current.name_next;
      }
    }
  },
  lookupNode: function (parent, name) {
    var errCode = FS.mayLookup(parent);
    if (errCode) {
      throw new FS.ErrnoError(errCode, parent);
    }
    var hash = FS.hashName(parent.id, name);
    for (var node = FS.nameTable[hash]; node; node = node.name_next) {
      var nodeName = node.name;
      if (node.parent.id === parent.id && nodeName === name) {
        return node;
      }
    }
    return FS.lookup(parent, name);
  },
  createNode: function (parent, name, mode, rdev) {
    var node = new FS.FSNode(parent, name, mode, rdev);
    FS.hashAddNode(node);
    return node;
  },
  destroyNode: function (node) {
    FS.hashRemoveNode(node);
  },
  isRoot: function (node) {
    return node === node.parent;
  },
  isMountpoint: function (node) {
    return !!node.mounted;
  },
  isFile: function (mode) {
    return (mode & 61440) === 32768;
  },
  isDir: function (mode) {
    return (mode & 61440) === 16384;
  },
  isLink: function (mode) {
    return (mode & 61440) === 40960;
  },
  isChrdev: function (mode) {
    return (mode & 61440) === 8192;
  },
  isBlkdev: function (mode) {
    return (mode & 61440) === 24576;
  },
  isFIFO: function (mode) {
    return (mode & 61440) === 4096;
  },
  isSocket: function (mode) {
    return (mode & 49152) === 49152;
  },
  flagModes: {
    r: 0,
    rs: 1052672,
    "r+": 2,
    w: 577,
    wx: 705,
    xw: 705,
    "w+": 578,
    "wx+": 706,
    "xw+": 706,
    a: 1089,
    ax: 1217,
    xa: 1217,
    "a+": 1090,
    "ax+": 1218,
    "xa+": 1218,
  },
  modeStringToFlags: function (str) {
    var flags = FS.flagModes[str];
    if (typeof flags === "undefined") {
      throw new Error("Unknown file open mode: " + str);
    }
    return flags;
  },
  flagsToPermissionString: function (flag) {
    var perms = ["r", "w", "rw"][flag & 3];
    if (flag & 512) {
      perms += "w";
    }
    return perms;
  },
  nodePermissions: function (node, perms) {
    if (FS.ignorePermissions) {
      return 0;
    }
    if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
      return 2;
    } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
      return 2;
    } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
      return 2;
    }
    return 0;
  },
  mayLookup: function (dir) {
    var errCode = FS.nodePermissions(dir, "x");
    if (errCode) return errCode;
    if (!dir.node_ops.lookup) return 2;
    return 0;
  },
  mayCreate: function (dir, name) {
    try {
      var node = FS.lookupNode(dir, name);
      return 20;
    } catch (e) {}
    return FS.nodePermissions(dir, "wx");
  },
  mayDelete: function (dir, name, isdir) {
    var node;
    try {
      node = FS.lookupNode(dir, name);
    } catch (e) {
      return e.errno;
    }
    var errCode = FS.nodePermissions(dir, "wx");
    if (errCode) {
      return errCode;
    }
    if (isdir) {
      if (!FS.isDir(node.mode)) {
        return 54;
      }
      if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
        return 10;
      }
    } else {
      if (FS.isDir(node.mode)) {
        return 31;
      }
    }
    return 0;
  },
  mayOpen: function (node, flags) {
    if (!node) {
      return 44;
    }
    if (FS.isLink(node.mode)) {
      return 32;
    } else if (FS.isDir(node.mode)) {
      if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
        return 31;
      }
    }
    return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
  },
  MAX_OPEN_FDS: 4096,
  nextfd: function (fd_start, fd_end) {
    fd_start = fd_start || 0;
    fd_end = fd_end || FS.MAX_OPEN_FDS;
    for (var fd = fd_start; fd <= fd_end; fd++) {
      if (!FS.streams[fd]) {
        return fd;
      }
    }
    throw new FS.ErrnoError(33);
  },
  getStream: function (fd) {
    return FS.streams[fd];
  },
  createStream: function (stream, fd_start, fd_end) {
    if (!FS.FSStream) {
      FS.FSStream = function () {};
      FS.FSStream.prototype = {
        object: {
          get: function () {
            return this.node;
          },
          set: function (val) {
            this.node = val;
          },
        },
        isRead: {
          get: function () {
            return (this.flags & 2097155) !== 1;
          },
        },
        isWrite: {
          get: function () {
            return (this.flags & 2097155) !== 0;
          },
        },
        isAppend: {
          get: function () {
            return this.flags & 1024;
          },
        },
      };
    }
    var newStream = new FS.FSStream();
    for (var p in stream) {
      newStream[p] = stream[p];
    }
    stream = newStream;
    var fd = FS.nextfd(fd_start, fd_end);
    stream.fd = fd;
    FS.streams[fd] = stream;
    return stream;
  },
  closeStream: function (fd) {
    FS.streams[fd] = null;
  },
  chrdev_stream_ops: {
    open: function (stream) {
      var device = FS.getDevice(stream.node.rdev);
      stream.stream_ops = device.stream_ops;
      if (stream.stream_ops.open) {
        stream.stream_ops.open(stream);
      }
    },
    llseek: function () {
      throw new FS.ErrnoError(70);
    },
  },
  major: function (dev) {
    return dev >> 8;
  },
  minor: function (dev) {
    return dev & 255;
  },
  makedev: function (ma, mi) {
    return (ma << 8) | mi;
  },
  registerDevice: function (dev, ops) {
    FS.devices[dev] = { stream_ops: ops };
  },
  getDevice: function (dev) {
    return FS.devices[dev];
  },
  getMounts: function (mount) {
    var mounts = [];
    var check = [mount];
    while (check.length) {
      var m = check.pop();
      mounts.push(m);
      check.push.apply(check, m.mounts);
    }
    return mounts;
  },
  syncfs: function (populate, callback) {
    if (typeof populate === "function") {
      callback = populate;
      populate = false;
    }
    FS.syncFSRequests++;
    if (FS.syncFSRequests > 1) {
      err(
        "warning: " +
          FS.syncFSRequests +
          " FS.syncfs operations in flight at once, probably just doing extra work"
      );
    }
    var mounts = FS.getMounts(FS.root.mount);
    var completed = 0;
    function doCallback(errCode) {
      FS.syncFSRequests--;
      return callback(errCode);
    }
    function done(errCode) {
      if (errCode) {
        if (!done.errored) {
          done.errored = true;
          return doCallback(errCode);
        }
        return;
      }
      if (++completed >= mounts.length) {
        doCallback(null);
      }
    }
    mounts.forEach(function (mount) {
      if (!mount.type.syncfs) {
        return done(null);
      }
      mount.type.syncfs(mount, populate, done);
    });
  },
  mount: function (type, opts, mountpoint) {
    var root = mountpoint === "/";
    var pseudo = !mountpoint;
    var node;
    if (root && FS.root) {
      throw new FS.ErrnoError(10);
    } else if (!root && !pseudo) {
      var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
      mountpoint = lookup.path;
      node = lookup.node;
      if (FS.isMountpoint(node)) {
        throw new FS.ErrnoError(10);
      }
      if (!FS.isDir(node.mode)) {
        throw new FS.ErrnoError(54);
      }
    }
    var mount = { type: type, opts: opts, mountpoint: mountpoint, mounts: [] };
    var mountRoot = type.mount(mount);
    mountRoot.mount = mount;
    mount.root = mountRoot;
    if (root) {
      FS.root = mountRoot;
    } else if (node) {
      node.mounted = mount;
      if (node.mount) {
        node.mount.mounts.push(mount);
      }
    }
    return mountRoot;
  },
  unmount: function (mountpoint) {
    var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
    if (!FS.isMountpoint(lookup.node)) {
      throw new FS.ErrnoError(28);
    }
    var node = lookup.node;
    var mount = node.mounted;
    var mounts = FS.getMounts(mount);
    Object.keys(FS.nameTable).forEach(function (hash) {
      var current = FS.nameTable[hash];
      while (current) {
        var next = current.name_next;
        if (mounts.indexOf(current.mount) !== -1) {
          FS.destroyNode(current);
        }
        current = next;
      }
    });
    node.mounted = null;
    var idx = node.mount.mounts.indexOf(mount);
    node.mount.mounts.splice(idx, 1);
  },
  lookup: function (parent, name) {
    return parent.node_ops.lookup(parent, name);
  },
  mknod: function (path, mode, dev) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    if (!name || name === "." || name === "..") {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.mayCreate(parent, name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.mknod) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.mknod(parent, name, mode, dev);
  },
  create: function (path, mode) {
    mode = mode !== undefined ? mode : 438;
    mode &= 4095;
    mode |= 32768;
    return FS.mknod(path, mode, 0);
  },
  mkdir: function (path, mode) {
    mode = mode !== undefined ? mode : 511;
    mode &= 511 | 512;
    mode |= 16384;
    return FS.mknod(path, mode, 0);
  },
  mkdirTree: function (path, mode) {
    var dirs = path.split("/");
    var d = "";
    for (var i = 0; i < dirs.length; ++i) {
      if (!dirs[i]) continue;
      d += "/" + dirs[i];
      try {
        FS.mkdir(d, mode);
      } catch (e) {
        if (e.errno != 20) throw e;
      }
    }
  },
  mkdev: function (path, mode, dev) {
    if (typeof dev === "undefined") {
      dev = mode;
      mode = 438;
    }
    mode |= 8192;
    return FS.mknod(path, mode, dev);
  },
  symlink: function (oldpath, newpath) {
    if (!PATH_FS.resolve(oldpath)) {
      throw new FS.ErrnoError(44);
    }
    var lookup = FS.lookupPath(newpath, { parent: true });
    var parent = lookup.node;
    if (!parent) {
      throw new FS.ErrnoError(44);
    }
    var newname = PATH.basename(newpath);
    var errCode = FS.mayCreate(parent, newname);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.symlink) {
      throw new FS.ErrnoError(63);
    }
    return parent.node_ops.symlink(parent, newname, oldpath);
  },
  rename: function (old_path, new_path) {
    var old_dirname = PATH.dirname(old_path);
    var new_dirname = PATH.dirname(new_path);
    var old_name = PATH.basename(old_path);
    var new_name = PATH.basename(new_path);
    var lookup, old_dir, new_dir;
    try {
      lookup = FS.lookupPath(old_path, { parent: true });
      old_dir = lookup.node;
      lookup = FS.lookupPath(new_path, { parent: true });
      new_dir = lookup.node;
    } catch (e) {
      throw new FS.ErrnoError(10);
    }
    if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
    if (old_dir.mount !== new_dir.mount) {
      throw new FS.ErrnoError(75);
    }
    var old_node = FS.lookupNode(old_dir, old_name);
    var relative = PATH_FS.relative(old_path, new_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(28);
    }
    relative = PATH_FS.relative(new_path, old_dirname);
    if (relative.charAt(0) !== ".") {
      throw new FS.ErrnoError(55);
    }
    var new_node;
    try {
      new_node = FS.lookupNode(new_dir, new_name);
    } catch (e) {}
    if (old_node === new_node) {
      return;
    }
    var isdir = FS.isDir(old_node.mode);
    var errCode = FS.mayDelete(old_dir, old_name, isdir);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    errCode = new_node
      ? FS.mayDelete(new_dir, new_name, isdir)
      : FS.mayCreate(new_dir, new_name);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!old_dir.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
      throw new FS.ErrnoError(10);
    }
    if (new_dir !== old_dir) {
      errCode = FS.nodePermissions(old_dir, "w");
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    try {
      if (FS.trackingDelegate["willMovePath"]) {
        FS.trackingDelegate["willMovePath"](old_path, new_path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
    FS.hashRemoveNode(old_node);
    try {
      old_dir.node_ops.rename(old_node, new_dir, new_name);
    } catch (e) {
      throw e;
    } finally {
      FS.hashAddNode(old_node);
    }
    try {
      if (FS.trackingDelegate["onMovePath"])
        FS.trackingDelegate["onMovePath"](old_path, new_path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onMovePath']('" +
          old_path +
          "', '" +
          new_path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  rmdir: function (path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, true);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.rmdir) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.rmdir(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readdir: function (path) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    if (!node.node_ops.readdir) {
      throw new FS.ErrnoError(54);
    }
    return node.node_ops.readdir(node);
  },
  unlink: function (path) {
    var lookup = FS.lookupPath(path, { parent: true });
    var parent = lookup.node;
    var name = PATH.basename(path);
    var node = FS.lookupNode(parent, name);
    var errCode = FS.mayDelete(parent, name, false);
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    if (!parent.node_ops.unlink) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(node)) {
      throw new FS.ErrnoError(10);
    }
    try {
      if (FS.trackingDelegate["willDeletePath"]) {
        FS.trackingDelegate["willDeletePath"](path);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['willDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
    parent.node_ops.unlink(parent, name);
    FS.destroyNode(node);
    try {
      if (FS.trackingDelegate["onDeletePath"])
        FS.trackingDelegate["onDeletePath"](path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onDeletePath']('" +
          path +
          "') threw an exception: " +
          e.message
      );
    }
  },
  readlink: function (path) {
    var lookup = FS.lookupPath(path);
    var link = lookup.node;
    if (!link) {
      throw new FS.ErrnoError(44);
    }
    if (!link.node_ops.readlink) {
      throw new FS.ErrnoError(28);
    }
    return PATH_FS.resolve(
      FS.getPath(link.parent),
      link.node_ops.readlink(link)
    );
  },
  stat: function (path, dontFollow) {
    var lookup = FS.lookupPath(path, { follow: !dontFollow });
    var node = lookup.node;
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (!node.node_ops.getattr) {
      throw new FS.ErrnoError(63);
    }
    return node.node_ops.getattr(node);
  },
  lstat: function (path) {
    return FS.stat(path, true);
  },
  chmod: function (path, mode, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, {
      mode: (mode & 4095) | (node.mode & ~4095),
      timestamp: Date.now(),
    });
  },
  lchmod: function (path, mode) {
    FS.chmod(path, mode, true);
  },
  fchmod: function (fd, mode) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chmod(stream.node, mode);
  },
  chown: function (path, uid, gid, dontFollow) {
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: !dontFollow });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    node.node_ops.setattr(node, { timestamp: Date.now() });
  },
  lchown: function (path, uid, gid) {
    FS.chown(path, uid, gid, true);
  },
  fchown: function (fd, uid, gid) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    FS.chown(stream.node, uid, gid);
  },
  truncate: function (path, len) {
    if (len < 0) {
      throw new FS.ErrnoError(28);
    }
    var node;
    if (typeof path === "string") {
      var lookup = FS.lookupPath(path, { follow: true });
      node = lookup.node;
    } else {
      node = path;
    }
    if (!node.node_ops.setattr) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isDir(node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!FS.isFile(node.mode)) {
      throw new FS.ErrnoError(28);
    }
    var errCode = FS.nodePermissions(node, "w");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
  },
  ftruncate: function (fd, len) {
    var stream = FS.getStream(fd);
    if (!stream) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(28);
    }
    FS.truncate(stream.node, len);
  },
  utime: function (path, atime, mtime) {
    var lookup = FS.lookupPath(path, { follow: true });
    var node = lookup.node;
    node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
  },
  open: function (path, flags, mode, fd_start, fd_end) {
    if (path === "") {
      throw new FS.ErrnoError(44);
    }
    flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
    mode = typeof mode === "undefined" ? 438 : mode;
    if (flags & 64) {
      mode = (mode & 4095) | 32768;
    } else {
      mode = 0;
    }
    var node;
    if (typeof path === "object") {
      node = path;
    } else {
      path = PATH.normalize(path);
      try {
        var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
        node = lookup.node;
      } catch (e) {}
    }
    var created = false;
    if (flags & 64) {
      if (node) {
        if (flags & 128) {
          throw new FS.ErrnoError(20);
        }
      } else {
        node = FS.mknod(path, mode, 0);
        created = true;
      }
    }
    if (!node) {
      throw new FS.ErrnoError(44);
    }
    if (FS.isChrdev(node.mode)) {
      flags &= ~512;
    }
    if (flags & 65536 && !FS.isDir(node.mode)) {
      throw new FS.ErrnoError(54);
    }
    if (!created) {
      var errCode = FS.mayOpen(node, flags);
      if (errCode) {
        throw new FS.ErrnoError(errCode);
      }
    }
    if (flags & 512) {
      FS.truncate(node, 0);
    }
    flags &= ~(128 | 512 | 131072);
    var stream = FS.createStream(
      {
        node: node,
        path: FS.getPath(node),
        flags: flags,
        seekable: true,
        position: 0,
        stream_ops: node.stream_ops,
        ungotten: [],
        error: false,
      },
      fd_start,
      fd_end
    );
    if (stream.stream_ops.open) {
      stream.stream_ops.open(stream);
    }
    if (Module["logReadFiles"] && !(flags & 1)) {
      if (!FS.readFiles) FS.readFiles = {};
      if (!(path in FS.readFiles)) {
        FS.readFiles[path] = 1;
        err("FS.trackingDelegate error on read file: " + path);
      }
    }
    try {
      if (FS.trackingDelegate["onOpenFile"]) {
        var trackingFlags = 0;
        if ((flags & 2097155) !== 1) {
          trackingFlags |= FS.tracking.openFlags.READ;
        }
        if ((flags & 2097155) !== 0) {
          trackingFlags |= FS.tracking.openFlags.WRITE;
        }
        FS.trackingDelegate["onOpenFile"](path, trackingFlags);
      }
    } catch (e) {
      err(
        "FS.trackingDelegate['onOpenFile']('" +
          path +
          "', flags) threw an exception: " +
          e.message
      );
    }
    return stream;
  },
  close: function (stream) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (stream.getdents) stream.getdents = null;
    try {
      if (stream.stream_ops.close) {
        stream.stream_ops.close(stream);
      }
    } catch (e) {
      throw e;
    } finally {
      FS.closeStream(stream.fd);
    }
    stream.fd = null;
  },
  isClosed: function (stream) {
    return stream.fd === null;
  },
  llseek: function (stream, offset, whence) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (!stream.seekable || !stream.stream_ops.llseek) {
      throw new FS.ErrnoError(70);
    }
    if (whence != 0 && whence != 1 && whence != 2) {
      throw new FS.ErrnoError(28);
    }
    stream.position = stream.stream_ops.llseek(stream, offset, whence);
    stream.ungotten = [];
    return stream.position;
  },
  read: function (stream, buffer, offset, length, position) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.read) {
      throw new FS.ErrnoError(28);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesRead = stream.stream_ops.read(
      stream,
      buffer,
      offset,
      length,
      position
    );
    if (!seeking) stream.position += bytesRead;
    return bytesRead;
  },
  write: function (stream, buffer, offset, length, position, canOwn) {
    if (length < 0 || position < 0) {
      throw new FS.ErrnoError(28);
    }
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(31);
    }
    if (!stream.stream_ops.write) {
      throw new FS.ErrnoError(28);
    }
    if (stream.seekable && stream.flags & 1024) {
      FS.llseek(stream, 0, 2);
    }
    var seeking = typeof position !== "undefined";
    if (!seeking) {
      position = stream.position;
    } else if (!stream.seekable) {
      throw new FS.ErrnoError(70);
    }
    var bytesWritten = stream.stream_ops.write(
      stream,
      buffer,
      offset,
      length,
      position,
      canOwn
    );
    if (!seeking) stream.position += bytesWritten;
    try {
      if (stream.path && FS.trackingDelegate["onWriteToFile"])
        FS.trackingDelegate["onWriteToFile"](stream.path);
    } catch (e) {
      err(
        "FS.trackingDelegate['onWriteToFile']('" +
          stream.path +
          "') threw an exception: " +
          e.message
      );
    }
    return bytesWritten;
  },
  allocate: function (stream, offset, length) {
    if (FS.isClosed(stream)) {
      throw new FS.ErrnoError(8);
    }
    if (offset < 0 || length <= 0) {
      throw new FS.ErrnoError(28);
    }
    if ((stream.flags & 2097155) === 0) {
      throw new FS.ErrnoError(8);
    }
    if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
      throw new FS.ErrnoError(43);
    }
    if (!stream.stream_ops.allocate) {
      throw new FS.ErrnoError(138);
    }
    stream.stream_ops.allocate(stream, offset, length);
  },
  mmap: function (stream, address, length, position, prot, flags) {
    if (
      (prot & 2) !== 0 &&
      (flags & 2) === 0 &&
      (stream.flags & 2097155) !== 2
    ) {
      throw new FS.ErrnoError(2);
    }
    if ((stream.flags & 2097155) === 1) {
      throw new FS.ErrnoError(2);
    }
    if (!stream.stream_ops.mmap) {
      throw new FS.ErrnoError(43);
    }
    return stream.stream_ops.mmap(
      stream,
      address,
      length,
      position,
      prot,
      flags
    );
  },
  msync: function (stream, buffer, offset, length, mmapFlags) {
    if (!stream || !stream.stream_ops.msync) {
      return 0;
    }
    return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
  },
  munmap: function (stream) {
    return 0;
  },
  ioctl: function (stream, cmd, arg) {
    if (!stream.stream_ops.ioctl) {
      throw new FS.ErrnoError(59);
    }
    return stream.stream_ops.ioctl(stream, cmd, arg);
  },
  readFile: function (path, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "r";
    opts.encoding = opts.encoding || "binary";
    if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
      throw new Error('Invalid encoding type "' + opts.encoding + '"');
    }
    var ret;
    var stream = FS.open(path, opts.flags);
    var stat = FS.stat(path);
    var length = stat.size;
    var buf = new Uint8Array(length);
    FS.read(stream, buf, 0, length, 0);
    if (opts.encoding === "utf8") {
      ret = UTF8ArrayToString(buf, 0);
    } else if (opts.encoding === "binary") {
      ret = buf;
    }
    FS.close(stream);
    return ret;
  },
  writeFile: function (path, data, opts) {
    opts = opts || {};
    opts.flags = opts.flags || "w";
    var stream = FS.open(path, opts.flags, opts.mode);
    if (typeof data === "string") {
      var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
      var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
      FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
    } else if (ArrayBuffer.isView(data)) {
      FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
    } else {
      throw new Error("Unsupported data type");
    }
    FS.close(stream);
  },
  cwd: function () {
    return FS.currentPath;
  },
  chdir: function (path) {
    var lookup = FS.lookupPath(path, { follow: true });
    if (lookup.node === null) {
      throw new FS.ErrnoError(44);
    }
    if (!FS.isDir(lookup.node.mode)) {
      throw new FS.ErrnoError(54);
    }
    var errCode = FS.nodePermissions(lookup.node, "x");
    if (errCode) {
      throw new FS.ErrnoError(errCode);
    }
    FS.currentPath = lookup.path;
  },
  createDefaultDirectories: function () {
    FS.mkdir("/tmp");
    FS.mkdir("/home");
    FS.mkdir("/home/web_user");
  },
  createDefaultDevices: function () {
    FS.mkdir("/dev");
    FS.registerDevice(FS.makedev(1, 3), {
      read: function () {
        return 0;
      },
      write: function (stream, buffer, offset, length, pos) {
        return length;
      },
    });
    FS.mkdev("/dev/null", FS.makedev(1, 3));
    TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
    TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
    FS.mkdev("/dev/tty", FS.makedev(5, 0));
    FS.mkdev("/dev/tty1", FS.makedev(6, 0));
    var random_device;
    if (
      typeof crypto === "object" &&
      typeof crypto["getRandomValues"] === "function"
    ) {
      var randomBuffer = new Uint8Array(1);
      random_device = function () {
        crypto.getRandomValues(randomBuffer);
        return randomBuffer[0];
      };
    } else if (ENVIRONMENT_IS_NODE) {
      try {
        var crypto_module = require("crypto");
        random_device = function () {
          return crypto_module["randomBytes"](1)[0];
        };
      } catch (e) {}
    } else {
    }
    if (!random_device) {
      random_device = function () {
        abort("random_device");
      };
    }
    FS.createDevice("/dev", "random", random_device);
    FS.createDevice("/dev", "urandom", random_device);
    FS.mkdir("/dev/shm");
    FS.mkdir("/dev/shm/tmp");
  },
  createSpecialDirectories: function () {
    FS.mkdir("/proc");
    FS.mkdir("/proc/self");
    FS.mkdir("/proc/self/fd");
    FS.mount(
      {
        mount: function () {
          var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
          node.node_ops = {
            lookup: function (parent, name) {
              var fd = +name;
              var stream = FS.getStream(fd);
              if (!stream) throw new FS.ErrnoError(8);
              var ret = {
                parent: null,
                mount: { mountpoint: "fake" },
                node_ops: {
                  readlink: function () {
                    return stream.path;
                  },
                },
              };
              ret.parent = ret;
              return ret;
            },
          };
          return node;
        },
      },
      {},
      "/proc/self/fd"
    );
  },
  createStandardStreams: function () {
    if (Module["stdin"]) {
      FS.createDevice("/dev", "stdin", Module["stdin"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdin");
    }
    if (Module["stdout"]) {
      FS.createDevice("/dev", "stdout", null, Module["stdout"]);
    } else {
      FS.symlink("/dev/tty", "/dev/stdout");
    }
    if (Module["stderr"]) {
      FS.createDevice("/dev", "stderr", null, Module["stderr"]);
    } else {
      FS.symlink("/dev/tty1", "/dev/stderr");
    }
    var stdin = FS.open("/dev/stdin", "r");
    var stdout = FS.open("/dev/stdout", "w");
    var stderr = FS.open("/dev/stderr", "w");
  },
  ensureErrnoError: function () {
    if (FS.ErrnoError) return;
    FS.ErrnoError = function ErrnoError(errno, node) {
      this.node = node;
      this.setErrno = function (errno) {
        this.errno = errno;
      };
      this.setErrno(errno);
      this.message = "FS error";
    };
    FS.ErrnoError.prototype = new Error();
    FS.ErrnoError.prototype.constructor = FS.ErrnoError;
    [44].forEach(function (code) {
      FS.genericErrors[code] = new FS.ErrnoError(code);
      FS.genericErrors[code].stack = "<generic error, no stack>";
    });
  },
  staticInit: function () {
    FS.ensureErrnoError();
    FS.nameTable = new Array(4096);
    FS.mount(MEMFS, {}, "/");
    FS.createDefaultDirectories();
    FS.createDefaultDevices();
    FS.createSpecialDirectories();
    FS.filesystems = { MEMFS: MEMFS, IDBFS: IDBFS };
  },
  init: function (input, output, error) {
    FS.init.initialized = true;
    FS.ensureErrnoError();
    Module["stdin"] = input || Module["stdin"];
    Module["stdout"] = output || Module["stdout"];
    Module["stderr"] = error || Module["stderr"];
    FS.createStandardStreams();
  },
  quit: function () {
    FS.init.initialized = false;
    var fflush = Module["_fflush"];
    if (fflush) fflush(0);
    for (var i = 0; i < FS.streams.length; i++) {
      var stream = FS.streams[i];
      if (!stream) {
        continue;
      }
      FS.close(stream);
    }
  },
  getMode: function (canRead, canWrite) {
    var mode = 0;
    if (canRead) mode |= 292 | 73;
    if (canWrite) mode |= 146;
    return mode;
  },
  joinPath: function (parts, forceRelative) {
    var path = PATH.join.apply(null, parts);
    if (forceRelative && path[0] == "/") path = path.substr(1);
    return path;
  },
  absolutePath: function (relative, base) {
    return PATH_FS.resolve(base, relative);
  },
  standardizePath: function (path) {
    return PATH.normalize(path);
  },
  findObject: function (path, dontResolveLastLink) {
    var ret = FS.analyzePath(path, dontResolveLastLink);
    if (ret.exists) {
      return ret.object;
    } else {
      setErrNo(ret.error);
      return null;
    }
  },
  analyzePath: function (path, dontResolveLastLink) {
    try {
      var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      path = lookup.path;
    } catch (e) {}
    var ret = {
      isRoot: false,
      exists: false,
      error: 0,
      name: null,
      path: null,
      object: null,
      parentExists: false,
      parentPath: null,
      parentObject: null,
    };
    try {
      var lookup = FS.lookupPath(path, { parent: true });
      ret.parentExists = true;
      ret.parentPath = lookup.path;
      ret.parentObject = lookup.node;
      ret.name = PATH.basename(path);
      lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
      ret.exists = true;
      ret.path = lookup.path;
      ret.object = lookup.node;
      ret.name = lookup.node.name;
      ret.isRoot = lookup.path === "/";
    } catch (e) {
      ret.error = e.errno;
    }
    return ret;
  },
  createFolder: function (parent, name, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.mkdir(path, mode);
  },
  createPath: function (parent, path, canRead, canWrite) {
    parent = typeof parent === "string" ? parent : FS.getPath(parent);
    var parts = path.split("/").reverse();
    while (parts.length) {
      var part = parts.pop();
      if (!part) continue;
      var current = PATH.join2(parent, part);
      try {
        FS.mkdir(current);
      } catch (e) {}
      parent = current;
    }
    return current;
  },
  createFile: function (parent, name, properties, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(canRead, canWrite);
    return FS.create(path, mode);
  },
  createDataFile: function (parent, name, data, canRead, canWrite, canOwn) {
    var path = name
      ? PATH.join2(
          typeof parent === "string" ? parent : FS.getPath(parent),
          name
        )
      : parent;
    var mode = FS.getMode(canRead, canWrite);
    var node = FS.create(path, mode);
    if (data) {
      if (typeof data === "string") {
        var arr = new Array(data.length);
        for (var i = 0, len = data.length; i < len; ++i)
          arr[i] = data.charCodeAt(i);
        data = arr;
      }
      FS.chmod(node, mode | 146);
      var stream = FS.open(node, "w");
      FS.write(stream, data, 0, data.length, 0, canOwn);
      FS.close(stream);
      FS.chmod(node, mode);
    }
    return node;
  },
  createDevice: function (parent, name, input, output) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    var mode = FS.getMode(!!input, !!output);
    if (!FS.createDevice.major) FS.createDevice.major = 64;
    var dev = FS.makedev(FS.createDevice.major++, 0);
    FS.registerDevice(dev, {
      open: function (stream) {
        stream.seekable = false;
      },
      close: function (stream) {
        if (output && output.buffer && output.buffer.length) {
          output(10);
        }
      },
      read: function (stream, buffer, offset, length, pos) {
        var bytesRead = 0;
        for (var i = 0; i < length; i++) {
          var result;
          try {
            result = input();
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (result === undefined && bytesRead === 0) {
            throw new FS.ErrnoError(6);
          }
          if (result === null || result === undefined) break;
          bytesRead++;
          buffer[offset + i] = result;
        }
        if (bytesRead) {
          stream.node.timestamp = Date.now();
        }
        return bytesRead;
      },
      write: function (stream, buffer, offset, length, pos) {
        for (var i = 0; i < length; i++) {
          try {
            output(buffer[offset + i]);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
        if (length) {
          stream.node.timestamp = Date.now();
        }
        return i;
      },
    });
    return FS.mkdev(path, mode, dev);
  },
  createLink: function (parent, name, target, canRead, canWrite) {
    var path = PATH.join2(
      typeof parent === "string" ? parent : FS.getPath(parent),
      name
    );
    return FS.symlink(target, path);
  },
  forceLoadFile: function (obj) {
    if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
    var success = true;
    if (typeof XMLHttpRequest !== "undefined") {
      throw new Error(
        "Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."
      );
    } else if (read_) {
      try {
        obj.contents = intArrayFromString(read_(obj.url), true);
        obj.usedBytes = obj.contents.length;
      } catch (e) {
        success = false;
      }
    } else {
      throw new Error("Cannot load without read() or XMLHttpRequest.");
    }
    if (!success) setErrNo(29);
    return success;
  },
  createLazyFile: function (parent, name, url, canRead, canWrite) {
    function LazyUint8Array() {
      this.lengthKnown = false;
      this.chunks = [];
    }
    LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
      if (idx > this.length - 1 || idx < 0) {
        return undefined;
      }
      var chunkOffset = idx % this.chunkSize;
      var chunkNum = (idx / this.chunkSize) | 0;
      return this.getter(chunkNum)[chunkOffset];
    };
    LazyUint8Array.prototype.setDataGetter =
      function LazyUint8Array_setDataGetter(getter) {
        this.getter = getter;
      };
    LazyUint8Array.prototype.cacheLength =
      function LazyUint8Array_cacheLength() {
        var xhr = new XMLHttpRequest();
        xhr.open("HEAD", url, false);
        xhr.send(null);
        if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
          throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
        var datalength = Number(xhr.getResponseHeader("Content-length"));
        var header;
        var hasByteServing =
          (header = xhr.getResponseHeader("Accept-Ranges")) &&
          header === "bytes";
        var usesGzip =
          (header = xhr.getResponseHeader("Content-Encoding")) &&
          header === "gzip";
        var chunkSize = 1024 * 1024;
        if (!hasByteServing) chunkSize = datalength;
        var doXHR = function (from, to) {
          if (from > to)
            throw new Error(
              "invalid range (" + from + ", " + to + ") or no bytes requested!"
            );
          if (to > datalength - 1)
            throw new Error(
              "only " + datalength + " bytes available! programmer error!"
            );
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          if (datalength !== chunkSize)
            xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
          if (typeof Uint8Array != "undefined")
            xhr.responseType = "arraybuffer";
          if (xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
          }
          xhr.send(null);
          if (!((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304))
            throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          if (xhr.response !== undefined) {
            return new Uint8Array(xhr.response || []);
          } else {
            return intArrayFromString(xhr.responseText || "", true);
          }
        };
        var lazyArray = this;
        lazyArray.setDataGetter(function (chunkNum) {
          var start = chunkNum * chunkSize;
          var end = (chunkNum + 1) * chunkSize - 1;
          end = Math.min(end, datalength - 1);
          if (typeof lazyArray.chunks[chunkNum] === "undefined") {
            lazyArray.chunks[chunkNum] = doXHR(start, end);
          }
          if (typeof lazyArray.chunks[chunkNum] === "undefined")
            throw new Error("doXHR failed!");
          return lazyArray.chunks[chunkNum];
        });
        if (usesGzip || !datalength) {
          chunkSize = datalength = 1;
          datalength = this.getter(0).length;
          chunkSize = datalength;
          out(
            "LazyFiles on gzip forces download of the whole file when length is accessed"
          );
        }
        this._length = datalength;
        this._chunkSize = chunkSize;
        this.lengthKnown = true;
      };
    if (typeof XMLHttpRequest !== "undefined") {
      if (!ENVIRONMENT_IS_WORKER)
        throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
      var lazyArray = new LazyUint8Array();
      Object.defineProperties(lazyArray, {
        length: {
          get: function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          },
        },
        chunkSize: {
          get: function () {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          },
        },
      });
      var properties = { isDevice: false, contents: lazyArray };
    } else {
      var properties = { isDevice: false, url: url };
    }
    var node = FS.createFile(parent, name, properties, canRead, canWrite);
    if (properties.contents) {
      node.contents = properties.contents;
    } else if (properties.url) {
      node.contents = null;
      node.url = properties.url;
    }
    Object.defineProperties(node, {
      usedBytes: {
        get: function () {
          return this.contents.length;
        },
      },
    });
    var stream_ops = {};
    var keys = Object.keys(node.stream_ops);
    keys.forEach(function (key) {
      var fn = node.stream_ops[key];
      stream_ops[key] = function forceLoadLazyFile() {
        if (!FS.forceLoadFile(node)) {
          throw new FS.ErrnoError(29);
        }
        return fn.apply(null, arguments);
      };
    });
    stream_ops.read = function stream_ops_read(
      stream,
      buffer,
      offset,
      length,
      position
    ) {
      if (!FS.forceLoadFile(node)) {
        throw new FS.ErrnoError(29);
      }
      var contents = stream.node.contents;
      if (position >= contents.length) return 0;
      var size = Math.min(contents.length - position, length);
      if (contents.slice) {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents[position + i];
        }
      } else {
        for (var i = 0; i < size; i++) {
          buffer[offset + i] = contents.get(position + i);
        }
      }
      return size;
    };
    node.stream_ops = stream_ops;
    return node;
  },
  createPreloadedFile: function (
    parent,
    name,
    url,
    canRead,
    canWrite,
    onload,
    onerror,
    dontCreateFile,
    canOwn,
    preFinish
  ) {
    Browser.init();
    var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
    var dep = getUniqueRunDependency("cp " + fullname);
    function processData(byteArray) {
      function finish(byteArray) {
        if (preFinish) preFinish();
        if (!dontCreateFile) {
          FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
        if (onload) onload();
        removeRunDependency(dep);
      }
      var handled = false;
      Module["preloadPlugins"].forEach(function (plugin) {
        if (handled) return;
        if (plugin["canHandle"](fullname)) {
          plugin["handle"](byteArray, fullname, finish, function () {
            if (onerror) onerror();
            removeRunDependency(dep);
          });
          handled = true;
        }
      });
      if (!handled) finish(byteArray);
    }
    addRunDependency(dep);
    if (typeof url == "string") {
      Browser.asyncLoad(
        url,
        function (byteArray) {
          processData(byteArray);
        },
        onerror
      );
    } else {
      processData(url);
    }
  },
  indexedDB: function () {
    return (
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB
    );
  },
  DB_NAME: function () {
    return "EM_FS_" + window.location.pathname;
  },
  DB_VERSION: 20,
  DB_STORE_NAME: "FILE_DATA",
  saveFilesToDB: function (paths, onload, onerror) {
    onload = onload || function () {};
    onerror = onerror || function () {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
      out("creating db");
      var db = openRequest.result;
      db.createObjectStore(FS.DB_STORE_NAME);
    };
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function (path) {
        var putRequest = files.put(FS.analyzePath(path).object.contents, path);
        putRequest.onsuccess = function putRequest_onsuccess() {
          ok++;
          if (ok + fail == total) finish();
        };
        putRequest.onerror = function putRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
  loadFilesFromDB: function (paths, onload, onerror) {
    onload = onload || function () {};
    onerror = onerror || function () {};
    var indexedDB = FS.indexedDB();
    try {
      var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
    } catch (e) {
      return onerror(e);
    }
    openRequest.onupgradeneeded = onerror;
    openRequest.onsuccess = function openRequest_onsuccess() {
      var db = openRequest.result;
      try {
        var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
      } catch (e) {
        onerror(e);
        return;
      }
      var files = transaction.objectStore(FS.DB_STORE_NAME);
      var ok = 0,
        fail = 0,
        total = paths.length;
      function finish() {
        if (fail == 0) onload();
        else onerror();
      }
      paths.forEach(function (path) {
        var getRequest = files.get(path);
        getRequest.onsuccess = function getRequest_onsuccess() {
          if (FS.analyzePath(path).exists) {
            FS.unlink(path);
          }
          FS.createDataFile(
            PATH.dirname(path),
            PATH.basename(path),
            getRequest.result,
            true,
            true,
            true
          );
          ok++;
          if (ok + fail == total) finish();
        };
        getRequest.onerror = function getRequest_onerror() {
          fail++;
          if (ok + fail == total) finish();
        };
      });
      transaction.onerror = onerror;
    };
    openRequest.onerror = onerror;
  },
  mmapAlloc: function (size) {
    var alignedSize = alignMemory(size, 16384);
    var ptr = _malloc(alignedSize);
    while (size < alignedSize) HEAP8[ptr + size++] = 0;
    return ptr;
  },
};
var SYSCALLS = {
  mappings: {},
  DEFAULT_POLLMASK: 5,
  umask: 511,
  calculateAt: function (dirfd, path) {
    if (path[0] !== "/") {
      var dir;
      if (dirfd === -100) {
        dir = FS.cwd();
      } else {
        var dirstream = FS.getStream(dirfd);
        if (!dirstream) throw new FS.ErrnoError(8);
        dir = dirstream.path;
      }
      path = PATH.join2(dir, path);
    }
    return path;
  },
  doStat: function (func, path, buf) {
    try {
      var stat = func(path);
    } catch (e) {
      if (
        e &&
        e.node &&
        PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))
      ) {
        return -54;
      }
      throw e;
    }
    HEAP32[buf >> 2] = stat.dev;
    HEAP32[(buf + 4) >> 2] = 0;
    HEAP32[(buf + 8) >> 2] = stat.ino;
    HEAP32[(buf + 12) >> 2] = stat.mode;
    HEAP32[(buf + 16) >> 2] = stat.nlink;
    HEAP32[(buf + 20) >> 2] = stat.uid;
    HEAP32[(buf + 24) >> 2] = stat.gid;
    HEAP32[(buf + 28) >> 2] = stat.rdev;
    HEAP32[(buf + 32) >> 2] = 0;
    (tempI64 = [
      stat.size >>> 0,
      ((tempDouble = stat.size),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[(buf + 40) >> 2] = tempI64[0]),
      (HEAP32[(buf + 44) >> 2] = tempI64[1]);
    HEAP32[(buf + 48) >> 2] = 4096;
    HEAP32[(buf + 52) >> 2] = stat.blocks;
    HEAP32[(buf + 56) >> 2] = (stat.atime.getTime() / 1e3) | 0;
    HEAP32[(buf + 60) >> 2] = 0;
    HEAP32[(buf + 64) >> 2] = (stat.mtime.getTime() / 1e3) | 0;
    HEAP32[(buf + 68) >> 2] = 0;
    HEAP32[(buf + 72) >> 2] = (stat.ctime.getTime() / 1e3) | 0;
    HEAP32[(buf + 76) >> 2] = 0;
    (tempI64 = [
      stat.ino >>> 0,
      ((tempDouble = stat.ino),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[(buf + 80) >> 2] = tempI64[0]),
      (HEAP32[(buf + 84) >> 2] = tempI64[1]);
    return 0;
  },
  doMsync: function (addr, stream, len, flags, offset) {
    var buffer = HEAPU8.slice(addr, addr + len);
    FS.msync(stream, buffer, offset, len, flags);
  },
  doMkdir: function (path, mode) {
    path = PATH.normalize(path);
    if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
    FS.mkdir(path, mode, 0);
    return 0;
  },
  doMknod: function (path, mode, dev) {
    switch (mode & 61440) {
      case 32768:
      case 8192:
      case 24576:
      case 4096:
      case 49152:
        break;
      default:
        return -28;
    }
    FS.mknod(path, mode, dev);
    return 0;
  },
  doReadlink: function (path, buf, bufsize) {
    if (bufsize <= 0) return -28;
    var ret = FS.readlink(path);
    var len = Math.min(bufsize, lengthBytesUTF8(ret));
    var endChar = HEAP8[buf + len];
    stringToUTF8(ret, buf, bufsize + 1);
    HEAP8[buf + len] = endChar;
    return len;
  },
  doAccess: function (path, amode) {
    if (amode & ~7) {
      return -28;
    }
    var node;
    var lookup = FS.lookupPath(path, { follow: true });
    node = lookup.node;
    if (!node) {
      return -44;
    }
    var perms = "";
    if (amode & 4) perms += "r";
    if (amode & 2) perms += "w";
    if (amode & 1) perms += "x";
    if (perms && FS.nodePermissions(node, perms)) {
      return -2;
    }
    return 0;
  },
  doDup: function (path, flags, suggestFD) {
    var suggest = FS.getStream(suggestFD);
    if (suggest) FS.close(suggest);
    return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
  },
  doReadv: function (stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.read(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
      if (curr < len) break;
    }
    return ret;
  },
  doWritev: function (stream, iov, iovcnt, offset) {
    var ret = 0;
    for (var i = 0; i < iovcnt; i++) {
      var ptr = HEAP32[(iov + i * 8) >> 2];
      var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
      var curr = FS.write(stream, HEAP8, ptr, len, offset);
      if (curr < 0) return -1;
      ret += curr;
    }
    return ret;
  },
  varargs: undefined,
  get: function () {
    SYSCALLS.varargs += 4;
    var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
    return ret;
  },
  getStr: function (ptr) {
    var ret = UTF8ToString(ptr);
    return ret;
  },
  getStreamFromFD: function (fd) {
    var stream = FS.getStream(fd);
    if (!stream) throw new FS.ErrnoError(8);
    return stream;
  },
  get64: function (low, high) {
    return low;
  },
};
function ___sys_access(path, amode) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doAccess(path, amode);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_chmod(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chmod(path, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_chown32(path, owner, group) {
  try {
    path = SYSCALLS.getStr(path);
    FS.chown(path, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchmod(fd, mode) {
  try {
    FS.fchmod(fd, mode);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fchown32(fd, owner, group) {
  try {
    FS.fchown(fd, owner, group);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (cmd) {
      case 0: {
        var arg = SYSCALLS.get();
        if (arg < 0) {
          return -28;
        }
        var newStream;
        newStream = FS.open(stream.path, stream.flags, 0, arg);
        return newStream.fd;
      }
      case 1:
      case 2:
        return 0;
      case 3:
        return stream.flags;
      case 4: {
        var arg = SYSCALLS.get();
        stream.flags |= arg;
        return 0;
      }
      case 12: {
        var arg = SYSCALLS.get();
        var offset = 0;
        HEAP16[(arg + offset) >> 1] = 2;
        return 0;
      }
      case 13:
      case 14:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        setErrNo(28);
        return -1;
      default: {
        return -28;
      }
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_fstat64(fd, buf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return SYSCALLS.doStat(FS.stat, stream.path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_ftruncate64(fd, zero, low, high) {
  try {
    var length = SYSCALLS.get64(low, high);
    FS.ftruncate(fd, length);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getcwd(buf, size) {
  try {
    if (size === 0) return -28;
    var cwd = FS.cwd();
    var cwdLengthInBytes = lengthBytesUTF8(cwd);
    if (size < cwdLengthInBytes + 1) return -68;
    stringToUTF8(cwd, buf, size);
    return buf;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getdents64(fd, dirp, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (!stream.getdents) {
      stream.getdents = FS.readdir(stream.path);
    }
    var struct_size = 280;
    var pos = 0;
    var off = FS.llseek(stream, 0, 1);
    var idx = Math.floor(off / struct_size);
    while (idx < stream.getdents.length && pos + struct_size <= count) {
      var id;
      var type;
      var name = stream.getdents[idx];
      if (name[0] === ".") {
        id = 1;
        type = 4;
      } else {
        var child = FS.lookupNode(stream.node, name);
        id = child.id;
        type = FS.isChrdev(child.mode)
          ? 2
          : FS.isDir(child.mode)
          ? 4
          : FS.isLink(child.mode)
          ? 10
          : 8;
      }
      (tempI64 = [
        id >>> 0,
        ((tempDouble = id),
        +Math_abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math_ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(dirp + pos) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 4) >> 2] = tempI64[1]);
      (tempI64 = [
        ((idx + 1) * struct_size) >>> 0,
        ((tempDouble = (idx + 1) * struct_size),
        +Math_abs(tempDouble) >= 1
          ? tempDouble > 0
            ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) |
                0) >>>
              0
            : ~~+Math_ceil(
                (tempDouble - +(~~tempDouble >>> 0)) / 4294967296
              ) >>> 0
          : 0),
      ]),
        (HEAP32[(dirp + pos + 8) >> 2] = tempI64[0]),
        (HEAP32[(dirp + pos + 12) >> 2] = tempI64[1]);
      HEAP16[(dirp + pos + 16) >> 1] = 280;
      HEAP8[(dirp + pos + 18) >> 0] = type;
      stringToUTF8(name, dirp + pos + 19, 256);
      pos += struct_size;
      idx += 1;
    }
    FS.llseek(stream, idx * struct_size, 0);
    return pos;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_getegid32() {
  return 0;
}
function ___sys_geteuid32() {
  return ___sys_getegid32();
}
function ___sys_getpid() {
  return 42;
}
function ___sys_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    switch (op) {
      case 21509:
      case 21505: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21510:
      case 21511:
      case 21512:
      case 21506:
      case 21507:
      case 21508: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21519: {
        if (!stream.tty) return -59;
        var argp = SYSCALLS.get();
        HEAP32[argp >> 2] = 0;
        return 0;
      }
      case 21520: {
        if (!stream.tty) return -59;
        return -28;
      }
      case 21531: {
        var argp = SYSCALLS.get();
        return FS.ioctl(stream, op, argp);
      }
      case 21523: {
        if (!stream.tty) return -59;
        return 0;
      }
      case 21524: {
        if (!stream.tty) return -59;
        return 0;
      }
      default:
        abort("bad ioctl syscall " + op);
    }
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_lstat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.lstat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_mkdir(path, mode) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doMkdir(path, mode);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function syscallMmap2(addr, len, prot, flags, fd, off) {
  off <<= 12;
  var ptr;
  var allocated = false;
  if ((flags & 16) !== 0 && addr % 16384 !== 0) {
    return -28;
  }
  if ((flags & 32) !== 0) {
    ptr = _memalign(16384, len);
    if (!ptr) return -48;
    _memset(ptr, 0, len);
    allocated = true;
  } else {
    var info = FS.getStream(fd);
    if (!info) return -8;
    var res = FS.mmap(info, addr, len, off, prot, flags);
    ptr = res.ptr;
    allocated = res.allocated;
  }
  SYSCALLS.mappings[ptr] = {
    malloc: ptr,
    len: len,
    allocated: allocated,
    fd: fd,
    prot: prot,
    flags: flags,
    offset: off,
  };
  return ptr;
}
function ___sys_mmap2(addr, len, prot, flags, fd, off) {
  try {
    return syscallMmap2(addr, len, prot, flags, fd, off);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function syscallMunmap(addr, len) {
  if ((addr | 0) === -1 || len === 0) {
    return -28;
  }
  var info = SYSCALLS.mappings[addr];
  if (!info) return 0;
  if (len === info.len) {
    var stream = FS.getStream(info.fd);
    if (info.prot & 2) {
      SYSCALLS.doMsync(addr, stream, len, info.flags, info.offset);
    }
    FS.munmap(stream);
    SYSCALLS.mappings[addr] = null;
    if (info.allocated) {
      _free(info.malloc);
    }
  }
  return 0;
}
function ___sys_munmap(addr, len) {
  try {
    return syscallMunmap(addr, len);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_open(path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
    var pathname = SYSCALLS.getStr(path);
    var mode = SYSCALLS.get();
    var stream = FS.open(pathname, flags, mode);
    return stream.fd;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_read(fd, buf, count) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    return FS.read(stream, HEAP8, buf, count);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_readlink(path, buf, bufsize) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doReadlink(path, buf, bufsize);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rename(old_path, new_path) {
  try {
    old_path = SYSCALLS.getStr(old_path);
    new_path = SYSCALLS.getStr(new_path);
    FS.rename(old_path, new_path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_rmdir(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.rmdir(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_stat64(path, buf) {
  try {
    path = SYSCALLS.getStr(path);
    return SYSCALLS.doStat(FS.stat, path, buf);
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_statfs64(path, size, buf) {
  try {
    path = SYSCALLS.getStr(path);
    HEAP32[(buf + 4) >> 2] = 4096;
    HEAP32[(buf + 40) >> 2] = 4096;
    HEAP32[(buf + 8) >> 2] = 1e6;
    HEAP32[(buf + 12) >> 2] = 5e5;
    HEAP32[(buf + 16) >> 2] = 5e5;
    HEAP32[(buf + 20) >> 2] = FS.nextInode;
    HEAP32[(buf + 24) >> 2] = 1e6;
    HEAP32[(buf + 28) >> 2] = 42;
    HEAP32[(buf + 44) >> 2] = 2;
    HEAP32[(buf + 36) >> 2] = 255;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_umask(mask) {
  try {
    var old = SYSCALLS.umask;
    SYSCALLS.umask = mask;
    return old;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function ___sys_unlink(path) {
  try {
    path = SYSCALLS.getStr(path);
    FS.unlink(path);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
}
function _emscripten_set_main_loop_timing(mode, value) {
  Browser.mainLoop.timingMode = mode;
  Browser.mainLoop.timingValue = value;
  if (!Browser.mainLoop.func) {
    return 1;
  }
  if (mode == 0) {
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setTimeout() {
        var timeUntilNextTick =
          Math.max(
            0,
            Browser.mainLoop.tickStartTime + value - _emscripten_get_now()
          ) | 0;
        setTimeout(Browser.mainLoop.runner, timeUntilNextTick);
      };
    Browser.mainLoop.method = "timeout";
  } else if (mode == 1) {
    Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
      Browser.requestAnimationFrame(Browser.mainLoop.runner);
    };
    Browser.mainLoop.method = "rAF";
  } else if (mode == 2) {
    if (typeof setImmediate === "undefined") {
      var setImmediates = [];
      var emscriptenMainLoopMessageId = "setimmediate";
      var Browser_setImmediate_messageHandler = function (event) {
        if (
          event.data === emscriptenMainLoopMessageId ||
          event.data.target === emscriptenMainLoopMessageId
        ) {
          event.stopPropagation();
          setImmediates.shift()();
        }
      };
      addEventListener("message", Browser_setImmediate_messageHandler, true);
      setImmediate = function Browser_emulated_setImmediate(func) {
        setImmediates.push(func);
        if (ENVIRONMENT_IS_WORKER) {
          if (Module["setImmediates"] === undefined)
            Module["setImmediates"] = [];
          Module["setImmediates"].push(func);
          postMessage({ target: emscriptenMainLoopMessageId });
        } else postMessage(emscriptenMainLoopMessageId, "*");
      };
    }
    Browser.mainLoop.scheduler =
      function Browser_mainLoop_scheduler_setImmediate() {
        setImmediate(Browser.mainLoop.runner);
      };
    Browser.mainLoop.method = "immediate";
  }
  return 0;
}
var _emscripten_get_now;
if (ENVIRONMENT_IS_NODE) {
  _emscripten_get_now = function () {
    var t = process["hrtime"]();
    return t[0] * 1e3 + t[1] / 1e6;
  };
} else if (typeof dateNow !== "undefined") {
  _emscripten_get_now = dateNow;
} else
  _emscripten_get_now = function () {
    return performance.now();
  };
function _emscripten_set_main_loop(
  func,
  fps,
  simulateInfiniteLoop,
  arg,
  noSetTiming
) {
  noExitRuntime = true;
  assert(
    !Browser.mainLoop.func,
    "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."
  );
  Browser.mainLoop.func = func;
  Browser.mainLoop.arg = arg;
  var browserIterationFunc;
  if (typeof arg !== "undefined") {
    browserIterationFunc = function () {
      Module["dynCall_vi"](func, arg);
    };
  } else {
    browserIterationFunc = function () {
      Module["dynCall_v"](func);
    };
  }
  var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
  Browser.mainLoop.runner = function Browser_mainLoop_runner() {
    if (ABORT) return;
    if (Browser.mainLoop.queue.length > 0) {
      var start = Date.now();
      var blocker = Browser.mainLoop.queue.shift();
      blocker.func(blocker.arg);
      if (Browser.mainLoop.remainingBlockers) {
        var remaining = Browser.mainLoop.remainingBlockers;
        var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
        if (blocker.counted) {
          Browser.mainLoop.remainingBlockers = next;
        } else {
          next = next + 0.5;
          Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9;
        }
      }
      console.log(
        'main loop blocker "' +
          blocker.name +
          '" took ' +
          (Date.now() - start) +
          " ms"
      );
      Browser.mainLoop.updateStatus();
      if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
      setTimeout(Browser.mainLoop.runner, 0);
      return;
    }
    if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
    Browser.mainLoop.currentFrameNumber =
      (Browser.mainLoop.currentFrameNumber + 1) | 0;
    if (
      Browser.mainLoop.timingMode == 1 &&
      Browser.mainLoop.timingValue > 1 &&
      Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0
    ) {
      Browser.mainLoop.scheduler();
      return;
    } else if (Browser.mainLoop.timingMode == 0) {
      Browser.mainLoop.tickStartTime = _emscripten_get_now();
    }
    GL.newRenderingFrameStarted();
    Browser.mainLoop.runIter(browserIterationFunc);
    if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
    if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData)
      SDL.audio.queueNewAudioData();
    Browser.mainLoop.scheduler();
  };
  if (!noSetTiming) {
    if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
    else _emscripten_set_main_loop_timing(1, 1);
    Browser.mainLoop.scheduler();
  }
  if (simulateInfiniteLoop) {
    throw "unwind";
  }
}
var Browser = {
  mainLoop: {
    scheduler: null,
    method: "",
    currentlyRunningMainloop: 0,
    func: null,
    arg: 0,
    timingMode: 0,
    timingValue: 0,
    currentFrameNumber: 0,
    queue: [],
    pause: function () {
      Browser.mainLoop.scheduler = null;
      Browser.mainLoop.currentlyRunningMainloop++;
    },
    resume: function () {
      Browser.mainLoop.currentlyRunningMainloop++;
      var timingMode = Browser.mainLoop.timingMode;
      var timingValue = Browser.mainLoop.timingValue;
      var func = Browser.mainLoop.func;
      Browser.mainLoop.func = null;
      _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
      _emscripten_set_main_loop_timing(timingMode, timingValue);
      Browser.mainLoop.scheduler();
    },
    updateStatus: function () {
      if (Module["setStatus"]) {
        var message = Module["statusMessage"] || "Please wait...";
        var remaining = Browser.mainLoop.remainingBlockers;
        var expected = Browser.mainLoop.expectedBlockers;
        if (remaining) {
          if (remaining < expected) {
            Module["setStatus"](
              message + " (" + (expected - remaining) + "/" + expected + ")"
            );
          } else {
            Module["setStatus"](message);
          }
        } else {
          Module["setStatus"]("");
        }
      }
    },
    runIter: function (func) {
      if (ABORT) return;
      if (Module["preMainLoop"]) {
        var preRet = Module["preMainLoop"]();
        if (preRet === false) {
          return;
        }
      }
      try {
        func();
      } catch (e) {
        if (e instanceof ExitStatus) {
          return;
        } else if (e == "unwind") {
          return;
        } else {
          if (e && typeof e === "object" && e.stack)
            err("exception thrown: " + [e, e.stack]);
          throw e;
        }
      }
      if (Module["postMainLoop"]) Module["postMainLoop"]();
    },
  },
  isFullscreen: false,
  pointerLock: false,
  moduleContextCreatedCallbacks: [],
  workers: [],
  init: function () {
    if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
    if (Browser.initted) return;
    Browser.initted = true;
    try {
      new Blob();
      Browser.hasBlobConstructor = true;
    } catch (e) {
      Browser.hasBlobConstructor = false;
      console.log(
        "warning: no blob constructor, cannot create blobs with mimetypes"
      );
    }
    Browser.BlobBuilder =
      typeof MozBlobBuilder != "undefined"
        ? MozBlobBuilder
        : typeof WebKitBlobBuilder != "undefined"
        ? WebKitBlobBuilder
        : !Browser.hasBlobConstructor
        ? console.log("warning: no BlobBuilder")
        : null;
    Browser.URLObject =
      typeof window != "undefined"
        ? window.URL
          ? window.URL
          : window.webkitURL
        : undefined;
    if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
      console.log(
        "warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."
      );
      Module.noImageDecoding = true;
    }
    var imagePlugin = {};
    imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
      return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
    };
    imagePlugin["handle"] = function imagePlugin_handle(
      byteArray,
      name,
      onload,
      onerror
    ) {
      var b = null;
      if (Browser.hasBlobConstructor) {
        try {
          b = new Blob([byteArray], { type: Browser.getMimetype(name) });
          if (b.size !== byteArray.length) {
            b = new Blob([new Uint8Array(byteArray).buffer], {
              type: Browser.getMimetype(name),
            });
          }
        } catch (e) {
          warnOnce(
            "Blob constructor present but fails: " +
              e +
              "; falling back to blob builder"
          );
        }
      }
      if (!b) {
        var bb = new Browser.BlobBuilder();
        bb.append(new Uint8Array(byteArray).buffer);
        b = bb.getBlob();
      }
      var url = Browser.URLObject.createObjectURL(b);
      var img = new Image();
      img.onload = function img_onload() {
        assert(img.complete, "Image " + name + " could not be decoded");
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        Module["preloadedImages"][name] = canvas;
        Browser.URLObject.revokeObjectURL(url);
        if (onload) onload(byteArray);
      };
      img.onerror = function img_onerror(event) {
        console.log("Image " + url + " could not be decoded");
        if (onerror) onerror();
      };
      img.src = url;
    };
    Module["preloadPlugins"].push(imagePlugin);
    var audioPlugin = {};
    audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
      return (
        !Module.noAudioDecoding &&
        name.substr(-4) in { ".ogg": 1, ".wav": 1, ".mp3": 1 }
      );
    };
    audioPlugin["handle"] = function audioPlugin_handle(
      byteArray,
      name,
      onload,
      onerror
    ) {
      var done = false;
      function finish(audio) {
        if (done) return;
        done = true;
        Module["preloadedAudios"][name] = audio;
        if (onload) onload(byteArray);
      }
      function fail() {
        if (done) return;
        done = true;
        Module["preloadedAudios"][name] = new Audio();
        if (onerror) onerror();
      }
      if (Browser.hasBlobConstructor) {
        try {
          var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
        } catch (e) {
          return fail();
        }
        var url = Browser.URLObject.createObjectURL(b);
        var audio = new Audio();
        audio.addEventListener(
          "canplaythrough",
          function () {
            finish(audio);
          },
          false
        );
        audio.onerror = function audio_onerror(event) {
          if (done) return;
          console.log(
            "warning: browser could not fully decode audio " +
              name +
              ", trying slower base64 approach"
          );
          function encode64(data) {
            var BASE =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var PAD = "=";
            var ret = "";
            var leftchar = 0;
            var leftbits = 0;
            for (var i = 0; i < data.length; i++) {
              leftchar = (leftchar << 8) | data[i];
              leftbits += 8;
              while (leftbits >= 6) {
                var curr = (leftchar >> (leftbits - 6)) & 63;
                leftbits -= 6;
                ret += BASE[curr];
              }
            }
            if (leftbits == 2) {
              ret += BASE[(leftchar & 3) << 4];
              ret += PAD + PAD;
            } else if (leftbits == 4) {
              ret += BASE[(leftchar & 15) << 2];
              ret += PAD;
            }
            return ret;
          }
          audio.src =
            "data:audio/x-" +
            name.substr(-3) +
            ";base64," +
            encode64(byteArray);
          finish(audio);
        };
        audio.src = url;
        Browser.safeSetTimeout(function () {
          finish(audio);
        }, 1e4);
      } else {
        return fail();
      }
    };
    Module["preloadPlugins"].push(audioPlugin);
    function pointerLockChange() {
      Browser.pointerLock =
        document["pointerLockElement"] === Module["canvas"] ||
        document["mozPointerLockElement"] === Module["canvas"] ||
        document["webkitPointerLockElement"] === Module["canvas"] ||
        document["msPointerLockElement"] === Module["canvas"];
    }
    var canvas = Module["canvas"];
    if (canvas) {
      canvas.requestPointerLock =
        canvas["requestPointerLock"] ||
        canvas["mozRequestPointerLock"] ||
        canvas["webkitRequestPointerLock"] ||
        canvas["msRequestPointerLock"] ||
        function () {};
      canvas.exitPointerLock =
        document["exitPointerLock"] ||
        document["mozExitPointerLock"] ||
        document["webkitExitPointerLock"] ||
        document["msExitPointerLock"] ||
        function () {};
      canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
      document.addEventListener("pointerlockchange", pointerLockChange, false);
      document.addEventListener(
        "mozpointerlockchange",
        pointerLockChange,
        false
      );
      document.addEventListener(
        "webkitpointerlockchange",
        pointerLockChange,
        false
      );
      document.addEventListener(
        "mspointerlockchange",
        pointerLockChange,
        false
      );
      if (Module["elementPointerLock"]) {
        canvas.addEventListener(
          "click",
          function (ev) {
            if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
              Module["canvas"].requestPointerLock();
              ev.preventDefault();
            }
          },
          false
        );
      }
    }
  },
  createContext: function (
    canvas,
    useWebGL,
    setInModule,
    webGLContextAttributes
  ) {
    if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
    var ctx;
    var contextHandle;
    if (useWebGL) {
      var contextAttributes = {
        antialias: false,
        alpha: false,
        majorVersion: 1,
      };
      if (webGLContextAttributes) {
        for (var attribute in webGLContextAttributes) {
          contextAttributes[attribute] = webGLContextAttributes[attribute];
        }
      }
      if (typeof GL !== "undefined") {
        contextHandle = GL.createContext(canvas, contextAttributes);
        if (contextHandle) {
          ctx = GL.getContext(contextHandle).GLctx;
        }
      }
    } else {
      ctx = canvas.getContext("2d");
    }
    if (!ctx) return null;
    if (setInModule) {
      if (!useWebGL)
        assert(
          typeof GLctx === "undefined",
          "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"
        );
      Module.ctx = ctx;
      if (useWebGL) GL.makeContextCurrent(contextHandle);
      Module.useWebGL = useWebGL;
      Browser.moduleContextCreatedCallbacks.forEach(function (callback) {
        callback();
      });
      Browser.init();
    }
    return ctx;
  },
  destroyContext: function (canvas, useWebGL, setInModule) {},
  fullscreenHandlersInstalled: false,
  lockPointer: undefined,
  resizeCanvas: undefined,
  requestFullscreen: function (lockPointer, resizeCanvas) {
    Browser.lockPointer = lockPointer;
    Browser.resizeCanvas = resizeCanvas;
    if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
    if (typeof Browser.resizeCanvas === "undefined")
      Browser.resizeCanvas = false;
    var canvas = Module["canvas"];
    function fullscreenChange() {
      Browser.isFullscreen = false;
      var canvasContainer = canvas.parentNode;
      if (
        (document["fullscreenElement"] ||
          document["mozFullScreenElement"] ||
          document["msFullscreenElement"] ||
          document["webkitFullscreenElement"] ||
          document["webkitCurrentFullScreenElement"]) === canvasContainer
      ) {
        canvas.exitFullscreen = Browser.exitFullscreen;
        if (Browser.lockPointer) canvas.requestPointerLock();
        Browser.isFullscreen = true;
        if (Browser.resizeCanvas) {
          Browser.setFullscreenCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      } else {
        canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
        canvasContainer.parentNode.removeChild(canvasContainer);
        if (Browser.resizeCanvas) {
          Browser.setWindowedCanvasSize();
        } else {
          Browser.updateCanvasDimensions(canvas);
        }
      }
      if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
      if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen);
    }
    if (!Browser.fullscreenHandlersInstalled) {
      Browser.fullscreenHandlersInstalled = true;
      document.addEventListener("fullscreenchange", fullscreenChange, false);
      document.addEventListener("mozfullscreenchange", fullscreenChange, false);
      document.addEventListener(
        "webkitfullscreenchange",
        fullscreenChange,
        false
      );
      document.addEventListener("MSFullscreenChange", fullscreenChange, false);
    }
    var canvasContainer = document.createElement("div");
    canvas.parentNode.insertBefore(canvasContainer, canvas);
    canvasContainer.appendChild(canvas);
    canvasContainer.requestFullscreen =
      canvasContainer["requestFullscreen"] ||
      canvasContainer["mozRequestFullScreen"] ||
      canvasContainer["msRequestFullscreen"] ||
      (canvasContainer["webkitRequestFullscreen"]
        ? function () {
            canvasContainer["webkitRequestFullscreen"](
              Element["ALLOW_KEYBOARD_INPUT"]
            );
          }
        : null) ||
      (canvasContainer["webkitRequestFullScreen"]
        ? function () {
            canvasContainer["webkitRequestFullScreen"](
              Element["ALLOW_KEYBOARD_INPUT"]
            );
          }
        : null);
    canvasContainer.requestFullscreen();
  },
  exitFullscreen: function () {
    if (!Browser.isFullscreen) {
      return false;
    }
    var CFS =
      document["exitFullscreen"] ||
      document["cancelFullScreen"] ||
      document["mozCancelFullScreen"] ||
      document["msExitFullscreen"] ||
      document["webkitCancelFullScreen"] ||
      function () {};
    CFS.apply(document, []);
    return true;
  },
  nextRAF: 0,
  fakeRequestAnimationFrame: function (func) {
    var now = Date.now();
    if (Browser.nextRAF === 0) {
      Browser.nextRAF = now + 1e3 / 60;
    } else {
      while (now + 2 >= Browser.nextRAF) {
        Browser.nextRAF += 1e3 / 60;
      }
    }
    var delay = Math.max(Browser.nextRAF - now, 0);
    setTimeout(func, delay);
  },
  requestAnimationFrame: function (func) {
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(func);
      return;
    }
    var RAF = Browser.fakeRequestAnimationFrame;
    RAF(func);
  },
  safeCallback: function (func) {
    return function () {
      if (!ABORT) return func.apply(null, arguments);
    };
  },
  allowAsyncCallbacks: true,
  queuedAsyncCallbacks: [],
  pauseAsyncCallbacks: function () {
    Browser.allowAsyncCallbacks = false;
  },
  resumeAsyncCallbacks: function () {
    Browser.allowAsyncCallbacks = true;
    if (Browser.queuedAsyncCallbacks.length > 0) {
      var callbacks = Browser.queuedAsyncCallbacks;
      Browser.queuedAsyncCallbacks = [];
      callbacks.forEach(function (func) {
        func();
      });
    }
  },
  safeRequestAnimationFrame: function (func) {
    return Browser.requestAnimationFrame(function () {
      if (ABORT) return;
      if (Browser.allowAsyncCallbacks) {
        func();
      } else {
        Browser.queuedAsyncCallbacks.push(func);
      }
    });
  },
  safeSetTimeout: function (func, timeout) {
    noExitRuntime = true;
    return setTimeout(function () {
      if (ABORT) return;
      if (Browser.allowAsyncCallbacks) {
        func();
      } else {
        Browser.queuedAsyncCallbacks.push(func);
      }
    }, timeout);
  },
  safeSetInterval: function (func, timeout) {
    noExitRuntime = true;
    return setInterval(function () {
      if (ABORT) return;
      if (Browser.allowAsyncCallbacks) {
        func();
      }
    }, timeout);
  },
  getMimetype: function (name) {
    return {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      bmp: "image/bmp",
      ogg: "audio/ogg",
      wav: "audio/wav",
      mp3: "audio/mpeg",
    }[name.substr(name.lastIndexOf(".") + 1)];
  },
  getUserMedia: function (func) {
    if (!window.getUserMedia) {
      window.getUserMedia =
        navigator["getUserMedia"] || navigator["mozGetUserMedia"];
    }
    window.getUserMedia(func);
  },
  getMovementX: function (event) {
    return (
      event["movementX"] ||
      event["mozMovementX"] ||
      event["webkitMovementX"] ||
      0
    );
  },
  getMovementY: function (event) {
    return (
      event["movementY"] ||
      event["mozMovementY"] ||
      event["webkitMovementY"] ||
      0
    );
  },
  getMouseWheelDelta: function (event) {
    var delta = 0;
    switch (event.type) {
      case "DOMMouseScroll":
        delta = event.detail / 3;
        break;
      case "mousewheel":
        delta = event.wheelDelta / 120;
        break;
      case "wheel":
        delta = event.deltaY;
        switch (event.deltaMode) {
          case 0:
            delta /= 100;
            break;
          case 1:
            delta /= 3;
            break;
          case 2:
            delta *= 80;
            break;
          default:
            throw "unrecognized mouse wheel delta mode: " + event.deltaMode;
        }
        break;
      default:
        throw "unrecognized mouse wheel event: " + event.type;
    }
    return delta;
  },
  mouseX: 0,
  mouseY: 0,
  mouseMovementX: 0,
  mouseMovementY: 0,
  touches: {},
  lastTouches: {},
  calculateMouseEvent: function (event) {
    if (Browser.pointerLock) {
      if (event.type != "mousemove" && "mozMovementX" in event) {
        Browser.mouseMovementX = Browser.mouseMovementY = 0;
      } else {
        Browser.mouseMovementX = Browser.getMovementX(event);
        Browser.mouseMovementY = Browser.getMovementY(event);
      }
      if (typeof SDL != "undefined") {
        Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
        Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
      } else {
        Browser.mouseX += Browser.mouseMovementX;
        Browser.mouseY += Browser.mouseMovementY;
      }
    } else {
      var rect = Module["canvas"].getBoundingClientRect();
      var cw = Module["canvas"].width;
      var ch = Module["canvas"].height;
      var scrollX =
        typeof window.scrollX !== "undefined"
          ? window.scrollX
          : window.pageXOffset;
      var scrollY =
        typeof window.scrollY !== "undefined"
          ? window.scrollY
          : window.pageYOffset;
      if (
        event.type === "touchstart" ||
        event.type === "touchend" ||
        event.type === "touchmove"
      ) {
        var touch = event.touch;
        if (touch === undefined) {
          return;
        }
        var adjustedX = touch.pageX - (scrollX + rect.left);
        var adjustedY = touch.pageY - (scrollY + rect.top);
        adjustedX = adjustedX * (cw / rect.width);
        adjustedY = adjustedY * (ch / rect.height);
        var coords = { x: adjustedX, y: adjustedY };
        if (event.type === "touchstart") {
          Browser.lastTouches[touch.identifier] = coords;
          Browser.touches[touch.identifier] = coords;
        } else if (event.type === "touchend" || event.type === "touchmove") {
          var last = Browser.touches[touch.identifier];
          if (!last) last = coords;
          Browser.lastTouches[touch.identifier] = last;
          Browser.touches[touch.identifier] = coords;
        }
        return;
      }
      var x = event.pageX - (scrollX + rect.left);
      var y = event.pageY - (scrollY + rect.top);
      x = x * (cw / rect.width);
      y = y * (ch / rect.height);
      Browser.mouseMovementX = x - Browser.mouseX;
      Browser.mouseMovementY = y - Browser.mouseY;
      Browser.mouseX = x;
      Browser.mouseY = y;
    }
  },
  asyncLoad: function (url, onload, onerror, noRunDep) {
    var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
    readAsync(
      url,
      function (arrayBuffer) {
        assert(
          arrayBuffer,
          'Loading data file "' + url + '" failed (no arrayBuffer).'
        );
        onload(new Uint8Array(arrayBuffer));
        if (dep) removeRunDependency(dep);
      },
      function (event) {
        if (onerror) {
          onerror();
        } else {
          throw 'Loading data file "' + url + '" failed.';
        }
      }
    );
    if (dep) addRunDependency(dep);
  },
  resizeListeners: [],
  updateResizeListeners: function () {
    var canvas = Module["canvas"];
    Browser.resizeListeners.forEach(function (listener) {
      listener(canvas.width, canvas.height);
    });
  },
  setCanvasSize: function (width, height, noUpdates) {
    var canvas = Module["canvas"];
    Browser.updateCanvasDimensions(canvas, width, height);
    if (!noUpdates) Browser.updateResizeListeners();
  },
  windowedWidth: 0,
  windowedHeight: 0,
  setFullscreenCanvasSize: function () {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL.screen >> 2];
      flags = flags | 8388608;
      HEAP32[SDL.screen >> 2] = flags;
    }
    Browser.updateCanvasDimensions(Module["canvas"]);
    Browser.updateResizeListeners();
  },
  setWindowedCanvasSize: function () {
    if (typeof SDL != "undefined") {
      var flags = HEAPU32[SDL.screen >> 2];
      flags = flags & ~8388608;
      HEAP32[SDL.screen >> 2] = flags;
    }
    Browser.updateCanvasDimensions(Module["canvas"]);
    Browser.updateResizeListeners();
  },
  updateCanvasDimensions: function (canvas, wNative, hNative) {
    if (wNative && hNative) {
      canvas.widthNative = wNative;
      canvas.heightNative = hNative;
    } else {
      wNative = canvas.widthNative;
      hNative = canvas.heightNative;
    }
    var w = wNative;
    var h = hNative;
    if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
      if (w / h < Module["forcedAspectRatio"]) {
        w = Math.round(h * Module["forcedAspectRatio"]);
      } else {
        h = Math.round(w / Module["forcedAspectRatio"]);
      }
    }
    if (
      (document["fullscreenElement"] ||
        document["mozFullScreenElement"] ||
        document["msFullscreenElement"] ||
        document["webkitFullscreenElement"] ||
        document["webkitCurrentFullScreenElement"]) === canvas.parentNode &&
      typeof screen != "undefined"
    ) {
      var factor = Math.min(screen.width / w, screen.height / h);
      w = Math.round(w * factor);
      h = Math.round(h * factor);
    }
    if (Browser.resizeCanvas) {
      if (canvas.width != w) canvas.width = w;
      if (canvas.height != h) canvas.height = h;
      if (typeof canvas.style != "undefined") {
        canvas.style.removeProperty("width");
        canvas.style.removeProperty("height");
      }
    } else {
      if (canvas.width != wNative) canvas.width = wNative;
      if (canvas.height != hNative) canvas.height = hNative;
      if (typeof canvas.style != "undefined") {
        if (w != wNative || h != hNative) {
          canvas.style.setProperty("width", w + "px", "important");
          canvas.style.setProperty("height", h + "px", "important");
        } else {
          canvas.style.removeProperty("width");
          canvas.style.removeProperty("height");
        }
      }
    }
  },
  wgetRequests: {},
  nextWgetRequestHandle: 0,
  getNextWgetRequestHandle: function () {
    var handle = Browser.nextWgetRequestHandle;
    Browser.nextWgetRequestHandle++;
    return handle;
  },
};
function __emscripten_push_uncounted_main_loop_blocker(func, arg, name) {
  Browser.mainLoop.queue.push({
    func: function () {
      dynCall_vi(func, arg);
    },
    name: UTF8ToString(name),
    counted: false,
  });
  Browser.mainLoop.updateStatus();
}
function _abort() {
  abort();
}
var AL = {
  QUEUE_INTERVAL: 25,
  QUEUE_LOOKAHEAD: 0.1,
  DEVICE_NAME: "Emscripten OpenAL",
  CAPTURE_DEVICE_NAME: "Emscripten OpenAL capture",
  ALC_EXTENSIONS: { ALC_SOFT_pause_device: true, ALC_SOFT_HRTF: true },
  AL_EXTENSIONS: {
    AL_EXT_float32: true,
    AL_SOFT_loop_points: true,
    AL_SOFT_source_length: true,
    AL_EXT_source_distance_model: true,
    AL_SOFT_source_spatialize: true,
  },
  _alcErr: 0,
  alcErr: 0,
  deviceRefCounts: {},
  alcStringCache: {},
  paused: false,
  stringCache: {},
  contexts: {},
  currentCtx: null,
  buffers: {
    0: {
      id: 0,
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0,
    },
  },
  paramArray: [],
  _nextId: 1,
  newId: function () {
    return AL.freeIds.length > 0 ? AL.freeIds.pop() : AL._nextId++;
  },
  freeIds: [],
  scheduleContextAudio: function (ctx) {
    if (
      Browser.mainLoop.timingMode === 1 &&
      document["visibilityState"] != "visible"
    ) {
      return;
    }
    for (var i in ctx.sources) {
      AL.scheduleSourceAudio(ctx.sources[i]);
    }
  },
  scheduleSourceAudio: function (src, lookahead) {
    if (
      Browser.mainLoop.timingMode === 1 &&
      document["visibilityState"] != "visible"
    ) {
      return;
    }
    if (src.state !== 4114) {
      return;
    }
    var currentTime = AL.updateSourceTime(src);
    var startTime = src.bufStartTime;
    var startOffset = src.bufOffset;
    var bufCursor = src.bufsProcessed;
    for (var i = 0; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      startTime = audioSrc._startTime + audioSrc._duration;
      startOffset = 0;
      bufCursor += audioSrc._skipCount + 1;
    }
    if (!lookahead) {
      lookahead = AL.QUEUE_LOOKAHEAD;
    }
    var lookaheadTime = currentTime + lookahead;
    var skipCount = 0;
    while (startTime < lookaheadTime) {
      if (bufCursor >= src.bufQueue.length) {
        if (src.looping) {
          bufCursor %= src.bufQueue.length;
        } else {
          break;
        }
      }
      var buf = src.bufQueue[bufCursor % src.bufQueue.length];
      if (buf.length === 0) {
        skipCount++;
        if (skipCount === src.bufQueue.length) {
          break;
        }
      } else {
        var audioSrc = src.context.audioCtx.createBufferSource();
        audioSrc.buffer = buf.audioBuf;
        audioSrc.playbackRate.value = src.playbackRate;
        if (buf.audioBuf._loopStart || buf.audioBuf._loopEnd) {
          audioSrc.loopStart = buf.audioBuf._loopStart;
          audioSrc.loopEnd = buf.audioBuf._loopEnd;
        }
        var duration = 0;
        if (src.type === 4136 && src.looping) {
          duration = Number.POSITIVE_INFINITY;
          audioSrc.loop = true;
          if (buf.audioBuf._loopStart) {
            audioSrc.loopStart = buf.audioBuf._loopStart;
          }
          if (buf.audioBuf._loopEnd) {
            audioSrc.loopEnd = buf.audioBuf._loopEnd;
          }
        } else {
          duration = (buf.audioBuf.duration - startOffset) / src.playbackRate;
        }
        audioSrc._startOffset = startOffset;
        audioSrc._duration = duration;
        audioSrc._skipCount = skipCount;
        skipCount = 0;
        audioSrc.connect(src.gain);
        if (typeof audioSrc.start !== "undefined") {
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.start(startTime, startOffset);
        } else if (typeof audioSrc.noteOn !== "undefined") {
          startTime = Math.max(startTime, src.context.audioCtx.currentTime);
          audioSrc.noteOn(startTime);
        }
        audioSrc._startTime = startTime;
        src.audioQueue.push(audioSrc);
        startTime += duration;
      }
      startOffset = 0;
      bufCursor++;
    }
  },
  updateSourceTime: function (src) {
    var currentTime = src.context.audioCtx.currentTime;
    if (src.state !== 4114) {
      return currentTime;
    }
    if (!isFinite(src.bufStartTime)) {
      src.bufStartTime = currentTime - src.bufOffset / src.playbackRate;
      src.bufOffset = 0;
    }
    var nextStartTime = 0;
    while (src.audioQueue.length) {
      var audioSrc = src.audioQueue[0];
      src.bufsProcessed += audioSrc._skipCount;
      nextStartTime = audioSrc._startTime + audioSrc._duration;
      if (currentTime < nextStartTime) {
        break;
      }
      src.audioQueue.shift();
      src.bufStartTime = nextStartTime;
      src.bufOffset = 0;
      src.bufsProcessed++;
    }
    if (src.bufsProcessed >= src.bufQueue.length && !src.looping) {
      AL.setSourceState(src, 4116);
    } else if (src.type === 4136 && src.looping) {
      var buf = src.bufQueue[0];
      if (buf.length === 0) {
        src.bufOffset = 0;
      } else {
        var delta = (currentTime - src.bufStartTime) * src.playbackRate;
        var loopStart = buf.audioBuf._loopStart || 0;
        var loopEnd = buf.audioBuf._loopEnd || buf.audioBuf.duration;
        if (loopEnd <= loopStart) {
          loopEnd = buf.audioBuf.duration;
        }
        if (delta < loopEnd) {
          src.bufOffset = delta;
        } else {
          src.bufOffset =
            loopStart + ((delta - loopStart) % (loopEnd - loopStart));
        }
      }
    } else if (src.audioQueue[0]) {
      src.bufOffset =
        (currentTime - src.audioQueue[0]._startTime) * src.playbackRate;
    } else {
      if (src.type !== 4136 && src.looping) {
        var srcDuration = AL.sourceDuration(src) / src.playbackRate;
        if (srcDuration > 0) {
          src.bufStartTime +=
            Math.floor((currentTime - src.bufStartTime) / srcDuration) *
            srcDuration;
        }
      }
      for (var i = 0; i < src.bufQueue.length; i++) {
        if (src.bufsProcessed >= src.bufQueue.length) {
          if (src.looping) {
            src.bufsProcessed %= src.bufQueue.length;
          } else {
            AL.setSourceState(src, 4116);
            break;
          }
        }
        var buf = src.bufQueue[src.bufsProcessed];
        if (buf.length > 0) {
          nextStartTime =
            src.bufStartTime + buf.audioBuf.duration / src.playbackRate;
          if (currentTime < nextStartTime) {
            src.bufOffset = (currentTime - src.bufStartTime) * src.playbackRate;
            break;
          }
          src.bufStartTime = nextStartTime;
        }
        src.bufOffset = 0;
        src.bufsProcessed++;
      }
    }
    return currentTime;
  },
  cancelPendingSourceAudio: function (src) {
    AL.updateSourceTime(src);
    for (var i = 1; i < src.audioQueue.length; i++) {
      var audioSrc = src.audioQueue[i];
      audioSrc.stop();
    }
    if (src.audioQueue.length > 1) {
      src.audioQueue.length = 1;
    }
  },
  stopSourceAudio: function (src) {
    for (var i = 0; i < src.audioQueue.length; i++) {
      src.audioQueue[i].stop();
    }
    src.audioQueue.length = 0;
  },
  setSourceState: function (src, state) {
    if (state === 4114) {
      if (src.state === 4114 || src.state == 4116) {
        src.bufsProcessed = 0;
        src.bufOffset = 0;
      } else {
      }
      AL.stopSourceAudio(src);
      src.state = 4114;
      src.bufStartTime = Number.NEGATIVE_INFINITY;
      AL.scheduleSourceAudio(src);
    } else if (state === 4115) {
      if (src.state === 4114) {
        AL.updateSourceTime(src);
        AL.stopSourceAudio(src);
        src.state = 4115;
      }
    } else if (state === 4116) {
      if (src.state !== 4113) {
        src.state = 4116;
        src.bufsProcessed = src.bufQueue.length;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    } else if (state === 4113) {
      if (src.state !== 4113) {
        src.state = 4113;
        src.bufsProcessed = 0;
        src.bufStartTime = Number.NEGATIVE_INFINITY;
        src.bufOffset = 0;
        AL.stopSourceAudio(src);
      }
    }
  },
  initSourcePanner: function (src) {
    if (src.type === 4144) {
      return;
    }
    var templateBuf = AL.buffers[0];
    for (var i = 0; i < src.bufQueue.length; i++) {
      if (src.bufQueue[i].id !== 0) {
        templateBuf = src.bufQueue[i];
        break;
      }
    }
    if (
      src.spatialize === 1 ||
      (src.spatialize === 2 && templateBuf.channels === 1)
    ) {
      if (src.panner) {
        return;
      }
      src.panner = src.context.audioCtx.createPanner();
      AL.updateSourceGlobal(src);
      AL.updateSourceSpace(src);
      src.panner.connect(src.context.gain);
      src.gain.disconnect();
      src.gain.connect(src.panner);
    } else {
      if (!src.panner) {
        return;
      }
      src.panner.disconnect();
      src.gain.disconnect();
      src.gain.connect(src.context.gain);
      src.panner = null;
    }
  },
  updateContextGlobal: function (ctx) {
    for (var i in ctx.sources) {
      AL.updateSourceGlobal(ctx.sources[i]);
    }
  },
  updateSourceGlobal: function (src) {
    var panner = src.panner;
    if (!panner) {
      return;
    }
    panner.refDistance = src.refDistance;
    panner.maxDistance = src.maxDistance;
    panner.rolloffFactor = src.rolloffFactor;
    panner.panningModel = src.context.hrtf ? "HRTF" : "equalpower";
    var distanceModel = src.context.sourceDistanceModel
      ? src.distanceModel
      : src.context.distanceModel;
    switch (distanceModel) {
      case 0:
        panner.distanceModel = "inverse";
        panner.refDistance = 3.40282e38;
        break;
      case 53249:
      case 53250:
        panner.distanceModel = "inverse";
        break;
      case 53251:
      case 53252:
        panner.distanceModel = "linear";
        break;
      case 53253:
      case 53254:
        panner.distanceModel = "exponential";
        break;
    }
  },
  updateListenerSpace: function (ctx) {
    var listener = ctx.audioCtx.listener;
    if (listener.positionX) {
      listener.positionX.value = ctx.listener.position[0];
      listener.positionY.value = ctx.listener.position[1];
      listener.positionZ.value = ctx.listener.position[2];
    } else {
      listener.setPosition(
        ctx.listener.position[0],
        ctx.listener.position[1],
        ctx.listener.position[2]
      );
    }
    if (listener.forwardX) {
      listener.forwardX.value = ctx.listener.direction[0];
      listener.forwardY.value = ctx.listener.direction[1];
      listener.forwardZ.value = ctx.listener.direction[2];
      listener.upX.value = ctx.listener.up[0];
      listener.upY.value = ctx.listener.up[1];
      listener.upZ.value = ctx.listener.up[2];
    } else {
      listener.setOrientation(
        ctx.listener.direction[0],
        ctx.listener.direction[1],
        ctx.listener.direction[2],
        ctx.listener.up[0],
        ctx.listener.up[1],
        ctx.listener.up[2]
      );
    }
    for (var i in ctx.sources) {
      AL.updateSourceSpace(ctx.sources[i]);
    }
  },
  updateSourceSpace: function (src) {
    if (!src.panner) {
      return;
    }
    var panner = src.panner;
    var posX = src.position[0];
    var posY = src.position[1];
    var posZ = src.position[2];
    var dirX = src.direction[0];
    var dirY = src.direction[1];
    var dirZ = src.direction[2];
    var listener = src.context.listener;
    var lPosX = listener.position[0];
    var lPosY = listener.position[1];
    var lPosZ = listener.position[2];
    if (src.relative) {
      var lBackX = -listener.direction[0];
      var lBackY = -listener.direction[1];
      var lBackZ = -listener.direction[2];
      var lUpX = listener.up[0];
      var lUpY = listener.up[1];
      var lUpZ = listener.up[2];
      var inverseMagnitude = function (x, y, z) {
        var length = Math.sqrt(x * x + y * y + z * z);
        if (length < Number.EPSILON) {
          return 0;
        }
        return 1 / length;
      };
      var invMag = inverseMagnitude(lBackX, lBackY, lBackZ);
      lBackX *= invMag;
      lBackY *= invMag;
      lBackZ *= invMag;
      invMag = inverseMagnitude(lUpX, lUpY, lUpZ);
      lUpX *= invMag;
      lUpY *= invMag;
      lUpZ *= invMag;
      var lRightX = lUpY * lBackZ - lUpZ * lBackY;
      var lRightY = lUpZ * lBackX - lUpX * lBackZ;
      var lRightZ = lUpX * lBackY - lUpY * lBackX;
      invMag = inverseMagnitude(lRightX, lRightY, lRightZ);
      lRightX *= invMag;
      lRightY *= invMag;
      lRightZ *= invMag;
      lUpX = lBackY * lRightZ - lBackZ * lRightY;
      lUpY = lBackZ * lRightX - lBackX * lRightZ;
      lUpZ = lBackX * lRightY - lBackY * lRightX;
      var oldX = dirX;
      var oldY = dirY;
      var oldZ = dirZ;
      dirX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      dirY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      dirZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
      oldX = posX;
      oldY = posY;
      oldZ = posZ;
      posX = oldX * lRightX + oldY * lUpX + oldZ * lBackX;
      posY = oldX * lRightY + oldY * lUpY + oldZ * lBackY;
      posZ = oldX * lRightZ + oldY * lUpZ + oldZ * lBackZ;
      posX += lPosX;
      posY += lPosY;
      posZ += lPosZ;
    }
    if (panner.positionX) {
      panner.positionX.value = posX;
      panner.positionY.value = posY;
      panner.positionZ.value = posZ;
    } else {
      panner.setPosition(posX, posY, posZ);
    }
    if (panner.orientationX) {
      panner.orientationX.value = dirX;
      panner.orientationY.value = dirY;
      panner.orientationZ.value = dirZ;
    } else {
      panner.setOrientation(dirX, dirY, dirZ);
    }
    var oldShift = src.dopplerShift;
    var velX = src.velocity[0];
    var velY = src.velocity[1];
    var velZ = src.velocity[2];
    var lVelX = listener.velocity[0];
    var lVelY = listener.velocity[1];
    var lVelZ = listener.velocity[2];
    if (
      (posX === lPosX && posY === lPosY && posZ === lPosZ) ||
      (velX === lVelX && velY === lVelY && velZ === lVelZ)
    ) {
      src.dopplerShift = 1;
    } else {
      var speedOfSound = src.context.speedOfSound;
      var dopplerFactor = src.context.dopplerFactor;
      var slX = lPosX - posX;
      var slY = lPosY - posY;
      var slZ = lPosZ - posZ;
      var magSl = Math.sqrt(slX * slX + slY * slY + slZ * slZ);
      var vls = (slX * lVelX + slY * lVelY + slZ * lVelZ) / magSl;
      var vss = (slX * velX + slY * velY + slZ * velZ) / magSl;
      vls = Math.min(vls, speedOfSound / dopplerFactor);
      vss = Math.min(vss, speedOfSound / dopplerFactor);
      src.dopplerShift =
        (speedOfSound - dopplerFactor * vls) /
        (speedOfSound - dopplerFactor * vss);
    }
    if (src.dopplerShift !== oldShift) {
      AL.updateSourceRate(src);
    }
  },
  updateSourceRate: function (src) {
    if (src.state === 4114) {
      AL.cancelPendingSourceAudio(src);
      var audioSrc = src.audioQueue[0];
      if (!audioSrc) {
        return;
      }
      var duration;
      if (src.type === 4136 && src.looping) {
        duration = Number.POSITIVE_INFINITY;
      } else {
        duration =
          (audioSrc.buffer.duration - audioSrc._startOffset) / src.playbackRate;
      }
      audioSrc._duration = duration;
      audioSrc.playbackRate.value = src.playbackRate;
      AL.scheduleSourceAudio(src);
    }
  },
  sourceDuration: function (src) {
    var length = 0;
    for (var i = 0; i < src.bufQueue.length; i++) {
      var audioBuf = src.bufQueue[i].audioBuf;
      length += audioBuf ? audioBuf.duration : 0;
    }
    return length;
  },
  sourceTell: function (src) {
    AL.updateSourceTime(src);
    var offset = 0;
    for (var i = 0; i < src.bufsProcessed; i++) {
      offset += src.bufQueue[i].audioBuf.duration;
    }
    offset += src.bufOffset;
    return offset;
  },
  sourceSeek: function (src, offset) {
    var playing = src.state == 4114;
    if (playing) {
      AL.setSourceState(src, 4113);
    }
    if (src.bufQueue[src.bufsProcessed].audioBuf !== null) {
      src.bufsProcessed = 0;
      while (offset > src.bufQueue[src.bufsProcessed].audioBuf.duration) {
        offset -= src.bufQueue[src.bufsProcessed].audiobuf.duration;
        src.bufsProcessed++;
      }
      src.bufOffset = offset;
    }
    if (playing) {
      AL.setSourceState(src, 4114);
    }
  },
  getGlobalParam: function (funcname, param) {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
      case 49152:
        return AL.currentCtx.dopplerFactor;
      case 49155:
        return AL.currentCtx.speedOfSound;
      case 53248:
        return AL.currentCtx.distanceModel;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setGlobalParam: function (funcname, param, value) {
    if (!AL.currentCtx) {
      return;
    }
    switch (param) {
      case 49152:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.currentCtx.dopplerFactor = value;
        AL.updateListenerSpace(AL.currentCtx);
        break;
      case 49155:
        if (!Number.isFinite(value) || value <= 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.currentCtx.speedOfSound = value;
        AL.updateListenerSpace(AL.currentCtx);
        break;
      case 53248:
        switch (value) {
          case 0:
          case 53249:
          case 53250:
          case 53251:
          case 53252:
          case 53253:
          case 53254:
            AL.currentCtx.distanceModel = value;
            AL.updateContextGlobal(AL.currentCtx);
            break;
          default:
            AL.currentCtx.err = 40963;
            return;
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
    }
  },
  getListenerParam: function (funcname, param) {
    if (!AL.currentCtx) {
      return null;
    }
    switch (param) {
      case 4100:
        return AL.currentCtx.listener.position;
      case 4102:
        return AL.currentCtx.listener.velocity;
      case 4111:
        return AL.currentCtx.listener.direction.concat(
          AL.currentCtx.listener.up
        );
      case 4106:
        return AL.currentCtx.gain.gain.value;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setListenerParam: function (funcname, param, value) {
    if (!AL.currentCtx) {
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    var listener = AL.currentCtx.listener;
    switch (param) {
      case 4100:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        listener.position[0] = value[0];
        listener.position[1] = value[1];
        listener.position[2] = value[2];
        AL.updateListenerSpace(AL.currentCtx);
        break;
      case 4102:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        listener.velocity[0] = value[0];
        listener.velocity[1] = value[1];
        listener.velocity[2] = value[2];
        AL.updateListenerSpace(AL.currentCtx);
        break;
      case 4106:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.currentCtx.gain.gain.value = value;
        break;
      case 4111:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2]) ||
          !Number.isFinite(value[3]) ||
          !Number.isFinite(value[4]) ||
          !Number.isFinite(value[5])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        listener.direction[0] = value[0];
        listener.direction[1] = value[1];
        listener.direction[2] = value[2];
        listener.up[0] = value[3];
        listener.up[1] = value[4];
        listener.up[2] = value[5];
        AL.updateListenerSpace(AL.currentCtx);
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
    }
  },
  getBufferParam: function (funcname, bufferId, param) {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    switch (param) {
      case 8193:
        return buf.frequency;
      case 8194:
        return buf.bytesPerSample * 8;
      case 8195:
        return buf.channels;
      case 8196:
        return buf.length * buf.bytesPerSample * buf.channels;
      case 8213:
        if (buf.length === 0) {
          return [0, 0];
        } else {
          return [
            (buf.audioBuf._loopStart || 0) * buf.frequency,
            (buf.audioBuf._loopEnd || buf.length) * buf.frequency,
          ];
        }
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setBufferParam: function (funcname, bufferId, param, value) {
    if (!AL.currentCtx) {
      return;
    }
    var buf = AL.buffers[bufferId];
    if (!buf || bufferId === 0) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
      case 8196:
        if (value !== 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        break;
      case 8213:
        if (
          value[0] < 0 ||
          value[0] > buf.length ||
          value[1] < 0 ||
          value[1] > buf.Length ||
          value[0] >= value[1]
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        if (buf.refCount > 0) {
          AL.currentCtx.err = 40964;
          return;
        }
        if (buf.audioBuf) {
          buf.audioBuf._loopStart = value[0] / buf.frequency;
          buf.audioBuf._loopEnd = value[1] / buf.frequency;
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
    }
  },
  getSourceParam: function (funcname, sourceId, param) {
    if (!AL.currentCtx) {
      return null;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return null;
    }
    switch (param) {
      case 514:
        return src.relative;
      case 4097:
        return src.coneInnerAngle;
      case 4098:
        return src.coneOuterAngle;
      case 4099:
        return src.pitch;
      case 4100:
        return src.position;
      case 4101:
        return src.direction;
      case 4102:
        return src.velocity;
      case 4103:
        return src.looping;
      case 4105:
        if (src.type === 4136) {
          return src.bufQueue[0].id;
        } else {
          return 0;
        }
      case 4106:
        return src.gain.gain.value;
      case 4109:
        return src.minGain;
      case 4110:
        return src.maxGain;
      case 4112:
        return src.state;
      case 4117:
        if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
          return 0;
        } else {
          return src.bufQueue.length;
        }
      case 4118:
        if (
          (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) ||
          src.looping
        ) {
          return 0;
        } else {
          return src.bufsProcessed;
        }
      case 4128:
        return src.refDistance;
      case 4129:
        return src.rolloffFactor;
      case 4130:
        return src.coneOuterGain;
      case 4131:
        return src.maxDistance;
      case 4132:
        return AL.sourceTell(src);
      case 4133:
        var offset = AL.sourceTell(src);
        if (offset > 0) {
          offset *= src.bufQueue[0].frequency;
        }
        return offset;
      case 4134:
        var offset = AL.sourceTell(src);
        if (offset > 0) {
          offset *= src.bufQueue[0].frequency * src.bufQueue[0].bytesPerSample;
        }
        return offset;
      case 4135:
        return src.type;
      case 4628:
        return src.spatialize;
      case 8201:
        var length = 0;
        var bytesPerFrame = 0;
        for (var i = 0; i < src.bufQueue.length; i++) {
          length += src.bufQueue[i].length;
          if (src.bufQueue[i].id !== 0) {
            bytesPerFrame =
              src.bufQueue[i].bytesPerSample * src.bufQueue[i].channels;
          }
        }
        return length * bytesPerFrame;
      case 8202:
        var length = 0;
        for (var i = 0; i < src.bufQueue.length; i++) {
          length += src.bufQueue[i].length;
        }
        return length;
      case 8203:
        return AL.sourceDuration(src);
      case 53248:
        return src.distanceModel;
      default:
        AL.currentCtx.err = 40962;
        return null;
    }
  },
  setSourceParam: function (funcname, sourceId, param, value) {
    if (!AL.currentCtx) {
      return;
    }
    var src = AL.currentCtx.sources[sourceId];
    if (!src) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (value === null) {
      AL.currentCtx.err = 40962;
      return;
    }
    switch (param) {
      case 514:
        if (value === 1) {
          src.relative = true;
          AL.updateSourceSpace(src);
        } else if (value === 0) {
          src.relative = false;
          AL.updateSourceSpace(src);
        } else {
          AL.currentCtx.err = 40963;
          return;
        }
        break;
      case 4097:
        if (!Number.isFinite(value)) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.coneInnerAngle = value;
        if (src.panner) {
          src.panner.coneInnerAngle = value % 360;
        }
        break;
      case 4098:
        if (!Number.isFinite(value)) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.coneOuterAngle = value;
        if (src.panner) {
          src.panner.coneOuterAngle = value % 360;
        }
        break;
      case 4099:
        if (!Number.isFinite(value) || value <= 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        if (src.pitch === value) {
          break;
        }
        src.pitch = value;
        AL.updateSourceRate(src);
        break;
      case 4100:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.position[0] = value[0];
        src.position[1] = value[1];
        src.position[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4101:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.direction[0] = value[0];
        src.direction[1] = value[1];
        src.direction[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4102:
        if (
          !Number.isFinite(value[0]) ||
          !Number.isFinite(value[1]) ||
          !Number.isFinite(value[2])
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.velocity[0] = value[0];
        src.velocity[1] = value[1];
        src.velocity[2] = value[2];
        AL.updateSourceSpace(src);
        break;
      case 4103:
        if (value === 1) {
          src.looping = true;
          AL.updateSourceTime(src);
          if (src.type === 4136 && src.audioQueue.length > 0) {
            var audioSrc = src.audioQueue[0];
            audioSrc.loop = true;
            audioSrc._duration = Number.POSITIVE_INFINITY;
          }
        } else if (value === 0) {
          src.looping = false;
          var currentTime = AL.updateSourceTime(src);
          if (src.type === 4136 && src.audioQueue.length > 0) {
            var audioSrc = src.audioQueue[0];
            audioSrc.loop = false;
            audioSrc._duration =
              src.bufQueue[0].audioBuf.duration / src.playbackRate;
            audioSrc._startTime =
              currentTime - src.bufOffset / src.playbackRate;
          }
        } else {
          AL.currentCtx.err = 40963;
          return;
        }
        break;
      case 4105:
        if (src.state === 4114 || src.state === 4115) {
          AL.currentCtx.err = 40964;
          return;
        }
        if (value === 0) {
          for (var i in src.bufQueue) {
            src.bufQueue[i].refCount--;
          }
          src.bufQueue.length = 1;
          src.bufQueue[0] = AL.buffers[0];
          src.bufsProcessed = 0;
          src.type = 4144;
        } else {
          var buf = AL.buffers[value];
          if (!buf) {
            AL.currentCtx.err = 40963;
            return;
          }
          for (var i in src.bufQueue) {
            src.bufQueue[i].refCount--;
          }
          src.bufQueue.length = 0;
          buf.refCount++;
          src.bufQueue = [buf];
          src.bufsProcessed = 0;
          src.type = 4136;
        }
        AL.initSourcePanner(src);
        AL.scheduleSourceAudio(src);
        break;
      case 4106:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.gain.gain.value = value;
        break;
      case 4109:
        if (
          !Number.isFinite(value) ||
          value < 0 ||
          value > Math.min(src.maxGain, 1)
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.minGain = value;
        break;
      case 4110:
        if (
          !Number.isFinite(value) ||
          value < Math.max(0, src.minGain) ||
          value > 1
        ) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.maxGain = value;
        break;
      case 4128:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.refDistance = value;
        if (src.panner) {
          src.panner.refDistance = value;
        }
        break;
      case 4129:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.rolloffFactor = value;
        if (src.panner) {
          src.panner.rolloffFactor = value;
        }
        break;
      case 4130:
        if (!Number.isFinite(value) || value < 0 || value > 1) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.coneOuterGain = value;
        if (src.panner) {
          src.panner.coneOuterGain = value;
        }
        break;
      case 4131:
        if (!Number.isFinite(value) || value < 0) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.maxDistance = value;
        if (src.panner) {
          src.panner.maxDistance = value;
        }
        break;
      case 4132:
        if (value < 0 || value > AL.sourceDuration(src)) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.sourceSeek(src, value);
        break;
      case 4133:
        var srcLen = AL.sourceDuration(src);
        if (srcLen > 0) {
          var frequency;
          for (var bufId in src.bufQueue) {
            if (bufId) {
              frequency = src.bufQueue[bufId].frequency;
              break;
            }
          }
          value /= frequency;
        }
        if (value < 0 || value > srcLen) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.sourceSeek(src, value);
        break;
      case 4134:
        var srcLen = AL.sourceDuration(src);
        if (srcLen > 0) {
          var bytesPerSec;
          for (var bufId in src.bufQueue) {
            if (bufId) {
              var buf = src.bufQueue[bufId];
              bytesPerSec = buf.frequency * buf.bytesPerSample * buf.channels;
              break;
            }
          }
          value /= bytesPerSec;
        }
        if (value < 0 || value > srcLen) {
          AL.currentCtx.err = 40963;
          return;
        }
        AL.sourceSeek(src, value);
        break;
      case 4628:
        if (value !== 0 && value !== 1 && value !== 2) {
          AL.currentCtx.err = 40963;
          return;
        }
        src.spatialize = value;
        AL.initSourcePanner(src);
        break;
      case 8201:
      case 8202:
      case 8203:
        AL.currentCtx.err = 40964;
        break;
      case 53248:
        switch (value) {
          case 0:
          case 53249:
          case 53250:
          case 53251:
          case 53252:
          case 53253:
          case 53254:
            src.distanceModel = value;
            if (AL.currentCtx.sourceDistanceModel) {
              AL.updateContextGlobal(AL.currentCtx);
            }
            break;
          default:
            AL.currentCtx.err = 40963;
            return;
        }
        break;
      default:
        AL.currentCtx.err = 40962;
        return;
    }
  },
  captures: {},
  sharedCaptureAudioCtx: null,
  requireValidCaptureDevice: function (deviceId, funcname) {
    if (deviceId === 0) {
      AL.alcErr = 40961;
      return null;
    }
    var c = AL.captures[deviceId];
    if (!c) {
      AL.alcErr = 40961;
      return null;
    }
    var err = c.mediaStreamError;
    if (err) {
      AL.alcErr = 40961;
      return null;
    }
    return c;
  },
};
function _alBufferData(bufferId, format, pData, size, freq) {
  if (!AL.currentCtx) {
    return;
  }
  var buf = AL.buffers[bufferId];
  if (!buf) {
    AL.currentCtx.err = 40963;
    return;
  }
  if (freq <= 0) {
    AL.currentCtx.err = 40963;
    return;
  }
  var audioBuf = null;
  try {
    switch (format) {
      case 4352:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size, freq);
          var channel0 = audioBuf.getChannelData(0);
          for (var i = 0; i < size; ++i) {
            channel0[i] = HEAPU8[pData++] * 0.0078125 - 1;
          }
        }
        buf.bytesPerSample = 1;
        buf.channels = 1;
        buf.length = size;
        break;
      case 4353:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 1, freq);
          var channel0 = audioBuf.getChannelData(0);
          pData >>= 1;
          for (var i = 0; i < size >> 1; ++i) {
            channel0[i] = HEAP16[pData++] * 30517578125e-15;
          }
        }
        buf.bytesPerSample = 2;
        buf.channels = 1;
        buf.length = size >> 1;
        break;
      case 4354:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 1, freq);
          var channel0 = audioBuf.getChannelData(0);
          var channel1 = audioBuf.getChannelData(1);
          for (var i = 0; i < size >> 1; ++i) {
            channel0[i] = HEAPU8[pData++] * 0.0078125 - 1;
            channel1[i] = HEAPU8[pData++] * 0.0078125 - 1;
          }
        }
        buf.bytesPerSample = 1;
        buf.channels = 2;
        buf.length = size >> 1;
        break;
      case 4355:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 2, freq);
          var channel0 = audioBuf.getChannelData(0);
          var channel1 = audioBuf.getChannelData(1);
          pData >>= 1;
          for (var i = 0; i < size >> 2; ++i) {
            channel0[i] = HEAP16[pData++] * 30517578125e-15;
            channel1[i] = HEAP16[pData++] * 30517578125e-15;
          }
        }
        buf.bytesPerSample = 2;
        buf.channels = 2;
        buf.length = size >> 2;
        break;
      case 65552:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(1, size >> 2, freq);
          var channel0 = audioBuf.getChannelData(0);
          pData >>= 2;
          for (var i = 0; i < size >> 2; ++i) {
            channel0[i] = HEAPF32[pData++];
          }
        }
        buf.bytesPerSample = 4;
        buf.channels = 1;
        buf.length = size >> 2;
        break;
      case 65553:
        if (size > 0) {
          audioBuf = AL.currentCtx.audioCtx.createBuffer(2, size >> 3, freq);
          var channel0 = audioBuf.getChannelData(0);
          var channel1 = audioBuf.getChannelData(1);
          pData >>= 2;
          for (var i = 0; i < size >> 3; ++i) {
            channel0[i] = HEAPF32[pData++];
            channel1[i] = HEAPF32[pData++];
          }
        }
        buf.bytesPerSample = 4;
        buf.channels = 2;
        buf.length = size >> 3;
        break;
      default:
        AL.currentCtx.err = 40963;
        return;
    }
    buf.frequency = freq;
    buf.audioBuf = audioBuf;
  } catch (e) {
    AL.currentCtx.err = 40963;
    return;
  }
}
function _alDeleteBuffers(count, pBufferIds) {
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(pBufferIds + i * 4) >> 2];
    if (bufId === 0) {
      continue;
    }
    if (!AL.buffers[bufId]) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (AL.buffers[bufId].refCount) {
      AL.currentCtx.err = 40964;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(pBufferIds + i * 4) >> 2];
    if (bufId === 0) {
      continue;
    }
    AL.deviceRefCounts[AL.buffers[bufId].deviceId]--;
    delete AL.buffers[bufId];
    AL.freeIds.push(bufId);
  }
}
function _alSourcei(sourceId, param, value) {
  switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
      AL.setSourceParam("alSourcei", sourceId, param, value);
      break;
    default:
      AL.setSourceParam("alSourcei", sourceId, param, null);
      break;
  }
}
function _alDeleteSources(count, pSourceIds) {
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(pSourceIds + i * 4) >> 2];
    if (!AL.currentCtx.sources[srcId]) {
      AL.currentCtx.err = 40961;
      return;
    }
  }
  for (var i = 0; i < count; ++i) {
    var srcId = HEAP32[(pSourceIds + i * 4) >> 2];
    AL.setSourceState(AL.currentCtx.sources[srcId], 4116);
    _alSourcei(srcId, 4105, 0);
    delete AL.currentCtx.sources[srcId];
    AL.freeIds.push(srcId);
  }
}
function _alDistanceModel(model) {
  AL.setGlobalParam("alDistanceModel", 53248, model);
}
function _alGenBuffers(count, pBufferIds) {
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var buf = {
      deviceId: AL.currentCtx.deviceId,
      id: AL.newId(),
      refCount: 0,
      audioBuf: null,
      frequency: 0,
      bytesPerSample: 2,
      channels: 1,
      length: 0,
    };
    AL.deviceRefCounts[buf.deviceId]++;
    AL.buffers[buf.id] = buf;
    HEAP32[(pBufferIds + i * 4) >> 2] = buf.id;
  }
}
function _alGenSources(count, pSourceIds) {
  if (!AL.currentCtx) {
    return;
  }
  for (var i = 0; i < count; ++i) {
    var gain = AL.currentCtx.audioCtx.createGain();
    gain.connect(AL.currentCtx.gain);
    var src = {
      context: AL.currentCtx,
      id: AL.newId(),
      type: 4144,
      state: 4113,
      bufQueue: [AL.buffers[0]],
      audioQueue: [],
      looping: false,
      pitch: 1,
      dopplerShift: 1,
      gain: gain,
      minGain: 0,
      maxGain: 1,
      panner: null,
      bufsProcessed: 0,
      bufStartTime: Number.NEGATIVE_INFINITY,
      bufOffset: 0,
      relative: false,
      refDistance: 1,
      maxDistance: 3.40282e38,
      rolloffFactor: 1,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      direction: [0, 0, 0],
      coneOuterGain: 0,
      coneInnerAngle: 360,
      coneOuterAngle: 360,
      distanceModel: 53250,
      spatialize: 2,
      get playbackRate() {
        return this.pitch * this.dopplerShift;
      },
    };
    AL.currentCtx.sources[src.id] = src;
    HEAP32[(pSourceIds + i * 4) >> 2] = src.id;
  }
}
function _alGetBufferi(bufferId, param, pValue) {
  var val = AL.getBufferParam("alGetBufferi", bufferId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
    case 8193:
    case 8194:
    case 8195:
    case 8196:
      HEAP32[pValue >> 2] = val;
      break;
    default:
      AL.currentCtx.err = 40962;
      return;
  }
}
function _alGetError() {
  if (!AL.currentCtx) {
    return 40964;
  } else {
    var err = AL.currentCtx.err;
    AL.currentCtx.err = 0;
    return err;
  }
}
function _alGetSourcei(sourceId, param, pValue) {
  var val = AL.getSourceParam("alGetSourcei", sourceId, param);
  if (val === null) {
    return;
  }
  if (!pValue) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
    case 514:
    case 4097:
    case 4098:
    case 4103:
    case 4105:
    case 4112:
    case 4117:
    case 4118:
    case 4128:
    case 4129:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 4135:
    case 4628:
    case 8201:
    case 8202:
    case 53248:
      HEAP32[pValue >> 2] = val;
      break;
    default:
      AL.currentCtx.err = 40962;
      return;
  }
}
function _alListener3f(param, value0, value1, value2) {
  switch (param) {
    case 4100:
    case 4102:
      AL.paramArray[0] = value0;
      AL.paramArray[1] = value1;
      AL.paramArray[2] = value2;
      AL.setListenerParam("alListener3f", param, AL.paramArray);
      break;
    default:
      AL.setListenerParam("alListener3f", param, null);
      break;
  }
}
function _alListenerf(param, value) {
  switch (param) {
    case 4106:
      AL.setListenerParam("alListenerf", param, value);
      break;
    default:
      AL.setListenerParam("alListenerf", param, null);
      break;
  }
}
function _alListenerfv(param, pValues) {
  if (!AL.currentCtx) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
    case 4100:
    case 4102:
      AL.paramArray[0] = HEAPF32[pValues >> 2];
      AL.paramArray[1] = HEAPF32[(pValues + 4) >> 2];
      AL.paramArray[2] = HEAPF32[(pValues + 8) >> 2];
      AL.setListenerParam("alListenerfv", param, AL.paramArray);
      break;
    case 4111:
      AL.paramArray[0] = HEAPF32[pValues >> 2];
      AL.paramArray[1] = HEAPF32[(pValues + 4) >> 2];
      AL.paramArray[2] = HEAPF32[(pValues + 8) >> 2];
      AL.paramArray[3] = HEAPF32[(pValues + 12) >> 2];
      AL.paramArray[4] = HEAPF32[(pValues + 16) >> 2];
      AL.paramArray[5] = HEAPF32[(pValues + 20) >> 2];
      AL.setListenerParam("alListenerfv", param, AL.paramArray);
      break;
    default:
      AL.setListenerParam("alListenerfv", param, null);
      break;
  }
}
function _alSource3f(sourceId, param, value0, value1, value2) {
  switch (param) {
    case 4100:
    case 4101:
    case 4102:
      AL.paramArray[0] = value0;
      AL.paramArray[1] = value1;
      AL.paramArray[2] = value2;
      AL.setSourceParam("alSource3f", sourceId, param, AL.paramArray);
      break;
    default:
      AL.setSourceParam("alSource3f", sourceId, param, null);
      break;
  }
}
function _alSourcePause(sourceId) {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4115);
}
function _alSourcePlay(sourceId) {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4114);
}
function _alSourceQueueBuffers(sourceId, count, pBufferIds) {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  if (src.type === 4136) {
    AL.currentCtx.err = 40964;
    return;
  }
  if (count === 0) {
    return;
  }
  var templateBuf = AL.buffers[0];
  for (var i = 0; i < src.bufQueue.length; i++) {
    if (src.bufQueue[i].id !== 0) {
      templateBuf = src.bufQueue[i];
      break;
    }
  }
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(pBufferIds + i * 4) >> 2];
    var buf = AL.buffers[bufId];
    if (!buf) {
      AL.currentCtx.err = 40961;
      return;
    }
    if (
      templateBuf.id !== 0 &&
      (buf.frequency !== templateBuf.frequency ||
        buf.bytesPerSample !== templateBuf.bytesPerSample ||
        buf.channels !== templateBuf.channels)
    ) {
      AL.currentCtx.err = 40964;
    }
  }
  if (src.bufQueue.length === 1 && src.bufQueue[0].id === 0) {
    src.bufQueue.length = 0;
  }
  src.type = 4137;
  for (var i = 0; i < count; ++i) {
    var bufId = HEAP32[(pBufferIds + i * 4) >> 2];
    var buf = AL.buffers[bufId];
    buf.refCount++;
    src.bufQueue.push(buf);
  }
  if (src.looping) {
    AL.cancelPendingSourceAudio(src);
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src);
}
function _alSourceStop(sourceId) {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  AL.setSourceState(src, 4116);
}
function _alSourceUnqueueBuffers(sourceId, count, pBufferIds) {
  if (!AL.currentCtx) {
    return;
  }
  var src = AL.currentCtx.sources[sourceId];
  if (!src) {
    AL.currentCtx.err = 40961;
    return;
  }
  if (
    count >
    (src.bufQueue.length === 1 && src.bufQueue[0].id === 0
      ? 0
      : src.bufsProcessed)
  ) {
    AL.currentCtx.err = 40963;
    return;
  }
  if (count === 0) {
    return;
  }
  for (var i = 0; i < count; i++) {
    var buf = src.bufQueue.shift();
    buf.refCount--;
    HEAP32[(pBufferIds + i * 4) >> 2] = buf.id;
    src.bufsProcessed--;
  }
  if (src.bufQueue.length === 0) {
    src.bufQueue.push(AL.buffers[0]);
  }
  AL.initSourcePanner(src);
  AL.scheduleSourceAudio(src);
}
function _alSourcef(sourceId, param, value) {
  switch (param) {
    case 4097:
    case 4098:
    case 4099:
    case 4106:
    case 4109:
    case 4110:
    case 4128:
    case 4129:
    case 4130:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 8203:
      AL.setSourceParam("alSourcef", sourceId, param, value);
      break;
    default:
      AL.setSourceParam("alSourcef", sourceId, param, null);
      break;
  }
}
function _alSourcefv(sourceId, param, pValues) {
  if (!AL.currentCtx) {
    return;
  }
  if (!pValues) {
    AL.currentCtx.err = 40963;
    return;
  }
  switch (param) {
    case 4097:
    case 4098:
    case 4099:
    case 4106:
    case 4109:
    case 4110:
    case 4128:
    case 4129:
    case 4130:
    case 4131:
    case 4132:
    case 4133:
    case 4134:
    case 8203:
      var val = HEAPF32[pValues >> 2];
      AL.setSourceParam("alSourcefv", sourceId, param, val);
      break;
    case 4100:
    case 4101:
    case 4102:
      AL.paramArray[0] = HEAPF32[pValues >> 2];
      AL.paramArray[1] = HEAPF32[(pValues + 4) >> 2];
      AL.paramArray[2] = HEAPF32[(pValues + 8) >> 2];
      AL.setSourceParam("alSourcefv", sourceId, param, AL.paramArray);
      break;
    default:
      AL.setSourceParam("alSourcefv", sourceId, param, null);
      break;
  }
}
function _alcCloseDevice(deviceId) {
  if (!(deviceId in AL.deviceRefCounts) || AL.deviceRefCounts[deviceId] > 0) {
    return 0;
  }
  delete AL.deviceRefCounts[deviceId];
  AL.freeIds.push(deviceId);
  return 1;
}
function listenOnce(object, event, func) {
  object.addEventListener(event, func, { once: true });
}
function autoResumeAudioContext(ctx, elements) {
  if (!elements) {
    elements = [document, document.getElementById("canvas")];
  }
  ["keydown", "mousedown", "touchstart"].forEach(function (event) {
    elements.forEach(function (element) {
      if (element) {
        listenOnce(element, event, function () {
          if (ctx.state === "suspended") ctx.resume();
        });
      }
    });
  });
}
function _alcCreateContext(deviceId, pAttrList) {
  if (!(deviceId in AL.deviceRefCounts)) {
    AL.alcErr = 40961;
    return 0;
  }
  var options = null;
  var attrs = [];
  var hrtf = null;
  pAttrList >>= 2;
  if (pAttrList) {
    var attr = 0;
    var val = 0;
    while (true) {
      attr = HEAP32[pAttrList++];
      attrs.push(attr);
      if (attr === 0) {
        break;
      }
      val = HEAP32[pAttrList++];
      attrs.push(val);
      switch (attr) {
        case 4103:
          if (!options) {
            options = {};
          }
          options.sampleRate = val;
          break;
        case 4112:
        case 4113:
          break;
        case 6546:
          switch (val) {
            case 0:
              hrtf = false;
              break;
            case 1:
              hrtf = true;
              break;
            case 2:
              break;
            default:
              AL.alcErr = 40964;
              return 0;
          }
          break;
        case 6550:
          if (val !== 0) {
            AL.alcErr = 40964;
            return 0;
          }
          break;
        default:
          AL.alcErr = 40964;
          return 0;
      }
    }
  }
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var ac = null;
  try {
    if (options) {
      ac = new AudioContext(options);
    } else {
      ac = new AudioContext();
    }
  } catch (e) {
    if (e.name === "NotSupportedError") {
      AL.alcErr = 40964;
    } else {
      AL.alcErr = 40961;
    }
    return 0;
  }
  autoResumeAudioContext(ac);
  if (typeof ac.createGain === "undefined") {
    ac.createGain = ac.createGainNode;
  }
  var gain = ac.createGain();
  gain.connect(ac.destination);
  var ctx = {
    deviceId: deviceId,
    id: AL.newId(),
    attrs: attrs,
    audioCtx: ac,
    listener: {
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      direction: [0, 0, 0],
      up: [0, 0, 0],
    },
    sources: [],
    interval: setInterval(function () {
      AL.scheduleContextAudio(ctx);
    }, AL.QUEUE_INTERVAL),
    gain: gain,
    distanceModel: 53250,
    speedOfSound: 343.3,
    dopplerFactor: 1,
    sourceDistanceModel: false,
    hrtf: hrtf || false,
    _err: 0,
    get err() {
      return this._err;
    },
    set err(val) {
      if (this._err === 0 || val === 0) {
        this._err = val;
      }
    },
  };
  AL.deviceRefCounts[deviceId]++;
  AL.contexts[ctx.id] = ctx;
  if (hrtf !== null) {
    for (var ctxId in AL.contexts) {
      var c = AL.contexts[ctxId];
      if (c.deviceId === deviceId) {
        c.hrtf = hrtf;
        AL.updateContextGlobal(c);
      }
    }
  }
  return ctx.id;
}
function _alcDestroyContext(contextId) {
  var ctx = AL.contexts[contextId];
  if (AL.currentCtx === ctx) {
    AL.alcErr = 40962;
    return;
  }
  if (AL.contexts[contextId].interval) {
    clearInterval(AL.contexts[contextId].interval);
  }
  AL.deviceRefCounts[ctx.deviceId]--;
  delete AL.contexts[contextId];
  AL.freeIds.push(contextId);
}
function _alcGetCurrentContext() {
  if (AL.currentCtx !== null) {
    return AL.currentCtx.id;
  } else {
    return 0;
  }
}
function _alcMakeContextCurrent(contextId) {
  if (contextId === 0) {
    AL.currentCtx = null;
    return 0;
  } else {
    AL.currentCtx = AL.contexts[contextId];
    return 1;
  }
}
function _alcOpenDevice(pDeviceName) {
  if (pDeviceName) {
    var name = UTF8ToString(pDeviceName);
    if (name !== AL.DEVICE_NAME) {
      return 0;
    }
  }
  if (
    typeof AudioContext !== "undefined" ||
    typeof webkitAudioContext !== "undefined"
  ) {
    var deviceId = AL.newId();
    AL.deviceRefCounts[deviceId] = 0;
    return deviceId;
  } else {
    return 0;
  }
}
function _alcProcessContext(contextId) {}
function _alcSuspendContext(contextId) {}
function _clock() {
  if (_clock.start === undefined) _clock.start = Date.now();
  return ((Date.now() - _clock.start) * (1e6 / 1e3)) | 0;
}
var _emscripten_get_now_is_monotonic = true;
function _clock_gettime(clk_id, tp) {
  var now;
  if (clk_id === 0) {
    now = Date.now();
  } else if (
    (clk_id === 1 || clk_id === 4) &&
    _emscripten_get_now_is_monotonic
  ) {
    now = _emscripten_get_now();
  } else {
    setErrNo(28);
    return -1;
  }
  HEAP32[tp >> 2] = (now / 1e3) | 0;
  HEAP32[(tp + 4) >> 2] = ((now % 1e3) * 1e3 * 1e3) | 0;
  return 0;
}
var ___tm_current = 5164736;
var ___tm_timezone = (stringToUTF8("GMT", 5164784, 4), 5164784);
function _tzset() {
  if (_tzset.called) return;
  _tzset.called = true;
  HEAP32[__get_timezone() >> 2] = new Date().getTimezoneOffset() * 60;
  var currentYear = new Date().getFullYear();
  var winter = new Date(currentYear, 0, 1);
  var summer = new Date(currentYear, 6, 1);
  HEAP32[__get_daylight() >> 2] = Number(
    winter.getTimezoneOffset() != summer.getTimezoneOffset()
  );
  function extractZone(date) {
    var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
    return match ? match[1] : "GMT";
  }
  var winterName = extractZone(winter);
  var summerName = extractZone(summer);
  var winterNamePtr = allocateUTF8(winterName);
  var summerNamePtr = allocateUTF8(summerName);
  if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
    HEAP32[__get_tzname() >> 2] = winterNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = summerNamePtr;
  } else {
    HEAP32[__get_tzname() >> 2] = summerNamePtr;
    HEAP32[(__get_tzname() + 4) >> 2] = winterNamePtr;
  }
}
function _localtime_r(time, tmPtr) {
  _tzset();
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getDay();
  var start = new Date(date.getFullYear(), 0, 1);
  var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 36) >> 2] = -(date.getTimezoneOffset() * 60);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dst =
    (summerOffset != winterOffset &&
      date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
  HEAP32[(tmPtr + 32) >> 2] = dst;
  var zonePtr = HEAP32[(__get_tzname() + (dst ? 4 : 0)) >> 2];
  HEAP32[(tmPtr + 40) >> 2] = zonePtr;
  return tmPtr;
}
function _mktime(tmPtr) {
  _tzset();
  var date = new Date(
    HEAP32[(tmPtr + 20) >> 2] + 1900,
    HEAP32[(tmPtr + 16) >> 2],
    HEAP32[(tmPtr + 12) >> 2],
    HEAP32[(tmPtr + 8) >> 2],
    HEAP32[(tmPtr + 4) >> 2],
    HEAP32[tmPtr >> 2],
    0
  );
  var dst = HEAP32[(tmPtr + 32) >> 2];
  var guessedOffset = date.getTimezoneOffset();
  var start = new Date(date.getFullYear(), 0, 1);
  var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  var winterOffset = start.getTimezoneOffset();
  var dstOffset = Math.min(winterOffset, summerOffset);
  if (dst < 0) {
    HEAP32[(tmPtr + 32) >> 2] = Number(
      summerOffset != winterOffset && dstOffset == guessedOffset
    );
  } else if (dst > 0 != (dstOffset == guessedOffset)) {
    var nonDstOffset = Math.max(winterOffset, summerOffset);
    var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
    date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4);
  }
  HEAP32[(tmPtr + 24) >> 2] = date.getDay();
  var yday = ((date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  return (date.getTime() / 1e3) | 0;
}
function _asctime_r(tmPtr, buf) {
  var date = {
    tm_sec: HEAP32[tmPtr >> 2],
    tm_min: HEAP32[(tmPtr + 4) >> 2],
    tm_hour: HEAP32[(tmPtr + 8) >> 2],
    tm_mday: HEAP32[(tmPtr + 12) >> 2],
    tm_mon: HEAP32[(tmPtr + 16) >> 2],
    tm_year: HEAP32[(tmPtr + 20) >> 2],
    tm_wday: HEAP32[(tmPtr + 24) >> 2],
  };
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var s =
    days[date.tm_wday] +
    " " +
    months[date.tm_mon] +
    (date.tm_mday < 10 ? "  " : " ") +
    date.tm_mday +
    (date.tm_hour < 10 ? " 0" : " ") +
    date.tm_hour +
    (date.tm_min < 10 ? ":0" : ":") +
    date.tm_min +
    (date.tm_sec < 10 ? ":0" : ":") +
    date.tm_sec +
    " " +
    (1900 + date.tm_year) +
    "\n";
  stringToUTF8(s, buf, 26);
  return buf;
}
function _ctime_r(time, buf) {
  var stack = stackSave();
  var rv = _asctime_r(_localtime_r(time, stackAlloc(44)), buf);
  stackRestore(stack);
  return rv;
}
function _ctime(timer) {
  return _ctime_r(timer, ___tm_current);
}
function _curl_easy_cleanup() {
  err("missing function: curl_easy_cleanup");
  abort(-1);
}
function _curl_easy_init() {
  err("missing function: curl_easy_init");
  abort(-1);
}
function _curl_easy_perform() {
  err("missing function: curl_easy_perform");
  abort(-1);
}
function _curl_easy_setopt() {
  err("missing function: curl_easy_setopt");
  abort(-1);
}
function _curl_slist_append() {
  err("missing function: curl_slist_append");
  abort(-1);
}
function _difftime(time1, time0) {
  return time1 - time0;
}
function _dlclose(handle) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlerror() {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlopen(filename, flag) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _dlsym(handle, symbol) {
  abort(
    "To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking"
  );
}
function _emscripten_async_call(func, arg, millis) {
  noExitRuntime = true;
  function wrapper() {
    getFuncWrapper(func, "vi")(arg);
  }
  if (millis >= 0) {
    Browser.safeSetTimeout(wrapper, millis);
  } else {
    Browser.safeRequestAnimationFrame(wrapper);
  }
}
function _emscripten_cancel_main_loop() {
  Browser.mainLoop.pause();
  Browser.mainLoop.func = null;
}
var JSEvents = {
  inEventHandler: 0,
  removeAllEventListeners: function () {
    for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
      JSEvents._removeHandler(i);
    }
    JSEvents.eventHandlers = [];
    JSEvents.deferredCalls = [];
  },
  registerRemoveEventListeners: function () {
    if (!JSEvents.removeEventListenersRegistered) {
      __ATEXIT__.push(JSEvents.removeAllEventListeners);
      JSEvents.removeEventListenersRegistered = true;
    }
  },
  deferredCalls: [],
  deferCall: function (targetFunction, precedence, argsList) {
    function arraysHaveEqualContent(arrA, arrB) {
      if (arrA.length != arrB.length) return false;
      for (var i in arrA) {
        if (arrA[i] != arrB[i]) return false;
      }
      return true;
    }
    for (var i in JSEvents.deferredCalls) {
      var call = JSEvents.deferredCalls[i];
      if (
        call.targetFunction == targetFunction &&
        arraysHaveEqualContent(call.argsList, argsList)
      ) {
        return;
      }
    }
    JSEvents.deferredCalls.push({
      targetFunction: targetFunction,
      precedence: precedence,
      argsList: argsList,
    });
    JSEvents.deferredCalls.sort(function (x, y) {
      return x.precedence < y.precedence;
    });
  },
  removeDeferredCalls: function (targetFunction) {
    for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
      if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
        JSEvents.deferredCalls.splice(i, 1);
        --i;
      }
    }
  },
  canPerformEventHandlerRequests: function () {
    return (
      JSEvents.inEventHandler &&
      JSEvents.currentEventHandler.allowsDeferredCalls
    );
  },
  runDeferredCalls: function () {
    if (!JSEvents.canPerformEventHandlerRequests()) {
      return;
    }
    for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
      var call = JSEvents.deferredCalls[i];
      JSEvents.deferredCalls.splice(i, 1);
      --i;
      call.targetFunction.apply(null, call.argsList);
    }
  },
  eventHandlers: [],
  removeAllHandlersOnTarget: function (target, eventTypeString) {
    for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
      if (
        JSEvents.eventHandlers[i].target == target &&
        (!eventTypeString ||
          eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
      ) {
        JSEvents._removeHandler(i--);
      }
    }
  },
  _removeHandler: function (i) {
    var h = JSEvents.eventHandlers[i];
    h.target.removeEventListener(
      h.eventTypeString,
      h.eventListenerFunc,
      h.useCapture
    );
    JSEvents.eventHandlers.splice(i, 1);
  },
  registerOrRemoveHandler: function (eventHandler) {
    var jsEventHandler = function jsEventHandler(event) {
      ++JSEvents.inEventHandler;
      JSEvents.currentEventHandler = eventHandler;
      JSEvents.runDeferredCalls();
      eventHandler.handlerFunc(event);
      JSEvents.runDeferredCalls();
      --JSEvents.inEventHandler;
    };
    if (eventHandler.callbackfunc) {
      eventHandler.eventListenerFunc = jsEventHandler;
      eventHandler.target.addEventListener(
        eventHandler.eventTypeString,
        jsEventHandler,
        eventHandler.useCapture
      );
      JSEvents.eventHandlers.push(eventHandler);
      JSEvents.registerRemoveEventListeners();
    } else {
      for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
        if (
          JSEvents.eventHandlers[i].target == eventHandler.target &&
          JSEvents.eventHandlers[i].eventTypeString ==
            eventHandler.eventTypeString
        ) {
          JSEvents._removeHandler(i--);
        }
      }
    }
  },
  getNodeNameForTarget: function (target) {
    if (!target) return "";
    if (target == window) return "#window";
    if (target == screen) return "#screen";
    return target && target.nodeName ? target.nodeName : "";
  },
  fullscreenEnabled: function () {
    return document.fullscreenEnabled || document.webkitFullscreenEnabled;
  },
};
var __currentFullscreenStrategy = {};
function maybeCStringToJsString(cString) {
  return cString > 2 ? UTF8ToString(cString) : cString;
}
var specialHTMLTargets = [
  0,
  typeof document !== "undefined" ? document : 0,
  typeof window !== "undefined" ? window : 0,
];
function findEventTarget(target) {
  target = maybeCStringToJsString(target);
  var domElement =
    specialHTMLTargets[target] ||
    (typeof document !== "undefined"
      ? document.querySelector(target)
      : undefined);
  return domElement;
}
function findCanvasEventTarget(target) {
  return findEventTarget(target);
}
function _emscripten_get_canvas_element_size(target, width, height) {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  HEAP32[width >> 2] = canvas.width;
  HEAP32[height >> 2] = canvas.height;
}
function __get_canvas_element_size(target) {
  var stackTop = stackSave();
  var w = stackAlloc(8);
  var h = w + 4;
  var targetInt = stackAlloc(target.id.length + 1);
  stringToUTF8(target.id, targetInt, target.id.length + 1);
  var ret = _emscripten_get_canvas_element_size(targetInt, w, h);
  var size = [HEAP32[w >> 2], HEAP32[h >> 2]];
  stackRestore(stackTop);
  return size;
}
function _emscripten_set_canvas_element_size(target, width, height) {
  var canvas = findCanvasEventTarget(target);
  if (!canvas) return -4;
  canvas.width = width;
  canvas.height = height;
  return 0;
}
function __set_canvas_element_size(target, width, height) {
  if (!target.controlTransferredOffscreen) {
    target.width = width;
    target.height = height;
  } else {
    var stackTop = stackSave();
    var targetInt = stackAlloc(target.id.length + 1);
    stringToUTF8(target.id, targetInt, target.id.length + 1);
    _emscripten_set_canvas_element_size(targetInt, width, height);
    stackRestore(stackTop);
  }
}
function __registerRestoreOldStyle(canvas) {
  var canvasSize = __get_canvas_element_size(canvas);
  var oldWidth = canvasSize[0];
  var oldHeight = canvasSize[1];
  var oldCssWidth = canvas.style.width;
  var oldCssHeight = canvas.style.height;
  var oldBackgroundColor = canvas.style.backgroundColor;
  var oldDocumentBackgroundColor = document.body.style.backgroundColor;
  var oldPaddingLeft = canvas.style.paddingLeft;
  var oldPaddingRight = canvas.style.paddingRight;
  var oldPaddingTop = canvas.style.paddingTop;
  var oldPaddingBottom = canvas.style.paddingBottom;
  var oldMarginLeft = canvas.style.marginLeft;
  var oldMarginRight = canvas.style.marginRight;
  var oldMarginTop = canvas.style.marginTop;
  var oldMarginBottom = canvas.style.marginBottom;
  var oldDocumentBodyMargin = document.body.style.margin;
  var oldDocumentOverflow = document.documentElement.style.overflow;
  var oldDocumentScroll = document.body.scroll;
  var oldImageRendering = canvas.style.imageRendering;
  function restoreOldStyle() {
    var fullscreenElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement;
    if (!fullscreenElement) {
      document.removeEventListener("fullscreenchange", restoreOldStyle);
      document.removeEventListener("webkitfullscreenchange", restoreOldStyle);
      __set_canvas_element_size(canvas, oldWidth, oldHeight);
      canvas.style.width = oldCssWidth;
      canvas.style.height = oldCssHeight;
      canvas.style.backgroundColor = oldBackgroundColor;
      if (!oldDocumentBackgroundColor)
        document.body.style.backgroundColor = "white";
      document.body.style.backgroundColor = oldDocumentBackgroundColor;
      canvas.style.paddingLeft = oldPaddingLeft;
      canvas.style.paddingRight = oldPaddingRight;
      canvas.style.paddingTop = oldPaddingTop;
      canvas.style.paddingBottom = oldPaddingBottom;
      canvas.style.marginLeft = oldMarginLeft;
      canvas.style.marginRight = oldMarginRight;
      canvas.style.marginTop = oldMarginTop;
      canvas.style.marginBottom = oldMarginBottom;
      document.body.style.margin = oldDocumentBodyMargin;
      document.documentElement.style.overflow = oldDocumentOverflow;
      document.body.scroll = oldDocumentScroll;
      canvas.style.imageRendering = oldImageRendering;
      if (canvas.GLctxObject)
        canvas.GLctxObject.GLctx.viewport(0, 0, oldWidth, oldHeight);
      if (__currentFullscreenStrategy.canvasResizedCallback) {
        dynCall_iiii(
          __currentFullscreenStrategy.canvasResizedCallback,
          37,
          0,
          __currentFullscreenStrategy.canvasResizedCallbackUserData
        );
      }
    }
  }
  document.addEventListener("fullscreenchange", restoreOldStyle);
  document.addEventListener("webkitfullscreenchange", restoreOldStyle);
  return restoreOldStyle;
}
function __setLetterbox(element, topBottom, leftRight) {
  element.style.paddingLeft = element.style.paddingRight = leftRight + "px";
  element.style.paddingTop = element.style.paddingBottom = topBottom + "px";
}
function __getBoundingClientRect(e) {
  return specialHTMLTargets.indexOf(e) < 0
    ? e.getBoundingClientRect()
    : { left: 0, top: 0 };
}
function _JSEvents_resizeCanvasForFullscreen(target, strategy) {
  var restoreOldStyle = __registerRestoreOldStyle(target);
  var cssWidth = strategy.softFullscreen ? innerWidth : screen.width;
  var cssHeight = strategy.softFullscreen ? innerHeight : screen.height;
  var rect = __getBoundingClientRect(target);
  var windowedCssWidth = rect.width;
  var windowedCssHeight = rect.height;
  var canvasSize = __get_canvas_element_size(target);
  var windowedRttWidth = canvasSize[0];
  var windowedRttHeight = canvasSize[1];
  if (strategy.scaleMode == 3) {
    __setLetterbox(
      target,
      (cssHeight - windowedCssHeight) / 2,
      (cssWidth - windowedCssWidth) / 2
    );
    cssWidth = windowedCssWidth;
    cssHeight = windowedCssHeight;
  } else if (strategy.scaleMode == 2) {
    if (cssWidth * windowedRttHeight < windowedRttWidth * cssHeight) {
      var desiredCssHeight = (windowedRttHeight * cssWidth) / windowedRttWidth;
      __setLetterbox(target, (cssHeight - desiredCssHeight) / 2, 0);
      cssHeight = desiredCssHeight;
    } else {
      var desiredCssWidth = (windowedRttWidth * cssHeight) / windowedRttHeight;
      __setLetterbox(target, 0, (cssWidth - desiredCssWidth) / 2);
      cssWidth = desiredCssWidth;
    }
  }
  if (!target.style.backgroundColor) target.style.backgroundColor = "black";
  if (!document.body.style.backgroundColor)
    document.body.style.backgroundColor = "black";
  target.style.width = cssWidth + "px";
  target.style.height = cssHeight + "px";
  if (strategy.filteringMode == 1) {
    target.style.imageRendering = "optimizeSpeed";
    target.style.imageRendering = "-moz-crisp-edges";
    target.style.imageRendering = "-o-crisp-edges";
    target.style.imageRendering = "-webkit-optimize-contrast";
    target.style.imageRendering = "optimize-contrast";
    target.style.imageRendering = "crisp-edges";
    target.style.imageRendering = "pixelated";
  }
  var dpiScale = strategy.canvasResolutionScaleMode == 2 ? devicePixelRatio : 1;
  if (strategy.canvasResolutionScaleMode != 0) {
    var newWidth = (cssWidth * dpiScale) | 0;
    var newHeight = (cssHeight * dpiScale) | 0;
    __set_canvas_element_size(target, newWidth, newHeight);
    if (target.GLctxObject)
      target.GLctxObject.GLctx.viewport(0, 0, newWidth, newHeight);
  }
  return restoreOldStyle;
}
function _JSEvents_requestFullscreen(target, strategy) {
  if (strategy.scaleMode != 0 || strategy.canvasResolutionScaleMode != 0) {
    _JSEvents_resizeCanvasForFullscreen(target, strategy);
  }
  if (target.requestFullscreen) {
    target.requestFullscreen();
  } else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    return JSEvents.fullscreenEnabled() ? -3 : -1;
  }
  __currentFullscreenStrategy = strategy;
  if (strategy.canvasResizedCallback) {
    dynCall_iiii(
      strategy.canvasResizedCallback,
      37,
      0,
      strategy.canvasResizedCallbackUserData
    );
  }
  return 0;
}
function _emscripten_exit_fullscreen() {
  if (!JSEvents.fullscreenEnabled()) return -1;
  JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);
  var d = specialHTMLTargets[1];
  if (d.exitFullscreen) {
    d.fullscreenElement && d.exitFullscreen();
  } else if (d.webkitExitFullscreen) {
    d.webkitFullscreenElement && d.webkitExitFullscreen();
  } else {
    return -1;
  }
  return 0;
}
function __fillFullscreenChangeEventData(eventStruct) {
  var fullscreenElement =
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement;
  var isFullscreen = !!fullscreenElement;
  HEAP32[eventStruct >> 2] = isFullscreen;
  HEAP32[(eventStruct + 4) >> 2] = JSEvents.fullscreenEnabled();
  var reportedElement = isFullscreen
    ? fullscreenElement
    : JSEvents.previousFullscreenElement;
  var nodeName = JSEvents.getNodeNameForTarget(reportedElement);
  var id = reportedElement && reportedElement.id ? reportedElement.id : "";
  stringToUTF8(nodeName, eventStruct + 8, 128);
  stringToUTF8(id, eventStruct + 136, 128);
  HEAP32[(eventStruct + 264) >> 2] = reportedElement
    ? reportedElement.clientWidth
    : 0;
  HEAP32[(eventStruct + 268) >> 2] = reportedElement
    ? reportedElement.clientHeight
    : 0;
  HEAP32[(eventStruct + 272) >> 2] = screen.width;
  HEAP32[(eventStruct + 276) >> 2] = screen.height;
  if (isFullscreen) {
    JSEvents.previousFullscreenElement = fullscreenElement;
  }
}
function _emscripten_get_fullscreen_status(fullscreenStatus) {
  if (!JSEvents.fullscreenEnabled()) return -1;
  __fillFullscreenChangeEventData(fullscreenStatus);
  return 0;
}
function _emscripten_get_sbrk_ptr() {
  return 5164720;
}
function _longjmp(env, value) {
  _setThrew(env, value || 1);
  throw "longjmp";
}
function _emscripten_longjmp(env, value) {
  _longjmp(env, value);
}
function _emscripten_memcpy_big(dest, src, num) {
  HEAPU8.copyWithin(dest, src, src + num);
}
function _emscripten_pause_main_loop() {
  Browser.mainLoop.pause();
}
function __emscripten_do_request_fullscreen(target, strategy) {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  if (!target.requestFullscreen && !target.webkitRequestFullscreen) {
    return -3;
  }
  var canPerformRequests = JSEvents.canPerformEventHandlerRequests();
  if (!canPerformRequests) {
    if (strategy.deferUntilInEventHandler) {
      JSEvents.deferCall(_JSEvents_requestFullscreen, 1, [target, strategy]);
      return 1;
    } else {
      return -2;
    }
  }
  return _JSEvents_requestFullscreen(target, strategy);
}
function _emscripten_request_fullscreen_strategy(
  target,
  deferUntilInEventHandler,
  fullscreenStrategy
) {
  var strategy = {
    scaleMode: HEAP32[fullscreenStrategy >> 2],
    canvasResolutionScaleMode: HEAP32[(fullscreenStrategy + 4) >> 2],
    filteringMode: HEAP32[(fullscreenStrategy + 8) >> 2],
    deferUntilInEventHandler: deferUntilInEventHandler,
    canvasResizedCallback: HEAP32[(fullscreenStrategy + 12) >> 2],
    canvasResizedCallbackUserData: HEAP32[(fullscreenStrategy + 16) >> 2],
  };
  return __emscripten_do_request_fullscreen(target, strategy);
}
function _emscripten_get_heap_size() {
  return HEAPU8.length;
}
function abortOnCannotGrowMemory(requestedSize) {
  abort("OOM");
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
  requestedSize = requestedSize >>> 0;
  var oldSize = _emscripten_get_heap_size();
  var PAGE_MULTIPLE = 65536;
  var maxHeapSize = 2113929216;
  if (requestedSize > maxHeapSize) {
    abortOnCannotGrowMemory(requestedSize);
  }
  var minHeapSize = 16777216;
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(
      maxHeapSize,
      alignUp(
        Math.max(minHeapSize, requestedSize, overGrownHeapSize),
        PAGE_MULTIPLE
      )
    );
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  abortOnCannotGrowMemory(requestedSize);
}
function _emscripten_resume_main_loop() {
  Browser.mainLoop.resume();
}
function __registerBeforeUnloadEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString
) {
  var beforeUnloadEventHandlerFunc = function (ev) {
    var e = ev || event;
    var confirmationMessage = dynCall_iiii(
      callbackfunc,
      eventTypeId,
      0,
      userData
    );
    if (confirmationMessage) {
      confirmationMessage = UTF8ToString(confirmationMessage);
    }
    if (confirmationMessage) {
      e.preventDefault();
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };
  var eventHandler = {
    target: findEventTarget(target),
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: beforeUnloadEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_beforeunload_callback_on_thread(
  userData,
  callbackfunc,
  targetThread
) {
  if (typeof onbeforeunload === "undefined") return -1;
  if (targetThread !== 1) return -5;
  __registerBeforeUnloadEventCallback(
    2,
    userData,
    true,
    callbackfunc,
    28,
    "beforeunload"
  );
  return 0;
}
function __registerFullscreenChangeEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.fullscreenChangeEvent)
    JSEvents.fullscreenChangeEvent = _malloc(280);
  var fullscreenChangeEventhandlerFunc = function (ev) {
    var e = ev || event;
    var fullscreenChangeEvent = JSEvents.fullscreenChangeEvent;
    __fillFullscreenChangeEventData(fullscreenChangeEvent);
    if (
      dynCall_iiii(callbackfunc, eventTypeId, fullscreenChangeEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: fullscreenChangeEventhandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_fullscreenchange_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (!JSEvents.fullscreenEnabled()) return -1;
  target = findEventTarget(target);
  if (!target) return -4;
  __registerFullscreenChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    19,
    "fullscreenchange",
    targetThread
  );
  __registerFullscreenChangeEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    19,
    "webkitfullscreenchange",
    targetThread
  );
  return 0;
}
function __registerKeyEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(164);
  var keyEventHandlerFunc = function (e) {
    var keyEventData = JSEvents.keyEvent;
    var idx = keyEventData >> 2;
    HEAP32[idx + 0] = e.location;
    HEAP32[idx + 1] = e.ctrlKey;
    HEAP32[idx + 2] = e.shiftKey;
    HEAP32[idx + 3] = e.altKey;
    HEAP32[idx + 4] = e.metaKey;
    HEAP32[idx + 5] = e.repeat;
    HEAP32[idx + 6] = e.charCode;
    HEAP32[idx + 7] = e.keyCode;
    HEAP32[idx + 8] = e.which;
    stringToUTF8(e.key || "", keyEventData + 36, 32);
    stringToUTF8(e.code || "", keyEventData + 68, 32);
    stringToUTF8(e.char || "", keyEventData + 100, 32);
    stringToUTF8(e.locale || "", keyEventData + 132, 32);
    if (dynCall_iiii(callbackfunc, eventTypeId, keyEventData, userData))
      e.preventDefault();
  };
  var eventHandler = {
    target: findEventTarget(target),
    allowsDeferredCalls: true,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: keyEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_keydown_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    2,
    "keydown",
    targetThread
  );
  return 0;
}
function _emscripten_set_keyup_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerKeyEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    3,
    "keyup",
    targetThread
  );
  return 0;
}
function _emscripten_set_main_loop_arg(func, arg, fps, simulateInfiniteLoop) {
  _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg);
}
function __fillMouseEventData(eventStruct, e, target) {
  var idx = eventStruct >> 2;
  HEAP32[idx + 0] = e.screenX;
  HEAP32[idx + 1] = e.screenY;
  HEAP32[idx + 2] = e.clientX;
  HEAP32[idx + 3] = e.clientY;
  HEAP32[idx + 4] = e.ctrlKey;
  HEAP32[idx + 5] = e.shiftKey;
  HEAP32[idx + 6] = e.altKey;
  HEAP32[idx + 7] = e.metaKey;
  HEAP16[idx * 2 + 16] = e.button;
  HEAP16[idx * 2 + 17] = e.buttons;
  HEAP32[idx + 9] = e["movementX"];
  HEAP32[idx + 10] = e["movementY"];
  var rect = __getBoundingClientRect(target);
  HEAP32[idx + 11] = e.clientX - rect.left;
  HEAP32[idx + 12] = e.clientY - rect.top;
}
function __registerMouseEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(64);
  target = findEventTarget(target);
  var mouseEventHandlerFunc = function (ev) {
    var e = ev || event;
    __fillMouseEventData(JSEvents.mouseEvent, e, target);
    if (dynCall_iiii(callbackfunc, eventTypeId, JSEvents.mouseEvent, userData))
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls:
      eventTypeString != "mousemove" &&
      eventTypeString != "mouseenter" &&
      eventTypeString != "mouseleave",
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: mouseEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_mousedown_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    5,
    "mousedown",
    targetThread
  );
  return 0;
}
function _emscripten_set_mousemove_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    8,
    "mousemove",
    targetThread
  );
  return 0;
}
function _emscripten_set_mouseup_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerMouseEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    6,
    "mouseup",
    targetThread
  );
  return 0;
}
function __registerTouchEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1684);
  target = findEventTarget(target);
  var touchEventHandlerFunc = function (e) {
    var touches = {};
    var et = e.touches;
    for (var i = 0; i < et.length; ++i) {
      var touch = et[i];
      touches[touch.identifier] = touch;
    }
    et = e.changedTouches;
    for (var i = 0; i < et.length; ++i) {
      var touch = et[i];
      touch.isChanged = 1;
      touches[touch.identifier] = touch;
    }
    et = e.targetTouches;
    for (var i = 0; i < et.length; ++i) {
      touches[et[i].identifier].onTarget = 1;
    }
    var touchEvent = JSEvents.touchEvent;
    var idx = touchEvent >> 2;
    HEAP32[idx + 1] = e.ctrlKey;
    HEAP32[idx + 2] = e.shiftKey;
    HEAP32[idx + 3] = e.altKey;
    HEAP32[idx + 4] = e.metaKey;
    idx += 5;
    var targetRect = __getBoundingClientRect(target);
    var numTouches = 0;
    for (var i in touches) {
      var t = touches[i];
      HEAP32[idx + 0] = t.identifier;
      HEAP32[idx + 1] = t.screenX;
      HEAP32[idx + 2] = t.screenY;
      HEAP32[idx + 3] = t.clientX;
      HEAP32[idx + 4] = t.clientY;
      HEAP32[idx + 5] = t.pageX;
      HEAP32[idx + 6] = t.pageY;
      HEAP32[idx + 7] = t.isChanged;
      HEAP32[idx + 8] = t.onTarget;
      HEAP32[idx + 9] = t.clientX - targetRect.left;
      HEAP32[idx + 10] = t.clientY - targetRect.top;
      idx += 13;
      if (++numTouches > 31) {
        break;
      }
    }
    HEAP32[touchEvent >> 2] = numTouches;
    if (dynCall_iiii(callbackfunc, eventTypeId, touchEvent, userData))
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls:
      eventTypeString == "touchstart" || eventTypeString == "touchend",
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: touchEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_touchcancel_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    25,
    "touchcancel",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchend_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    23,
    "touchend",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchmove_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    24,
    "touchmove",
    targetThread
  );
  return 0;
}
function _emscripten_set_touchstart_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  __registerTouchEventCallback(
    target,
    userData,
    useCapture,
    callbackfunc,
    22,
    "touchstart",
    targetThread
  );
  return 0;
}
function __fillVisibilityChangeEventData(eventStruct) {
  var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
  var visibilityState = visibilityStates.indexOf(document.visibilityState);
  HEAP32[eventStruct >> 2] = document.hidden;
  HEAP32[(eventStruct + 4) >> 2] = visibilityState;
}
function __registerVisibilityChangeEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.visibilityChangeEvent)
    JSEvents.visibilityChangeEvent = _malloc(8);
  var visibilityChangeEventHandlerFunc = function (ev) {
    var e = ev || event;
    var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
    __fillVisibilityChangeEventData(visibilityChangeEvent);
    if (
      dynCall_iiii(callbackfunc, eventTypeId, visibilityChangeEvent, userData)
    )
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: visibilityChangeEventHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_visibilitychange_callback_on_thread(
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  if (!specialHTMLTargets[1]) {
    return -4;
  }
  __registerVisibilityChangeEventCallback(
    specialHTMLTargets[1],
    userData,
    useCapture,
    callbackfunc,
    21,
    "visibilitychange",
    targetThread
  );
  return 0;
}
function __registerWheelEventCallback(
  target,
  userData,
  useCapture,
  callbackfunc,
  eventTypeId,
  eventTypeString,
  targetThread
) {
  if (!JSEvents.wheelEvent) JSEvents.wheelEvent = _malloc(96);
  var wheelHandlerFunc = function (ev) {
    var e = ev || event;
    var wheelEvent = JSEvents.wheelEvent;
    __fillMouseEventData(wheelEvent, e, target);
    HEAPF64[(wheelEvent + 64) >> 3] = e["deltaX"];
    HEAPF64[(wheelEvent + 72) >> 3] = e["deltaY"];
    HEAPF64[(wheelEvent + 80) >> 3] = e["deltaZ"];
    HEAP32[(wheelEvent + 88) >> 2] = e["deltaMode"];
    if (dynCall_iiii(callbackfunc, eventTypeId, wheelEvent, userData))
      e.preventDefault();
  };
  var eventHandler = {
    target: target,
    allowsDeferredCalls: true,
    eventTypeString: eventTypeString,
    callbackfunc: callbackfunc,
    handlerFunc: wheelHandlerFunc,
    useCapture: useCapture,
  };
  JSEvents.registerOrRemoveHandler(eventHandler);
}
function _emscripten_set_wheel_callback_on_thread(
  target,
  userData,
  useCapture,
  callbackfunc,
  targetThread
) {
  target = findEventTarget(target);
  if (typeof target.onwheel !== "undefined") {
    __registerWheelEventCallback(
      target,
      userData,
      useCapture,
      callbackfunc,
      9,
      "wheel",
      targetThread
    );
    return 0;
  } else {
    return -1;
  }
}
var ENV = {};
function getExecutableName() {
  return thisProgram || "./this.program";
}
function getEnvStrings() {
  if (!getEnvStrings.strings) {
    var lang =
      (
        (typeof navigator === "object" &&
          navigator.languages &&
          navigator.languages[0]) ||
        "C"
      ).replace("-", "_") + ".UTF-8";
    var env = {
      USER: "web_user",
      LOGNAME: "web_user",
      PATH: "/",
      PWD: "/",
      HOME: "/home/web_user",
      LANG: lang,
      _: getExecutableName(),
    };
    for (var x in ENV) {
      env[x] = ENV[x];
    }
    var strings = [];
    for (var x in env) {
      strings.push(x + "=" + env[x]);
    }
    getEnvStrings.strings = strings;
  }
  return getEnvStrings.strings;
}
function _environ_get(__environ, environ_buf) {
  var bufSize = 0;
  getEnvStrings().forEach(function (string, i) {
    var ptr = environ_buf + bufSize;
    HEAP32[(__environ + i * 4) >> 2] = ptr;
    writeAsciiToMemory(string, ptr);
    bufSize += string.length + 1;
  });
  return 0;
}
function _environ_sizes_get(penviron_count, penviron_buf_size) {
  var strings = getEnvStrings();
  HEAP32[penviron_count >> 2] = strings.length;
  var bufSize = 0;
  strings.forEach(function (string) {
    bufSize += string.length + 1;
  });
  HEAP32[penviron_buf_size >> 2] = bufSize;
  return 0;
}
function _fd_close(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    FS.close(stream);
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_fdstat_get(fd, pbuf) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var type = stream.tty
      ? 2
      : FS.isDir(stream.mode)
      ? 3
      : FS.isLink(stream.mode)
      ? 7
      : 4;
    HEAP8[pbuf >> 0] = type;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_read(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doReadv(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var HIGH_OFFSET = 4294967296;
    var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
    var DOUBLE_LIMIT = 9007199254740992;
    if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
      return -61;
    }
    FS.llseek(stream, offset, whence);
    (tempI64 = [
      stream.position >>> 0,
      ((tempDouble = stream.position),
      +Math_abs(tempDouble) >= 1
        ? tempDouble > 0
          ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>>
            0
          : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>>
            0
        : 0),
    ]),
      (HEAP32[newOffset >> 2] = tempI64[0]),
      (HEAP32[(newOffset + 4) >> 2] = tempI64[1]);
    if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_sync(fd) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    if (stream.stream_ops && stream.stream_ops.fsync) {
      return -stream.stream_ops.fsync(stream);
    }
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _fd_write(fd, iov, iovcnt, pnum) {
  try {
    var stream = SYSCALLS.getStreamFromFD(fd);
    var num = SYSCALLS.doWritev(stream, iov, iovcnt);
    HEAP32[pnum >> 2] = num;
    return 0;
  } catch (e) {
    if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
}
function _gettimeofday(ptr) {
  var now = Date.now();
  HEAP32[ptr >> 2] = (now / 1e3) | 0;
  HEAP32[(ptr + 4) >> 2] = ((now % 1e3) * 1e3) | 0;
  return 0;
}
function __webgl_enable_ANGLE_instanced_arrays(ctx) {
  var ext = ctx.getExtension("ANGLE_instanced_arrays");
  if (ext) {
    ctx["vertexAttribDivisor"] = function (index, divisor) {
      ext["vertexAttribDivisorANGLE"](index, divisor);
    };
    ctx["drawArraysInstanced"] = function (mode, first, count, primcount) {
      ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
    };
    ctx["drawElementsInstanced"] = function (
      mode,
      count,
      type,
      indices,
      primcount
    ) {
      ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
    };
    return 1;
  }
}
function __webgl_enable_OES_vertex_array_object(ctx) {
  var ext = ctx.getExtension("OES_vertex_array_object");
  if (ext) {
    ctx["createVertexArray"] = function () {
      return ext["createVertexArrayOES"]();
    };
    ctx["deleteVertexArray"] = function (vao) {
      ext["deleteVertexArrayOES"](vao);
    };
    ctx["bindVertexArray"] = function (vao) {
      ext["bindVertexArrayOES"](vao);
    };
    ctx["isVertexArray"] = function (vao) {
      return ext["isVertexArrayOES"](vao);
    };
    return 1;
  }
}
function __webgl_enable_WEBGL_draw_buffers(ctx) {
  var ext = ctx.getExtension("WEBGL_draw_buffers");
  if (ext) {
    ctx["drawBuffers"] = function (n, bufs) {
      ext["drawBuffersWEBGL"](n, bufs);
    };
    return 1;
  }
}
function __webgl_enable_WEBGL_multi_draw(ctx) {
  return !!(ctx.multiDrawWebgl = ctx.getExtension("WEBGL_multi_draw"));
}
var GL = {
  counter: 1,
  buffers: [],
  programs: [],
  framebuffers: [],
  renderbuffers: [],
  textures: [],
  uniforms: [],
  shaders: [],
  vaos: [],
  contexts: [],
  offscreenCanvases: {},
  timerQueriesEXT: [],
  byteSizeByTypeRoot: 5120,
  byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
  programInfos: {},
  stringCache: {},
  unpackAlignment: 4,
  recordError: function recordError(errorCode) {
    if (!GL.lastError) {
      GL.lastError = errorCode;
    }
  },
  getNewId: function (table) {
    var ret = GL.counter++;
    for (var i = table.length; i < ret; i++) {
      table[i] = null;
    }
    return ret;
  },
  MAX_TEMP_BUFFER_SIZE: 2097152,
  numTempVertexBuffersPerSize: 64,
  log2ceilLookup: function (i) {
    return 32 - Math.clz32(i - 1);
  },
  generateTempBuffers: function (quads, context) {
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    context.tempVertexBufferCounters1 = [];
    context.tempVertexBufferCounters2 = [];
    context.tempVertexBufferCounters1.length =
      context.tempVertexBufferCounters2.length = largestIndex + 1;
    context.tempVertexBuffers1 = [];
    context.tempVertexBuffers2 = [];
    context.tempVertexBuffers1.length = context.tempVertexBuffers2.length =
      largestIndex + 1;
    context.tempIndexBuffers = [];
    context.tempIndexBuffers.length = largestIndex + 1;
    for (var i = 0; i <= largestIndex; ++i) {
      context.tempIndexBuffers[i] = null;
      context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[
        i
      ] = 0;
      var ringbufferLength = GL.numTempVertexBuffersPerSize;
      context.tempVertexBuffers1[i] = [];
      context.tempVertexBuffers2[i] = [];
      var ringbuffer1 = context.tempVertexBuffers1[i];
      var ringbuffer2 = context.tempVertexBuffers2[i];
      ringbuffer1.length = ringbuffer2.length = ringbufferLength;
      for (var j = 0; j < ringbufferLength; ++j) {
        ringbuffer1[j] = ringbuffer2[j] = null;
      }
    }
    if (quads) {
      context.tempQuadIndexBuffer = GLctx.createBuffer();
      context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
      var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
      var quadIndexes = new Uint16Array(numIndexes);
      var i = 0,
        v = 0;
      while (1) {
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 1;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 2;
        if (i >= numIndexes) break;
        quadIndexes[i++] = v + 3;
        if (i >= numIndexes) break;
        v += 4;
      }
      context.GLctx.bufferData(34963, quadIndexes, 35044);
      context.GLctx.bindBuffer(34963, null);
    }
  },
  getTempVertexBuffer: function getTempVertexBuffer(sizeBytes) {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
    var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
    GL.currentContext.tempVertexBufferCounters1[idx] =
      (GL.currentContext.tempVertexBufferCounters1[idx] + 1) &
      (GL.numTempVertexBuffersPerSize - 1);
    var vbo = ringbuffer[nextFreeBufferIndex];
    if (vbo) {
      return vbo;
    }
    var prevVBO = GLctx.getParameter(34964);
    ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
    GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
    GLctx.bufferData(34962, 1 << idx, 35048);
    GLctx.bindBuffer(34962, prevVBO);
    return ringbuffer[nextFreeBufferIndex];
  },
  getTempIndexBuffer: function getTempIndexBuffer(sizeBytes) {
    var idx = GL.log2ceilLookup(sizeBytes);
    var ibo = GL.currentContext.tempIndexBuffers[idx];
    if (ibo) {
      return ibo;
    }
    var prevIBO = GLctx.getParameter(34965);
    GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
    GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
    GLctx.bufferData(34963, 1 << idx, 35048);
    GLctx.bindBuffer(34963, prevIBO);
    return GL.currentContext.tempIndexBuffers[idx];
  },
  newRenderingFrameStarted: function newRenderingFrameStarted() {
    if (!GL.currentContext) {
      return;
    }
    var vb = GL.currentContext.tempVertexBuffers1;
    GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
    GL.currentContext.tempVertexBuffers2 = vb;
    vb = GL.currentContext.tempVertexBufferCounters1;
    GL.currentContext.tempVertexBufferCounters1 =
      GL.currentContext.tempVertexBufferCounters2;
    GL.currentContext.tempVertexBufferCounters2 = vb;
    var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
    for (var i = 0; i <= largestIndex; ++i) {
      GL.currentContext.tempVertexBufferCounters1[i] = 0;
    }
  },
  getSource: function (shader, count, string, length) {
    var source = "";
    for (var i = 0; i < count; ++i) {
      var len = length ? HEAP32[(length + i * 4) >> 2] : -1;
      source += UTF8ToString(
        HEAP32[(string + i * 4) >> 2],
        len < 0 ? undefined : len
      );
    }
    return source;
  },
  calcBufLength: function calcBufLength(size, type, stride, count) {
    if (stride > 0) {
      return count * stride;
    }
    var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
    return size * typeSize * count;
  },
  usedTempBuffers: [],
  preDrawHandleClientVertexAttribBindings:
    function preDrawHandleClientVertexAttribBindings(count) {
      GL.resetBufferBinding = false;
      for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
        var cb = GL.currentContext.clientBuffers[i];
        if (!cb.clientside || !cb.enabled) continue;
        GL.resetBufferBinding = true;
        var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
        var buf = GL.getTempVertexBuffer(size);
        GLctx.bindBuffer(34962, buf);
        GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
        cb.vertexAttribPointerAdaptor.call(
          GLctx,
          i,
          cb.size,
          cb.type,
          cb.normalized,
          cb.stride,
          0
        );
      }
    },
  postDrawHandleClientVertexAttribBindings:
    function postDrawHandleClientVertexAttribBindings() {
      if (GL.resetBufferBinding) {
        GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
      }
    },
  createContext: function (canvas, webGLContextAttributes) {
    if(!(canvas instanceof HTMLCanvasElement)) console.log(canvas);debugger
    var ctx = canvas.getContext("webgl", webGLContextAttributes);
    if (!ctx) return 0;
    var handle = GL.registerContext(ctx, webGLContextAttributes);
    return handle;
  },
  registerContext: function (ctx, webGLContextAttributes) {
    var handle = GL.getNewId(GL.contexts);
    var context = {
      handle: handle,
      attributes: webGLContextAttributes,
      version: webGLContextAttributes.majorVersion,
      GLctx: ctx,
    };
    if (ctx.canvas) ctx.canvas.GLctxObject = context;
    GL.contexts[handle] = context;
    if (
      typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" ||
      webGLContextAttributes.enableExtensionsByDefault
    ) {
      GL.initExtensions(context);
    }
    context.maxVertexAttribs = context.GLctx.getParameter(34921);
    context.clientBuffers = [];
    for (var i = 0; i < context.maxVertexAttribs; i++) {
      context.clientBuffers[i] = {
        enabled: false,
        clientside: false,
        size: 0,
        type: 0,
        normalized: 0,
        stride: 0,
        ptr: 0,
        vertexAttribPointerAdaptor: null,
      };
    }
    GL.generateTempBuffers(false, context);
    return handle;
  },
  makeContextCurrent: function (contextHandle) {
    GL.currentContext = GL.contexts[contextHandle];
    Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
    return !(contextHandle && !GLctx);
  },
  getContext: function (contextHandle) {
    return GL.contexts[contextHandle];
  },
  deleteContext: function (contextHandle) {
    if (GL.currentContext === GL.contexts[contextHandle])
      GL.currentContext = null;
    if (typeof JSEvents === "object")
      JSEvents.removeAllHandlersOnTarget(
        GL.contexts[contextHandle].GLctx.canvas
      );
    if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas)
      GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
    GL.contexts[contextHandle] = null;
  },
  initExtensions: function (context) {
    if (!context) context = GL.currentContext;
    if (context.initExtensionsDone) return;
    context.initExtensionsDone = true;
    var GLctx = context.GLctx;
    __webgl_enable_ANGLE_instanced_arrays(GLctx);
    __webgl_enable_OES_vertex_array_object(GLctx);
    __webgl_enable_WEBGL_draw_buffers(GLctx);
    GLctx.disjointTimerQueryExt = GLctx.getExtension(
      "EXT_disjoint_timer_query"
    );
    __webgl_enable_WEBGL_multi_draw(GLctx);
    var automaticallyEnabledExtensions = [
      "OES_texture_float",
      "OES_texture_half_float",
      "OES_standard_derivatives",
      "OES_vertex_array_object",
      "WEBGL_compressed_texture_s3tc",
      "WEBGL_depth_texture",
      "OES_element_index_uint",
      "EXT_texture_filter_anisotropic",
      "EXT_frag_depth",
      "WEBGL_draw_buffers",
      "ANGLE_instanced_arrays",
      "OES_texture_float_linear",
      "OES_texture_half_float_linear",
      "EXT_blend_minmax",
      "EXT_shader_texture_lod",
      "EXT_texture_norm16",
      "WEBGL_compressed_texture_pvrtc",
      "EXT_color_buffer_half_float",
      "WEBGL_color_buffer_float",
      "EXT_sRGB",
      "WEBGL_compressed_texture_etc1",
      "EXT_disjoint_timer_query",
      "WEBGL_compressed_texture_etc",
      "WEBGL_compressed_texture_astc",
      "EXT_color_buffer_float",
      "WEBGL_compressed_texture_s3tc_srgb",
      "EXT_disjoint_timer_query_webgl2",
      "WEBKIT_WEBGL_compressed_texture_pvrtc",
    ];
    var exts = GLctx.getSupportedExtensions() || [];
    exts.forEach(function (ext) {
      if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
        GLctx.getExtension(ext);
      }
    });
  },
  populateUniformTable: function (program) {
    var p = GL.programs[program];
    var ptable = (GL.programInfos[program] = {
      uniforms: {},
      maxUniformLength: 0,
      maxAttributeLength: -1,
      maxUniformBlockNameLength: -1,
    });
    var utable = ptable.uniforms;
    var numUniforms = GLctx.getProgramParameter(p, 35718);
    for (var i = 0; i < numUniforms; ++i) {
      var u = GLctx.getActiveUniform(p, i);
      var name = u.name;
      ptable.maxUniformLength = Math.max(
        ptable.maxUniformLength,
        name.length + 1
      );
      if (name.slice(-1) == "]") {
        name = name.slice(0, name.lastIndexOf("["));
      }
      var loc = GLctx.getUniformLocation(p, name);
      if (loc) {
        var id = GL.getNewId(GL.uniforms);
        utable[name] = [u.size, id];
        GL.uniforms[id] = loc;
        for (var j = 1; j < u.size; ++j) {
          var n = name + "[" + j + "]";
          loc = GLctx.getUniformLocation(p, n);
          id = GL.getNewId(GL.uniforms);
          GL.uniforms[id] = loc;
        }
      }
    }
  },
};
function _glActiveTexture(x0) {
  GLctx["activeTexture"](x0);
}
function _glAttachShader(program, shader) {
  GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
}
function _glBindAttribLocation(program, index, name) {
  GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
}
function _glBindFramebuffer(target, framebuffer) {
  GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
}
function _glBindRenderbuffer(target, renderbuffer) {
  GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
}
function _glBindTexture(target, texture) {
  GLctx.bindTexture(target, GL.textures[texture]);
}
function _glBlendFunc(x0, x1) {
  GLctx["blendFunc"](x0, x1);
}
function _glCheckFramebufferStatus(x0) {
  return GLctx["checkFramebufferStatus"](x0);
}
function _glClear(x0) {
  GLctx["clear"](x0);
}
function _glClearColor(x0, x1, x2, x3) {
  GLctx["clearColor"](x0, x1, x2, x3);
}
function _glClearDepthf(x0) {
  GLctx["clearDepth"](x0);
}
function _glClearStencil(x0) {
  GLctx["clearStencil"](x0);
}
function _glColorMask(red, green, blue, alpha) {
  GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
}
function _glCompileShader(shader) {
  GLctx.compileShader(GL.shaders[shader]);
}
function _glCompressedTexImage2D(
  target,
  level,
  internalFormat,
  width,
  height,
  border,
  imageSize,
  data
) {
  GLctx["compressedTexImage2D"](
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    data ? HEAPU8.subarray(data, data + imageSize) : null
  );
}
function _glCompressedTexSubImage2D(
  target,
  level,
  xoffset,
  yoffset,
  width,
  height,
  format,
  imageSize,
  data
) {
  GLctx["compressedTexSubImage2D"](
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    data ? HEAPU8.subarray(data, data + imageSize) : null
  );
}
function _glCreateProgram() {
  var id = GL.getNewId(GL.programs);
  var program = GLctx.createProgram();
  program.name = id;
  GL.programs[id] = program;
  return id;
}
function _glCreateShader(shaderType) {
  var id = GL.getNewId(GL.shaders);
  GL.shaders[id] = GLctx.createShader(shaderType);
  return id;
}
function _glCullFace(x0) {
  GLctx["cullFace"](x0);
}
function _glDeleteFramebuffers(n, framebuffers) {
  for (var i = 0; i < n; ++i) {
    var id = HEAP32[(framebuffers + i * 4) >> 2];
    var framebuffer = GL.framebuffers[id];
    if (!framebuffer) continue;
    GLctx.deleteFramebuffer(framebuffer);
    framebuffer.name = 0;
    GL.framebuffers[id] = null;
  }
}
function _glDeleteProgram(id) {
  if (!id) return;
  var program = GL.programs[id];
  if (!program) {
    GL.recordError(1281);
    return;
  }
  GLctx.deleteProgram(program);
  program.name = 0;
  GL.programs[id] = null;
  GL.programInfos[id] = null;
}
function _glDeleteRenderbuffers(n, renderbuffers) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(renderbuffers + i * 4) >> 2];
    var renderbuffer = GL.renderbuffers[id];
    if (!renderbuffer) continue;
    GLctx.deleteRenderbuffer(renderbuffer);
    renderbuffer.name = 0;
    GL.renderbuffers[id] = null;
  }
}
function _glDeleteShader(id) {
  if (!id) return;
  var shader = GL.shaders[id];
  if (!shader) {
    GL.recordError(1281);
    return;
  }
  GLctx.deleteShader(shader);
  GL.shaders[id] = null;
}
function _glDeleteTextures(n, textures) {
  for (var i = 0; i < n; i++) {
    var id = HEAP32[(textures + i * 4) >> 2];
    var texture = GL.textures[id];
    if (!texture) continue;
    GLctx.deleteTexture(texture);
    texture.name = 0;
    GL.textures[id] = null;
  }
}
function _glDepthFunc(x0) {
  GLctx["depthFunc"](x0);
}
function _glDepthMask(flag) {
  GLctx.depthMask(!!flag);
}
function _glDepthRangef(x0, x1) {
  GLctx["depthRange"](x0, x1);
}
function _glDisable(x0) {
  GLctx["disable"](x0);
}
function _glDisableVertexAttribArray(index) {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = false;
  GLctx.disableVertexAttribArray(index);
}
function _glDrawArrays(mode, first, count) {
  GL.preDrawHandleClientVertexAttribBindings(first + count);
  GLctx.drawArrays(mode, first, count);
  GL.postDrawHandleClientVertexAttribBindings();
}
function _glDrawElements(mode, count, type, indices) {
  var buf;
  if (!GLctx.currentElementArrayBufferBinding) {
    var size = GL.calcBufLength(1, type, 0, count);
    buf = GL.getTempIndexBuffer(size);
    GLctx.bindBuffer(34963, buf);
    GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
    indices = 0;
  }
  GL.preDrawHandleClientVertexAttribBindings(count);
  GLctx.drawElements(mode, count, type, indices);
  GL.postDrawHandleClientVertexAttribBindings(count);
  if (!GLctx.currentElementArrayBufferBinding) {
    GLctx.bindBuffer(34963, null);
  }
}
function _glEnable(x0) {
  GLctx["enable"](x0);
}
function _glEnableVertexAttribArray(index) {
  var cb = GL.currentContext.clientBuffers[index];
  cb.enabled = true;
  GLctx.enableVertexAttribArray(index);
}
function _glFramebufferRenderbuffer(
  target,
  attachment,
  renderbuffertarget,
  renderbuffer
) {
  GLctx.framebufferRenderbuffer(
    target,
    attachment,
    renderbuffertarget,
    GL.renderbuffers[renderbuffer]
  );
}
function _glFramebufferTexture2D(
  target,
  attachment,
  textarget,
  texture,
  level
) {
  GLctx.framebufferTexture2D(
    target,
    attachment,
    textarget,
    GL.textures[texture],
    level
  );
}
function __glGenObject(n, buffers, createFunction, objectTable) {
  for (var i = 0; i < n; i++) {
    var buffer = GLctx[createFunction]();
    var id = buffer && GL.getNewId(objectTable);
    if (buffer) {
      buffer.name = id;
      objectTable[id] = buffer;
    } else {
      GL.recordError(1282);
    }
    HEAP32[(buffers + i * 4) >> 2] = id;
  }
}
function _glGenFramebuffers(n, ids) {
  __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
}
function _glGenRenderbuffers(n, renderbuffers) {
  __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
}
function _glGenTextures(n, textures) {
  __glGenObject(n, textures, "createTexture", GL.textures);
}
function _glGenerateMipmap(x0) {
  GLctx["generateMipmap"](x0);
}
function __glGetActiveAttribOrUniform(
  funcName,
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  program = GL.programs[program];
  var info = GLctx[funcName](program, index);
  if (info) {
    var numBytesWrittenExclNull =
      name && stringToUTF8(info.name, name, bufSize);
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    if (size) HEAP32[size >> 2] = info.size;
    if (type) HEAP32[type >> 2] = info.type;
  }
}
function _glGetActiveUniform(
  program,
  index,
  bufSize,
  length,
  size,
  type,
  name
) {
  __glGetActiveAttribOrUniform(
    "getActiveUniform",
    program,
    index,
    bufSize,
    length,
    size,
    type,
    name
  );
}
function writeI53ToI64(ptr, num) {
  HEAPU32[ptr >> 2] = num;
  HEAPU32[(ptr + 4) >> 2] = (num - HEAPU32[ptr >> 2]) / 4294967296;
}
function emscriptenWebGLGet(name_, p, type) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  var ret = undefined;
  switch (name_) {
    case 36346:
      ret = 1;
      break;
    case 36344:
      if (type != 0 && type != 1) {
        GL.recordError(1280);
      }
      return;
    case 36345:
      ret = 0;
      break;
    case 34466:
      var formats = GLctx.getParameter(34467);
      ret = formats ? formats.length : 0;
      break;
  }
  if (ret === undefined) {
    var result = GLctx.getParameter(name_);
    switch (typeof result) {
      case "number":
        ret = result;
        break;
      case "boolean":
        ret = result ? 1 : 0;
        break;
      case "string":
        GL.recordError(1280);
        return;
      case "object":
        if (result === null) {
          switch (name_) {
            case 34964:
            case 35725:
            case 34965:
            case 36006:
            case 36007:
            case 32873:
            case 34229:
            case 34068: {
              ret = 0;
              break;
            }
            default: {
              GL.recordError(1280);
              return;
            }
          }
        } else if (
          result instanceof Float32Array ||
          result instanceof Uint32Array ||
          result instanceof Int32Array ||
          result instanceof Array
        ) {
          for (var i = 0; i < result.length; ++i) {
            switch (type) {
              case 0:
                HEAP32[(p + i * 4) >> 2] = result[i];
                break;
              case 2:
                HEAPF32[(p + i * 4) >> 2] = result[i];
                break;
              case 4:
                HEAP8[(p + i) >> 0] = result[i] ? 1 : 0;
                break;
            }
          }
          return;
        } else {
          try {
            ret = result.name | 0;
          } catch (e) {
            GL.recordError(1280);
            err(
              "GL_INVALID_ENUM in glGet" +
                type +
                "v: Unknown object returned from WebGL getParameter(" +
                name_ +
                ")! (error: " +
                e +
                ")"
            );
            return;
          }
        }
        break;
      default:
        GL.recordError(1280);
        err(
          "GL_INVALID_ENUM in glGet" +
            type +
            "v: Native code calling glGet" +
            type +
            "v(" +
            name_ +
            ") and it returns " +
            result +
            " of type " +
            typeof result +
            "!"
        );
        return;
    }
  }
  switch (type) {
    case 1:
      writeI53ToI64(p, ret);
      break;
    case 0:
      HEAP32[p >> 2] = ret;
      break;
    case 2:
      HEAPF32[p >> 2] = ret;
      break;
    case 4:
      HEAP8[p >> 0] = ret ? 1 : 0;
      break;
  }
}
function _glGetIntegerv(name_, p) {
  emscriptenWebGLGet(name_, p, 0);
}
function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
  var log = GLctx.getProgramInfoLog(GL.programs[program]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
}
function _glGetProgramiv(program, pname, p) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  if (program >= GL.counter) {
    GL.recordError(1281);
    return;
  }
  var ptable = GL.programInfos[program];
  if (!ptable) {
    GL.recordError(1282);
    return;
  }
  if (pname == 35716) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    HEAP32[p >> 2] = log.length + 1;
  } else if (pname == 35719) {
    HEAP32[p >> 2] = ptable.maxUniformLength;
  } else if (pname == 35722) {
    if (ptable.maxAttributeLength == -1) {
      program = GL.programs[program];
      var numAttribs = GLctx.getProgramParameter(program, 35721);
      ptable.maxAttributeLength = 0;
      for (var i = 0; i < numAttribs; ++i) {
        var activeAttrib = GLctx.getActiveAttrib(program, i);
        ptable.maxAttributeLength = Math.max(
          ptable.maxAttributeLength,
          activeAttrib.name.length + 1
        );
      }
    }
    HEAP32[p >> 2] = ptable.maxAttributeLength;
  } else if (pname == 35381) {
    if (ptable.maxUniformBlockNameLength == -1) {
      program = GL.programs[program];
      var numBlocks = GLctx.getProgramParameter(program, 35382);
      ptable.maxUniformBlockNameLength = 0;
      for (var i = 0; i < numBlocks; ++i) {
        var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
        ptable.maxUniformBlockNameLength = Math.max(
          ptable.maxUniformBlockNameLength,
          activeBlockName.length + 1
        );
      }
    }
    HEAP32[p >> 2] = ptable.maxUniformBlockNameLength;
  } else {
    HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname);
  }
}
function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
  var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
  if (log === null) log = "(unknown error)";
  var numBytesWrittenExclNull =
    maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
  if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
}
function _glGetShaderiv(shader, pname, p) {
  if (!p) {
    GL.recordError(1281);
    return;
  }
  if (pname == 35716) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var logLength = log ? log.length + 1 : 0;
    HEAP32[p >> 2] = logLength;
  } else if (pname == 35720) {
    var source = GLctx.getShaderSource(GL.shaders[shader]);
    var sourceLength = source ? source.length + 1 : 0;
    HEAP32[p >> 2] = sourceLength;
  } else {
    HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
  }
}
function stringToNewUTF8(jsString) {
  var length = lengthBytesUTF8(jsString) + 1;
  var cString = _malloc(length);
  stringToUTF8(jsString, cString, length);
  return cString;
}
function _glGetString(name_) {
  if (GL.stringCache[name_]) return GL.stringCache[name_];
  var ret;
  switch (name_) {
    case 7939:
      var exts = GLctx.getSupportedExtensions() || [];
      exts = exts.concat(
        exts.map(function (e) {
          return "GL_" + e;
        })
      );
      ret = stringToNewUTF8(exts.join(" "));
      break;
    case 7936:
    case 7937:
    case 37445:
    case 37446:
      var s = GLctx.getParameter(name_);
      if (!s) {
        GL.recordError(1280);
      }
      ret = stringToNewUTF8(s);
      break;
    case 7938:
      var glVersion = GLctx.getParameter(7938);
      {
        glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
      }
      ret = stringToNewUTF8(glVersion);
      break;
    case 35724:
      var glslVersion = GLctx.getParameter(35724);
      var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
      var ver_num = glslVersion.match(ver_re);
      if (ver_num !== null) {
        if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
        glslVersion =
          "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
      }
      ret = stringToNewUTF8(glslVersion);
      break;
    default:
      GL.recordError(1280);
      return 0;
  }
  GL.stringCache[name_] = ret;
  return ret;
}
function jstoi_q(str) {
  return parseInt(str);
}
function _glGetUniformLocation(program, name) {
  name = UTF8ToString(name);
  var arrayIndex = 0;
  if (name[name.length - 1] == "]") {
    var leftBrace = name.lastIndexOf("[");
    arrayIndex =
      name[leftBrace + 1] != "]" ? jstoi_q(name.slice(leftBrace + 1)) : 0;
    name = name.slice(0, leftBrace);
  }
  var uniformInfo =
    GL.programInfos[program] && GL.programInfos[program].uniforms[name];
  if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) {
    return uniformInfo[1] + arrayIndex;
  } else {
    return -1;
  }
}
function _glLinkProgram(program) {
  GLctx.linkProgram(GL.programs[program]);
  GL.populateUniformTable(program);
}
function _glPixelStorei(pname, param) {
  if (pname == 3317) {
    GL.unpackAlignment = param;
  }
  GLctx.pixelStorei(pname, param);
}
function computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
  function roundedToNextMultipleOf(x, y) {
    return (x + y - 1) & -y;
  }
  var plainRowSize = width * sizePerPixel;
  var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
  return height * alignedRowSize;
}
function __colorChannelsInGlTextureFormat(format) {
  var colorChannels = { 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4 };
  return colorChannels[format - 6402] || 1;
}
function heapObjectForWebGLType(type) {
  type -= 5120;
  if (type == 1) return HEAPU8;
  if (type == 4) return HEAP32;
  if (type == 6) return HEAPF32;
  if (type == 5 || type == 28922) return HEAPU32;
  return HEAPU16;
}
function heapAccessShiftForWebGLHeap(heap) {
  return 31 - Math.clz32(heap.BYTES_PER_ELEMENT);
}
function emscriptenWebGLGetTexPixelData(
  type,
  format,
  width,
  height,
  pixels,
  internalFormat
) {
  var heap = heapObjectForWebGLType(type);
  var shift = heapAccessShiftForWebGLHeap(heap);
  var byteSize = 1 << shift;
  var sizePerPixel = __colorChannelsInGlTextureFormat(format) * byteSize;
  var bytes = computeUnpackAlignedImageSize(
    width,
    height,
    sizePerPixel,
    GL.unpackAlignment
  );
  return heap.subarray(pixels >> shift, (pixels + bytes) >> shift);
}
function _glReadPixels(x, y, width, height, format, type, pixels) {
  var pixelData = emscriptenWebGLGetTexPixelData(
    type,
    format,
    width,
    height,
    pixels,
    format
  );
  if (!pixelData) {
    GL.recordError(1280);
    return;
  }
  GLctx.readPixels(x, y, width, height, format, type, pixelData);
}
function _glRenderbufferStorage(x0, x1, x2, x3) {
  GLctx["renderbufferStorage"](x0, x1, x2, x3);
}
function _glScissor(x0, x1, x2, x3) {
  GLctx["scissor"](x0, x1, x2, x3);
}
function _glShaderSource(shader, count, string, length) {
  var source = GL.getSource(shader, count, string, length);
  GLctx.shaderSource(GL.shaders[shader], source);
}
function _glStencilFunc(x0, x1, x2) {
  GLctx["stencilFunc"](x0, x1, x2);
}
function _glStencilMask(x0) {
  GLctx["stencilMask"](x0);
}
function _glStencilOp(x0, x1, x2) {
  GLctx["stencilOp"](x0, x1, x2);
}
function _glTexImage2D(
  target,
  level,
  internalFormat,
  width,
  height,
  border,
  format,
  type,
  pixels
) {
  GLctx.texImage2D(
    target,
    level,
    internalFormat,
    width,
    height,
    border,
    format,
    type,
    pixels
      ? emscriptenWebGLGetTexPixelData(
          type,
          format,
          width,
          height,
          pixels,
          internalFormat
        )
      : null
  );
}
function _glTexParameteri(x0, x1, x2) {
  GLctx["texParameteri"](x0, x1, x2);
}
function _glTexSubImage2D(
  target,
  level,
  xoffset,
  yoffset,
  width,
  height,
  format,
  type,
  pixels
) {
  var pixelData = null;
  if (pixels)
    pixelData = emscriptenWebGLGetTexPixelData(
      type,
      format,
      width,
      height,
      pixels,
      0
    );
  GLctx.texSubImage2D(
    target,
    level,
    xoffset,
    yoffset,
    width,
    height,
    format,
    type,
    pixelData
  );
}
var miniTempWebGLFloatBuffers = [];
function _glUniform1fv(location, count, value) {
  if (count <= 288) {
    var view = miniTempWebGLFloatBuffers[count - 1];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 4) >> 2);
  }
  GLctx.uniform1fv(GL.uniforms[location], view);
}
function _glUniform1i(location, v0) {
  GLctx.uniform1i(GL.uniforms[location], v0);
}
var __miniTempWebGLIntBuffers = [];
function _glUniform1iv(location, count, value) {
  if (count <= 288) {
    var view = __miniTempWebGLIntBuffers[count - 1];
    for (var i = 0; i < count; ++i) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2);
  }
  GLctx.uniform1iv(GL.uniforms[location], view);
}
function _glUniform2fv(location, count, value) {
  if (count <= 144) {
    var view = miniTempWebGLFloatBuffers[2 * count - 1];
    for (var i = 0; i < 2 * count; i += 2) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 8) >> 2);
  }
  GLctx.uniform2fv(GL.uniforms[location], view);
}
function _glUniform2iv(location, count, value) {
  if (count <= 144) {
    var view = __miniTempWebGLIntBuffers[2 * count - 1];
    for (var i = 0; i < 2 * count; i += 2) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 8) >> 2);
  }
  GLctx.uniform2iv(GL.uniforms[location], view);
}
function _glUniform3fv(location, count, value) {
  if (count <= 96) {
    var view = miniTempWebGLFloatBuffers[3 * count - 1];
    for (var i = 0; i < 3 * count; i += 3) {
      view[i] = HEAPF32[(value + 4 * i) >> 2];
      view[i + 1] = HEAPF32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAPF32[(value + (4 * i + 8)) >> 2];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 12) >> 2);
  }
  GLctx.uniform3fv(GL.uniforms[location], view);
}
function _glUniform3iv(location, count, value) {
  if (count <= 96) {
    var view = __miniTempWebGLIntBuffers[3 * count - 1];
    for (var i = 0; i < 3 * count; i += 3) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 12) >> 2);
  }
  GLctx.uniform3iv(GL.uniforms[location], view);
}
function _glUniform4fv(location, count, value) {
  if (count <= 72) {
    var view = miniTempWebGLFloatBuffers[4 * count - 1];
    var heap = HEAPF32;
    value >>= 2;
    for (var i = 0; i < 4 * count; i += 4) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 16) >> 2);
  }
  GLctx.uniform4fv(GL.uniforms[location], view);
}
function _glUniform4iv(location, count, value) {
  if (count <= 72) {
    var view = __miniTempWebGLIntBuffers[4 * count - 1];
    for (var i = 0; i < 4 * count; i += 4) {
      view[i] = HEAP32[(value + 4 * i) >> 2];
      view[i + 1] = HEAP32[(value + (4 * i + 4)) >> 2];
      view[i + 2] = HEAP32[(value + (4 * i + 8)) >> 2];
      view[i + 3] = HEAP32[(value + (4 * i + 12)) >> 2];
    }
  } else {
    var view = HEAP32.subarray(value >> 2, (value + count * 16) >> 2);
  }
  GLctx.uniform4iv(GL.uniforms[location], view);
}
function _glUniformMatrix4fv(location, count, transpose, value) {
  if (count <= 18) {
    var view = miniTempWebGLFloatBuffers[16 * count - 1];
    var heap = HEAPF32;
    value >>= 2;
    for (var i = 0; i < 16 * count; i += 16) {
      var dst = value + i;
      view[i] = heap[dst];
      view[i + 1] = heap[dst + 1];
      view[i + 2] = heap[dst + 2];
      view[i + 3] = heap[dst + 3];
      view[i + 4] = heap[dst + 4];
      view[i + 5] = heap[dst + 5];
      view[i + 6] = heap[dst + 6];
      view[i + 7] = heap[dst + 7];
      view[i + 8] = heap[dst + 8];
      view[i + 9] = heap[dst + 9];
      view[i + 10] = heap[dst + 10];
      view[i + 11] = heap[dst + 11];
      view[i + 12] = heap[dst + 12];
      view[i + 13] = heap[dst + 13];
      view[i + 14] = heap[dst + 14];
      view[i + 15] = heap[dst + 15];
    }
  } else {
    var view = HEAPF32.subarray(value >> 2, (value + count * 64) >> 2);
  }
  GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
}
function _glUseProgram(program) {
  GLctx.useProgram(GL.programs[program]);
}
function _glVertexAttrib1fv(index, v) {
  GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
}
function _glVertexAttrib2fv(index, v) {
  GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[(v + 4) >> 2]);
}
function _glVertexAttrib3fv(index, v) {
  GLctx.vertexAttrib3f(
    index,
    HEAPF32[v >> 2],
    HEAPF32[(v + 4) >> 2],
    HEAPF32[(v + 8) >> 2]
  );
}
function _glVertexAttrib4fv(index, v) {
  GLctx.vertexAttrib4f(
    index,
    HEAPF32[v >> 2],
    HEAPF32[(v + 4) >> 2],
    HEAPF32[(v + 8) >> 2],
    HEAPF32[(v + 12) >> 2]
  );
}
function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
  var cb = GL.currentContext.clientBuffers[index];
  if (!GLctx.currentArrayBufferBinding) {
    cb.size = size;
    cb.type = type;
    cb.normalized = normalized;
    cb.stride = stride;
    cb.ptr = ptr;
    cb.clientside = true;
    cb.vertexAttribPointerAdaptor = function (
      index,
      size,
      type,
      normalized,
      stride,
      ptr
    ) {
      this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
    };
    return;
  }
  cb.clientside = false;
  GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
}
function _glViewport(x0, x1, x2, x3) {
  GLctx["viewport"](x0, x1, x2, x3);
}
function _glutPostRedisplay() {
  if (GLUT.displayFunc && !GLUT.requestedAnimationFrame) {
    GLUT.requestedAnimationFrame = true;
    Browser.requestAnimationFrame(function () {
      GLUT.requestedAnimationFrame = false;
      Browser.mainLoop.runIter(function () {
        dynCall_v(GLUT.displayFunc);
      });
    });
  }
}
var GLUT = {
  initTime: null,
  idleFunc: null,
  displayFunc: null,
  keyboardFunc: null,
  keyboardUpFunc: null,
  specialFunc: null,
  specialUpFunc: null,
  reshapeFunc: null,
  motionFunc: null,
  passiveMotionFunc: null,
  mouseFunc: null,
  buttons: 0,
  modifiers: 0,
  initWindowWidth: 256,
  initWindowHeight: 256,
  initDisplayMode: 18,
  windowX: 0,
  windowY: 0,
  windowWidth: 0,
  windowHeight: 0,
  requestedAnimationFrame: false,
  saveModifiers: function (event) {
    GLUT.modifiers = 0;
    if (event["shiftKey"]) GLUT.modifiers += 1;
    if (event["ctrlKey"]) GLUT.modifiers += 2;
    if (event["altKey"]) GLUT.modifiers += 4;
  },
  onMousemove: function (event) {
    var lastX = Browser.mouseX;
    var lastY = Browser.mouseY;
    Browser.calculateMouseEvent(event);
    var newX = Browser.mouseX;
    var newY = Browser.mouseY;
    if (newX == lastX && newY == lastY) return;
    if (
      GLUT.buttons == 0 &&
      event.target == Module["canvas"] &&
      GLUT.passiveMotionFunc
    ) {
      event.preventDefault();
      GLUT.saveModifiers(event);
      dynCall_vii(GLUT.passiveMotionFunc, lastX, lastY);
    } else if (GLUT.buttons != 0 && GLUT.motionFunc) {
      event.preventDefault();
      GLUT.saveModifiers(event);
      dynCall_vii(GLUT.motionFunc, lastX, lastY);
    }
  },
  getSpecialKey: function (keycode) {
    var key = null;
    switch (keycode) {
      case 8:
        key = 120;
        break;
      case 46:
        key = 111;
        break;
      case 112:
        key = 1;
        break;
      case 113:
        key = 2;
        break;
      case 114:
        key = 3;
        break;
      case 115:
        key = 4;
        break;
      case 116:
        key = 5;
        break;
      case 117:
        key = 6;
        break;
      case 118:
        key = 7;
        break;
      case 119:
        key = 8;
        break;
      case 120:
        key = 9;
        break;
      case 121:
        key = 10;
        break;
      case 122:
        key = 11;
        break;
      case 123:
        key = 12;
        break;
      case 37:
        key = 100;
        break;
      case 38:
        key = 101;
        break;
      case 39:
        key = 102;
        break;
      case 40:
        key = 103;
        break;
      case 33:
        key = 104;
        break;
      case 34:
        key = 105;
        break;
      case 36:
        key = 106;
        break;
      case 35:
        key = 107;
        break;
      case 45:
        key = 108;
        break;
      case 16:
      case 5:
        key = 112;
        break;
      case 6:
        key = 113;
        break;
      case 17:
      case 3:
        key = 114;
        break;
      case 4:
        key = 115;
        break;
      case 18:
      case 2:
        key = 116;
        break;
      case 1:
        key = 117;
        break;
    }
    return key;
  },
  getASCIIKey: function (event) {
    if (event["ctrlKey"] || event["altKey"] || event["metaKey"]) return null;
    var keycode = event["keyCode"];
    if (48 <= keycode && keycode <= 57) return keycode;
    if (65 <= keycode && keycode <= 90)
      return event["shiftKey"] ? keycode : keycode + 32;
    if (96 <= keycode && keycode <= 105) return keycode - 48;
    if (106 <= keycode && keycode <= 111) return keycode - 106 + 42;
    switch (keycode) {
      case 9:
      case 13:
      case 27:
      case 32:
      case 61:
        return keycode;
    }
    var s = event["shiftKey"];
    switch (keycode) {
      case 186:
        return s ? 58 : 59;
      case 187:
        return s ? 43 : 61;
      case 188:
        return s ? 60 : 44;
      case 189:
        return s ? 95 : 45;
      case 190:
        return s ? 62 : 46;
      case 191:
        return s ? 63 : 47;
      case 219:
        return s ? 123 : 91;
      case 220:
        return s ? 124 : 47;
      case 221:
        return s ? 125 : 93;
      case 222:
        return s ? 34 : 39;
    }
    return null;
  },
  onKeydown: function (event) {
    if (GLUT.specialFunc || GLUT.keyboardFunc) {
      var key = GLUT.getSpecialKey(event["keyCode"]);
      if (key !== null) {
        if (GLUT.specialFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          dynCall_viii(GLUT.specialFunc, key, Browser.mouseX, Browser.mouseY);
        }
      } else {
        key = GLUT.getASCIIKey(event);
        if (key !== null && GLUT.keyboardFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          dynCall_viii(GLUT.keyboardFunc, key, Browser.mouseX, Browser.mouseY);
        }
      }
    }
  },
  onKeyup: function (event) {
    if (GLUT.specialUpFunc || GLUT.keyboardUpFunc) {
      var key = GLUT.getSpecialKey(event["keyCode"]);
      if (key !== null) {
        if (GLUT.specialUpFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          dynCall_viii(GLUT.specialUpFunc, key, Browser.mouseX, Browser.mouseY);
        }
      } else {
        key = GLUT.getASCIIKey(event);
        if (key !== null && GLUT.keyboardUpFunc) {
          event.preventDefault();
          GLUT.saveModifiers(event);
          dynCall_viii(
            GLUT.keyboardUpFunc,
            key,
            Browser.mouseX,
            Browser.mouseY
          );
        }
      }
    }
  },
  touchHandler: function (event) {
    if (event.target != Module["canvas"]) {
      return;
    }
    var touches = event.changedTouches,
      main = touches[0],
      type = "";
    switch (event.type) {
      case "touchstart":
        type = "mousedown";
        break;
      case "touchmove":
        type = "mousemove";
        break;
      case "touchend":
        type = "mouseup";
        break;
      default:
        return;
    }
    var simulatedEvent = document.createEvent("MouseEvent");
    simulatedEvent.initMouseEvent(
      type,
      true,
      true,
      window,
      1,
      main.screenX,
      main.screenY,
      main.clientX,
      main.clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    main.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
  },
  onMouseButtonDown: function (event) {
    Browser.calculateMouseEvent(event);
    GLUT.buttons |= 1 << event["button"];
    if (event.target == Module["canvas"] && GLUT.mouseFunc) {
      try {
        event.target.setCapture();
      } catch (e) {}
      event.preventDefault();
      GLUT.saveModifiers(event);
      dynCall_viiii(
        GLUT.mouseFunc,
        event["button"],
        0,
        Browser.mouseX,
        Browser.mouseY
      );
    }
  },
  onMouseButtonUp: function (event) {
    Browser.calculateMouseEvent(event);
    GLUT.buttons &= ~(1 << event["button"]);
    if (GLUT.mouseFunc) {
      event.preventDefault();
      GLUT.saveModifiers(event);
      dynCall_viiii(
        GLUT.mouseFunc,
        event["button"],
        1,
        Browser.mouseX,
        Browser.mouseY
      );
    }
  },
  onMouseWheel: function (event) {
    Browser.calculateMouseEvent(event);
    var e = window.event || event;
    var delta = -Browser.getMouseWheelDelta(event);
    delta =
      delta == 0 ? 0 : delta > 0 ? Math.max(delta, 1) : Math.min(delta, -1);
    var button = 3;
    if (delta < 0) {
      button = 4;
    }
    if (GLUT.mouseFunc) {
      event.preventDefault();
      GLUT.saveModifiers(event);
      dynCall_viiii(GLUT.mouseFunc, button, 0, Browser.mouseX, Browser.mouseY);
    }
  },
  onFullscreenEventChange: function (event) {
    var width;
    var height;
    if (
      document["fullscreen"] ||
      document["fullScreen"] ||
      document["mozFullScreen"] ||
      document["webkitIsFullScreen"]
    ) {
      width = screen["width"];
      height = screen["height"];
    } else {
      width = GLUT.windowWidth;
      height = GLUT.windowHeight;
      document.removeEventListener(
        "fullscreenchange",
        GLUT.onFullscreenEventChange,
        true
      );
      document.removeEventListener(
        "mozfullscreenchange",
        GLUT.onFullscreenEventChange,
        true
      );
      document.removeEventListener(
        "webkitfullscreenchange",
        GLUT.onFullscreenEventChange,
        true
      );
    }
    Browser.setCanvasSize(width, height, true);
    if (GLUT.reshapeFunc) {
      dynCall_vii(GLUT.reshapeFunc, width, height);
    }
    _glutPostRedisplay();
  },
};
function _glutCreateWindow(name) {
  var contextAttributes = {
    antialias: (GLUT.initDisplayMode & 128) != 0,
    depth: (GLUT.initDisplayMode & 16) != 0,
    stencil: (GLUT.initDisplayMode & 32) != 0,
    alpha: (GLUT.initDisplayMode & 8) != 0,
  };
  Module.ctx = Browser.createContext(
    Module["canvas"],
    true,
    true,
    contextAttributes
  );
  return Module.ctx ? 1 : 0;
}
function _glutInitDisplayMode(mode) {
  GLUT.initDisplayMode = mode;
}
function _gmtime_r(time, tmPtr) {
  var date = new Date(HEAP32[time >> 2] * 1e3);
  HEAP32[tmPtr >> 2] = date.getUTCSeconds();
  HEAP32[(tmPtr + 4) >> 2] = date.getUTCMinutes();
  HEAP32[(tmPtr + 8) >> 2] = date.getUTCHours();
  HEAP32[(tmPtr + 12) >> 2] = date.getUTCDate();
  HEAP32[(tmPtr + 16) >> 2] = date.getUTCMonth();
  HEAP32[(tmPtr + 20) >> 2] = date.getUTCFullYear() - 1900;
  HEAP32[(tmPtr + 24) >> 2] = date.getUTCDay();
  HEAP32[(tmPtr + 36) >> 2] = 0;
  HEAP32[(tmPtr + 32) >> 2] = 0;
  var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
  var yday = ((date.getTime() - start) / (1e3 * 60 * 60 * 24)) | 0;
  HEAP32[(tmPtr + 28) >> 2] = yday;
  HEAP32[(tmPtr + 40) >> 2] = ___tm_timezone;
  return tmPtr;
}
function _gmtime(time) {
  return _gmtime_r(time, ___tm_current);
}
function _localtime(time) {
  return _localtime_r(time, ___tm_current);
}
function _usleep(useconds) {
  var start = _emscripten_get_now();
  while (_emscripten_get_now() - start < useconds / 1e3) {}
}
Module["_usleep"] = _usleep;
function _nanosleep(rqtp, rmtp) {
  if (rqtp === 0) {
    setErrNo(28);
    return -1;
  }
  var seconds = HEAP32[rqtp >> 2];
  var nanoseconds = HEAP32[(rqtp + 4) >> 2];
  if (nanoseconds < 0 || nanoseconds > 999999999 || seconds < 0) {
    setErrNo(28);
    return -1;
  }
  if (rmtp !== 0) {
    HEAP32[rmtp >> 2] = 0;
    HEAP32[(rmtp + 4) >> 2] = 0;
  }
  return _usleep(seconds * 1e6 + nanoseconds / 1e3);
}
function _pthread_create() {
  return 6;
}
function _pthread_detach() {}
function _pthread_join() {}
function _pthread_mutexattr_destroy() {}
function _pthread_mutexattr_init() {}
function _pthread_mutexattr_settype() {}
var ERRNO_CODES = {
  EPERM: 63,
  ENOENT: 44,
  ESRCH: 71,
  EINTR: 27,
  EIO: 29,
  ENXIO: 60,
  E2BIG: 1,
  ENOEXEC: 45,
  EBADF: 8,
  ECHILD: 12,
  EAGAIN: 6,
  EWOULDBLOCK: 6,
  ENOMEM: 48,
  EACCES: 2,
  EFAULT: 21,
  ENOTBLK: 105,
  EBUSY: 10,
  EEXIST: 20,
  EXDEV: 75,
  ENODEV: 43,
  ENOTDIR: 54,
  EISDIR: 31,
  EINVAL: 28,
  ENFILE: 41,
  EMFILE: 33,
  ENOTTY: 59,
  ETXTBSY: 74,
  EFBIG: 22,
  ENOSPC: 51,
  ESPIPE: 70,
  EROFS: 69,
  EMLINK: 34,
  EPIPE: 64,
  EDOM: 18,
  ERANGE: 68,
  ENOMSG: 49,
  EIDRM: 24,
  ECHRNG: 106,
  EL2NSYNC: 156,
  EL3HLT: 107,
  EL3RST: 108,
  ELNRNG: 109,
  EUNATCH: 110,
  ENOCSI: 111,
  EL2HLT: 112,
  EDEADLK: 16,
  ENOLCK: 46,
  EBADE: 113,
  EBADR: 114,
  EXFULL: 115,
  ENOANO: 104,
  EBADRQC: 103,
  EBADSLT: 102,
  EDEADLOCK: 16,
  EBFONT: 101,
  ENOSTR: 100,
  ENODATA: 116,
  ETIME: 117,
  ENOSR: 118,
  ENONET: 119,
  ENOPKG: 120,
  EREMOTE: 121,
  ENOLINK: 47,
  EADV: 122,
  ESRMNT: 123,
  ECOMM: 124,
  EPROTO: 65,
  EMULTIHOP: 36,
  EDOTDOT: 125,
  EBADMSG: 9,
  ENOTUNIQ: 126,
  EBADFD: 127,
  EREMCHG: 128,
  ELIBACC: 129,
  ELIBBAD: 130,
  ELIBSCN: 131,
  ELIBMAX: 132,
  ELIBEXEC: 133,
  ENOSYS: 52,
  ENOTEMPTY: 55,
  ENAMETOOLONG: 37,
  ELOOP: 32,
  EOPNOTSUPP: 138,
  EPFNOSUPPORT: 139,
  ECONNRESET: 15,
  ENOBUFS: 42,
  EAFNOSUPPORT: 5,
  EPROTOTYPE: 67,
  ENOTSOCK: 57,
  ENOPROTOOPT: 50,
  ESHUTDOWN: 140,
  ECONNREFUSED: 14,
  EADDRINUSE: 3,
  ECONNABORTED: 13,
  ENETUNREACH: 40,
  ENETDOWN: 38,
  ETIMEDOUT: 73,
  EHOSTDOWN: 142,
  EHOSTUNREACH: 23,
  EINPROGRESS: 26,
  EALREADY: 7,
  EDESTADDRREQ: 17,
  EMSGSIZE: 35,
  EPROTONOSUPPORT: 66,
  ESOCKTNOSUPPORT: 137,
  EADDRNOTAVAIL: 4,
  ENETRESET: 39,
  EISCONN: 30,
  ENOTCONN: 53,
  ETOOMANYREFS: 141,
  EUSERS: 136,
  EDQUOT: 19,
  ESTALE: 72,
  ENOTSUP: 138,
  ENOMEDIUM: 148,
  EILSEQ: 25,
  EOVERFLOW: 61,
  ECANCELED: 11,
  ENOTRECOVERABLE: 56,
  EOWNERDEAD: 62,
  ESTRPIPE: 135,
};
function _raise(sig) {
  setErrNo(ERRNO_CODES.ENOSYS);
  return -1;
}
function _round(d) {
  d = +d;
  return d >= +0 ? +Math_floor(d + +0.5) : +Math_ceil(d - +0.5);
}
function _roundf(d) {
  d = +d;
  return d >= +0 ? +Math_floor(d + +0.5) : +Math_ceil(d - +0.5);
}
function __isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function __arraySum(array, index) {
  var sum = 0;
  for (var i = 0; i <= index; sum += array[i++]) {}
  return sum;
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function __addDays(date, days) {
  var newDate = new Date(date.getTime());
  while (days > 0) {
    var leap = __isLeapYear(newDate.getFullYear());
    var currentMonth = newDate.getMonth();
    var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[
      currentMonth
    ];
    if (days > daysInCurrentMonth - newDate.getDate()) {
      days -= daysInCurrentMonth - newDate.getDate() + 1;
      newDate.setDate(1);
      if (currentMonth < 11) {
        newDate.setMonth(currentMonth + 1);
      } else {
        newDate.setMonth(0);
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
    } else {
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    }
  }
  return newDate;
}
function _strftime(s, maxsize, format, tm) {
  var tm_zone = HEAP32[(tm + 40) >> 2];
  var date = {
    tm_sec: HEAP32[tm >> 2],
    tm_min: HEAP32[(tm + 4) >> 2],
    tm_hour: HEAP32[(tm + 8) >> 2],
    tm_mday: HEAP32[(tm + 12) >> 2],
    tm_mon: HEAP32[(tm + 16) >> 2],
    tm_year: HEAP32[(tm + 20) >> 2],
    tm_wday: HEAP32[(tm + 24) >> 2],
    tm_yday: HEAP32[(tm + 28) >> 2],
    tm_isdst: HEAP32[(tm + 32) >> 2],
    tm_gmtoff: HEAP32[(tm + 36) >> 2],
    tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
  };
  var pattern = UTF8ToString(format);
  var EXPANSION_RULES_1 = {
    "%c": "%a %b %d %H:%M:%S %Y",
    "%D": "%m/%d/%y",
    "%F": "%Y-%m-%d",
    "%h": "%b",
    "%r": "%I:%M:%S %p",
    "%R": "%H:%M",
    "%T": "%H:%M:%S",
    "%x": "%m/%d/%y",
    "%X": "%H:%M:%S",
    "%Ec": "%c",
    "%EC": "%C",
    "%Ex": "%m/%d/%y",
    "%EX": "%H:%M:%S",
    "%Ey": "%y",
    "%EY": "%Y",
    "%Od": "%d",
    "%Oe": "%e",
    "%OH": "%H",
    "%OI": "%I",
    "%Om": "%m",
    "%OM": "%M",
    "%OS": "%S",
    "%Ou": "%u",
    "%OU": "%U",
    "%OV": "%V",
    "%Ow": "%w",
    "%OW": "%W",
    "%Oy": "%y",
  };
  for (var rule in EXPANSION_RULES_1) {
    pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
  }
  var WEEKDAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  function leadingSomething(value, digits, character) {
    var str = typeof value === "number" ? value.toString() : value || "";
    while (str.length < digits) {
      str = character[0] + str;
    }
    return str;
  }
  function leadingNulls(value, digits) {
    return leadingSomething(value, digits, "0");
  }
  function compareByDay(date1, date2) {
    function sgn(value) {
      return value < 0 ? -1 : value > 0 ? 1 : 0;
    }
    var compare;
    if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
      if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
        compare = sgn(date1.getDate() - date2.getDate());
      }
    }
    return compare;
  }
  function getFirstWeekStartDate(janFourth) {
    switch (janFourth.getDay()) {
      case 0:
        return new Date(janFourth.getFullYear() - 1, 11, 29);
      case 1:
        return janFourth;
      case 2:
        return new Date(janFourth.getFullYear(), 0, 3);
      case 3:
        return new Date(janFourth.getFullYear(), 0, 2);
      case 4:
        return new Date(janFourth.getFullYear(), 0, 1);
      case 5:
        return new Date(janFourth.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(janFourth.getFullYear() - 1, 11, 30);
    }
  }
  function getWeekBasedYear(date) {
    var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
    var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
    var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
    var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
    var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
    if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
      if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
        return thisDate.getFullYear() + 1;
      } else {
        return thisDate.getFullYear();
      }
    } else {
      return thisDate.getFullYear() - 1;
    }
  }
  var EXPANSION_RULES_2 = {
    "%a": function (date) {
      return WEEKDAYS[date.tm_wday].substring(0, 3);
    },
    "%A": function (date) {
      return WEEKDAYS[date.tm_wday];
    },
    "%b": function (date) {
      return MONTHS[date.tm_mon].substring(0, 3);
    },
    "%B": function (date) {
      return MONTHS[date.tm_mon];
    },
    "%C": function (date) {
      var year = date.tm_year + 1900;
      return leadingNulls((year / 100) | 0, 2);
    },
    "%d": function (date) {
      return leadingNulls(date.tm_mday, 2);
    },
    "%e": function (date) {
      return leadingSomething(date.tm_mday, 2, " ");
    },
    "%g": function (date) {
      return getWeekBasedYear(date).toString().substring(2);
    },
    "%G": function (date) {
      return getWeekBasedYear(date);
    },
    "%H": function (date) {
      return leadingNulls(date.tm_hour, 2);
    },
    "%I": function (date) {
      var twelveHour = date.tm_hour;
      if (twelveHour == 0) twelveHour = 12;
      else if (twelveHour > 12) twelveHour -= 12;
      return leadingNulls(twelveHour, 2);
    },
    "%j": function (date) {
      return leadingNulls(
        date.tm_mday +
          __arraySum(
            __isLeapYear(date.tm_year + 1900)
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            date.tm_mon - 1
          ),
        3
      );
    },
    "%m": function (date) {
      return leadingNulls(date.tm_mon + 1, 2);
    },
    "%M": function (date) {
      return leadingNulls(date.tm_min, 2);
    },
    "%n": function () {
      return "\n";
    },
    "%p": function (date) {
      if (date.tm_hour >= 0 && date.tm_hour < 12) {
        return "AM";
      } else {
        return "PM";
      }
    },
    "%S": function (date) {
      return leadingNulls(date.tm_sec, 2);
    },
    "%t": function () {
      return "\t";
    },
    "%u": function (date) {
      return date.tm_wday || 7;
    },
    "%U": function (date) {
      var janFirst = new Date(date.tm_year + 1900, 0, 1);
      var firstSunday =
        janFirst.getDay() === 0
          ? janFirst
          : __addDays(janFirst, 7 - janFirst.getDay());
      var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
      if (compareByDay(firstSunday, endDate) < 0) {
        var februaryFirstUntilEndMonth =
          __arraySum(
            __isLeapYear(endDate.getFullYear())
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            endDate.getMonth() - 1
          ) - 31;
        var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
        var days =
          firstSundayUntilEndJanuary +
          februaryFirstUntilEndMonth +
          endDate.getDate();
        return leadingNulls(Math.ceil(days / 7), 2);
      }
      return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
    },
    "%V": function (date) {
      var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
      var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
      var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
      var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
      var endDate = __addDays(
        new Date(date.tm_year + 1900, 0, 1),
        date.tm_yday
      );
      if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
        return "53";
      }
      if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
        return "01";
      }
      var daysDifference;
      if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
        daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
      } else {
        daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
      }
      return leadingNulls(Math.ceil(daysDifference / 7), 2);
    },
    "%w": function (date) {
      return date.tm_wday;
    },
    "%W": function (date) {
      var janFirst = new Date(date.tm_year, 0, 1);
      var firstMonday =
        janFirst.getDay() === 1
          ? janFirst
          : __addDays(
              janFirst,
              janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1
            );
      var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
      if (compareByDay(firstMonday, endDate) < 0) {
        var februaryFirstUntilEndMonth =
          __arraySum(
            __isLeapYear(endDate.getFullYear())
              ? __MONTH_DAYS_LEAP
              : __MONTH_DAYS_REGULAR,
            endDate.getMonth() - 1
          ) - 31;
        var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
        var days =
          firstMondayUntilEndJanuary +
          februaryFirstUntilEndMonth +
          endDate.getDate();
        return leadingNulls(Math.ceil(days / 7), 2);
      }
      return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
    },
    "%y": function (date) {
      return (date.tm_year + 1900).toString().substring(2);
    },
    "%Y": function (date) {
      return date.tm_year + 1900;
    },
    "%z": function (date) {
      var off = date.tm_gmtoff;
      var ahead = off >= 0;
      off = Math.abs(off) / 60;
      off = (off / 60) * 100 + (off % 60);
      return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
    },
    "%Z": function (date) {
      return date.tm_zone;
    },
    "%%": function () {
      return "%";
    },
  };
  for (var rule in EXPANSION_RULES_2) {
    if (pattern.indexOf(rule) >= 0) {
      pattern = pattern.replace(
        new RegExp(rule, "g"),
        EXPANSION_RULES_2[rule](date)
      );
    }
  }
  var bytes = intArrayFromString(pattern, false);
  if (bytes.length > maxsize) {
    return 0;
  }
  writeArrayToMemory(bytes, s);
  return bytes.length - 1;
}
function _strftime_l(s, maxsize, format, tm) {
  return _strftime(s, maxsize, format, tm);
}
function _strptime(buf, format, tm) {
  var pattern = UTF8ToString(format);
  var SPECIAL_CHARS = "\\!@#$^&*()+=-[]/{}|:<>?,.";
  for (var i = 0, ii = SPECIAL_CHARS.length; i < ii; ++i) {
    pattern = pattern.replace(
      new RegExp("\\" + SPECIAL_CHARS[i], "g"),
      "\\" + SPECIAL_CHARS[i]
    );
  }
  var EQUIVALENT_MATCHERS = {
    "%A": "%a",
    "%B": "%b",
    "%c": "%a %b %d %H:%M:%S %Y",
    "%D": "%m\\/%d\\/%y",
    "%e": "%d",
    "%F": "%Y-%m-%d",
    "%h": "%b",
    "%R": "%H\\:%M",
    "%r": "%I\\:%M\\:%S\\s%p",
    "%T": "%H\\:%M\\:%S",
    "%x": "%m\\/%d\\/(?:%y|%Y)",
    "%X": "%H\\:%M\\:%S",
  };
  for (var matcher in EQUIVALENT_MATCHERS) {
    pattern = pattern.replace(matcher, EQUIVALENT_MATCHERS[matcher]);
  }
  var DATE_PATTERNS = {
    "%a": "(?:Sun(?:day)?)|(?:Mon(?:day)?)|(?:Tue(?:sday)?)|(?:Wed(?:nesday)?)|(?:Thu(?:rsday)?)|(?:Fri(?:day)?)|(?:Sat(?:urday)?)",
    "%b": "(?:Jan(?:uary)?)|(?:Feb(?:ruary)?)|(?:Mar(?:ch)?)|(?:Apr(?:il)?)|May|(?:Jun(?:e)?)|(?:Jul(?:y)?)|(?:Aug(?:ust)?)|(?:Sep(?:tember)?)|(?:Oct(?:ober)?)|(?:Nov(?:ember)?)|(?:Dec(?:ember)?)",
    "%C": "\\d\\d",
    "%d": "0[1-9]|[1-9](?!\\d)|1\\d|2\\d|30|31",
    "%H": "\\d(?!\\d)|[0,1]\\d|20|21|22|23",
    "%I": "\\d(?!\\d)|0\\d|10|11|12",
    "%j": "00[1-9]|0?[1-9](?!\\d)|0?[1-9]\\d(?!\\d)|[1,2]\\d\\d|3[0-6]\\d",
    "%m": "0[1-9]|[1-9](?!\\d)|10|11|12",
    "%M": "0\\d|\\d(?!\\d)|[1-5]\\d",
    "%n": "\\s",
    "%p": "AM|am|PM|pm|A\\.M\\.|a\\.m\\.|P\\.M\\.|p\\.m\\.",
    "%S": "0\\d|\\d(?!\\d)|[1-5]\\d|60",
    "%U": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
    "%W": "0\\d|\\d(?!\\d)|[1-4]\\d|50|51|52|53",
    "%w": "[0-6]",
    "%y": "\\d\\d",
    "%Y": "\\d\\d\\d\\d",
    "%%": "%",
    "%t": "\\s",
  };
  var MONTH_NUMBERS = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };
  var DAY_NUMBERS_SUN_FIRST = {
    SUN: 0,
    MON: 1,
    TUE: 2,
    WED: 3,
    THU: 4,
    FRI: 5,
    SAT: 6,
  };
  var DAY_NUMBERS_MON_FIRST = {
    MON: 0,
    TUE: 1,
    WED: 2,
    THU: 3,
    FRI: 4,
    SAT: 5,
    SUN: 6,
  };
  for (var datePattern in DATE_PATTERNS) {
    pattern = pattern.replace(
      datePattern,
      "(" + datePattern + DATE_PATTERNS[datePattern] + ")"
    );
  }
  var capture = [];
  for (var i = pattern.indexOf("%"); i >= 0; i = pattern.indexOf("%")) {
    capture.push(pattern[i + 1]);
    pattern = pattern.replace(new RegExp("\\%" + pattern[i + 1], "g"), "");
  }
  var matches = new RegExp("^" + pattern, "i").exec(UTF8ToString(buf));
  function initDate() {
    function fixup(value, min, max) {
      return typeof value !== "number" || isNaN(value)
        ? min
        : value >= min
        ? value <= max
          ? value
          : max
        : min;
    }
    return {
      year: fixup(HEAP32[(tm + 20) >> 2] + 1900, 1970, 9999),
      month: fixup(HEAP32[(tm + 16) >> 2], 0, 11),
      day: fixup(HEAP32[(tm + 12) >> 2], 1, 31),
      hour: fixup(HEAP32[(tm + 8) >> 2], 0, 23),
      min: fixup(HEAP32[(tm + 4) >> 2], 0, 59),
      sec: fixup(HEAP32[tm >> 2], 0, 59),
    };
  }
  if (matches) {
    var date = initDate();
    var value;
    var getMatch = function (symbol) {
      var pos = capture.indexOf(symbol);
      if (pos >= 0) {
        return matches[pos + 1];
      }
      return;
    };
    if ((value = getMatch("S"))) {
      date.sec = jstoi_q(value);
    }
    if ((value = getMatch("M"))) {
      date.min = jstoi_q(value);
    }
    if ((value = getMatch("H"))) {
      date.hour = jstoi_q(value);
    } else if ((value = getMatch("I"))) {
      var hour = jstoi_q(value);
      if ((value = getMatch("p"))) {
        hour += value.toUpperCase()[0] === "P" ? 12 : 0;
      }
      date.hour = hour;
    }
    if ((value = getMatch("Y"))) {
      date.year = jstoi_q(value);
    } else if ((value = getMatch("y"))) {
      var year = jstoi_q(value);
      if ((value = getMatch("C"))) {
        year += jstoi_q(value) * 100;
      } else {
        year += year < 69 ? 2e3 : 1900;
      }
      date.year = year;
    }
    if ((value = getMatch("m"))) {
      date.month = jstoi_q(value) - 1;
    } else if ((value = getMatch("b"))) {
      date.month = MONTH_NUMBERS[value.substring(0, 3).toUpperCase()] || 0;
    }
    if ((value = getMatch("d"))) {
      date.day = jstoi_q(value);
    } else if ((value = getMatch("j"))) {
      var day = jstoi_q(value);
      var leapYear = __isLeapYear(date.year);
      for (var month = 0; month < 12; ++month) {
        var daysUntilMonth = __arraySum(
          leapYear ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR,
          month - 1
        );
        if (
          day <=
          daysUntilMonth +
            (leapYear ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[month]
        ) {
          date.day = day - daysUntilMonth;
        }
      }
    } else if ((value = getMatch("a"))) {
      var weekDay = value.substring(0, 3).toUpperCase();
      if ((value = getMatch("U"))) {
        var weekDayNumber = DAY_NUMBERS_SUN_FIRST[weekDay];
        var weekNumber = jstoi_q(value);
        var janFirst = new Date(date.year, 0, 1);
        var endDate;
        if (janFirst.getDay() === 0) {
          endDate = __addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
        } else {
          endDate = __addDays(
            janFirst,
            7 - janFirst.getDay() + weekDayNumber + 7 * (weekNumber - 1)
          );
        }
        date.day = endDate.getDate();
        date.month = endDate.getMonth();
      } else if ((value = getMatch("W"))) {
        var weekDayNumber = DAY_NUMBERS_MON_FIRST[weekDay];
        var weekNumber = jstoi_q(value);
        var janFirst = new Date(date.year, 0, 1);
        var endDate;
        if (janFirst.getDay() === 1) {
          endDate = __addDays(janFirst, weekDayNumber + 7 * (weekNumber - 1));
        } else {
          endDate = __addDays(
            janFirst,
            7 - janFirst.getDay() + 1 + weekDayNumber + 7 * (weekNumber - 1)
          );
        }
        date.day = endDate.getDate();
        date.month = endDate.getMonth();
      }
    }
    var fullDate = new Date(
      date.year,
      date.month,
      date.day,
      date.hour,
      date.min,
      date.sec,
      0
    );
    HEAP32[tm >> 2] = fullDate.getSeconds();
    HEAP32[(tm + 4) >> 2] = fullDate.getMinutes();
    HEAP32[(tm + 8) >> 2] = fullDate.getHours();
    HEAP32[(tm + 12) >> 2] = fullDate.getDate();
    HEAP32[(tm + 16) >> 2] = fullDate.getMonth();
    HEAP32[(tm + 20) >> 2] = fullDate.getFullYear() - 1900;
    HEAP32[(tm + 24) >> 2] = fullDate.getDay();
    HEAP32[(tm + 28) >> 2] =
      __arraySum(
        __isLeapYear(fullDate.getFullYear())
          ? __MONTH_DAYS_LEAP
          : __MONTH_DAYS_REGULAR,
        fullDate.getMonth() - 1
      ) +
      fullDate.getDate() -
      1;
    HEAP32[(tm + 32) >> 2] = 0;
    return buf + intArrayFromString(matches[0]).length - 1;
  }
  return 0;
}
function _sysconf(name) {
  switch (name) {
    case 30:
      return 16384;
    case 85:
      var maxHeapSize = 2113929216;
      return maxHeapSize / 16384;
    case 132:
    case 133:
    case 12:
    case 137:
    case 138:
    case 15:
    case 235:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 149:
    case 13:
    case 10:
    case 236:
    case 153:
    case 9:
    case 21:
    case 22:
    case 159:
    case 154:
    case 14:
    case 77:
    case 78:
    case 139:
    case 80:
    case 81:
    case 82:
    case 68:
    case 67:
    case 164:
    case 11:
    case 29:
    case 47:
    case 48:
    case 95:
    case 52:
    case 51:
    case 46:
    case 79:
      return 200809;
    case 27:
    case 246:
    case 127:
    case 128:
    case 23:
    case 24:
    case 160:
    case 161:
    case 181:
    case 182:
    case 242:
    case 183:
    case 184:
    case 243:
    case 244:
    case 245:
    case 165:
    case 178:
    case 179:
    case 49:
    case 50:
    case 168:
    case 169:
    case 175:
    case 170:
    case 171:
    case 172:
    case 97:
    case 76:
    case 32:
    case 173:
    case 35:
      return -1;
    case 176:
    case 177:
    case 7:
    case 155:
    case 8:
    case 157:
    case 125:
    case 126:
    case 92:
    case 93:
    case 129:
    case 130:
    case 131:
    case 94:
    case 91:
      return 1;
    case 74:
    case 60:
    case 69:
    case 70:
    case 4:
      return 1024;
    case 31:
    case 42:
    case 72:
      return 32;
    case 87:
    case 26:
    case 33:
      return 2147483647;
    case 34:
    case 1:
      return 47839;
    case 38:
    case 36:
      return 99;
    case 43:
    case 37:
      return 2048;
    case 0:
      return 2097152;
    case 3:
      return 65536;
    case 28:
      return 32768;
    case 44:
      return 32767;
    case 75:
      return 16384;
    case 39:
      return 1e3;
    case 89:
      return 700;
    case 71:
      return 256;
    case 40:
      return 255;
    case 2:
      return 100;
    case 180:
      return 64;
    case 25:
      return 20;
    case 5:
      return 16;
    case 6:
      return 6;
    case 73:
      return 4;
    case 84: {
      if (typeof navigator === "object")
        return navigator["hardwareConcurrency"] || 1;
      return 1;
    }
  }
  setErrNo(28);
  return -1;
}
function _time(ptr) {
  var ret = (Date.now() / 1e3) | 0;
  if (ptr) {
    HEAP32[ptr >> 2] = ret;
  }
  return ret;
}
function _utimes(path, times) {
  var time;
  if (times) {
    var offset = 8 + 0;
    time = HEAP32[(times + offset) >> 2] * 1e3;
    offset = 8 + 4;
    time += HEAP32[(times + offset) >> 2] / 1e3;
  } else {
    time = Date.now();
  }
  path = UTF8ToString(path);
  try {
    FS.utime(path, time, time);
    return 0;
  } catch (e) {
    FS.handleFSError(e);
    return -1;
  }
}
var readAsmConstArgsArray = [];
function readAsmConstArgs(sigPtr, buf) {
  readAsmConstArgsArray.length = 0;
  var ch;
  buf >>= 2;
  while ((ch = HEAPU8[sigPtr++])) {
    var double = ch < 105;
    if (double && buf & 1) buf++;
    readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
    ++buf;
  }
  return readAsmConstArgsArray;
}
var FSNode = function (parent, name, mode, rdev) {
  if (!parent) {
    parent = this;
  }
  this.parent = parent;
  this.mount = parent.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = name;
  this.mode = mode;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = rdev;
};
var readMode = 292 | 73;
var writeMode = 146;
Object.defineProperties(FSNode.prototype, {
  read: {
    get: function () {
      return (this.mode & readMode) === readMode;
    },
    set: function (val) {
      val ? (this.mode |= readMode) : (this.mode &= ~readMode);
    },
  },
  write: {
    get: function () {
      return (this.mode & writeMode) === writeMode;
    },
    set: function (val) {
      val ? (this.mode |= writeMode) : (this.mode &= ~writeMode);
    },
  },
  isFolder: {
    get: function () {
      return FS.isDir(this.mode);
    },
  },
  isDevice: {
    get: function () {
      return FS.isChrdev(this.mode);
    },
  },
});
FS.FSNode = FSNode;
FS.staticInit();
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["requestFullscreen"] = function Module_requestFullscreen(
  lockPointer,
  resizeCanvas
) {
  Browser.requestFullscreen(lockPointer, resizeCanvas);
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
  Browser.requestAnimationFrame(func);
};
Module["setCanvasSize"] = function Module_setCanvasSize(
  width,
  height,
  noUpdates
) {
  Browser.setCanvasSize(width, height, noUpdates);
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
  Browser.mainLoop.pause();
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
  Browser.mainLoop.resume();
};
Module["getUserMedia"] = function Module_getUserMedia() {
  Browser.getUserMedia();
};
Module["createContext"] = function Module_createContext(
  canvas,
  useWebGL,
  setInModule,
  webGLContextAttributes
) {
  return Browser.createContext(
    canvas,
    useWebGL,
    setInModule,
    webGLContextAttributes
  );
};
var GLctx;
var miniTempWebGLFloatBuffersStorage = new Float32Array(288);
for (var i = 0; i < 288; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(
    0,
    i + 1
  );
}
var __miniTempWebGLIntBuffersStorage = new Int32Array(288);
for (var i = 0; i < 288; ++i) {
  __miniTempWebGLIntBuffers[i] = __miniTempWebGLIntBuffersStorage.subarray(
    0,
    i + 1
  );
}
var ASSERTIONS = false;
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}
var asmLibraryArg = {
  __cxa_atexit: ___cxa_atexit,
  __cxa_thread_atexit: ___cxa_thread_atexit,
  __map_file: ___map_file,
  __sys_access: ___sys_access,
  __sys_chmod: ___sys_chmod,
  __sys_chown32: ___sys_chown32,
  __sys_fchmod: ___sys_fchmod,
  __sys_fchown32: ___sys_fchown32,
  __sys_fcntl64: ___sys_fcntl64,
  __sys_fstat64: ___sys_fstat64,
  __sys_ftruncate64: ___sys_ftruncate64,
  __sys_getcwd: ___sys_getcwd,
  __sys_getdents64: ___sys_getdents64,
  __sys_geteuid32: ___sys_geteuid32,
  __sys_getpid: ___sys_getpid,
  __sys_ioctl: ___sys_ioctl,
  __sys_lstat64: ___sys_lstat64,
  __sys_mkdir: ___sys_mkdir,
  __sys_mmap2: ___sys_mmap2,
  __sys_munmap: ___sys_munmap,
  __sys_open: ___sys_open,
  __sys_read: ___sys_read,
  __sys_readlink: ___sys_readlink,
  __sys_rename: ___sys_rename,
  __sys_rmdir: ___sys_rmdir,
  __sys_stat64: ___sys_stat64,
  __sys_statfs64: ___sys_statfs64,
  __sys_umask: ___sys_umask,
  __sys_unlink: ___sys_unlink,
  _emscripten_push_uncounted_main_loop_blocker:
    __emscripten_push_uncounted_main_loop_blocker,
  abort: _abort,
  alBufferData: _alBufferData,
  alDeleteBuffers: _alDeleteBuffers,
  alDeleteSources: _alDeleteSources,
  alDistanceModel: _alDistanceModel,
  alGenBuffers: _alGenBuffers,
  alGenSources: _alGenSources,
  alGetBufferi: _alGetBufferi,
  alGetError: _alGetError,
  alGetSourcei: _alGetSourcei,
  alListener3f: _alListener3f,
  alListenerf: _alListenerf,
  alListenerfv: _alListenerfv,
  alSource3f: _alSource3f,
  alSourcePause: _alSourcePause,
  alSourcePlay: _alSourcePlay,
  alSourceQueueBuffers: _alSourceQueueBuffers,
  alSourceStop: _alSourceStop,
  alSourceUnqueueBuffers: _alSourceUnqueueBuffers,
  alSourcef: _alSourcef,
  alSourcefv: _alSourcefv,
  alSourcei: _alSourcei,
  alcCloseDevice: _alcCloseDevice,
  alcCreateContext: _alcCreateContext,
  alcDestroyContext: _alcDestroyContext,
  alcGetCurrentContext: _alcGetCurrentContext,
  alcMakeContextCurrent: _alcMakeContextCurrent,
  alcOpenDevice: _alcOpenDevice,
  alcProcessContext: _alcProcessContext,
  alcSuspendContext: _alcSuspendContext,
  clock: _clock,
  clock_gettime: _clock_gettime,
  ctime: _ctime,
  curl_easy_cleanup: _curl_easy_cleanup,
  curl_easy_init: _curl_easy_init,
  curl_easy_perform: _curl_easy_perform,
  curl_easy_setopt: _curl_easy_setopt,
  curl_slist_append: _curl_slist_append,
  difftime: _difftime,
  dlclose: _dlclose,
  dlerror: _dlerror,
  dlopen: _dlopen,
  dlsym: _dlsym,
  emscripten_asm_const_iii: _emscripten_asm_const_iii,
  emscripten_async_call: _emscripten_async_call,
  emscripten_cancel_main_loop: _emscripten_cancel_main_loop,
  emscripten_exit_fullscreen: _emscripten_exit_fullscreen,
  emscripten_get_canvas_element_size: _emscripten_get_canvas_element_size,
  emscripten_get_fullscreen_status: _emscripten_get_fullscreen_status,
  emscripten_get_now: _emscripten_get_now,
  emscripten_get_sbrk_ptr: _emscripten_get_sbrk_ptr,
  emscripten_longjmp: _emscripten_longjmp,
  emscripten_memcpy_big: _emscripten_memcpy_big,
  emscripten_pause_main_loop: _emscripten_pause_main_loop,
  emscripten_request_fullscreen_strategy:
    _emscripten_request_fullscreen_strategy,
  emscripten_resize_heap: _emscripten_resize_heap,
  emscripten_resume_main_loop: _emscripten_resume_main_loop,
  emscripten_set_beforeunload_callback_on_thread:
    _emscripten_set_beforeunload_callback_on_thread,
  emscripten_set_canvas_element_size: _emscripten_set_canvas_element_size,
  emscripten_set_fullscreenchange_callback_on_thread:
    _emscripten_set_fullscreenchange_callback_on_thread,
  emscripten_set_keydown_callback_on_thread:
    _emscripten_set_keydown_callback_on_thread,
  emscripten_set_keyup_callback_on_thread:
    _emscripten_set_keyup_callback_on_thread,
  emscripten_set_main_loop_arg: _emscripten_set_main_loop_arg,
  emscripten_set_mousedown_callback_on_thread:
    _emscripten_set_mousedown_callback_on_thread,
  emscripten_set_mousemove_callback_on_thread:
    _emscripten_set_mousemove_callback_on_thread,
  emscripten_set_mouseup_callback_on_thread:
    _emscripten_set_mouseup_callback_on_thread,
  emscripten_set_touchcancel_callback_on_thread:
    _emscripten_set_touchcancel_callback_on_thread,
  emscripten_set_touchend_callback_on_thread:
    _emscripten_set_touchend_callback_on_thread,
  emscripten_set_touchmove_callback_on_thread:
    _emscripten_set_touchmove_callback_on_thread,
  emscripten_set_touchstart_callback_on_thread:
    _emscripten_set_touchstart_callback_on_thread,
  emscripten_set_visibilitychange_callback_on_thread:
    _emscripten_set_visibilitychange_callback_on_thread,
  emscripten_set_wheel_callback_on_thread:
    _emscripten_set_wheel_callback_on_thread,
  environ_get: _environ_get,
  environ_sizes_get: _environ_sizes_get,
  fd_close: _fd_close,
  fd_fdstat_get: _fd_fdstat_get,
  fd_read: _fd_read,
  fd_seek: _fd_seek,
  fd_sync: _fd_sync,
  fd_write: _fd_write,
  getTempRet0: getTempRet0,
  gettimeofday: _gettimeofday,
  glActiveTexture: _glActiveTexture,
  glAttachShader: _glAttachShader,
  glBindAttribLocation: _glBindAttribLocation,
  glBindFramebuffer: _glBindFramebuffer,
  glBindRenderbuffer: _glBindRenderbuffer,
  glBindTexture: _glBindTexture,
  glBlendFunc: _glBlendFunc,
  glCheckFramebufferStatus: _glCheckFramebufferStatus,
  glClear: _glClear,
  glClearColor: _glClearColor,
  glClearDepthf: _glClearDepthf,
  glClearStencil: _glClearStencil,
  glColorMask: _glColorMask,
  glCompileShader: _glCompileShader,
  glCompressedTexImage2D: _glCompressedTexImage2D,
  glCompressedTexSubImage2D: _glCompressedTexSubImage2D,
  glCreateProgram: _glCreateProgram,
  glCreateShader: _glCreateShader,
  glCullFace: _glCullFace,
  glDeleteFramebuffers: _glDeleteFramebuffers,
  glDeleteProgram: _glDeleteProgram,
  glDeleteRenderbuffers: _glDeleteRenderbuffers,
  glDeleteShader: _glDeleteShader,
  glDeleteTextures: _glDeleteTextures,
  glDepthFunc: _glDepthFunc,
  glDepthMask: _glDepthMask,
  glDepthRangef: _glDepthRangef,
  glDisable: _glDisable,
  glDisableVertexAttribArray: _glDisableVertexAttribArray,
  glDrawArrays: _glDrawArrays,
  glDrawElements: _glDrawElements,
  glEnable: _glEnable,
  glEnableVertexAttribArray: _glEnableVertexAttribArray,
  glFramebufferRenderbuffer: _glFramebufferRenderbuffer,
  glFramebufferTexture2D: _glFramebufferTexture2D,
  glGenFramebuffers: _glGenFramebuffers,
  glGenRenderbuffers: _glGenRenderbuffers,
  glGenTextures: _glGenTextures,
  glGenerateMipmap: _glGenerateMipmap,
  glGetActiveUniform: _glGetActiveUniform,
  glGetIntegerv: _glGetIntegerv,
  glGetProgramInfoLog: _glGetProgramInfoLog,
  glGetProgramiv: _glGetProgramiv,
  glGetShaderInfoLog: _glGetShaderInfoLog,
  glGetShaderiv: _glGetShaderiv,
  glGetString: _glGetString,
  glGetUniformLocation: _glGetUniformLocation,
  glLinkProgram: _glLinkProgram,
  glPixelStorei: _glPixelStorei,
  glReadPixels: _glReadPixels,
  glRenderbufferStorage: _glRenderbufferStorage,
  glScissor: _glScissor,
  glShaderSource: _glShaderSource,
  glStencilFunc: _glStencilFunc,
  glStencilMask: _glStencilMask,
  glStencilOp: _glStencilOp,
  glTexImage2D: _glTexImage2D,
  glTexParameteri: _glTexParameteri,
  glTexSubImage2D: _glTexSubImage2D,
  glUniform1fv: _glUniform1fv,
  glUniform1i: _glUniform1i,
  glUniform1iv: _glUniform1iv,
  glUniform2fv: _glUniform2fv,
  glUniform2iv: _glUniform2iv,
  glUniform3fv: _glUniform3fv,
  glUniform3iv: _glUniform3iv,
  glUniform4fv: _glUniform4fv,
  glUniform4iv: _glUniform4iv,
  glUniformMatrix4fv: _glUniformMatrix4fv,
  glUseProgram: _glUseProgram,
  glVertexAttrib1fv: _glVertexAttrib1fv,
  glVertexAttrib2fv: _glVertexAttrib2fv,
  glVertexAttrib3fv: _glVertexAttrib3fv,
  glVertexAttrib4fv: _glVertexAttrib4fv,
  glVertexAttribPointer: _glVertexAttribPointer,
  glViewport: _glViewport,
  glutCreateWindow: _glutCreateWindow,
  glutInitDisplayMode: _glutInitDisplayMode,
  gmtime: _gmtime,
  gmtime_r: _gmtime_r,
  invoke_iii: invoke_iii,
  invoke_iiii: invoke_iiii,
  invoke_iiiii: invoke_iiiii,
  invoke_vi: invoke_vi,
  invoke_vii: invoke_vii,
  invoke_viiii: invoke_viiii,
  invoke_viiiii: invoke_viiiii,
  localtime: _localtime,
  localtime_r: _localtime_r,
  memory: wasmMemory,
  mktime: _mktime,
  nanosleep: _nanosleep,
  pthread_create: _pthread_create,
  pthread_detach: _pthread_detach,
  pthread_join: _pthread_join,
  pthread_mutexattr_destroy: _pthread_mutexattr_destroy,
  pthread_mutexattr_init: _pthread_mutexattr_init,
  pthread_mutexattr_settype: _pthread_mutexattr_settype,
  raise: _raise,
  round: _round,
  roundf: _roundf,
  setTempRet0: setTempRet0,
  strftime: _strftime,
  strftime_l: _strftime_l,
  strptime: _strptime,
  sysconf: _sysconf,
  table: wasmTable,
  time: _time,
  utimes: _utimes,
};
var asm = createWasm();
var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
  return (___wasm_call_ctors = Module["___wasm_call_ctors"] =
    Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
});
var _main = (Module["_main"] = function () {
  return (_main = Module["_main"] = Module["asm"]["main"]).apply(
    null,
    arguments
  );
});
var ___errno_location = (Module["___errno_location"] = function () {
  return (___errno_location = Module["___errno_location"] =
    Module["asm"]["__errno_location"]).apply(null, arguments);
});
var __get_tzname = (Module["__get_tzname"] = function () {
  return (__get_tzname = Module["__get_tzname"] =
    Module["asm"]["_get_tzname"]).apply(null, arguments);
});
var __get_daylight = (Module["__get_daylight"] = function () {
  return (__get_daylight = Module["__get_daylight"] =
    Module["asm"]["_get_daylight"]).apply(null, arguments);
});
var __get_timezone = (Module["__get_timezone"] = function () {
  return (__get_timezone = Module["__get_timezone"] =
    Module["asm"]["_get_timezone"]).apply(null, arguments);
});
var _setThrew = (Module["_setThrew"] = function () {
  return (_setThrew = Module["_setThrew"] = Module["asm"]["setThrew"]).apply(
    null,
    arguments
  );
});
var stackSave = (Module["stackSave"] = function () {
  return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(
    null,
    arguments
  );
});
var stackRestore = (Module["stackRestore"] = function () {
  return (stackRestore = Module["stackRestore"] =
    Module["asm"]["stackRestore"]).apply(null, arguments);
});
var stackAlloc = (Module["stackAlloc"] = function () {
  return (stackAlloc = Module["stackAlloc"] =
    Module["asm"]["stackAlloc"]).apply(null, arguments);
});
var _saveSetjmp = (Module["_saveSetjmp"] = function () {
  return (_saveSetjmp = Module["_saveSetjmp"] =
    Module["asm"]["saveSetjmp"]).apply(null, arguments);
});
var _testSetjmp = (Module["_testSetjmp"] = function () {
  return (_testSetjmp = Module["_testSetjmp"] =
    Module["asm"]["testSetjmp"]).apply(null, arguments);
});
var _malloc = (Module["_malloc"] = function () {
  return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(
    null,
    arguments
  );
});
var _free = (Module["_free"] = function () {
  return (_free = Module["_free"] = Module["asm"]["free"]).apply(
    null,
    arguments
  );
});
var _realloc = (Module["_realloc"] = function () {
  return (_realloc = Module["_realloc"] = Module["asm"]["realloc"]).apply(
    null,
    arguments
  );
});
var _memalign = (Module["_memalign"] = function () {
  return (_memalign = Module["_memalign"] = Module["asm"]["memalign"]).apply(
    null,
    arguments
  );
});
var _emscripten_main_thread_process_queued_calls = (Module[
  "_emscripten_main_thread_process_queued_calls"
] = function () {
  return (_emscripten_main_thread_process_queued_calls = Module[
    "_emscripten_main_thread_process_queued_calls"
  ] =
    Module["asm"]["emscripten_main_thread_process_queued_calls"]).apply(
    null,
    arguments
  );
});
var _memset = (Module["_memset"] = function () {
  return (_memset = Module["_memset"] = Module["asm"]["memset"]).apply(
    null,
    arguments
  );
});
var _strlen = (Module["_strlen"] = function () {
  return (_strlen = Module["_strlen"] = Module["asm"]["strlen"]).apply(
    null,
    arguments
  );
});
var dynCall_vi = (Module["dynCall_vi"] = function () {
  return (dynCall_vi = Module["dynCall_vi"] =
    Module["asm"]["dynCall_vi"]).apply(null, arguments);
});
var dynCall_vii = (Module["dynCall_vii"] = function () {
  return (dynCall_vii = Module["dynCall_vii"] =
    Module["asm"]["dynCall_vii"]).apply(null, arguments);
});
var dynCall_viiii = (Module["dynCall_viiii"] = function () {
  return (dynCall_viiii = Module["dynCall_viiii"] =
    Module["asm"]["dynCall_viiii"]).apply(null, arguments);
});
var dynCall_viiiii = (Module["dynCall_viiiii"] = function () {
  return (dynCall_viiiii = Module["dynCall_viiiii"] =
    Module["asm"]["dynCall_viiiii"]).apply(null, arguments);
});
var dynCall_iii = (Module["dynCall_iii"] = function () {
  return (dynCall_iii = Module["dynCall_iii"] =
    Module["asm"]["dynCall_iii"]).apply(null, arguments);
});
var dynCall_iiii = (Module["dynCall_iiii"] = function () {
  return (dynCall_iiii = Module["dynCall_iiii"] =
    Module["asm"]["dynCall_iiii"]).apply(null, arguments);
});
var dynCall_iiiii = (Module["dynCall_iiiii"] = function () {
  return (dynCall_iiiii = Module["dynCall_iiiii"] =
    Module["asm"]["dynCall_iiiii"]).apply(null, arguments);
});
var dynCall_v = (Module["dynCall_v"] = function () {
  return (dynCall_v = Module["dynCall_v"] = Module["asm"]["dynCall_v"]).apply(
    null,
    arguments
  );
});
var dynCall_jiji = (Module["dynCall_jiji"] = function () {
  return (dynCall_jiji = Module["dynCall_jiji"] =
    Module["asm"]["dynCall_jiji"]).apply(null, arguments);
});
var dynCall_ii = (Module["dynCall_ii"] = function () {
  return (dynCall_ii = Module["dynCall_ii"] =
    Module["asm"]["dynCall_ii"]).apply(null, arguments);
});
var dynCall_iidiiii = (Module["dynCall_iidiiii"] = function () {
  return (dynCall_iidiiii = Module["dynCall_iidiiii"] =
    Module["asm"]["dynCall_iidiiii"]).apply(null, arguments);
});
var dynCall_viiiiii = (Module["dynCall_viiiiii"] = function () {
  return (dynCall_viiiiii = Module["dynCall_viiiiii"] =
    Module["asm"]["dynCall_viiiiii"]).apply(null, arguments);
});
var dynCall_viii = (Module["dynCall_viii"] = function () {
  return (dynCall_viii = Module["dynCall_viii"] =
    Module["asm"]["dynCall_viii"]).apply(null, arguments);
});
var dynCall_jiiji = (Module["dynCall_jiiji"] = function () {
  return (dynCall_jiiji = Module["dynCall_jiiji"] =
    Module["asm"]["dynCall_jiiji"]).apply(null, arguments);
});
var dynCall_jiiiji = (Module["dynCall_jiiiji"] = function () {
  return (dynCall_jiiiji = Module["dynCall_jiiiji"] =
    Module["asm"]["dynCall_jiiiji"]).apply(null, arguments);
});
var dynCall_iiiiii = (Module["dynCall_iiiiii"] = function () {
  return (dynCall_iiiiii = Module["dynCall_iiiiii"] =
    Module["asm"]["dynCall_iiiiii"]).apply(null, arguments);
});
var dynCall_ji = (Module["dynCall_ji"] = function () {
  return (dynCall_ji = Module["dynCall_ji"] =
    Module["asm"]["dynCall_ji"]).apply(null, arguments);
});
var dynCall_fi = (Module["dynCall_fi"] = function () {
  return (dynCall_fi = Module["dynCall_fi"] =
    Module["asm"]["dynCall_fi"]).apply(null, arguments);
});
var dynCall_iiiiiiiii = (Module["dynCall_iiiiiiiii"] = function () {
  return (dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiiii = (Module["dynCall_iiiiiii"] = function () {
  return (dynCall_iiiiiii = Module["dynCall_iiiiiii"] =
    Module["asm"]["dynCall_iiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiij = (Module["dynCall_iiiiij"] = function () {
  return (dynCall_iiiiij = Module["dynCall_iiiiij"] =
    Module["asm"]["dynCall_iiiiij"]).apply(null, arguments);
});
var dynCall_iiiiid = (Module["dynCall_iiiiid"] = function () {
  return (dynCall_iiiiid = Module["dynCall_iiiiid"] =
    Module["asm"]["dynCall_iiiiid"]).apply(null, arguments);
});
var dynCall_iiiiijj = (Module["dynCall_iiiiijj"] = function () {
  return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] =
    Module["asm"]["dynCall_iiiiijj"]).apply(null, arguments);
});
var dynCall_iiiiiiii = (Module["dynCall_iiiiiiii"] = function () {
  return (dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiiijj = (Module["dynCall_iiiiiijj"] = function () {
  return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] =
    Module["asm"]["dynCall_iiiiiijj"]).apply(null, arguments);
});
var dynCall_viijii = (Module["dynCall_viijii"] = function () {
  return (dynCall_viijii = Module["dynCall_viijii"] =
    Module["asm"]["dynCall_viijii"]).apply(null, arguments);
});
var dynCall_iff = (Module["dynCall_iff"] = function () {
  return (dynCall_iff = Module["dynCall_iff"] =
    Module["asm"]["dynCall_iff"]).apply(null, arguments);
});
var dynCall_j = (Module["dynCall_j"] = function () {
  return (dynCall_j = Module["dynCall_j"] = Module["asm"]["dynCall_j"]).apply(
    null,
    arguments
  );
});
var dynCall_ff = (Module["dynCall_ff"] = function () {
  return (dynCall_ff = Module["dynCall_ff"] =
    Module["asm"]["dynCall_ff"]).apply(null, arguments);
});
var dynCall_viif = (Module["dynCall_viif"] = function () {
  return (dynCall_viif = Module["dynCall_viif"] =
    Module["asm"]["dynCall_viif"]).apply(null, arguments);
});
var dynCall_vif = (Module["dynCall_vif"] = function () {
  return (dynCall_vif = Module["dynCall_vif"] =
    Module["asm"]["dynCall_vif"]).apply(null, arguments);
});
var dynCall_viij = (Module["dynCall_viij"] = function () {
  return (dynCall_viij = Module["dynCall_viij"] =
    Module["asm"]["dynCall_viij"]).apply(null, arguments);
});
var dynCall_vij = (Module["dynCall_vij"] = function () {
  return (dynCall_vij = Module["dynCall_vij"] =
    Module["asm"]["dynCall_vij"]).apply(null, arguments);
});
var dynCall_vifj = (Module["dynCall_vifj"] = function () {
  return (dynCall_vifj = Module["dynCall_vifj"] =
    Module["asm"]["dynCall_vifj"]).apply(null, arguments);
});
var dynCall_vijjj = (Module["dynCall_vijjj"] = function () {
  return (dynCall_vijjj = Module["dynCall_vijjj"] =
    Module["asm"]["dynCall_vijjj"]).apply(null, arguments);
});
var dynCall_viiiij = (Module["dynCall_viiiij"] = function () {
  return (dynCall_viiiij = Module["dynCall_viiiij"] =
    Module["asm"]["dynCall_viiiij"]).apply(null, arguments);
});
var dynCall_viifj = (Module["dynCall_viifj"] = function () {
  return (dynCall_viifj = Module["dynCall_viifj"] =
    Module["asm"]["dynCall_viifj"]).apply(null, arguments);
});
var dynCall_fii = (Module["dynCall_fii"] = function () {
  return (dynCall_fii = Module["dynCall_fii"] =
    Module["asm"]["dynCall_fii"]).apply(null, arguments);
});
var dynCall_viiifj = (Module["dynCall_viiifj"] = function () {
  return (dynCall_viiifj = Module["dynCall_viiifj"] =
    Module["asm"]["dynCall_viiifj"]).apply(null, arguments);
});
var dynCall_viiif = (Module["dynCall_viiif"] = function () {
  return (dynCall_viiif = Module["dynCall_viiif"] =
    Module["asm"]["dynCall_viiif"]).apply(null, arguments);
});
var dynCall_fiff = (Module["dynCall_fiff"] = function () {
  return (dynCall_fiff = Module["dynCall_fiff"] =
    Module["asm"]["dynCall_fiff"]).apply(null, arguments);
});
var dynCall_viiffiif = (Module["dynCall_viiffiif"] = function () {
  return (dynCall_viiffiif = Module["dynCall_viiffiif"] =
    Module["asm"]["dynCall_viiffiif"]).apply(null, arguments);
});
var dynCall_viifff = (Module["dynCall_viifff"] = function () {
  return (dynCall_viifff = Module["dynCall_viifff"] =
    Module["asm"]["dynCall_viifff"]).apply(null, arguments);
});
var dynCall_viiffifii = (Module["dynCall_viiffifii"] = function () {
  return (dynCall_viiffifii = Module["dynCall_viiffifii"] =
    Module["asm"]["dynCall_viiffifii"]).apply(null, arguments);
});
var dynCall_iiifi = (Module["dynCall_iiifi"] = function () {
  return (dynCall_iiifi = Module["dynCall_iiifi"] =
    Module["asm"]["dynCall_iiifi"]).apply(null, arguments);
});
var dynCall_fiif = (Module["dynCall_fiif"] = function () {
  return (dynCall_fiif = Module["dynCall_fiif"] =
    Module["asm"]["dynCall_fiif"]).apply(null, arguments);
});
var dynCall_vifi = (Module["dynCall_vifi"] = function () {
  return (dynCall_vifi = Module["dynCall_vifi"] =
    Module["asm"]["dynCall_vifi"]).apply(null, arguments);
});
var dynCall_di = (Module["dynCall_di"] = function () {
  return (dynCall_di = Module["dynCall_di"] =
    Module["asm"]["dynCall_di"]).apply(null, arguments);
});
var dynCall_viiiiiii = (Module["dynCall_viiiiiii"] = function () {
  return (dynCall_viiiiiii = Module["dynCall_viiiiiii"] =
    Module["asm"]["dynCall_viiiiiii"]).apply(null, arguments);
});
var dynCall_jiiii = (Module["dynCall_jiiii"] = function () {
  return (dynCall_jiiii = Module["dynCall_jiiii"] =
    Module["asm"]["dynCall_jiiii"]).apply(null, arguments);
});
var dynCall_viiiiiiiii = (Module["dynCall_viiiiiiiii"] = function () {
  return (dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] =
    Module["asm"]["dynCall_viiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiiiiiii = (Module["dynCall_viiiiiiii"] = function () {
  return (dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] =
    Module["asm"]["dynCall_viiiiiiii"]).apply(null, arguments);
});
var dynCall_fiiiii = (Module["dynCall_fiiiii"] = function () {
  return (dynCall_fiiiii = Module["dynCall_fiiiii"] =
    Module["asm"]["dynCall_fiiiii"]).apply(null, arguments);
});
var dynCall_viiiiifff = (Module["dynCall_viiiiifff"] = function () {
  return (dynCall_viiiiifff = Module["dynCall_viiiiifff"] =
    Module["asm"]["dynCall_viiiiifff"]).apply(null, arguments);
});
var dynCall_viiifiii = (Module["dynCall_viiifiii"] = function () {
  return (dynCall_viiifiii = Module["dynCall_viiifiii"] =
    Module["asm"]["dynCall_viiifiii"]).apply(null, arguments);
});
var dynCall_viiifi = (Module["dynCall_viiifi"] = function () {
  return (dynCall_viiifi = Module["dynCall_viiifi"] =
    Module["asm"]["dynCall_viiifi"]).apply(null, arguments);
});
var dynCall_fif = (Module["dynCall_fif"] = function () {
  return (dynCall_fif = Module["dynCall_fif"] =
    Module["asm"]["dynCall_fif"]).apply(null, arguments);
});
var dynCall_viiiiifi = (Module["dynCall_viiiiifi"] = function () {
  return (dynCall_viiiiifi = Module["dynCall_viiiiifi"] =
    Module["asm"]["dynCall_viiiiifi"]).apply(null, arguments);
});
var dynCall_viiiiiif = (Module["dynCall_viiiiiif"] = function () {
  return (dynCall_viiiiiif = Module["dynCall_viiiiiif"] =
    Module["asm"]["dynCall_viiiiiif"]).apply(null, arguments);
});
var dynCall_viiiiiiff = (Module["dynCall_viiiiiiff"] = function () {
  return (dynCall_viiiiiiff = Module["dynCall_viiiiiiff"] =
    Module["asm"]["dynCall_viiiiiiff"]).apply(null, arguments);
});
var dynCall_iij = (Module["dynCall_iij"] = function () {
  return (dynCall_iij = Module["dynCall_iij"] =
    Module["asm"]["dynCall_iij"]).apply(null, arguments);
});
var dynCall_vijii = (Module["dynCall_vijii"] = function () {
  return (dynCall_vijii = Module["dynCall_vijii"] =
    Module["asm"]["dynCall_vijii"]).apply(null, arguments);
});
var dynCall_fiii = (Module["dynCall_fiii"] = function () {
  return (dynCall_fiii = Module["dynCall_fiii"] =
    Module["asm"]["dynCall_fiii"]).apply(null, arguments);
});
var dynCall_viff = (Module["dynCall_viff"] = function () {
  return (dynCall_viff = Module["dynCall_viff"] =
    Module["asm"]["dynCall_viff"]).apply(null, arguments);
});
var dynCall_viiiiff = (Module["dynCall_viiiiff"] = function () {
  return (dynCall_viiiiff = Module["dynCall_viiiiff"] =
    Module["asm"]["dynCall_viiiiff"]).apply(null, arguments);
});
var dynCall_viji = (Module["dynCall_viji"] = function () {
  return (dynCall_viji = Module["dynCall_viji"] =
    Module["asm"]["dynCall_viji"]).apply(null, arguments);
});
var dynCall_dii = (Module["dynCall_dii"] = function () {
  return (dynCall_dii = Module["dynCall_dii"] =
    Module["asm"]["dynCall_dii"]).apply(null, arguments);
});
var dynCall_ddddd = (Module["dynCall_ddddd"] = function () {
  return (dynCall_ddddd = Module["dynCall_ddddd"] =
    Module["asm"]["dynCall_ddddd"]).apply(null, arguments);
});
var dynCall_diiiii = (Module["dynCall_diiiii"] = function () {
  return (dynCall_diiiii = Module["dynCall_diiiii"] =
    Module["asm"]["dynCall_diiiii"]).apply(null, arguments);
});
var dynCall_viiffffii = (Module["dynCall_viiffffii"] = function () {
  return (dynCall_viiffffii = Module["dynCall_viiffffii"] =
    Module["asm"]["dynCall_viiffffii"]).apply(null, arguments);
});
var dynCall_viiffffiii = (Module["dynCall_viiffffiii"] = function () {
  return (dynCall_viiffffiii = Module["dynCall_viiffffiii"] =
    Module["asm"]["dynCall_viiffffiii"]).apply(null, arguments);
});
var dynCall_viffff = (Module["dynCall_viffff"] = function () {
  return (dynCall_viffff = Module["dynCall_viffff"] =
    Module["asm"]["dynCall_viffff"]).apply(null, arguments);
});
var dynCall_i = (Module["dynCall_i"] = function () {
  return (dynCall_i = Module["dynCall_i"] = Module["asm"]["dynCall_i"]).apply(
    null,
    arguments
  );
});
var dynCall_viijiiiiii = (Module["dynCall_viijiiiiii"] = function () {
  return (dynCall_viijiiiiii = Module["dynCall_viijiiiiii"] =
    Module["asm"]["dynCall_viijiiiiii"]).apply(null, arguments);
});
var dynCall_viijiiiiiii = (Module["dynCall_viijiiiiiii"] = function () {
  return (dynCall_viijiiiiiii = Module["dynCall_viijiiiiiii"] =
    Module["asm"]["dynCall_viijiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiij = (Module["dynCall_iiiij"] = function () {
  return (dynCall_iiiij = Module["dynCall_iiiij"] =
    Module["asm"]["dynCall_iiiij"]).apply(null, arguments);
});
var dynCall_iiij = (Module["dynCall_iiij"] = function () {
  return (dynCall_iiij = Module["dynCall_iiij"] =
    Module["asm"]["dynCall_iiij"]).apply(null, arguments);
});
var dynCall_iiji = (Module["dynCall_iiji"] = function () {
  return (dynCall_iiji = Module["dynCall_iiji"] =
    Module["asm"]["dynCall_iiji"]).apply(null, arguments);
});
var dynCall_iijii = (Module["dynCall_iijii"] = function () {
  return (dynCall_iijii = Module["dynCall_iijii"] =
    Module["asm"]["dynCall_iijii"]).apply(null, arguments);
});
var dynCall_iiiiiij = (Module["dynCall_iiiiiij"] = function () {
  return (dynCall_iiiiiij = Module["dynCall_iiiiiij"] =
    Module["asm"]["dynCall_iiiiiij"]).apply(null, arguments);
});
var dynCall_iiid = (Module["dynCall_iiid"] = function () {
  return (dynCall_iiid = Module["dynCall_iiid"] =
    Module["asm"]["dynCall_iiid"]).apply(null, arguments);
});
var dynCall_jii = (Module["dynCall_jii"] = function () {
  return (dynCall_jii = Module["dynCall_jii"] =
    Module["asm"]["dynCall_jii"]).apply(null, arguments);
});
var dynCall_vid = (Module["dynCall_vid"] = function () {
  return (dynCall_vid = Module["dynCall_vid"] =
    Module["asm"]["dynCall_vid"]).apply(null, arguments);
});
var dynCall_iiiiiiiiii = (Module["dynCall_iiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiijii = (Module["dynCall_iiiiijii"] = function () {
  return (dynCall_iiiiijii = Module["dynCall_iiiiijii"] =
    Module["asm"]["dynCall_iiiiijii"]).apply(null, arguments);
});
var dynCall_jj = (Module["dynCall_jj"] = function () {
  return (dynCall_jj = Module["dynCall_jj"] =
    Module["asm"]["dynCall_jj"]).apply(null, arguments);
});
var dynCall_jiij = (Module["dynCall_jiij"] = function () {
  return (dynCall_jiij = Module["dynCall_jiij"] =
    Module["asm"]["dynCall_jiij"]).apply(null, arguments);
});
var dynCall_iiiiji = (Module["dynCall_iiiiji"] = function () {
  return (dynCall_iiiiji = Module["dynCall_iiiiji"] =
    Module["asm"]["dynCall_iiiiji"]).apply(null, arguments);
});
var dynCall_iiiijii = (Module["dynCall_iiiijii"] = function () {
  return (dynCall_iiiijii = Module["dynCall_iiiijii"] =
    Module["asm"]["dynCall_iiiijii"]).apply(null, arguments);
});
var dynCall_ij = (Module["dynCall_ij"] = function () {
  return (dynCall_ij = Module["dynCall_ij"] =
    Module["asm"]["dynCall_ij"]).apply(null, arguments);
});
var dynCall_viiji = (Module["dynCall_viiji"] = function () {
  return (dynCall_viiji = Module["dynCall_viiji"] =
    Module["asm"]["dynCall_viiji"]).apply(null, arguments);
});
var dynCall_viiijijiii = (Module["dynCall_viiijijiii"] = function () {
  return (dynCall_viiijijiii = Module["dynCall_viiijijiii"] =
    Module["asm"]["dynCall_viiijijiii"]).apply(null, arguments);
});
var dynCall_viiijii = (Module["dynCall_viiijii"] = function () {
  return (dynCall_viiijii = Module["dynCall_viiijii"] =
    Module["asm"]["dynCall_viiijii"]).apply(null, arguments);
});
var dynCall_viiijijjijjiii = (Module["dynCall_viiijijjijjiii"] = function () {
  return (dynCall_viiijijjijjiii = Module["dynCall_viiijijjijjiii"] =
    Module["asm"]["dynCall_viiijijjijjiii"]).apply(null, arguments);
});
var dynCall_iiiijiiiii = (Module["dynCall_iiiijiiiii"] = function () {
  return (dynCall_iiiijiiiii = Module["dynCall_iiiijiiiii"] =
    Module["asm"]["dynCall_iiiijiiiii"]).apply(null, arguments);
});
var dynCall_viiijjijiii = (Module["dynCall_viiijjijiii"] = function () {
  return (dynCall_viiijjijiii = Module["dynCall_viiijjijiii"] =
    Module["asm"]["dynCall_viiijjijiii"]).apply(null, arguments);
});
var dynCall_viiijijiiiii = (Module["dynCall_viiijijiiiii"] = function () {
  return (dynCall_viiijijiiiii = Module["dynCall_viiijijiiiii"] =
    Module["asm"]["dynCall_viiijijiiiii"]).apply(null, arguments);
});
var dynCall_viiijijiiii = (Module["dynCall_viiijijiiii"] = function () {
  return (dynCall_viiijijiiii = Module["dynCall_viiijijiiii"] =
    Module["asm"]["dynCall_viiijijiiii"]).apply(null, arguments);
});
var dynCall_viiiijjiii = (Module["dynCall_viiiijjiii"] = function () {
  return (dynCall_viiiijjiii = Module["dynCall_viiiijjiii"] =
    Module["asm"]["dynCall_viiiijjiii"]).apply(null, arguments);
});
var dynCall_viiiijji = (Module["dynCall_viiiijji"] = function () {
  return (dynCall_viiiijji = Module["dynCall_viiiijji"] =
    Module["asm"]["dynCall_viiiijji"]).apply(null, arguments);
});
var dynCall_viiijij = (Module["dynCall_viiijij"] = function () {
  return (dynCall_viiijij = Module["dynCall_viiijij"] =
    Module["asm"]["dynCall_viiijij"]).apply(null, arguments);
});
var dynCall_viiijijiiiiiiiiiiiiiij = (Module["dynCall_viiijijiiiiiiiiiiiiiij"] =
  function () {
    return (dynCall_viiijijiiiiiiiiiiiiiij = Module[
      "dynCall_viiijijiiiiiiiiiiiiiij"
    ] =
      Module["asm"]["dynCall_viiijijiiiiiiiiiiiiiij"]).apply(null, arguments);
  });
var dynCall_viiijjiiijiiiiiii = (Module["dynCall_viiijjiiijiiiiiii"] =
  function () {
    return (dynCall_viiijjiiijiiiiiii = Module["dynCall_viiijjiiijiiiiiii"] =
      Module["asm"]["dynCall_viiijjiiijiiiiiii"]).apply(null, arguments);
  });
var dynCall_viiiijiiiijiiiiiii = (Module["dynCall_viiiijiiiijiiiiiii"] =
  function () {
    return (dynCall_viiiijiiiijiiiiiii = Module["dynCall_viiiijiiiijiiiiiii"] =
      Module["asm"]["dynCall_viiiijiiiijiiiiiii"]).apply(null, arguments);
  });
var dynCall_viiiijiiiijiiiiiiii = (Module["dynCall_viiiijiiiijiiiiiiii"] =
  function () {
    return (dynCall_viiiijiiiijiiiiiiii = Module[
      "dynCall_viiiijiiiijiiiiiiii"
    ] =
      Module["asm"]["dynCall_viiiijiiiijiiiiiiii"]).apply(null, arguments);
  });
var dynCall_viiijijjijji = (Module["dynCall_viiijijjijji"] = function () {
  return (dynCall_viiijijjijji = Module["dynCall_viiijijjijji"] =
    Module["asm"]["dynCall_viiijijjijji"]).apply(null, arguments);
});
var dynCall_viiijjijiiii = (Module["dynCall_viiijjijiiii"] = function () {
  return (dynCall_viiijjijiiii = Module["dynCall_viiijjijiiii"] =
    Module["asm"]["dynCall_viiijjijiiii"]).apply(null, arguments);
});
var dynCall_viiijiiiiiiiiiiiij = (Module["dynCall_viiijiiiiiiiiiiiij"] =
  function () {
    return (dynCall_viiijiiiiiiiiiiiij = Module["dynCall_viiijiiiiiiiiiiiij"] =
      Module["asm"]["dynCall_viiijiiiiiiiiiiiij"]).apply(null, arguments);
  });
var dynCall_viiijijii = (Module["dynCall_viiijijii"] = function () {
  return (dynCall_viiijijii = Module["dynCall_viiijijii"] =
    Module["asm"]["dynCall_viiijijii"]).apply(null, arguments);
});
var dynCall_viiijijiiiiii = (Module["dynCall_viiijijiiiiii"] = function () {
  return (dynCall_viiijijiiiiii = Module["dynCall_viiijijiiiiii"] =
    Module["asm"]["dynCall_viiijijiiiiii"]).apply(null, arguments);
});
var dynCall_viiijijjijjiiiiii = (Module["dynCall_viiijijjijjiiiiii"] =
  function () {
    return (dynCall_viiijijjijjiiiiii = Module["dynCall_viiijijjijjiiiiii"] =
      Module["asm"]["dynCall_viiijijjijjiiiiii"]).apply(null, arguments);
  });
var dynCall_viiijiji = (Module["dynCall_viiijiji"] = function () {
  return (dynCall_viiijiji = Module["dynCall_viiijiji"] =
    Module["asm"]["dynCall_viiijiji"]).apply(null, arguments);
});
var dynCall_viiijjijiiiii = (Module["dynCall_viiijjijiiiii"] = function () {
  return (dynCall_viiijjijiiiii = Module["dynCall_viiijjijiiiii"] =
    Module["asm"]["dynCall_viiijjijiiiii"]).apply(null, arguments);
});
var dynCall_viiiijiiiiiiiii = (Module["dynCall_viiiijiiiiiiiii"] = function () {
  return (dynCall_viiiijiiiiiiiii = Module["dynCall_viiiijiiiiiiiii"] =
    Module["asm"]["dynCall_viiiijiiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiijiiji = (Module["dynCall_viiijiiji"] = function () {
  return (dynCall_viiijiiji = Module["dynCall_viiijiiji"] =
    Module["asm"]["dynCall_viiijiiji"]).apply(null, arguments);
});
var dynCall_viiijiii = (Module["dynCall_viiijiii"] = function () {
  return (dynCall_viiijiii = Module["dynCall_viiijiii"] =
    Module["asm"]["dynCall_viiijiii"]).apply(null, arguments);
});
var dynCall_iiiijiiii = (Module["dynCall_iiiijiiii"] = function () {
  return (dynCall_iiiijiiii = Module["dynCall_iiiijiiii"] =
    Module["asm"]["dynCall_iiiijiiii"]).apply(null, arguments);
});
var dynCall_viiiijiiiii = (Module["dynCall_viiiijiiiii"] = function () {
  return (dynCall_viiiijiiiii = Module["dynCall_viiiijiiiii"] =
    Module["asm"]["dynCall_viiiijiiiii"]).apply(null, arguments);
});
var dynCall_viiijijjjjjii = (Module["dynCall_viiijijjjjjii"] = function () {
  return (dynCall_viiijijjjjjii = Module["dynCall_viiijijjjjjii"] =
    Module["asm"]["dynCall_viiijijjjjjii"]).apply(null, arguments);
});
var dynCall_viiijijiiiiiiiiidd = (Module["dynCall_viiijijiiiiiiiiidd"] =
  function () {
    return (dynCall_viiijijiiiiiiiiidd = Module["dynCall_viiijijiiiiiiiiidd"] =
      Module["asm"]["dynCall_viiijijiiiiiiiiidd"]).apply(null, arguments);
  });
var dynCall_viiijijiiiiiiiiiiiiidd = (Module["dynCall_viiijijiiiiiiiiiiiiidd"] =
  function () {
    return (dynCall_viiijijiiiiiiiiiiiiidd = Module[
      "dynCall_viiijijiiiiiiiiiiiiidd"
    ] =
      Module["asm"]["dynCall_viiijijiiiiiiiiiiiiidd"]).apply(null, arguments);
  });
var dynCall_viiijijiiiiiiiiiiiiii = (Module["dynCall_viiijijiiiiiiiiiiiiii"] =
  function () {
    return (dynCall_viiijijiiiiiiiiiiiiii = Module[
      "dynCall_viiijijiiiiiiiiiiiiii"
    ] =
      Module["asm"]["dynCall_viiijijiiiiiiiiiiiiii"]).apply(null, arguments);
  });
var dynCall_viiijijjijjiiii = (Module["dynCall_viiijijjijjiiii"] = function () {
  return (dynCall_viiijijjijjiiii = Module["dynCall_viiijijjijjiiii"] =
    Module["asm"]["dynCall_viiijijjijjiiii"]).apply(null, arguments);
});
var dynCall_viiijjiii = (Module["dynCall_viiijjiii"] = function () {
  return (dynCall_viiijjiii = Module["dynCall_viiijjiii"] =
    Module["asm"]["dynCall_viiijjiii"]).apply(null, arguments);
});
var dynCall_iiiijijiii = (Module["dynCall_iiiijijiii"] = function () {
  return (dynCall_iiiijijiii = Module["dynCall_iiiijijiii"] =
    Module["asm"]["dynCall_iiiijijiii"]).apply(null, arguments);
});
var dynCall_iiijji = (Module["dynCall_iiijji"] = function () {
  return (dynCall_iiijji = Module["dynCall_iiijji"] =
    Module["asm"]["dynCall_iiijji"]).apply(null, arguments);
});
var dynCall_iiiji = (Module["dynCall_iiiji"] = function () {
  return (dynCall_iiiji = Module["dynCall_iiiji"] =
    Module["asm"]["dynCall_iiiji"]).apply(null, arguments);
});
var dynCall_iiijiiii = (Module["dynCall_iiijiiii"] = function () {
  return (dynCall_iiijiiii = Module["dynCall_iiijiiii"] =
    Module["asm"]["dynCall_iiijiiii"]).apply(null, arguments);
});
var dynCall_iiiiiiiiiii = (Module["dynCall_iiiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiiii = Module["dynCall_iiiiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiijiiiiiiiii = (Module["dynCall_iiijiiiiiiiii"] = function () {
  return (dynCall_iiijiiiiiiiii = Module["dynCall_iiijiiiiiiiii"] =
    Module["asm"]["dynCall_iiijiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiijiiiiiiii = (Module["dynCall_iiijiiiiiiii"] = function () {
  return (dynCall_iiijiiiiiiii = Module["dynCall_iiijiiiiiiii"] =
    Module["asm"]["dynCall_iiijiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiijijiijiji = (Module["dynCall_viiijijiijiji"] = function () {
  return (dynCall_viiijijiijiji = Module["dynCall_viiijijiijiji"] =
    Module["asm"]["dynCall_viiijijiijiji"]).apply(null, arguments);
});
var dynCall_viiijijijiii = (Module["dynCall_viiijijijiii"] = function () {
  return (dynCall_viiijijijiii = Module["dynCall_viiijijijiii"] =
    Module["asm"]["dynCall_viiijijijiii"]).apply(null, arguments);
});
var dynCall_viiijjijjijjjii = (Module["dynCall_viiijjijjijjjii"] = function () {
  return (dynCall_viiijjijjijjjii = Module["dynCall_viiijjijjijjjii"] =
    Module["asm"]["dynCall_viiijjijjijjjii"]).apply(null, arguments);
});
var dynCall_viiiijijijiii = (Module["dynCall_viiiijijijiii"] = function () {
  return (dynCall_viiiijijijiii = Module["dynCall_viiiijijijiii"] =
    Module["asm"]["dynCall_viiiijijijiii"]).apply(null, arguments);
});
var dynCall_viiijiijijji = (Module["dynCall_viiijiijijji"] = function () {
  return (dynCall_viiijiijijji = Module["dynCall_viiijiijijji"] =
    Module["asm"]["dynCall_viiijiijijji"]).apply(null, arguments);
});
var dynCall_iiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiiiii = Module["dynCall_iiiiiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiijjiiii = (Module["dynCall_viiijjiiii"] = function () {
  return (dynCall_viiijjiiii = Module["dynCall_viiijjiiii"] =
    Module["asm"]["dynCall_viiijjiiii"]).apply(null, arguments);
});
var dynCall_viiijijjijjji = (Module["dynCall_viiijijjijjji"] = function () {
  return (dynCall_viiijijjijjji = Module["dynCall_viiijijjijjji"] =
    Module["asm"]["dynCall_viiijijjijjji"]).apply(null, arguments);
});
var dynCall_viiijjii = (Module["dynCall_viiijjii"] = function () {
  return (dynCall_viiijjii = Module["dynCall_viiijjii"] =
    Module["asm"]["dynCall_viiijjii"]).apply(null, arguments);
});
var dynCall_viiijijiiiij = (Module["dynCall_viiijijiiiij"] = function () {
  return (dynCall_viiijijiiiij = Module["dynCall_viiijijiiiij"] =
    Module["asm"]["dynCall_viiijijiiiij"]).apply(null, arguments);
});
var dynCall_iiiiiijiii = (Module["dynCall_iiiiiijiii"] = function () {
  return (dynCall_iiiiiijiii = Module["dynCall_iiiiiijiii"] =
    Module["asm"]["dynCall_iiiiiijiii"]).apply(null, arguments);
});
var dynCall_iiiiiijiiii = (Module["dynCall_iiiiiijiiii"] = function () {
  return (dynCall_iiiiiijiiii = Module["dynCall_iiiiiijiiii"] =
    Module["asm"]["dynCall_iiiiiijiiii"]).apply(null, arguments);
});
var dynCall_viiijijjijjii = (Module["dynCall_viiijijjijjii"] = function () {
  return (dynCall_viiijijjijjii = Module["dynCall_viiijijjijjii"] =
    Module["asm"]["dynCall_viiijijjijjii"]).apply(null, arguments);
});
var dynCall_viiijijjjijjiiiii = (Module["dynCall_viiijijjjijjiiiii"] =
  function () {
    return (dynCall_viiijijjjijjiiiii = Module["dynCall_viiijijjjijjiiiii"] =
      Module["asm"]["dynCall_viiijijjjijjiiiii"]).apply(null, arguments);
  });
var dynCall_viiijijjjjji = (Module["dynCall_viiijijjjjji"] = function () {
  return (dynCall_viiijijjjjji = Module["dynCall_viiijijjjjji"] =
    Module["asm"]["dynCall_viiijijjjjji"]).apply(null, arguments);
});
var dynCall_jiiiii = (Module["dynCall_jiiiii"] = function () {
  return (dynCall_jiiiii = Module["dynCall_jiiiii"] =
    Module["asm"]["dynCall_jiiiii"]).apply(null, arguments);
});
var dynCall_viiij = (Module["dynCall_viiij"] = function () {
  return (dynCall_viiij = Module["dynCall_viiij"] =
    Module["asm"]["dynCall_viiij"]).apply(null, arguments);
});
var dynCall_jiiiiiiii = (Module["dynCall_jiiiiiiii"] = function () {
  return (dynCall_jiiiiiiii = Module["dynCall_jiiiiiiii"] =
    Module["asm"]["dynCall_jiiiiiiii"]).apply(null, arguments);
});
var dynCall_jiiiiiii = (Module["dynCall_jiiiiiii"] = function () {
  return (dynCall_jiiiiiii = Module["dynCall_jiiiiiii"] =
    Module["asm"]["dynCall_jiiiiiii"]).apply(null, arguments);
});
var dynCall_jiii = (Module["dynCall_jiii"] = function () {
  return (dynCall_jiii = Module["dynCall_jiii"] =
    Module["asm"]["dynCall_jiii"]).apply(null, arguments);
});
var dynCall_vijiii = (Module["dynCall_vijiii"] = function () {
  return (dynCall_vijiii = Module["dynCall_vijiii"] =
    Module["asm"]["dynCall_vijiii"]).apply(null, arguments);
});
var dynCall_jijiii = (Module["dynCall_jijiii"] = function () {
  return (dynCall_jijiii = Module["dynCall_jijiii"] =
    Module["asm"]["dynCall_jijiii"]).apply(null, arguments);
});
var dynCall_viiiijii = (Module["dynCall_viiiijii"] = function () {
  return (dynCall_viiiijii = Module["dynCall_viiiijii"] =
    Module["asm"]["dynCall_viiiijii"]).apply(null, arguments);
});
var dynCall_viijiii = (Module["dynCall_viijiii"] = function () {
  return (dynCall_viijiii = Module["dynCall_viijiii"] =
    Module["asm"]["dynCall_viijiii"]).apply(null, arguments);
});
var dynCall_viijiiii = (Module["dynCall_viijiiii"] = function () {
  return (dynCall_viijiiii = Module["dynCall_viijiiii"] =
    Module["asm"]["dynCall_viijiiii"]).apply(null, arguments);
});
var dynCall_jiiiiii = (Module["dynCall_jiiiiii"] = function () {
  return (dynCall_jiiiiii = Module["dynCall_jiiiiii"] =
    Module["asm"]["dynCall_jiiiiii"]).apply(null, arguments);
});
var dynCall_vjii = (Module["dynCall_vjii"] = function () {
  return (dynCall_vjii = Module["dynCall_vjii"] =
    Module["asm"]["dynCall_vjii"]).apply(null, arguments);
});
var dynCall_vjjji = (Module["dynCall_vjjji"] = function () {
  return (dynCall_vjjji = Module["dynCall_vjjji"] =
    Module["asm"]["dynCall_vjjji"]).apply(null, arguments);
});
var dynCall_vijjii = (Module["dynCall_vijjii"] = function () {
  return (dynCall_vijjii = Module["dynCall_vijjii"] =
    Module["asm"]["dynCall_vijjii"]).apply(null, arguments);
});
var dynCall_jiijjj = (Module["dynCall_jiijjj"] = function () {
  return (dynCall_jiijjj = Module["dynCall_jiijjj"] =
    Module["asm"]["dynCall_jiijjj"]).apply(null, arguments);
});
var dynCall_viiiiiiiiii = (Module["dynCall_viiiiiiiiii"] = function () {
  return (dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] =
    Module["asm"]["dynCall_viiiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiiiiij = (Module["dynCall_viiiiiij"] = function () {
  return (dynCall_viiiiiij = Module["dynCall_viiiiiij"] =
    Module["asm"]["dynCall_viiiiiij"]).apply(null, arguments);
});
var dynCall_diid = (Module["dynCall_diid"] = function () {
  return (dynCall_diid = Module["dynCall_diid"] =
    Module["asm"]["dynCall_diid"]).apply(null, arguments);
});
var dynCall_viid = (Module["dynCall_viid"] = function () {
  return (dynCall_viid = Module["dynCall_viid"] =
    Module["asm"]["dynCall_viid"]).apply(null, arguments);
});
var dynCall_fiiif = (Module["dynCall_fiiif"] = function () {
  return (dynCall_fiiif = Module["dynCall_fiiif"] =
    Module["asm"]["dynCall_fiiif"]).apply(null, arguments);
});
var dynCall_vijjijji = (Module["dynCall_vijjijji"] = function () {
  return (dynCall_vijjijji = Module["dynCall_vijjijji"] =
    Module["asm"]["dynCall_vijjijji"]).apply(null, arguments);
});
var dynCall_vijjijjii = (Module["dynCall_vijjijjii"] = function () {
  return (dynCall_vijjijjii = Module["dynCall_vijjijjii"] =
    Module["asm"]["dynCall_vijjijjii"]).apply(null, arguments);
});
var dynCall_vijijjj = (Module["dynCall_vijijjj"] = function () {
  return (dynCall_vijijjj = Module["dynCall_vijijjj"] =
    Module["asm"]["dynCall_vijijjj"]).apply(null, arguments);
});
var dynCall_vijijjji = (Module["dynCall_vijijjji"] = function () {
  return (dynCall_vijijjji = Module["dynCall_vijijjji"] =
    Module["asm"]["dynCall_vijijjji"]).apply(null, arguments);
});
var dynCall_vijjijjj = (Module["dynCall_vijjijjj"] = function () {
  return (dynCall_vijjijjj = Module["dynCall_vijjijjj"] =
    Module["asm"]["dynCall_vijjijjj"]).apply(null, arguments);
});
var dynCall_vijjijjji = (Module["dynCall_vijjijjji"] = function () {
  return (dynCall_vijjijjji = Module["dynCall_vijjijjji"] =
    Module["asm"]["dynCall_vijjijjji"]).apply(null, arguments);
});
var dynCall_fffff = (Module["dynCall_fffff"] = function () {
  return (dynCall_fffff = Module["dynCall_fffff"] =
    Module["asm"]["dynCall_fffff"]).apply(null, arguments);
});
var dynCall_iiif = (Module["dynCall_iiif"] = function () {
  return (dynCall_iiif = Module["dynCall_iiif"] =
    Module["asm"]["dynCall_iiif"]).apply(null, arguments);
});
var dynCall_iif = (Module["dynCall_iif"] = function () {
  return (dynCall_iif = Module["dynCall_iif"] =
    Module["asm"]["dynCall_iif"]).apply(null, arguments);
});
var dynCall_ddd = (Module["dynCall_ddd"] = function () {
  return (dynCall_ddd = Module["dynCall_ddd"] =
    Module["asm"]["dynCall_ddd"]).apply(null, arguments);
});
var dynCall_dd = (Module["dynCall_dd"] = function () {
  return (dynCall_dd = Module["dynCall_dd"] =
    Module["asm"]["dynCall_dd"]).apply(null, arguments);
});
var dynCall_vijiiiii = (Module["dynCall_vijiiiii"] = function () {
  return (dynCall_vijiiiii = Module["dynCall_vijiiiii"] =
    Module["asm"]["dynCall_vijiiiii"]).apply(null, arguments);
});
var dynCall_vijj = (Module["dynCall_vijj"] = function () {
  return (dynCall_vijj = Module["dynCall_vijj"] =
    Module["asm"]["dynCall_vijj"]).apply(null, arguments);
});
var dynCall_vijji = (Module["dynCall_vijji"] = function () {
  return (dynCall_vijji = Module["dynCall_vijji"] =
    Module["asm"]["dynCall_vijji"]).apply(null, arguments);
});
var dynCall_iiiiiji = (Module["dynCall_iiiiiji"] = function () {
  return (dynCall_iiiiiji = Module["dynCall_iiiiiji"] =
    Module["asm"]["dynCall_iiiiiji"]).apply(null, arguments);
});
var dynCall_viiiiij = (Module["dynCall_viiiiij"] = function () {
  return (dynCall_viiiiij = Module["dynCall_viiiiij"] =
    Module["asm"]["dynCall_viiiiij"]).apply(null, arguments);
});
var dynCall_vijiiiiii = (Module["dynCall_vijiiiiii"] = function () {
  return (dynCall_vijiiiiii = Module["dynCall_vijiiiiii"] =
    Module["asm"]["dynCall_vijiiiiii"]).apply(null, arguments);
});
var dynCall_jiiiiiiiii = (Module["dynCall_jiiiiiiiii"] = function () {
  return (dynCall_jiiiiiiiii = Module["dynCall_jiiiiiiiii"] =
    Module["asm"]["dynCall_jiiiiiiiii"]).apply(null, arguments);
});
var dynCall_viiiiiiiiiiiiiiiiiiiiii = (Module[
  "dynCall_viiiiiiiiiiiiiiiiiiiiii"
] = function () {
  return (dynCall_viiiiiiiiiiiiiiiiiiiiii = Module[
    "dynCall_viiiiiiiiiiiiiiiiiiiiii"
  ] =
    Module["asm"]["dynCall_viiiiiiiiiiiiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_viijj = (Module["dynCall_viijj"] = function () {
  return (dynCall_viijj = Module["dynCall_viijj"] =
    Module["asm"]["dynCall_viijj"]).apply(null, arguments);
});
var dynCall_viiiif = (Module["dynCall_viiiif"] = function () {
  return (dynCall_viiiif = Module["dynCall_viiiif"] =
    Module["asm"]["dynCall_viiiif"]).apply(null, arguments);
});
var dynCall_viiiifiii = (Module["dynCall_viiiifiii"] = function () {
  return (dynCall_viiiifiii = Module["dynCall_viiiifiii"] =
    Module["asm"]["dynCall_viiiifiii"]).apply(null, arguments);
});
var dynCall_iiiiiiiiiiiiiii = (Module["dynCall_iiiiiiiiiiiiiii"] = function () {
  return (dynCall_iiiiiiiiiiiiiii = Module["dynCall_iiiiiiiiiiiiiii"] =
    Module["asm"]["dynCall_iiiiiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiijiiiiiii = (Module["dynCall_iiiijiiiiiii"] = function () {
  return (dynCall_iiiijiiiiiii = Module["dynCall_iiiijiiiiiii"] =
    Module["asm"]["dynCall_iiiijiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiijiiiiiiiii = (Module["dynCall_iiiijiiiiiiiii"] = function () {
  return (dynCall_iiiijiiiiiiiii = Module["dynCall_iiiijiiiiiiiii"] =
    Module["asm"]["dynCall_iiiijiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiiijii = (Module["dynCall_iiiiiijii"] = function () {
  return (dynCall_iiiiiijii = Module["dynCall_iiiiiijii"] =
    Module["asm"]["dynCall_iiiiiijii"]).apply(null, arguments);
});
var dynCall_viijiiiii = (Module["dynCall_viijiiiii"] = function () {
  return (dynCall_viijiiiii = Module["dynCall_viijiiiii"] =
    Module["asm"]["dynCall_viijiiiii"]).apply(null, arguments);
});
var dynCall_iiiijjiiiiiii = (Module["dynCall_iiiijjiiiiiii"] = function () {
  return (dynCall_iiiijjiiiiiii = Module["dynCall_iiiijjiiiiiii"] =
    Module["asm"]["dynCall_iiiijjiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiijjjiiiiiii = (Module["dynCall_iiiijjjiiiiiii"] = function () {
  return (dynCall_iiiijjjiiiiiii = Module["dynCall_iiiijjjiiiiiii"] =
    Module["asm"]["dynCall_iiiijjjiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiijiii = (Module["dynCall_iiiiijiii"] = function () {
  return (dynCall_iiiiijiii = Module["dynCall_iiiiijiii"] =
    Module["asm"]["dynCall_iiiiijiii"]).apply(null, arguments);
});
var dynCall_viiiji = (Module["dynCall_viiiji"] = function () {
  return (dynCall_viiiji = Module["dynCall_viiiji"] =
    Module["asm"]["dynCall_viiiji"]).apply(null, arguments);
});
var dynCall_viiijijiji = (Module["dynCall_viiijijiji"] = function () {
  return (dynCall_viiijijiji = Module["dynCall_viiijijiji"] =
    Module["asm"]["dynCall_viiijijiji"]).apply(null, arguments);
});
var dynCall_iiijii = (Module["dynCall_iiijii"] = function () {
  return (dynCall_iiijii = Module["dynCall_iiijii"] =
    Module["asm"]["dynCall_iiijii"]).apply(null, arguments);
});
var dynCall_vijiiii = (Module["dynCall_vijiiii"] = function () {
  return (dynCall_vijiiii = Module["dynCall_vijiiii"] =
    Module["asm"]["dynCall_vijiiii"]).apply(null, arguments);
});
var dynCall_viiiiiijji = (Module["dynCall_viiiiiijji"] = function () {
  return (dynCall_viiiiiijji = Module["dynCall_viiiiiijji"] =
    Module["asm"]["dynCall_viiiiiijji"]).apply(null, arguments);
});
var dynCall_viiifii = (Module["dynCall_viiifii"] = function () {
  return (dynCall_viiifii = Module["dynCall_viiifii"] =
    Module["asm"]["dynCall_viiifii"]).apply(null, arguments);
});
var dynCall_jijii = (Module["dynCall_jijii"] = function () {
  return (dynCall_jijii = Module["dynCall_jijii"] =
    Module["asm"]["dynCall_jijii"]).apply(null, arguments);
});
var dynCall_viiijjijii = (Module["dynCall_viiijjijii"] = function () {
  return (dynCall_viiijjijii = Module["dynCall_viiijjijii"] =
    Module["asm"]["dynCall_viiijjijii"]).apply(null, arguments);
});
var dynCall_viiiijjijii = (Module["dynCall_viiiijjijii"] = function () {
  return (dynCall_viiiijjijii = Module["dynCall_viiiijjijii"] =
    Module["asm"]["dynCall_viiiijjijii"]).apply(null, arguments);
});
var dynCall_iiiiiijiij = (Module["dynCall_iiiiiijiij"] = function () {
  return (dynCall_iiiiiijiij = Module["dynCall_iiiiiijiij"] =
    Module["asm"]["dynCall_iiiiiijiij"]).apply(null, arguments);
});
var dynCall_vijijiiii = (Module["dynCall_vijijiiii"] = function () {
  return (dynCall_vijijiiii = Module["dynCall_vijijiiii"] =
    Module["asm"]["dynCall_vijijiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiii = (Module["dynCall_vijijiiiii"] = function () {
  return (dynCall_vijijiiiii = Module["dynCall_vijijiiiii"] =
    Module["asm"]["dynCall_vijijiiiii"]).apply(null, arguments);
});
var dynCall_vijijiii = (Module["dynCall_vijijiii"] = function () {
  return (dynCall_vijijiii = Module["dynCall_vijijiii"] =
    Module["asm"]["dynCall_vijijiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiiiiii = (Module["dynCall_vijijiiiiiiiii"] = function () {
  return (dynCall_vijijiiiiiiiii = Module["dynCall_vijijiiiiiiiii"] =
    Module["asm"]["dynCall_vijijiiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiijifiiiii = (Module["dynCall_vijijiijifiiiii"] = function () {
  return (dynCall_vijijiijifiiiii = Module["dynCall_vijijiijifiiiii"] =
    Module["asm"]["dynCall_vijijiijifiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiii = (Module["dynCall_vijijiiiiii"] = function () {
  return (dynCall_vijijiiiiii = Module["dynCall_vijijiiiiii"] =
    Module["asm"]["dynCall_vijijiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiijiiiiiiii = (Module["dynCall_vijijiijiiiiiiii"] =
  function () {
    return (dynCall_vijijiijiiiiiiii = Module["dynCall_vijijiijiiiiiiii"] =
      Module["asm"]["dynCall_vijijiijiiiiiiii"]).apply(null, arguments);
  });
var dynCall_vijijiijjfiiiiiii = (Module["dynCall_vijijiijjfiiiiiii"] =
  function () {
    return (dynCall_vijijiijjfiiiiiii = Module["dynCall_vijijiijjfiiiiiii"] =
      Module["asm"]["dynCall_vijijiijjfiiiiiii"]).apply(null, arguments);
  });
var dynCall_vijijiijiiiiii = (Module["dynCall_vijijiijiiiiii"] = function () {
  return (dynCall_vijijiijiiiiii = Module["dynCall_vijijiijiiiiii"] =
    Module["asm"]["dynCall_vijijiijiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiijjififiiiiii = (Module["dynCall_vijijiiiiijjififiiiiii"] =
  function () {
    return (dynCall_vijijiiiiijjififiiiiii = Module[
      "dynCall_vijijiiiiijjififiiiiii"
    ] =
      Module["asm"]["dynCall_vijijiiiiijjififiiiiii"]).apply(null, arguments);
  });
var dynCall_vijijiiiiiiiiii = (Module["dynCall_vijijiiiiiiiiii"] = function () {
  return (dynCall_vijijiiiiiiiiii = Module["dynCall_vijijiiiiiiiiii"] =
    Module["asm"]["dynCall_vijijiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiijjiifiiiiiiii = (Module[
  "dynCall_vijijiiiiijjiifiiiiiiii"
] = function () {
  return (dynCall_vijijiiiiijjiifiiiiiiii = Module[
    "dynCall_vijijiiiiijjiifiiiiiiii"
  ] =
    Module["asm"]["dynCall_vijijiiiiijjiifiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiijjifiifiiiiiiiiii = (Module[
  "dynCall_vijijiiiiijjifiifiiiiiiiiii"
] = function () {
  return (dynCall_vijijiiiiijjifiifiiiiiiiiii = Module[
    "dynCall_vijijiiiiijjifiifiiiiiiiiii"
  ] =
    Module["asm"]["dynCall_vijijiiiiijjifiifiiiiiiiiii"]).apply(
    null,
    arguments
  );
});
var dynCall_vijijiiiiijjiiifiiiiiiii = (Module[
  "dynCall_vijijiiiiijjiiifiiiiiiii"
] = function () {
  return (dynCall_vijijiiiiijjiiifiiiiiiii = Module[
    "dynCall_vijijiiiiijjiiifiiiiiiii"
  ] =
    Module["asm"]["dynCall_vijijiiiiijjiiifiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiijjiiiiiii = (Module["dynCall_vijijiiiiijjiiiiiii"] =
  function () {
    return (dynCall_vijijiiiiijjiiiiiii = Module[
      "dynCall_vijijiiiiijjiiiiiii"
    ] =
      Module["asm"]["dynCall_vijijiiiiijjiiiiiii"]).apply(null, arguments);
  });
var dynCall_vijijiiiiijjiiiiii = (Module["dynCall_vijijiiiiijjiiiiii"] =
  function () {
    return (dynCall_vijijiiiiijjiiiiii = Module["dynCall_vijijiiiiijjiiiiii"] =
      Module["asm"]["dynCall_vijijiiiiijjiiiiii"]).apply(null, arguments);
  });
var dynCall_viijiiiiiiiiiii = (Module["dynCall_viijiiiiiiiiiii"] = function () {
  return (dynCall_viijiiiiiiiiiii = Module["dynCall_viijiiiiiiiiiii"] =
    Module["asm"]["dynCall_viijiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiiii = (Module["dynCall_vijijiiiiiii"] = function () {
  return (dynCall_vijijiiiiiii = Module["dynCall_vijijiiiiiii"] =
    Module["asm"]["dynCall_vijijiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiiiii = (Module["dynCall_vijijiiiiiiii"] = function () {
  return (dynCall_vijijiiiiiiii = Module["dynCall_vijijiiiiiiii"] =
    Module["asm"]["dynCall_vijijiiiiiiii"]).apply(null, arguments);
});
var dynCall_vijijiiiiiiiiiiii = (Module["dynCall_vijijiiiiiiiiiiii"] =
  function () {
    return (dynCall_vijijiiiiiiiiiiii = Module["dynCall_vijijiiiiiiiiiiii"] =
      Module["asm"]["dynCall_vijijiiiiiiiiiiii"]).apply(null, arguments);
  });
var dynCall_iiiiiijji = (Module["dynCall_iiiiiijji"] = function () {
  return (dynCall_iiiiiijji = Module["dynCall_iiiiiijji"] =
    Module["asm"]["dynCall_iiiiiijji"]).apply(null, arguments);
});
var dynCall_viiijiiii = (Module["dynCall_viiijiiii"] = function () {
  return (dynCall_viiijiiii = Module["dynCall_viiijiiii"] =
    Module["asm"]["dynCall_viiijiiii"]).apply(null, arguments);
});
var dynCall_viiiiiiiiiiii = (Module["dynCall_viiiiiiiiiiii"] = function () {
  return (dynCall_viiiiiiiiiiii = Module["dynCall_viiiiiiiiiiii"] =
    Module["asm"]["dynCall_viiiiiiiiiiii"]).apply(null, arguments);
});
var dynCall_iiiiiiifi = (Module["dynCall_iiiiiiifi"] = function () {
  return (dynCall_iiiiiiifi = Module["dynCall_iiiiiiifi"] =
    Module["asm"]["dynCall_iiiiiiifi"]).apply(null, arguments);
});
var dynCall_vijijjiiii = (Module["dynCall_vijijjiiii"] = function () {
  return (dynCall_vijijjiiii = Module["dynCall_vijijjiiii"] =
    Module["asm"]["dynCall_vijijjiiii"]).apply(null, arguments);
});
var dynCall_vijijjiii = (Module["dynCall_vijijjiii"] = function () {
  return (dynCall_vijijjiii = Module["dynCall_vijijjiii"] =
    Module["asm"]["dynCall_vijijjiii"]).apply(null, arguments);
});
var dynCall_viiiijjiiiii = (Module["dynCall_viiiijjiiiii"] = function () {
  return (dynCall_viiiijjiiiii = Module["dynCall_viiiijjiiiii"] =
    Module["asm"]["dynCall_viiiijjiiiii"]).apply(null, arguments);
});
var dynCall_viiiiiji = (Module["dynCall_viiiiiji"] = function () {
  return (dynCall_viiiiiji = Module["dynCall_viiiiiji"] =
    Module["asm"]["dynCall_viiiiiji"]).apply(null, arguments);
});
var dynCall_fifi = (Module["dynCall_fifi"] = function () {
  return (dynCall_fifi = Module["dynCall_fifi"] =
    Module["asm"]["dynCall_fifi"]).apply(null, arguments);
});
var dynCall_viijji = (Module["dynCall_viijji"] = function () {
  return (dynCall_viijji = Module["dynCall_viijji"] =
    Module["asm"]["dynCall_viijji"]).apply(null, arguments);
});
var dynCall_iiijj = (Module["dynCall_iiijj"] = function () {
  return (dynCall_iiijj = Module["dynCall_iiijj"] =
    Module["asm"]["dynCall_iiijj"]).apply(null, arguments);
});
var dynCall_jij = (Module["dynCall_jij"] = function () {
  return (dynCall_jij = Module["dynCall_jij"] =
    Module["asm"]["dynCall_jij"]).apply(null, arguments);
});
var dynCall_viiiiiiiij = (Module["dynCall_viiiiiiiij"] = function () {
  return (dynCall_viiiiiiiij = Module["dynCall_viiiiiiiij"] =
    Module["asm"]["dynCall_viiiiiiiij"]).apply(null, arguments);
});
var dynCall_vijijii = (Module["dynCall_vijijii"] = function () {
  return (dynCall_vijijii = Module["dynCall_vijijii"] =
    Module["asm"]["dynCall_vijijii"]).apply(null, arguments);
});
var dynCall_vijjji = (Module["dynCall_vijjji"] = function () {
  return (dynCall_vijjji = Module["dynCall_vijjji"] =
    Module["asm"]["dynCall_vijjji"]).apply(null, arguments);
});
var dynCall_d = (Module["dynCall_d"] = function () {
  return (dynCall_d = Module["dynCall_d"] = Module["asm"]["dynCall_d"]).apply(
    null,
    arguments
  );
});
var __growWasmMemory = (Module["__growWasmMemory"] = function () {
  return (__growWasmMemory = Module["__growWasmMemory"] =
    Module["asm"]["__growWasmMemory"]).apply(null, arguments);
});
function invoke_vii(index, a1, a2) {
  var sp = stackSave();
  try {
    dynCall_vii(index, a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    dynCall_viiii(index, a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iii(index, a1, a2) {
  var sp = stackSave();
  try {
    return dynCall_iii(index, a1, a2);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiiii(index, a1, a2, a3, a4) {
  var sp = stackSave();
  try {
    return dynCall_iiiii(index, a1, a2, a3, a4);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_iiii(index, a1, a2, a3) {
  var sp = stackSave();
  try {
    return dynCall_iiii(index, a1, a2, a3);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_vi(index, a1) {
  var sp = stackSave();
  try {
    dynCall_vi(index, a1);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
function invoke_viiiii(index, a1, a2, a3, a4, a5) {
  var sp = stackSave();
  try {
    dynCall_viiiii(index, a1, a2, a3, a4, a5);
  } catch (e) {
    stackRestore(sp);
    if (e !== e + 0 && e !== "longjmp") throw e;
    _setThrew(1, 0);
  }
}
Module["getMemory"] = getMemory;
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["printErr"] = err;
Module["abort"] = abort;
if (memoryInitializer) {
  if (!isDataURI(memoryInitializer)) {
    memoryInitializer = locateFile(memoryInitializer);
  }
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = readBinary(memoryInitializer);
    HEAPU8.set(data, GLOBAL_BASE);
  } else {
    addRunDependency("memory initializer");
    var applyMemoryInitializer = function (data) {
      if (data.byteLength) data = new Uint8Array(data);
      HEAPU8.set(data, GLOBAL_BASE);
      if (Module["memoryInitializerRequest"])
        delete Module["memoryInitializerRequest"].response;
      removeRunDependency("memory initializer");
    };
    var doBrowserLoad = function () {
      readAsync(memoryInitializer, applyMemoryInitializer, function () {
        var e = new Error(
          "could not load memory initializer " + memoryInitializer
        );
        throw e;
      });
    };
    if (Module["memoryInitializerRequest"]) {
      var useRequest = function () {
        var request = Module["memoryInitializerRequest"];
        var response = request.response;
        if (request.status !== 200 && request.status !== 0) {
          console.warn(
            "a problem seems to have happened with Module.memoryInitializerRequest, status: " +
              request.status +
              ", retrying " +
              memoryInitializer
          );
          doBrowserLoad();
          return;
        }
        applyMemoryInitializer(response);
      };
      if (Module["memoryInitializerRequest"].response) {
        setTimeout(useRequest, 0);
      } else {
        Module["memoryInitializerRequest"].addEventListener("load", useRequest);
      }
    } else {
      doBrowserLoad();
    }
  }
}
var calledRun;
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function callMain(args) {
  var entryFunction = Module["_main"];
  args = args || [];
  var argc = args.length + 1;
  var argv = stackAlloc((argc + 1) * 4);
  HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
  for (var i = 1; i < argc; i++) {
    HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1]);
  }
  HEAP32[(argv >> 2) + argc] = 0;
  try {
    var ret = entryFunction(argc, argv);
    exit(ret, true);
  } catch (e) {
    if (e instanceof ExitStatus) {
      return;
    } else if (e == "unwind") {
      noExitRuntime = true;
      return;
    } else {
      var toLog = e;
      if (e && typeof e === "object" && e.stack) {
        toLog = [e, e.stack];
      }
      err("exception thrown: " + toLog);
      quit_(1, e);
    }
  } finally {
    calledMain = true;
  }
}
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) return;
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module["calledRun"] = true;
    if (ABORT) return;
    initRuntime();
    preMain();
    if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
    if (shouldRunNow) callMain(args);
    postRun();
  }
  if (Module["setStatus"]) {
    Module["setStatus"]("Running...");
    setTimeout(function () {
      setTimeout(function () {
        Module["setStatus"]("");
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module["run"] = run;
function exit(status, implicit) {
  if (implicit && noExitRuntime && status === 0) {
    return;
  }
  if (noExitRuntime) {
  } else {
    ABORT = true;
    EXITSTATUS = status;
    exitRuntime();
    if (Module["onExit"]) Module["onExit"](status);
  }
  quit_(status, new ExitStatus(status));
}
if (Module["preInit"]) {
  if (typeof Module["preInit"] == "function")
    Module["preInit"] = [Module["preInit"]];
  while (Module["preInit"].length > 0) {
    Module["preInit"].pop()();
  }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
noExitRuntime = true;
run();
