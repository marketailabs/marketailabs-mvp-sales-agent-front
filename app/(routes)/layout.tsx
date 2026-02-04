import { AlertPaymentWrapper } from "@/components/layout/AlertPaymentWrapper";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { GlobalProvider } from "@/provider/GlobalContext";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {children}

          <Footer />
        </div>
      </div>

      <AlertPaymentWrapper />

      <SanityLive />
      <Toaster />

      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </GlobalProvider>
  );
};

export default HomeLayout;
