const { By, Key, Builder } = require("selenium-webdriver");
require("chromedriver");

async function test_case() {
    let driver = await new Builder().forBrowser("chrome").build();

    await driver.get("https://scandinavianoutdoor.fi/asiakas/");

    await driver.findElement(By.partialLinkText("Omat")).click();

    console.log(await driver.getTitle());

    if(await driver.getTitle() === 'Omat tiedot') {
        console.log("Test #1 success");
    } else {
        console.log("Test #1 failed");
    }

    
    driver.quit();
}

test_case();