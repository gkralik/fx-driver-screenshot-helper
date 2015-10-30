function takeScreenshot(offsetX, offsetY, height, width, cb) {
    self.port.on('screenshot-data', function(data) {
        cb(data);
    });
    self.port.emit('take-screenshot', {
        x: offsetX,
        y: offsetY,
        w: width,
        h: height
    });
}

exportFunction(takeScreenshot, unsafeWindow, {defineAs: "takeScreenshot"});

// $this->driver->executeAsyncScript('var callback = arguments[arguments.length - 1]; window.takeScreenshot(callback);');
