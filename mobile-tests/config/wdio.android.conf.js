const path = require('path');
require('dotenv').config();

const appPath = path.join(process.cwd(), 'apps', 'my-demo-app.apk');

exports.config = {
    runner: 'local',

    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4723),
    path: '/',

    specs: [
        path.join(process.cwd(), 'mobile-tests', 'specs', '**', '*.spec.js')
    ],

    maxInstances: 1,

    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
        'appium:app': appPath,
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
        'appium:noReset': false
    }],

    logLevel: 'info',

    bail: 0,

    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 2,

    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    }
};