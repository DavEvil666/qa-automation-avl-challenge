class CatalogPage {
    get productsTitle() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productTV")');
    }

    get firstProductImage() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productIV").instance(0)');
    }

    // Validado contra dump real de UI Automator (catalog.xml): el título de cada
    // producto en el catálogo usa resource-id "titleTV", no "productTV" (ese id
    // pertenece al encabezado "Products" de la pantalla, no a los items del listado).
    get firstProductTitle() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/titleTV").instance(0)');
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