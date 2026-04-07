import './globals.css'

export const metadata = {
  title: 'Mammoth Holdings — Corporate Structure',
  description: 'Manage entities, ownership splits, and generate legal documents',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
