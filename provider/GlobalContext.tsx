"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GlobalContextType, PaymentsPlan } from "@/types/globalContextTypes";
import {
  changeTitleAction,
  getChatsAction,
  getSanityUserAction,
} from "@/actions/userAction";
import { updateChatAction } from "@/actions/chatActions";
import { getPrices } from "@/actions/payment-actions";

export const GlobalContext = createContext<GlobalContextType>({
  isLoggedIn: false,
  isSidebarOpen: false,
  setIsSidebarOpen: () => {},
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
  const { data: session, status } = useSession();
  const [sanityUser, setSanityUser] = useState({
    credits: 0,
    email: "",
    token: "",
    _id: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
  const getChats = async () => {
    const chats = await getChatsAction(session?.user?.email!);
    setChats(chats);
  };

  // Funcion para actualizar el chat
  const handleUpdateChatDate = async (chatId: string) => {
    await updateChatAction(chatId);
    getChats();
  };

  // Funciones para cambiar el título y eliminar un chat
  const handleSaveTitle = async ({
    chatId,
    title,
  }: {
    chatId: string;
    title: string | null;
  }) => {
    if (title) {
      await changeTitleAction(chatId, title);
    }

    getChats();
  };

  // Obtener el usuario de Sanity
  const getSanityUser = async () => {
    try {
      const user = await getSanityUserAction(session?.user?.email!);
      setSanityUser(user);
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
    if (status === "authenticated" && session) {
      setIsLoggedIn(true);
      getSanityUser();
      getChats();
      getPaymentsPlan();
    }
  }, [session, status]);

  // Valor del contexto
  const value = {
    isLoggedIn,
    isSidebarOpen,
    setIsSidebarOpen,
    sanityUser,
    chats,
    getChats,
    handleSaveTitle,
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
