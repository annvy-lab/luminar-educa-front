import Footer from "@/src/_components/common/footer";
import Navbar from "@/src/_components/common/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
