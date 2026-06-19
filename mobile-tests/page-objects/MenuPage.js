class MenuPage {
    get menuButton() {
        return $('~View menu');
    }

    // Validado contra dump real de UI Automator (menu.xml): el item del menú
    // expone content-desc="Login Menu Item", único entre las opciones del drawer
    // (el resource-id "itemTV" se repite en todos los items, así que por sí solo
    // no sería un selector único; el accessibility id sí lo es).
    get loginOption() {
        return $('~Login Menu Item');
    }

    async openMenu() {
        await this.menuButton.waitForDisplayed({ timeout: 15000 });
        await this.menuButton.click();
    }

    async goToLogin() {
        await this.openMenu();
        await this.loginOption.waitForDisplayed({ timeout: 15000 });
        await this.loginOption.click();
    }
}

module.exports = new MenuPage();