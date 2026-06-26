import { ApiProperty } from "@nestjs/swagger";
import { WalletTransactionType, WalletRelatedEntityType } from "@prisma/client";
import { Wallet } from "./wallet.entity";

export class WalletTransactionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  walletId: string;

  @ApiProperty({ type: () => Wallet })
  wallet?: Wallet;

  @ApiProperty({ enum: WalletTransactionType })
  type: WalletTransactionType;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  relatedEntityId?: string;

  @ApiProperty({ enum: WalletRelatedEntityType, required: false })
  relatedEntityType?: WalletRelatedEntityType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<WalletTransactionEntity>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
}
