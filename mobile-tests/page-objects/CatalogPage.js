class CatalogPage {
    get productsTitle() {
        return $('android=new UiSelector().text("Products")');
    }

    get firstProductImage() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)');
    }

    get firstProductTitle() {
        return $('android=new UiSelector().text("Sauce Labs Backpack")');
    }

    async waitForCatalog() {
        await this.productsTitle.waitForDisplayed({ timeout: 15000 });
        await this.firstProductTitle.waitForDisplayed({ timeout: 15000 });
        await this.firstProductImage.waitForDisplayed({ timeout: 15000 });
    }

    async openFirstProduct() {
        await this.waitForCatalog();
        await this.firstProductImage.click();
    }
}

module.exports = new CatalogPage();