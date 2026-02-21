import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <section className="prose max-w-none">
          <h1>Welcome to Student Marketplace</h1>
          <p>This is a minimal, migration-ready frontend scaffold using Next.js 14, TypeScript, and Tailwind CSS.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
