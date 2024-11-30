import localFont from 'next/font/local'

export const netflixSans = localFont({
  src: [
    {
      path: '../fonts/regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/blk.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-netflix-sans'
})

export const netflixIcon = localFont({
  src: '../fonts/icon.woff',
  variable: '--font-netflix-icon'
})

export const geistMono = localFont({
  src: '../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono'
})

export const geist = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist'
})

