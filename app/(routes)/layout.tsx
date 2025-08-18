import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalProvider } from "@/provider/GlobalContext";
import { SanityLive } from "@/sanity/lib/live";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 flex flex-col md:ml-17">
          {children}

          <Footer />
        </div>
      </div>

      <SanityLive />
      <Toaster />
    </GlobalProvider>
  );
};

export default HomeLayout;
