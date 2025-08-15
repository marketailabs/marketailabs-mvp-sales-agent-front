import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalProvider } from "@/provider/GlobalContext";
import { SanityLive } from "@/sanity/lib/live";
import { SessionProvider } from "next-auth/react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <GlobalProvider>
        <div className="flex min-h-screen flex-col md:flex-row">
          <Sidebar />
          {children}
        </div>

        <SanityLive />
        <Toaster />
      </GlobalProvider>
    </SessionProvider>
  );
};

export default HomeLayout;
