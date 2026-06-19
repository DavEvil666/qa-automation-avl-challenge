class ProductDetailPage {
    get productImage() {
        return $('~Displays selected product');
    }

    get addToCartButton() {
        return $('~Tap to add product to cart');
    }

    get cartIcon() {
        return $('~View cart');
    }

    async waitForProductDetail() {
        await this.productImage.waitForDisplayed({ timeout: 15000 });
    }

    async addProductToCart() {
        await this.waitForProductDetail();
        await this.addToCartButton.waitForDisplayed({ timeout: 15000 });
        await this.addToCartButton.click();
    }

    async openCart() {
        await this.cartIcon.waitForDisplayed({ timeout: 15000 });
        await this.cartIcon.click();
    }
}

module.exports = new ProductDetailPage();