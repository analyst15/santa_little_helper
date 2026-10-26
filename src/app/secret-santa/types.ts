export type Participant = {
  id: string;
  name: string;
  email: string;
  wishlistUrl?: string;
};

export type Assignment = {
  giver: string;
  recipient: string;
};
