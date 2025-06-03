import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}

      <SanityLive />
      <Toaster />
    </>
  );
};

export default HomeLayout;
