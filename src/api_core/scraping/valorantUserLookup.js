const { startpt, userToSearch, timeout } = require('../utilities/webScrapperUtil.js');
const pt = require('puppeteer-extra');
const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')();
pt.use(blockResourcesPlugin);

let TIMEOUT = 0;
let TIMEOUTUPDATED = false;

function timeoutUpdater(timeout) {
  TIMEOUT = timeout
  TIMEOUTUPDATED = true
}

async function getUserDataCurrent(useridentifier) {
  if (!TIMEOUTUPDATED) timeoutUpdater(timeout)


  if (TIMEOUT >= 3) return TIMEOUTUPDATED = false

  const startHandler = await startpt(`https://tracker.gg/valorant/profile/riot/${userToSearch(useridentifier)}/overview`)

  if (startHandler[0] === true) {
    return startHandler[1]
  }
  blockResourcesPlugin.blockedTypes.delete('stylesheet')
  blockResourcesPlugin.blockedTypes.delete('other')
  blockResourcesPlugin.blockedTypes.delete('script')
  blockResourcesPlugin.blockedTypes.add('media')

  page = startHandler[0]
  browser = startHandler[1]

  const mainStatDiv = (await page.$x('/html/body/div/div/div[2]/div[3]/div/main/div[3]/div[3]/div[2]/div[2]/div[1]/div[1]/div[5]'))[0]

  if (mainStatDiv == undefined)
    return TIMEOUT++,
      errorCheck(useridentifier, browser, 'mainStats');

  const statNameDiv = await mainStatDiv.$$('span.name')
  const statDataDiv = await mainStatDiv.$$('span.value')
  // -------------------------------------------------------
  const giantStatsdiv = (await page.$x('/html/body/div/div/div[2]/div[3]/div/main/div[3]/div[3]/div[2]/div[2]/div[1]/div[1]/div[3]'))[0]

  if (giantStatsdiv == undefined)
    return TIMEOUT++,
      errorCheck(useridentifier, browser, 'gaintStatdiv');

  const giantStatNameDiv = await giantStatsdiv.$$('span.name')
  const giantStatDataDiv = await giantStatsdiv.$$('span.value')
  // -------------------------------------------------------
  const rankStatsdiv = (await page.$x('/html/body/div/div/div[2]/div[3]/div/main/div[3]/div[3]/div[2]/div[1]/div[1]'))[0];

  if (rankStatsdiv == undefined)
    return TIMEOUT++,
      errorCheck(useridentifier, browser, 'rankStatsdiv');

  const rankStatDataDiv = await rankStatsdiv.$$('div.value')
  const rankStatDataSubDiv = await rankStatsdiv.$$('div.subtext')
  // -------------------------------------------------------
  const userImagesdiv = (await page.$x('/html/body/div/div/div[2]/div[3]/div/main/div[3]/div[1]/div[2]/div[1]'))[0]

  if (userImagesdiv == undefined)
    return TIMEOUT++,
      errorCheck(useridentifier, browser, 'userImagesdiv');

  const userImageHander = await userImagesdiv.$$(`img.user-avatar__image`)
  // -------------------------------------------------------
  const userLevelDiv = (await page.$x('/html/body/div/div/div[2]/div[3]/div/main/div[3]/div[3]/div[2]/div[2]/div[1]/div[1]/div[2]/div[2]/div/div[1]/div'))[0]

  if (userLevelDiv == undefined)
    return TIMEOUT++,
      errorCheck(useridentifier, browser, 'userImagesdiv');

  const userLevelHandler = (await userLevelDiv.$$('span.stat__value'))

  const stats = {
    winName: await page.evaluate(element => element.textContent, statNameDiv[0]),
    winData: await page.evaluate(element => element.textContent, statDataDiv[0]),

    killsName: await page.evaluate(element => element.textContent, statNameDiv[3]),
    killsData: await page.evaluate(element => element.textContent, statDataDiv[3]),

    clutchName: await page.evaluate(element => element.textContent, statNameDiv[9]),
    clutchData: await page.evaluate(element => element.textContent, statDataDiv[9]),

    kdName: await page.evaluate(element => element.textContent, giantStatNameDiv[1]),
    kdData: await page.evaluate(element => element.textContent, giantStatDataDiv[1]),

    hsName: await page.evaluate(element => element.textContent, giantStatNameDiv[2]),
    hsData: await page.evaluate(element => element.textContent, giantStatDataDiv[2]),

    wrName: await page.evaluate(element => element.textContent, giantStatNameDiv[3]),
    wrData: await page.evaluate(element => element.textContent, giantStatDataDiv[3]),

    rankData: await page.evaluate(element => element.textContent, rankStatDataDiv[0]),
    rankPeakData: `
        ${await page.evaluate(element => element.textContent, rankStatDataDiv[1])} in 
        ${await page.evaluate(element => element.textContent, rankStatDataSubDiv[1])}`,

    displayName: `
        ${useridentifier[0]} #${useridentifier[1]} | Level: ${await page.evaluate(element => element.textContent, userLevelHandler[1])}`,

    userimage: await page.evaluate(element => element.getAttribute('src'), userImageHander[0]),

    userUrl: `https://tracker.gg/valorant/profile/riot/${userToSearch(useridentifier)}/overview`
  }

  TIMEOUTUPDATED = false

  await browser.close();
  return stats;
}

async function errorCheck(useridentifier, browser, error) {
  return getUserDataCurrent(useridentifier),
      await browser.close(),
      console.log(`Attempting again ${error}`)
}

module.exports = {
  getUserDataCurrent,
}

