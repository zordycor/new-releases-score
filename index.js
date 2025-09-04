import { FILMAFFINITY_HOME_URL } from './constants.js'
import { setStealthMode, getNewReleaseData, getLast20PlatformReleasesIds, acceptCookies } from './browserFunctions.js'

(async () => {
  const browser = await setStealthMode()
  const page = await browser.newPage()

  await page.goto(FILMAFFINITY_HOME_URL)
  await acceptCookies(page)

  const platformReleasesIds = await getLast20PlatformReleasesIds(page, 'netflix')
  const netflixReleases = []

  for (let index = 0; index < platformReleasesIds.netflix.length; index++) {
    const releaseId = platformReleasesIds.netflix[index]
    const releaseData = await getNewReleaseData(page, releaseId)
    netflixReleases.push(releaseData)
  }

  const sortedNetflixReleases = netflixReleases.sort((a, b) => b.movieScore - a.movieScore)
  const bestReleases = sortedNetflixReleases.filter(release => +release.movieScore > 6.5)
  console.log(bestReleases)

  await browser.close()
})()
