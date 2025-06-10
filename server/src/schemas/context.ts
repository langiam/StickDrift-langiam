export interface Context {
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
}

export interface ContextUser {
  _id: string;
  name: string;
  email: string;
}