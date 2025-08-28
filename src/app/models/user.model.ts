export interface UserModel {
  uid: string;
  email?: string;
  displayName?: string;
  role?: 'user' | 'sales' | 'manager';
  password?: string;
}
