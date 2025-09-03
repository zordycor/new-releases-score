import { PLATFORMS_URLS, FILMAFFINITY_HOME_URL } from './constants.js'
import { setStealthMode, getPlatformReleasesIds, acceptCookies } from './browserFunctions.js'

(async () => {
  const browser = await setStealthMode()
  const page = await browser.newPage()

  await page.goto(FILMAFFINITY_HOME_URL)
  await acceptCookies(page)

  const platformReleasesIds = await getPlatformReleasesIds(page, 'netflix')

  console.log(platformReleasesIds)

  await browser.close()
})()
