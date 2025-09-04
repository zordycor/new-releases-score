import { PLATFORMS_URLS } from './constants.js'
import { chromium } from 'playwright-extra'
import stealthPlugin from 'puppeteer-extra-plugin-stealth'

export const setStealthMode = async () => {
  // Trick Cloudflare to think we are a human
  const stealth = stealthPlugin()
  chromium.use(stealth)
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    viewport: {
      width: 1280 + Math.floor(Math.random() * 100),
      height: 720 + Math.floor(Math.random() * 100)
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid'
  })

  return context
}

export const getFilmUrl = (movieId) => {
  return `https://www.filmaffinity.com/es/film${movieId}.html`
}

export const acceptCookies = async (page) => {
  const acceptCookiesButton = await page.locator('#accept-btn').first()
  await acceptCookiesButton.click()
}

export const getLast20PlatformReleasesIds = async (page, platform) => {
  await page.goto(PLATFORMS_URLS[platform], { waitUntil: 'domcontentloaded' })

  const newReleasesListElement = await page.locator('.row.row-cols-3.row-cols-md-4.g-3.mb-3.movies-row')

  const releasesArray = []

  for (let i = 0; i < 20; i++) {
    const movieId = await newReleasesListElement.locator('.col').nth(i).getAttribute('data-movie-id')
    releasesArray.push(movieId)
  }

  return { [platform]: releasesArray }
}

export const getNewReleaseData = async (page, movieId) => {
  await page.goto(`https://www.filmaffinity.com/es/film${movieId}.html`, { waitUntil: 'domcontentloaded' })
  const hasScore = await page.locator('#rat-avg-count').isVisible()

  const movieTitle = await page.locator('h1 span').first().textContent()
  const moviePoster = await page.locator('#movie-main-image-container img').getAttribute('src')
  const movieVoteCount = hasScore
    ? await page.locator('#movie-count-rat span').getAttribute('content')
    : '0'
  const movieScore = hasScore
    ? await page.locator('#movie-rat-avg').getAttribute('content')
    : '0'

  return { movieTitle, moviePoster, movieVoteCount, movieScore }
}
