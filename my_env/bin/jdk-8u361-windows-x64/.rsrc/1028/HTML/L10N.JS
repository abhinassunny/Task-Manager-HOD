/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

function WixFile (fname) {
    var xmlDoc = require("activex")("Msxml2.DOMDocument");
    // If loading an XML document from a resource, the load must be performed asynchronously.
    xmlDoc.async = true
    xmlDoc.load(fname)

    // We don't want to process asynchronously because this can cause size effects
    // like execution of the onload handlers before layout is initialized.
    // So we wait here until the document loading is complete
    // (actually I was not able to reproduce the case when xmlDoc.load returns before
    // onreadystatechange event is fired, and MSDN example does not check ready state,
    // but lets do it for safety).
    while (xmlDoc.readyState !== 4) {
        host.delay(10)
    }

    if (xmlDoc.parseError.errorCode != 0) {
        var theErr = xmlDoc.parseError
        log.fatal(fname + ": xml loading/parsing error - " + theErr.reason)
        return
    }

    this.idWithHtml = new Array()

    var strings = xmlDoc.getElementsByTagName("WixLocalization")[0].childNodes

    for (var i = 0; i < strings.length; i++) {
        var element = strings[i]
        this.idWithHtml.push([ element.getAttribute("Id"), element.text ])
    }

    this.iterateStrings = function (callback, thisArg) {
        this.idWithHtml.forEach(function (v) {
            callback.call(thisArg, v[0], v[1])
        })
    }
}


var l10n = new function () {

    var SPECIAL_IDS = {
        title: function (html) {
            document.title = html;              // for browser
            host.setWindowProp('title', html);  // for htmlUI
        },
        lang: function () {
            // NOP by design
        }
    }

    // RegExp for '[Click Here]' or '[#<id>|Click Here]' patterns.
    var URL_REGEXP = new RegExp("[\[]{1}[^\]\[]{1,}[\]]{1}")

    // RegExp for #<id>| pattern
    var URL_ID_REGEXP = new RegExp("^#[^|]{1,}[|]{1}")

    this.createAnchorElemenet = function (url, label) {
        return "<a href=\"#\" shadow_href=\"" + url + "\">" + label + "</a>"
    }

    this.resolveURLs = function (str, urls) {
        if (typeof urls === 'string') {
            urls = { _: urls }
        } else if (!urls) {
            return str
        }

        var replaced = undefined
        for (var m; (m = URL_REGEXP.exec(str)); ) {
            var label = m[0].slice(1, -1)

            var urlId = "_"
            var idMatch = URL_ID_REGEXP.exec(label)
            if (idMatch) {
                label = label.slice(idMatch.lastIndex)
                urlId = idMatch[0].slice(1, -1)
            }

            var replace
            if (urlId in urls) {
                replace = this.createAnchorElemenet(urls[urlId], label)
            } else {
                replace = m[0]
            }

            replaced = replaced || ""
            replaced += str.slice(0, m.index)
            replaced += replace

            str = str.slice(m.lastIndex)
        }
        if (replaced != undefined) {
            return replaced + str
        }
        return str
    }

    function getURLsForId(id) {
        try {
            return urls[id]
        } catch (e) {
            return undefined
        }
    }

    function setAccessKey(element, html) {
        // accessKey is specified by "&" (&amp;) before the letter
        var ampIdx = html.indexOf('&')
        if (ampIdx >= 0 && ampIdx < html.length-1) {
            element.accessKey=html.charAt(ampIdx + 1)
            html = html.substring(0, ampIdx) /*+ "<u>"*/ + html.charAt(ampIdx + 1) /*+ "</u>"*/ + html.substring(ampIdx + 2)
        }
        return html
    }

    this.applyWixFile = function (wixFname) {
        document.getElementById("root").style.display = "none"
        try {
            new WixFile(wixFname).iterateStrings(function (id, html) {
                var element = document.getElementById(id)
                if (element) {
                    html = this.resolveURLs(html, getURLsForId(id))
                    html = setAccessKey(element, html)
                    element.innerHTML = html
                } else if (SPECIAL_IDS.hasOwnProperty(id)) {
                    SPECIAL_IDS[id](html, id)
                } else {
                    log.warning("element[" + id + "] not found")
                }
            }, this)
        } finally {
            document.getElementById("root").style.display = "block"
        }
    }

    this.setLocale = function (loc) {
        var filename = require("Filename")

        var href = window.location.href

        var wixFname = filename.basename(href) + '_' + loc + ".wxl"

        var wixPath = filename.unix.join(filename.dir(href), wixFname)

        this.applyWixFile(wixPath)
    }
}
