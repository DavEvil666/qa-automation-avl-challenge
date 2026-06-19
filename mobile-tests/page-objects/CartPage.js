class CartPage {
    // Validado contra dump real de UI Automator (cart.xml): el encabezado "My Cart"
    // usa el mismo resource-id genérico de título de pantalla ("productTV") que
    // "Products" en el catálogo. No depende del texto, solo de la presencia del nodo.
    get cartTitle() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/productTV")');
    }

    // El título del producto dentro del item del carrito usa resource-id "titleTV",
    // igual que en el catálogo (item dentro del RecyclerView "productRV").
    get productInCart() {
        return $('android=new UiSelector().resourceId("com.saucelabs.mydemoapp.android:id/titleTV").instance(0)');
    }

    async waitForCart() {
        await this.cartTitle.waitForDisplayed({ timeout: 15000 });
    }

    async isProductDisplayed() {
        await this.waitForCart();
        return this.productInCart.isDisplayed();
    }
}

module.exports = new CartPage();