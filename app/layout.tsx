import './globals.css'

export const metadata = {
  title: 'Aboud Cars | عبود للسيارات',
  description: 'معرض سيارات فخم في دمشق',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-zinc-950 text-white antialiased">{children}</body>
    </html>
  )
}
