class LoginPage {
    get loginTitle() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginTV")');
    }

    get usernameInput() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/nameET")');
    }

    get passwordInput() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/passwordET")');
    }

    get loginButton() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/loginBtn")');
    }

    // El resource-id "productTV" es el encabezado genérico de pantalla (lo usan
    // tanto "Products" como "My Cart" — confirmado contra catalog.xml y cart.xml).
    // Aquí se mantiene el filtro por texto a propósito: lo que se valida es que
    // se llegó específicamente a la pantalla de catálogo tras el login, no solo
    // que existe un encabezado cualquiera.
    get productsTitle() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productTV").text("Products")');
    }

    async waitForLoginScreen() {
        await this.loginTitle.waitForDisplayed({ timeout: 15000 });
        await this.usernameInput.waitForDisplayed({ timeout: 15000 });
        await this.passwordInput.waitForDisplayed({ timeout: 15000 });
    }

    async login(username, password) {
        await this.waitForLoginScreen();

        await this.usernameInput.click();
        await this.usernameInput.clearValue();
        await this.usernameInput.setValue(username);

        await this.passwordInput.click();
        await this.passwordInput.clearValue();
        await this.passwordInput.setValue(password);

        await this.loginButton.waitForDisplayed({ timeout: 15000 });
        await this.loginButton.click();
    }

    async isProductsScreenDisplayed() {
        await this.productsTitle.waitForDisplayed({ timeout: 15000 });
        return this.productsTitle.isDisplayed();
    }

    async isProductsScreenVisible(timeout = 5000) {
        try {
            await this.productsTitle.waitForDisplayed({ timeout });
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new LoginPage();