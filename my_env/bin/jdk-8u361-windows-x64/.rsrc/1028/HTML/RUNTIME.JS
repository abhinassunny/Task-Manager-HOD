/*
 * This is automatically generated file.
 */

//
// Load modules in dedicated scope
//
var jibe = (function (jibe) {

//////////////////////////////////////////////////////////////////////////////
//
// util module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

if (!Array.prototype.contains) {
    Array.prototype.contains = function (k) {
        return (this.indexOf(k) !== -1)
    }
}


if (!Array.prototype.unique) {
    Array.prototype.unique = function () {
        return this.filter(function (v, i) {
            return (this.indexOf(v) === i)
        }, this)
    }
}


if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        var len = this.length
        if (typeof callback != "function") {
            throw new TypeError();
        }

        for (var i = 0; i < len; ++i) {
            if (i in this) {
                callback.call(thisArg, this[i], i, this)
            }
        }
    }
}


if (!Array.prototype.map) {
    // http://www.tutorialspoint.com/javascript/array_map.htm
    Array.prototype.map = function (callback, thisArg) {
        var len = this.length
        if (typeof callback != "function") {
            throw new TypeError();
        }

        var res = new Array(len)
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = callback.call(thisArg, this[i], i, this)
            }
        }

        return res
    }
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun != "function")
      throw new TypeError();

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.lastIndexOf(searchString, position) === position;
    }
}


// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  (function() {
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function() {
      return this.replace(rtrim, '');
    };
  })();
}


var api = {}

api.getFunctionName = function (f) {
    var Assert = require("Assert")

    Assert.t(f instanceof Function)

    // get function signature and body
    var reply = f.toString()

    // strip 'function' form the beginning
    reply = reply.substr('function'.length)

    // drop comments (http://stackoverflow.com/a/15123777)
    // IMPORTANT: This is just naive js parsing with regexps.
    reply = reply.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm, '')

    // get the beginning of the string before the first space character
    reply = reply.split(/\s+/)[0]

    // function name ends with '(':
    //  function River() {}         >>tokenizing>> River()
    //  function River(a, b) {}     >>tokenizing>> River(a,
    // or '(' may start the next token:
    //  function River ( ) {}       >>tokenizing>> River
    //  function River (a, b) {}    >>tokenizing>> River
    var theFirstOpenBracketIdx = reply.indexOf('(')
    if (theFirstOpenBracketIdx >=  0) {
        reply = reply.slice(0, theFirstOpenBracketIdx)
    }

    return reply
}


function MeasureTime (f, thisArg) {
    if (this.constructor === MeasureTime) {
        return
    }

    var mt = new MeasureTime()
    mt.run(f, thisArg)
    return mt.getElapsedMillis()
}

MeasureTime.prototype.run = function(f, thisArg) {
    this.startTime = new Date().getTime()
    try {
        delete this.elapsedMillis
        return f.call(thisArg)
    } finally {
        this.elapsedMillis = this.getElapsedMillis()
        delete this.startTime
    }
}

MeasureTime.prototype.getElapsedMillis = function () {
    if (this.hasOwnProperty('elapsedMillis')) {
        return this.elapsedMillis
    }
    if (!this.hasOwnProperty('startTime')) {
        // run() has not been called on 'this' yet
        require("Assert").unreachable()
    }
    return new Date().getTime() - this.startTime
}
api.MeasureTime = MeasureTime


function errorDescription(e) {
    if (e instanceof Object) {
        if ('description' in e) {
            return String(e.description)
        }
        if ('message' in e) {
            return String(e.message)
        }
    }
    return String(e)
}


function errorType(e) {
    if (e instanceof Object) {
        if ('name' in e) {
            return String(e.name)
        }
        if ('constructor' in e) {
            return api.getFunctionName(e.constructor)
        }
    }
    return (typeof e)
}


api.errorToString = function (e) {
    var desc = errorDescription(e)
    return errorType(e) + '[' + desc + ']'
}


var VOID_TAG = {}

api.deriveFrom = function (baseCtor /*, ctor */) {
    var Arrays = require("Arrays")

    var derivedCtorImpl;
    if (arguments.length > 1) {
        derivedCtorImpl = arguments[1]
    }

    var derivedCtor = function () {
        var obj = this

        if (obj.constructor !== derivedCtor) {
            obj = api.constructAlmost(derivedCtor)
        }

        // Call base class constructor
        obj.constructor = baseCtor
        obj.constructor.apply(obj, arguments)

        // Restore constructor function of 'obj'
        obj.constructor = derivedCtor

        if (derivedCtorImpl !== undefined) {
            // Call derived class constructor
            derivedCtorImpl.apply(obj, arguments)
        }

        return obj
    }
    Arrays.extend(derivedCtor.prototype, baseCtor.prototype)

    function callBase () {
        var funcName = arguments[0]
        var funcArgs = Arrays.duck(arguments).slice(1)
        return baseCtor.prototype[funcName].apply(this, funcArgs)
    }

    if (baseCtor.prototype.hasOwnProperty('callBase')) {
        var baseCallBase = baseCtor.prototype.callBase

        derivedCtor.prototype.callBase = function () {
            var savedCallBase = api.getOwnProperty(this, 'callBase', VOID_TAG)
            try {
                this.callBase = baseCallBase
                return callBase.apply(this, arguments)
            } finally {
                if (savedCallBase === VOID_TAG) {
                    delete this.callBase
                } else {
                    this.callBase = savedCallBase
                }
            }
            return baseCallBase.apply(this, arguments)
        }
    } else {
        derivedCtor.prototype.callBase = callBase
    }

    return derivedCtor
}


api.construct = function (ctor, args) {
    var obj = api.constructAlmost(ctor)
    ctor.apply(obj, args)
    return obj
}


api.constructAlmost = function (ctor) {
    function stub () {}
    stub.prototype = ctor.prototype

    var obj = new stub()

    obj.constructor = ctor
    return obj
}


api.getOwnProperty = function (obj, name, fallback) {
    if (name in obj && Object.prototype.hasOwnProperty.call(obj, name)) {
        return obj[name]
    }
    return fallback
}


api.getProperty = function (obj, name, fallback) {
    if (name in obj) {
        return obj[name]
    }
    return fallback
}


api.singleton = function (ctor) {
    return (function () {
        var instance;
        return function () {
            if (instance === undefined) {
                instance = ctor()
            }
            return instance
        }
    })()
}


var getAddressWidth = api.singleton(function () {
    return require('activex')("winmgmts:root\\cimv2:Win32_Processor='cpu0'").AddressWidth
})


// http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
api.capitalizeFirstLetter = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


api.env = {
    fso: api.singleton(function () {
        return require("activex")("Scripting.FileSystemObject")
    }),
    shell: api.singleton(function () {
        return require("activex")("WScript.Shell")
    }),
    archs: api.singleton(function () {
        var reply = [ 32 ]
        if (getAddressWidth() === 64) {
            reply.push(64)
        }
        return reply
    }),
    is32BitOS: function () {
        return getAddressWidth() === 32
    },
    is64BitOS: function () {
        return getAddressWidth() === 64
    },
    getVariable: function(name) {
        return this.shell().ExpandEnvironmentStrings(
                                                [ '%', name, '%' ].join(''))
    }
}


publish(api)

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\util.js', 'util', 1)
//////////////////////////////////////////////////////////////////////////////
//
// Arrays module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

function values (obj) {
    var reply = []
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            reply.push(obj[k])
        }
    }
    return reply
}

function keys (obj) {
    var reply = []
    for (var k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            reply.push(k)
        }
    }
    return reply
}

function sortedKeys (obj) {
    return keys(obj).sort()
}

function set (array) {
    var reply = {}
    array.forEach(function (v) {
        reply[v] = true
    })
    return reply
}

function subtract (src, what) {
    return src.filter(function (v) {
        return !what.contains(v)
    })
}

function common (a, b) {
    var reply = []
    a.forEach(function (v) {
        if (b.contains(v) && !reply.contains(v)) {
            reply.push(v)
        }
    })
    return reply
}

function duck (o) {
    if (typeof o === 'unknown') {
        // .NET entity
        return arrayFromDotNetArray(o)
    }

    if (typeof o === 'object' && 'Count' in o) {
        return enumerate(o) || []
    }

    if (!('length' in o)) {
        return
    }

    if (o instanceof Array) {
        return o.slice()
    }

    var reply = []
    for (var i = 0, len = o.length; i < len; ++i) {
        reply.push(o[i])
    }
    return reply
}


function readBytesAs_ISO_8859_1(bytes) {
    var stream = require("activex")('ADODB.Stream')
    stream.Type = 1; // adTypeBinary
    stream.Open()

    stream.Write(bytes)

    stream.Position = 0
    stream.Type = 2; // adTypeText
    stream.CharSet = 'ISO-8859-1'

    return stream
}

var getCharCodeMap = require("util").singleton(function () {
    var all8BitCharCodes = new Array(256)
    for (var i = 0; i < 256; i++) {
        all8BitCharCodes[i] = i
    }
    all8BitCharCodes = String.fromCharCode.apply(this, all8BitCharCodes)

    var bytes = require("io").getBytes(all8BitCharCodes, 'ISO-8859-1')

    var stream = readBytesAs_ISO_8859_1(bytes)

    try {
        var dict = {}
        stream.ReadText().split('').map(function (c, idx) {
            dict[c.charCodeAt()] = idx
        })
        return dict
    } finally {
        stream.Close()
    }
})


//
// Converts given .NET byte array object into regular JS array of integers.
//
// There is no straightforward way for this. The workaround is:
//  1. Write .NET byte array into binary ADODB.Stream;
//  2. Read ADODB.Stream as ISO-8859-1 encoded text stream into
//     JS String object;
//  3. Save character codes of elements of JS String into an array.
//     This array is the result of the function call.
//     Do extra mapping of character codes. Code units of ISO-8859-1 encoding
//     correspond to code points from the first block of characters in Unicode.
//     However ADODB.Stream does unexpected mapping of some control
//     characters from ISO-8859-1 encoding. E.g.: it maps #151 char code into
//     #8212 Unicode character. This means that if some JS String is
//     constructed from #151 character code, saved into ADODB.Stream stream
//     with ISO-8859-1 encoding and then contents of ADODB.Stream stream are
//     requested with ReadText(), the return JS String will have character
//     #8218 instead of expected #151. To address this undesired magic
//     getCharCodeMap() is implemented.
//
function arrayFromDotNetArray (o) {
    var charCodeMap = getCharCodeMap()

    var stream = readBytesAs_ISO_8859_1(o)
    try {
        var str = stream.ReadText()
        return str.split('').map(function (c) {
            var code = c.charCodeAt()
            code = charCodeMap[code]
            return code
        })
    } finally {
        stream.Close()
    }
}

function extend (dst, src) {
    for (var k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) {
            dst[k] = src[k]
        }
    }
    return dst
}

function extendArray () {
    var args = duck(arguments)
    var dst = args[0]

    args.slice(1).forEach(function (src) {
        extend(dst, src)
    })

    return dst
}


function enumerate (enumerable, callback, thisArg) {
    var reply;

    if (callback === undefined) {
        callback = function (item) {
            return item
        }
    }

    if (enumerable instanceof Array) {
        if (enumerable.length) {
            reply = enumerable.map(callback, thisArg)
        }
        return reply
    }

    var enumerator = new Enumerator(enumerable)
    while (!enumerator.atEnd()) {
        var item = enumerator.item()
        item = callback.call(thisArg, item)
        if (item !== undefined) {
            if (reply === undefined) {
                reply = []
            }
            reply.push(item)
        }
        enumerator.moveNext()
    }

    if (reply !== undefined) {
        return reply
    }
}

publish({
    values: values,
    keys: keys,
    sortedKeys: sortedKeys,
    set: set,
    subtract: subtract,
    common: common,
    duck: duck,
    extend: extendArray,
    enumerate: enumerate
})

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\Arrays.js', 'Arrays', 2)
//////////////////////////////////////////////////////////////////////////////
//
// log module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */


//
// Constructs new logger or copies logging function to the given 'loggable'.
// There are multiple ways to call this function:
//  ---------------------------
//  (1) Loggable();
//  ---------------------------
//      Constructs new Logger instance.
//      The function returns new constructed instance.
//
//  ---------------------------
//  (2) Loggable(loggable);
//  ---------------------------
//      Copies properties from Logger prototype into 'loggable'.
//      The function returns 'undefined'.
//
//  ---------------------------
//  (3) new Loggable();
//  ---------------------------
//      Constructs new Logger instance.
//
//  ---------------------------
//  (4) new Loggable(loggable);
//  ---------------------------
//      Constructs new Logger instance and copies properties from
//      Logger prototype into 'loggable'.
//
//  ---------------------------
//  (5) var log; /* instance of Logger class */
//      log.constructor(loggable)
//  ---------------------------
//      Copies properties from Logger prototype into 'loggable.prototype'
//      and properties from 'log' into 'loggble'.
//
function Logger (loggable) {
    if (this.constructor === Logger) {
        if (arguments.length > 0) {
            var loggableCtor = loggable.constructor
            try {
                Logger(loggable)
                require("Arrays").extend(loggable, this)
            } finally {
                loggable.constructor = loggableCtor
            }
        }
        return
    }

    if (arguments.length === 0) {
        return new Logger()
    }

    require("Arrays").extend(loggable, Logger.prototype)
}

Logger.prototype.makeLoggable = function (loggable) {
    if (this.constructor !== Logger) {
        throw new TypeError()
    }
    loggable.log = this
    loggable.log.constructor(loggable)
}

Logger.prototype.logWrite = function (chanel, str) {
    WScript.Echo(str)
}

Logger.prototype.logFormat = function (chanel, msg) {
    var prefix;
    if (this.logRecordPrefix instanceof Function) {
        prefix = this.logRecordPrefix(chanel)
    } else {
        prefix = this.logRecordPrefix
    }
    if (prefix) {
        prefix = String(prefix)
    } else {
        prefix = ''
    }
    return (prefix + msg)
}

Logger.prototype.logRecordDefaultPrefix = function (chanel) {
    return chanel.toUpperCase() + ": "
}

Logger.prototype.logRecordPrefix = Logger.prototype.logRecordDefaultPrefix

Logger.prototype.logRecordAddPrefix = function (prefix) {
    var logRecordPrefix = this.logRecordPrefix
    if (logRecordPrefix instanceof Function) {
        this.logRecordPrefix = function (chanel) {
            return prefix + ": " + logRecordPrefix.call(this, chanel)
        }
    } else {
        this.logRecordPrefix = function (chanel) {
            return prefix + ": " + logRecordPrefix
        }
    }
}

Logger.prototype.fatal = function (msg) {
    this.error(msg)
    debugger
    throw new Error(msg)
}

function addChanel(name, chanel) {
    Logger.prototype[name] = function (msg) {
        if (this.logWrite instanceof Function) {
            this.logWrite(chanel, this.logFormat(chanel, msg))
        }
    }
}

addChanel("trace", "TRACE")
addChanel("info", "INFO")
addChanel("warning", "WARNING")
addChanel("error", "ERROR")


publish(Logger)

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\log.js', 'log', 3)
//////////////////////////////////////////////////////////////////////////////
//
// activex module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

publish(function (name) {
    var errMsgs = []
    try {
        return new ActiveXObject(name)
    } catch (e) {
        errMsgs.push("new ActiveXObject(" + name + ") failed: " +
                                            require("util").errorToString(e))
    }

    try {
        return GetObject(name)
    } catch (e) {
        errMsgs.push("GetObject(" + name + ") failed: " +
                                            require("util").errorToString(e))
    }

    log.fatal(errMsgs.join('; '))
})

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\activex.js', 'activex', 4)
//////////////////////////////////////////////////////////////////////////////
//
// deepCompare module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
var deepCompare = (function () {

  function compare2Objects (x, y, leftChain, rightChain) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on step when comparing prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good a we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    if ((x instanceof Array && y instanceof Array)) {
        if (x.length !== y.length) {
            return false;
        }
    }

    // check for infinitive linking loops
    if (leftChain.contains(x) || rightChain.contains(y)) {
        return false;
    }

    // Quick checking of one object beeing a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':
                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p], leftChain, rightChain)) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  return function (/* objects to compare */) {
      if (arguments.length < 1) {
        return true; //Die silently? Don't know how to handle such case, please help...
        // throw "Need two or more arguments to compare";
      }

      for (var i = 1, l = arguments.length; i < l; i++) {

          var leftChain = []; //todo: this can be cached
          var rightChain = [];

          if (!compare2Objects(arguments[0], arguments[i], leftChain, rightChain)) {
              return false;
          }
      }

      return true;
  }
})()


publish(deepCompare)

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\deepCompare.js', 'deepCompare', 6)
//////////////////////////////////////////////////////////////////////////////
//
// Assert module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

var deepCompare = require("deepCompare")

var eq = deepCompare

function ne (a, b) {
    return !eq(a, b)
}

function t (a) {
    return (a === true)
}

function f (a, msg) {
    return (a === false)
}

function rt (a) { /* test for relaxed 'true' */
    return (a ? true : false)
}

function rf (a) { /* test for relaxed 'false' */
    return (a ? false : true)
}

function unreachable () {
    return false
}

function is_function (v) {
    return (v instanceof Function)
}

function is_string (v) {
    return (typeof v === 'string')
}

function is_string_not_empty (v) {
    return is_string(v) && v.length > 0
}

function is_array (v) {
    return v instanceof Array
}

function adapt(f, argc) {
    return function () {
        var msg = arguments[argc]
        var args = []
        for (var i = 0; i < argc; ++i) {
            args.push(arguments[i])
        }
        this.assert(f.apply(undefined, args), msg)
    }
}


function Assert () {
    if (this.constructor !== Assert) {
        return new Assert()
    }
}
Assert.prototype.assert = function (v, msg) {
    if (!v) {
        debugger
        log.fatal(msg || 'Assertion failed')
    }
}
Assert.prototype.eq = adapt(eq, 2)
Assert.prototype.ne = adapt(ne, 2)
Assert.prototype.t = adapt(t, 1)
Assert.prototype.f = adapt(f, 1)
Assert.prototype.rt = adapt(rt, 1)
Assert.prototype.rf = adapt(rf, 1)
Assert.prototype.unreachable = adapt(unreachable, 0)
Assert.prototype.is_function = adapt(is_function, 1)
Assert.prototype.is_string = adapt(is_string, 1)
Assert.prototype.is_string_not_empty = adapt(is_string_not_empty, 1)
Assert.prototype.is_array = adapt(is_array, 1)


publish(new Assert())

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\Assert.js', 'Assert', 7)
//////////////////////////////////////////////////////////////////////////////
//
// Filename module
//
//////////////////////////////////////////////////////////////////////////////
jibe.loadModule(function (require, publish, jibe, __FILE__, __MODULE__, log) {
/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

var Assert = require("Assert")
var Arrays = require("Arrays")

var getFso = require("util").env.fso
var getShell = require("util").env.shell

var NOTDIR_PATTERN = '[^/\\\\]+[/\\\\]*$'

var NOTDIR_REGEXP = new RegExp(NOTDIR_PATTERN)
var DIR_REGEXP = new RegExp('[/\\\\]+' + NOTDIR_PATTERN)
var SUFFIX_REGEXP = new RegExp('\.[^./\\\\]+$')

var SPLIT_REGEXP = new RegExp("[/\\\\]\+", "g")

function dir (fname) {
    if (fname === undefined || fname === null) {
        return fname
    }
    var m = DIR_REGEXP.exec(fname)
    if (m) {
        return m.input.slice(0, m.index + 1)
    }
    return ''
}

function notdir (fname) {
    if (fname === undefined || fname === null) {
        return fname
    }
    var m = NOTDIR_REGEXP.exec(fname)
    if (!m) {
        return fname
    }
    return m[0]
}

function basename (fname) {
    if (fname === undefined || fname === null) {
        return fname
    }
    var name = notdir(fname)
    return name.slice(0, name.length - suffix(name).length)
}

function suffix (fname) {
    if (fname === undefined || fname === null) {
        return fname
    }
    var m = SUFFIX_REGEXP.exec(fname)
    if (m && m[0].charAt(0) === '.') {
        return m[0]
    }
    return ''
}

function isDirSeparator (chr) {
    return (chr === '/' || chr === '\\')
}

function join (a, b, dirSeparator) {
    if (!a) {
        return b
    }

    if (!b) {
        return a
    }

    var tail = a.charAt(a.length - 1)
    var head = b.charAt(0)

    if (!isDirSeparator(tail) && !isDirSeparator(head)) {
        return (a + dirSeparator + b)
    }

    if (isDirSeparator(tail) && isDirSeparator(head)) {
        return (a + b.slice(1, b.size))
    }

    return a + b
}

function joinArray (dirSeparator, paths) {
    var reply = ''
    paths.forEach(function (path) {
        reply = join(reply, path, dirSeparator)
    })
    return reply
}

function isEqualPaths(a, b) {
    var typeofA = typeof a
    if (typeofA !== typeof b) {
        return
    }

    if (typeofA === 'string') {
        return a.toLowerCase() === b.toLowerCase()
    }

    return a === b
}

function relativeTo (path, base, dirSeparator) {
    if (!path || !base) {
        return path
    }

    if (!isDirSeparator(base.charAt(base.length - 1))) {
        base = dir(base)
    }

    var pathTokens = tokenize(path)
    var baseTokens = tokenize(base)

    if (pathTokens[0] === null && baseTokens[0] === null) {
        // drop two token from both arrays: the first 'null'
        // path component [0] and directory separator [1]
        pathTokens = pathTokens.slice(2)
        baseTokens = baseTokens.slice(2)
    }

    // Iterate path components omitting directory separators ( i += 2)
    var len = baseTokens.length
    for (var i = 0; i < len; i += 2) {
        if (i >= pathTokens.length || !isEqualPaths(pathTokens[i], baseTokens[i])) {
            path = pathTokens.slice(i, pathTokens.length).join('')
            base = new Array((len + 1 - i) / 2).join('..' + dirSeparator)

            return join(base, path, dirSeparator)
        }
    }

    return pathTokens.slice(len, pathTokens.length).join(dirSeparator)
}

function tokenize (path) {
    var tokens = []
    var token = []
    var separator = isDirSeparator(path.charAt(0)) ? true : false
    path.split('').forEach(function (chr) {
        if (isDirSeparator(chr) == separator) {
            token.push(chr)
        } else {
            tokens.push(token.join(''))
            token = [ chr ]
            separator = ! separator
        }
    })
    if (token.length) {
        tokens.push(token.join(''))
    }

    // Resolve ambiguous split if any
    if (path.length) {
        if (isDirSeparator(path.charAt(0))) {
            tokens = [].concat([ null ], tokens)
        }
        if (isDirSeparator(path.charAt(path.length - 1))) {
            tokens.push(null)
        }
    }

    // It is guaranteed that if 'path' is not empty
    // 'tokens' array is not empty too and the following is true:
    //  - every even element of 'tokens' array is a path component;
    //  - every odd element of 'tokens' array is a directory separator;
    //  - every directory separator element 'tokens' array is either a
    //    single character or string where all characters are directory
    //    separators;
    //  - the first element of 'tokens' array is a path component or
    //    'null' if 'path' starts with directory separator character;
    //  - the last element of 'tokens' array is a path component or
    //    'null' if 'path' ends with directory separator character;
    //  - length of 'tokens' array is always odd number;
    //  - total count of path components in 'tokens' array is
    //    '(tokens.length + 1) / 2'
    return tokens
}

function normalize (path, dirSeparator) {
    // Tokenize path splitting it at '\' and '/' chars.
    // Drop all directory separators and '.' tokens.
    var tokens = tokenize(path).filter(function (token, i) {
        return (i % 2 === 0 && token != '.')
    })
    return tokens.join(dirSeparator)
}

function getAbsolutePathFromShortcut (target) {
    var shell = getShell()
    var link = shell.CreateShortcut('tmp.lnk')
    try {
        link.TargetPath = target
        return link.TargetPath
    } finally {
        delete link
    }
}

function absolute (path) {
    if (path === undefined || path === null) {
        path = ''
    }

    var fso = getFso()

    var fixDriveLetter;
    if (path && path.length > 1 && path.charAt(1) === ':') {
        var driveLetter = path.slice(0, 1)
        fixDriveLetter = function (path) {
            var newDriveLetter = path.slice(0, 1)
            if (newDriveLetter !== driveLetter &&
                    driveLetter.toLowerCase() === newDriveLetter.toLowerCase()) {
                path = driveLetter + path.slice(1)
            }
            return path
        }
    } else {
        fixDriveLetter = function (path) {
            return path
        }
    }

    path = fso.GetAbsolutePathName(path)

    if (path.indexOf('~') == -1) {
        return fixDriveLetter(path)
    }

    //
    // Want long file name to avoid 'warning MSB8012'
    // from generated .vcxproj
    //
    // Algorithm to get long path from short path grabbed from
    // http://www.computerhope.com/forum/index.php?topic=76293.0
    //

    var isFolder = fso.FolderExists(path)
    var isFile = !isFolder && fso.FileExists(path)

    if (isFolder || isFile) {
        return fixDriveLetter(getAbsolutePathFromShortcut(
                    isFolder ? fso.GetFolder(path) : fso.GetFile(path)))
    }

    var tokens = path.split(SPLIT_REGEXP)
    var path = tokens[0]
    for (var i = 1, len = tokens.length; i < len; ++i) {
        var nextPath = path + '\\' + tokens[i]
        if (fso.FolderExists(nextPath) || fso.FileExists(nextPath)) {
            path = nextPath
            continue
        }

        path = getAbsolutePathFromShortcut(fso.GetFolder(path))
        return fixDriveLetter(join(path, tokens.slice(i).join('\\'), '\\'))
    }
}

function tempPath (prefix, suffix, tmpFolder) {
    var fso = getFso()
    if (tmpFolder === undefined) {
        tmpFolder = fso.GetSpecialFolder(2 /* $TMP */)
    } else if (!(typeof tmpFolder === 'object' && 'Path' in tmpFolder)) {
        tmpFolder = fso.GetFolder(tmpFolder)
    }

    var tmpFilename = fso.GetTempName()

    if (arguments.length > 0) {
        tmpFilename = prefix + tmpFilename
    }

    if (arguments.length > 1) {
        tmpFilename = basename(tmpFilename) + suffix
    }

    return join(tmpFolder.Path, tmpFilename, '\\')
}

function withPaths (paths, f /*, arguments for 'f' */) {
    if (arguments.length > 2) {
        var args = Arrays.duck(arguments).slice(1)
        return paths.map(function (path) {
            args[0] = path
            return f.apply(this, args)
        }, this)
    }
    return paths.map(f, this)
}


function Filename(dirSeparator) {
    Assert.t(isDirSeparator(dirSeparator))

    this.dirSeparator = dirSeparator

    this.dir = dir

    this.notdir = notdir

    this.basename = basename

    this.suffix = suffix

    this.join = function () {
        var paths = [].concat.apply([], Arrays.duck(arguments))
        return joinArray(dirSeparator, paths)
    }

    this.relativeTo = function (path, base) {
        if (path instanceof Array) {
            return withPaths(path, relativeTo, base, dirSeparator)
        }
        return relativeTo(path, base, dirSeparator)
    }

    this.normalize = function (path) {
        if (path instanceof Array) {
            return withPaths(path, normalize, dirSeparator)
        }
        return normalize(path, dirSeparator)
    }

    var theAbsolute = absolute
    if (dirSeparator != '\\') {
        theAbsolute = function (path) {
            return absolute(path).replace(/\\/g, dirSeparator)
        }
    }
    this.absolute = function (path) {
        if (path instanceof Array) {
            return withPaths(path, theAbsolute, dirSeparator)
        }
        return theAbsolute(path, dirSeparator)
    }

    this.tempPath = tempPath
}

var unix = new Filename('/')
var win = new Filename('\\')

var api = ('WScript' in this) ? win : unix
api.win = win
api.unix = unix


publish(api)

}, jibe, 'C:\\jenkins\\workspace\\8-2-build-windows-x64-cygwin\\jdk8u361\\3183\\install\\make\\smartmake\\scripting\\Filename.js', 'Filename', 8)


return jibe.api
})((function () {
    var loadedModules = {}
    var logProto;
    var fso;
    var loadModule = (function (moduleFunc, jibe, __FILE__, __MODULE__, order) {
        if (!(moduleFunc instanceof Function)) {
            throw new TypeError()
        }

        var module = {
            path: __FILE__,
            order: order
        }

        var require = jibe.api.require

        var publish = (function (api) {
            var published;
            return function (api) {
                if (published) {
                    fatal("publish() has been called for \'" + __MODULE__ +
                            "\' module loaded from " + __FILE__ + " already")
                }
                published = true
                module.api = api
            }
        })()

        var log;
        if (logProto) {
            log = logProto()
        }

        moduleFunc(require, publish, jibe.api, __FILE__, __MODULE__, log)
        if (!module.hasOwnProperty('api')) {
            warning("publish() has not been called for \'" + moduleName +
                                        "\' module loaded from " + modulePath)
        }

        loadedModules[__MODULE__] = module

        if (__MODULE__ == "log") {
            logProto = module.api
        }
    })

    try {
        fso = WScript.CreateObject("Scripting.FileSystemObject")
    } catch (e) {
        // Just ignore failure. Being executed from the browser
    }
    
    var fatal = function (msg) {
        debugger
        throw new Error(msg)
    }

    //
    // Jibe duck typing
    //
    var api = { fso: fso }

    api.getModuleInfo = (function getModuleInfo (moduleNameFilter) {
    var moduleNames = Arrays.keys(loadedModules)

    if (arguments.length > 0) {
        if (moduleNameFilter instanceof RegExp) {
            var regexp = moduleNameFilter
            moduleNameFilter = function (str) {
                return regexp.test(str)
            }
        } else if (moduleNameFilter instanceof Function) {
        } else {
            var search = String(moduleNameFilter)
            moduleNameFilter = function (str) {
                return str == search
            }
        }

        moduleNames = moduleNames.filter(moduleNameFilter)
    }

    // Copy module information for requested modules
    var reply = {}
    moduleNames.forEach(function (name) {
        var info = Arrays.extend({}, loadedModules[name])
        info.name = name
        reply[name] = info
    })
    return reply
})
    
    api.require = (function (moduleName) {
        if (loadedModules.hasOwnProperty(moduleName)) {
            // Module has been loaded already
            return loadedModules[moduleName].api
        }

        if (!loadedModules.hasOwnProperty(moduleName)) {
            fatal("Can't find source of \'" + moduleName + "\' module")
        }
    })
    
    api.readFile = (function readFile (path, callback, thisArg) {
    function closeStream(stream) {
        try {
            stream.Close()
        } catch (e) {
            // TBD: report error
        }
    }

    // Detect if file is UCS 16 little-endian encoded (Unicode)
    // http://stackoverflow.com/a/1465386/4224163
    function isUnicode() {
        var stream = fso.OpenTextFile(path)
        try {
            var chr1 = stream.Read(1).charCodeAt(0)
            var chr2 = stream.Read(1).charCodeAt(0)
            return chr1 == 255 && chr2 == 254
        } catch (e) {
            // Error reading BOM. Assume this is not valid Unicode stream.
        } finally {
            closeStream(stream)
        }
    }

    var istream = fso.OpenTextFile( path,
                                    1       /* ForReading */,
                                    false   /* Don't create */,
                                    isUnicode() ? -1 : 0 /* ASCII */)
    try {
        if (arguments.length > 1) {
            return callback.call(thisArg, istream)
        }
        return istream.ReadAll()
    } finally {
        try {
            istream.Close()
        } catch (e) {
            // TBD: report error
        }
    }
})

    loadedModules["jibe"] = {
        api: api,
        path: '',
        order: 0
    }

    return {
        api: api,
        loadModule: loadModule
    }
})())


var require = jibe.require
