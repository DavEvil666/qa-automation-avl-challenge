class MenuPage {
    get menuButton() {
        return $('~View menu');
    }

    get loginOptionByText() {
        return $('android=new UiSelector().textContains("Log In")');
    }

    async openMenu() {
        await this.menuButton.waitForDisplayed({ timeout: 15000 });
        await this.menuButton.click();
    }

    async goToLogin() {
        await this.openMenu();
        await this.loginOptionByText.waitForDisplayed({ timeout: 15000 });
        await this.loginOptionByText.click();
    }
}

module.exports = new MenuPage();