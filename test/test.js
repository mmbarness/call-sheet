const {Builder, By, Key, Keys, until} = require('selenium-webdriver');
const assert = require('assert');

describe('call sheet tests', ()=> {
    let driver = new Builder().forBrowser("chrome").build();
    driver.get('https://call-sheet.matthewbarnes.tech/');
    describe('page load and search', () => {
        let closePopup = driver.findElement(By.className('info-container-close'))
        closePopup.click();
        it('should load and have a page title', async () => { 
            let actualTitle = await driver.getTitle();
            let expectedTitle = "Call Sheet";
            assert.strictEqual(actualTitle, expectedTitle)
        })
        it ('preloads directors successfully and builds treemap icons', async () =>{
            let iconContainer = await driver.wait(until.elementLocated(By.id('treemap-icons-container')))
            let iconContainerChildren = await (iconContainer.findElements(By.className('d3div')))
            assert.strictEqual(iconContainerChildren.length, 3)
        })
    })
    describe('search', () => {
        let searchBar = driver.findElement(By.id('searchBar'))
        it ('should render a loading icon on search', async() => {
            await driver.sleep(2000)
            await searchBar.sendKeys('Martin Scorsese',Key.ENTER);
            let loaderIcon = await driver.wait(until.elementLocated(By.className('loader')));
            let loaderStyle = await loaderIcon.getAttribute('style'); 
            assert.strictEqual(loaderStyle, 'display: block;')
        })
        it ('should display the appropriate bubble chart', async() => {
            await driver.sleep(2000)
            let bubbleEle = await driver.wait(until.elementLocated(By.id('bubble-chart-title')))
            let expectedBubbleTitle = "Martin Scorsese"
            let bubbleTitle = await bubbleEle.getText()
            assert.strictEqual(bubbleTitle, expectedBubbleTitle)
            driver.quit()
        })
    })
})
