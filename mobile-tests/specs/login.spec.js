const { expect } = require('@wdio/globals');
const LoginPage = require('../page-objects/LoginPage');

describe('Login flow', () => {
    beforeEach(async () => {
        await LoginPage.resetApp();
        await LoginPage.openLoginScreen();
    });

    it('should not login with locked out user credentials', async () => {
        await LoginPage.login('alice@example.com', '10203040');

        const isProductsVisible = await LoginPage.isProductsScreenVisible(5000);

        expect(isProductsVisible).toBe(false);
    });

    it('should login successfully with valid credentials', async () => {
        await LoginPage.login('bod@example.com', '10203040');

        const isProductsVisible = await LoginPage.isProductsScreenVisible(30000);

        expect(isProductsVisible).toBe(true);
    });
});