var self = require('sdk/self');
var windowUtils = require('sdk/window/utils');
var tabs = require("sdk/tabs");
var tabUtils = require('sdk/tabs/utils');

/**
 * Grab a screenshot of the browser window.
 *
 * @param int offsetX X offset
 * @param int offsetY Y offset
 * @param int height  Height of screenshot area
 * @param int width   Width of screenshot area
 *
 * @throws Error if taking the screenshot failed.
 *
 * @return string Base64-encoded PNG image
 */
function grabScreenshot(offsetX, offsetY, height, width) {
    var window = windowUtils.getMostRecentBrowserWindow();
    var activeTab = tabUtils.getActiveTab(window);
    var contentWindow = activeTab.linkedBrowser.contentWindow;

    canvas = window.document.createElementNS(
        'http://www.w3.org/1999/xhtml', 'canvas'
    );
    canvas.width = width;
    canvas.height = height;

    try {
        var context = canvas.getContext('2d');
    } catch (e) {
        throw new Error('Unable to get context: ' + e);
    }

    try {
        context.drawWindow(contentWindow, offsetX, offsetY, width, height, 'rgb(255,255,255)');
    } catch(e) {
        throw new Error('Unable to draw window: ' + e);
    }

    try {
        var dataUrl = canvas.toDataURL('image/png');
    } catch(e) {
        throw new Error('Unable to load canvas data into base64 string: ' + e);
    }

    var index = dataUrl.indexOf('base64,');
    if (index == -1) {
        throw new Error('Invalid base64 data: ' + dataUrl);
    }

    try {
        return dataUrl.substring(index + 'base64,'.length);
    } catch(e) {
        throw new Error('Unable to extract data from base64 string: ' + e);
    }
}

/*
 * Attach the data/exports.js content script to all new tabs.
 *
 * Listens for a 'take-screenshot' message on the port. If it receives
 * one, calls grabScreenshot() with the arguments from the message and
 * emits a screenshot-data message with the screenshot data from
 * grabScreenshot() as argument.
 */
tabs.on('ready', function(tab) {
    var worker = tab.attach({
        contentScriptFile: self.data.url("exports.js")
    });

    worker.port.on('take-screenshot', function(args) {
        var data = grabScreenshot(args.x, args.y, args.w, args.h);
        worker.port.emit('screenshot-data', data);
    });
});
