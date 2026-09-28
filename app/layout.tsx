export const metadata = {
  title: 'Aboud Cars',
  description: 'معرض سيارات فخم في دمشق',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#0A0A0C] text-white">{children}</body>
    </html>
  )
}
