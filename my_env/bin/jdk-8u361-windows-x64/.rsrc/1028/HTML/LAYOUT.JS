/*
 * Copyright (c) 2014, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */

function addOnloadCallback (newonload) {
    var oldonload = window.onload
    if (typeof oldonload == "function") {
        window.onload = function() {
            oldonload()
            newonload()
        }
    } else {
        window.onload = newonload
    }
}

// function is called before onload event fired
function initLayout() {
    function setElement(id) {
        var src = document.getElementById(id + ".src")
        if (src !== null) {
            var innerHTML = src.innerHTML
            src.parentNode.removeChild(src)
            document.getElementById(id).innerHTML = innerHTML
        }
    }

    setElement("header")
    setElement("main")
    setElement("footer_left")
    setElement("footer_right")

    l10n.setLocale(host.getLocale())

    configureAnchors()
}

addOnloadCallback( function () {
    // set focus to the last button on the page (if present)
    // pages can override this by setting focus in the onload callback
    setDefaultFocus();
})


function configureAnchors() {
    function notifyOpenUrl () {
        host.notify("a", this.shadow_href)
    }

    var anchors = document.body.getElementsByTagName("a")
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].onclick = notifyOpenUrl
    }
}

function setDefaultFocus() {
    // by default set focus to the last visible and enabled button
    var buttons = document.getElementsByTagName('button');
    for (var idx = buttons.length - 1; idx >= 0; idx--) {
        try {  // IE throws exception if the element cannot receive focus
            buttons[idx].focus();
            break;
        } catch (e) {
        }
    }
}

function getElementsByClassName(matchClass) {
    if (this.getElementsByClassName) {
        return this.getElementsByClassName(matchClass)
    }

    var reply = new Array()

    var elements = this.getElementsByTagName('*')
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i]
        if ((' ' + element.className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
            reply.push(element)
        }
    }
    return reply
}
