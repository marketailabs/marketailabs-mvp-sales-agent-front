export type CreateSanityUserInput = {
  name?: string | null;
  email?: string | null;
};

export type CreateSanityUserResult = {
  success: boolean;
  message?: string;
  userId?: string;
};
