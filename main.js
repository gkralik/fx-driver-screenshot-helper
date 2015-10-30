var self = require('sdk/self');
var windowUtils = require('sdk/window/utils');
var tabs = require("sdk/tabs");
var tabUtils = require('sdk/tabs/utils');

function grabScreenshot(offsetX, offsetY, height, width) {
    var window = windowUtils.getMostRecentBrowserWindow();
    var activeTab = tabUtils.getActiveTab(window);
    var contentWindow = activeTab.linkedBrowser.contentWindow;

    canvas = window.document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
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

    return canvas.toDataURL();
}

tabs.on('ready', function(tab) {
    var worker = tab.attach({
        contentScriptFile: self.data.url("exports.js")
    });

    worker.port.on('take-screenshot', function(args) {
        var data = grabScreenshot(args.x, args.y, args.w, args.h);
        worker.port.emit('screenshot-data', data);
    });
});
