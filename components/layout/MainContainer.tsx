import { LogoComponent } from "../LogoComponent";
import { PaymentDialog } from "./PaymentDialog";
import { ProfileDialog } from "./ProfileDialog";

export const MainContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <main
      className={`flex-1 relative font-sans mt-4 md:mt-0 md:ml-17 ${className}`}
    >
      {/* Modals */}
      <ProfileDialog />
      <PaymentDialog />

      {/* Logo */}
      <div className="absolute top-1 right-2 hidden md:flex items-end p-4">
        <LogoComponent />
      </div>

      {/* Content */}
      {children}
    </main>
  );
};
