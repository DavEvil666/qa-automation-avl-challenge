const assert = require('assert');
const CatalogPage = require('../page-objects/CatalogPage');
const ProductDetailPage = require('../page-objects/ProductDetailPage');
const CartPage = require('../page-objects/CartPage');

describe('Catalog and cart flow', () => {
    it('should navigate to product detail and add product to cart', async () => {
        await CatalogPage.openFirstProduct();

        await ProductDetailPage.addProductToCart();
        await ProductDetailPage.openCart();

        const isProductDisplayed = await CartPage.isProductDisplayed();

        assert.strictEqual(
            isProductDisplayed,
            true,
            'The selected product should be displayed in the cart'
        );
    });
});