import "./global.css";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <header className="sticky top-0 z-40 w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="font-semibold">Electricity PME</div>
          </div>
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}
