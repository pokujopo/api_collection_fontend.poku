export function isValidUrl(str) {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function detectPlatform(url) {
  if (!url) return null
  const lower = url.toLowerCase()
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'YouTube'
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X (Twitter)'
  if (lower.includes('instagram.com')) return 'Instagram'
  if (lower.includes('tiktok.com')) return 'TikTok'
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'Facebook'
  if (lower.includes('vimeo.com')) return 'Vimeo'
  if (lower.includes('twitch.tv')) return 'Twitch'
  if (lower.includes('reddit.com')) return 'Reddit'
  if (lower.includes('dailymotion.com')) return 'Dailymotion'
  if (lower.includes('soundcloud.com')) return 'SoundCloud'
  return 'Web'
}

export function getPlatformColor(platform) {
  const colors = {
    YouTube: '#FF0000',
    'X (Twitter)': '#1DA1F2',
    Instagram: '#E1306C',
    TikTok: '#00f2ea',
    Facebook: '#1877F2',
    Vimeo: '#1AB7EA',
    Twitch: '#9146FF',
    Reddit: '#FF4500',
    Dailymotion: '#0066DC',
    SoundCloud: '#FF7700',
    Web: '#00ff88',
  }
  return colors[platform] || '#00ff88'
}

export function truncateUrl(url, maxLen = 60) {
  if (!url || url.length <= maxLen) return url
  return url.slice(0, maxLen) + '...'
}
