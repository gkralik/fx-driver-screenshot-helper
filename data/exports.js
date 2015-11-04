/**
 * Take a screenshot of a window region.
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
function takeScreenshot(offsetX, offsetY, height, width, cb) {
    self.port.once('screenshot-data', function(data) {
        cb(data);
    });
    self.port.emit('take-screenshot', {
        x: offsetX,
        y: offsetY,
        w: width,
        h: height
    });
}

/*
 * Export the takeScreenshot() function to the page.
 */
exportFunction(takeScreenshot, unsafeWindow, {defineAs: "takeScreenshot"});
