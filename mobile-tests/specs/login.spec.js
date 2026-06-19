const assert = require('assert');
const MenuPage = require('../page-objects/MenuPage');
const LoginPage = require('../page-objects/LoginPage');

describe('Login flow', () => {
    beforeEach(async () => {
        await driver.execute('mobile: terminateApp', {
            appId: 'com.saucelabs.mydemoapp.android'
        });

        await driver.execute('mobile: activateApp', {
            appId: 'com.saucelabs.mydemoapp.android'
        });

        await MenuPage.goToLogin();
    });

    it('should not login with locked out user credentials', async () => {
        await LoginPage.login('alice@example.com', '10203040');

        const isProductsScreenVisible = await LoginPage.isProductsScreenVisible(5000);

        assert.strictEqual(
            isProductsScreenVisible,
            false,
            'Products screen should not be displayed for locked out user credentials'
        );
    });

    it('should login successfully with valid credentials', async () => {
        await LoginPage.login('bod@example.com', '10203040');

        const isProductsScreenDisplayed = await LoginPage.isProductsScreenDisplayed();

        assert.strictEqual(
            isProductsScreenDisplayed,
            true,
            'Products screen should be displayed after successful login'
        );
    });
});