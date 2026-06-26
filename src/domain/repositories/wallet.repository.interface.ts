import { Wallet } from "../entities/wallet.entity";
import { WalletOwnerType } from "@prisma/client";

export interface IWalletRepository {
  create(ownerId: string, ownerType: WalletOwnerType, initialBalance?: number): Promise<Wallet>;
  findById(id: string): Promise<Wallet | null>;
  findByOwnerIdAndType(ownerId: string, ownerType: WalletOwnerType): Promise<Wallet | null>;
  findAllByOwnerType(ownerType: WalletOwnerType): Promise<Wallet[]>;
  updateBalance(id: string, amount: number): Promise<Wallet>; // amount can be positive (credit) or negative (debit)
  update(id: string, data: Partial<Wallet>): Promise<Wallet>;
  delete(id: string): Promise<void>;
}
