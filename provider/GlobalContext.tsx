"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useSession } from "next-auth/react";
import { GlobalContextType, PaymentsPlan } from "@/types/globalContextTypes";
import {
  changeTitleAction,
  deleteChatAction,
  getChatsAction,
  getSanityUserAction,
} from "@/actions/userAction";
import { updateChatAction } from "@/actions/chatActions";
import { getPrices } from "@/actions/payment-actions";
import { needsReset } from "@/lib/utils";

export const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
  getSanityUser: async () => {
    return;
  },
  sanityUser: {
    credits: 0,
    email: "",
    token: "",
    _id: "",
    plan: {
      _id: "",
      name: "",
      description: "",
      price: 0,
      credits: 0,
      benefits: [],
      typeOfPlan: "mensual",
      priceId: "",
    },
  },
  chats: [],
  getChats: async () => {
    return;
  },
  handleUpdateChatDate: async () => {
    return;
  },
  handleSaveTitle: async () => {
    return;
  },
  handleDeleteChat: async () => {
    return;
  },
  isPendingChats: false,
  openLoginModal: false,
  openProfileModal: false,
  openPaymentModal: false,
  setOpenLoginModal: () => {},
  setOpenProfileModal: () => {},
  setOpenPaymentModal: () => {},

  // Planes de pago
  paymentsPlan: [],
  getPaymentsPlan: async () => {
    return;
  },
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  // Session
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Sanity
  const [sanityUser, setSanityUser] = useState({
    credits: 0,
    email: "",
    token: "",
    _id: "",
  });

  // UI variable
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Chats
  const [chats, setChats] = useState<
    { id: string; title: string | null; updatedAt: Date }[]
  >([]);

  // Planes de pago
  const [paymentsPlan, setPaymentsPlan] = useState<PaymentsPlan[]>([]);

  // Open Modals states
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  // Obtener los chats
  const [isPendingChats, startTransitionChats] = useTransition();
  const getChats = async () => {
    startTransitionChats(async () => {
      try {
        const chatsData = await getChatsAction(session?.user?.email!);
        setChats(chatsData);
      } catch (err) {
        console.error("Error al obtener chats:", err);
      }
    });
  };

  // Funcion para actualizar el chat
  const handleUpdateChatDate = async (chatId: string) => {
    await updateChatAction(chatId);

    // Local update: solo la fecha
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, updatedAt: new Date() } : c))
    );
  };

  // Funciones para cambiar el título y eliminar un chat
  const handleSaveTitle = async ({
    chatId,
    title,
  }: {
    chatId: string;
    title: string | null;
  }) => {
    if (!title) return;

    await changeTitleAction(chatId, title);

    // Actualizar localmente
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, title } : c))
    );

    // Actualizar en segundo plano
    startTransitionChats(() => getChats());
  };

  const handleDeleteChat = async ({ chatId }: { chatId: string }) => {
    if (!chatId) return;

    const response = await deleteChatAction(chatId);

    if (response.success) {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      startTransitionChats(() => getChats());
    }
  };

  // Obtener el usuario de Sanity
  const getSanityUser = async () => {
    try {
      const user = await getSanityUserAction(session?.user?.email!);

      // 1) Chequear si es free plan
      const FREE_PLAN_ID =
        process.env.NEXT_PUBLIC_FREE_PLAN_ID ||
        "9080a077-b426-478d-9e08-1eeb5fe9ca07";
      const isFreePlan = user?.plan?._id === FREE_PLAN_ID;

      if (isFreePlan && needsReset(user.lastCreditsReset)) {
        // 2) Resetear créditos en backend
        await fetch("/api/reset-credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id,
            planCredits: user?.plan?.credits,
          }),
        });

        console.log("Créditos reseteados");

        // 3) Volver a pedir el user actualizado
        const updatedUser = await getSanityUserAction(session?.user?.email!);
        setSanityUser(updatedUser);
      } else {
        setSanityUser(user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Obtener los planes de pago
  const getPaymentsPlan = async () => {
    const response = await getPrices();
    setPaymentsPlan(response as unknown as PaymentsPlan[]);
  };

  // Efecto para obtener el usuario de Sanity y los chats
  useEffect(() => {
    if (!initialized && status === "authenticated" && session) {
      setInitialized(true);
      setIsLoggedIn(true);
      getSanityUser();
      getChats();
      getPaymentsPlan();
    }
  }, [status, session, initialized]);

  // Valor del contexto
  const value = {
    isLoggedIn,
    isSidebarOpen,
    setIsSidebarOpen,
    sanityUser,
    getSanityUser,
    chats,
    getChats,
    isPendingChats,
    handleSaveTitle,
    handleDeleteChat,
    openLoginModal,
    openProfileModal,
    openPaymentModal,
    setOpenLoginModal,
    setOpenProfileModal,
    setOpenPaymentModal,
    handleUpdateChatDate,

    // Planes de pago
    paymentsPlan,
    getPaymentsPlan,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};
