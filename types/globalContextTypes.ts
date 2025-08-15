export type GlobalContextType = {
  isLoggedIn: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  sanityUser: SanityUser;
  chats:
    | {
        id: string;
        title: string | null;
        updatedAt: Date;
      }[];
  getChats: () => Promise<void>;
  handleUpdateChatDate: (chatId: string) => Promise<void>;
  handleSaveTitle: ({
    chatId,
    title,
  }: {
    chatId: string;
    title: string | null;
  }) => Promise<void>;

  // Modals states
  openLoginModal: boolean;
  openPaymentModal: boolean;
  openProfileModal: boolean;
  setOpenLoginModal: (open: boolean) => void;
  setOpenPaymentModal: (open: boolean) => void;
  setOpenProfileModal: (open: boolean) => void;

  // Planes de pago
  paymentsPlan: PaymentsPlan[];
  getPaymentsPlan: () => Promise<void>;
};

export type PaymentsPlan = {
  _id: string;
  name: string;
  price: number;
  description: string;
  typeOfPlan: string;
  benefits: string[];
  credits: number;
  priceId: string;
};

export type SanityPlan = {
  _id: string;
  name: string;
  price: number;
  description: string;
  typeOfPlan: "mensual" | "un solo pago";
  benefits: string[];
  credits: number;
  priceId: string;
};

export type SanityUser = {
  _id: string;
  credits: number;
  email: string;
  token: string;
  plan?: SanityPlan | null; // null si no tiene plan asignado
};
