export default function Footer() {
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const years =
    startYear === currentYear
      ? `${currentYear}`
      : `${startYear}–${currentYear}`;

  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600 dark:text-gray-400 flex justify-center">
        <div>© {years} WebELC · Christophe</div>
      </div>
    </footer>
  );
}
