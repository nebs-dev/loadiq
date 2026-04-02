import { AosProvider } from "@/components/providers/aos-provider";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <AosProvider>
        <main className="relative flex grow flex-col">{children}</main>
      </AosProvider>
      <Footer />
    </>
  );
}
