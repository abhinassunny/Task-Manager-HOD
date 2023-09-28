/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

// redirect all log output to host.log
require("log").prototype.logWrite = function (channel, msg) {
    host.log(channel, msg)
}
// define log variable in "global namespace"
var log = require("log")()

var host = new function () {

    function addFunction(name, fallback) {
        if (external && (name in external)) {
            this[name] = function () {
                var args = ""
                for (var i = 0; i < arguments.length; ++i) {
                    args += "arguments[" + i + "],"
                }
                return eval("external." + name + "(" + args.slice(0, -1) + ")")
            }
        } else if (fallback instanceof Function) {
            this[name] = fallback
        } else {
            this[name] = function () {
            }
        }
    }

    addFunction.call(this, "log")
    addFunction.call(this, "notify", function () {
        var msg = "notify"
        for (var i = 0; i < arguments.length; ++i) {
            msg += "\narg[" + i + "]=" + arguments[i]
        }
        alert(msg)
    })
    addFunction.call(this, "getLocale", function () {
        return "en"
    })
    addFunction.call(this, "setWindowProp")
    addFunction.call(this, "delay")
}
