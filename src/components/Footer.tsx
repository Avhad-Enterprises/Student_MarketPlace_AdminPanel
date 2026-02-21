export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container py-6 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} Student Marketplace</div>
          <div>Built for migration</div>
        </div>
      </div>
    </footer>
  );
}
