const assert = require('assert');

describe('Mobile app launch', () => {
    it('should open the application successfully', async () => {
        const currentPackage = await driver.getCurrentPackage();

        console.log(`Current Android package: ${currentPackage}`);

        assert.ok(currentPackage, 'The application package should be available');
    });
});