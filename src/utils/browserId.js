
const STORAGE_KEY = 'wanderwise_browser_id'

export function getBrowserId() {
  let browserId = localStorage.getItem(STORAGE_KEY)

  if (!browserId) {
    browserId = crypto.randomUUID()

    localStorage.setItem(STORAGE_KEY, browserId)
  }

  return browserId
}
