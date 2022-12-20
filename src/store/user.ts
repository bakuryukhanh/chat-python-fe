import create from "zustand";

export type TUser = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: TUser | null;
  setUser: (user: TUser) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: TUser) => set({ user }),
  signOut: () => set({ user: null }),
}));
