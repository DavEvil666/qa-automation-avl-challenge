class CartPage {
    get cartTitle() {
        return $('android=new UiSelector().textContains("My Cart")');
    }

    get productInCart() {
        return $('android=new UiSelector().textContains("Backpack")');
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