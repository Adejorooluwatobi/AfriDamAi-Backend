import { ApiProperty } from "@nestjs/swagger";
import { WalletOwnerType } from "@prisma/client";
import { WalletTransactionEntity } from "./wallet-transaction.entity";
import { WithdrawalRequestEntity } from "./withdrawal-request.entity";

export class Wallet {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ownerId: string;

  @ApiProperty({ enum: WalletOwnerType })
  ownerType: WalletOwnerType;

  @ApiProperty()
  balance: number;

  @ApiProperty({ description: 'Total amount credited to the wallet' })
  totalIn: number;

  @ApiProperty({ description: 'Total amount debited from the wallet' })
  totalOut: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => [WalletTransactionEntity], required: false })
  transactions?: WalletTransactionEntity[];

  @ApiProperty({ type: () => [WithdrawalRequestEntity], required: false })
  withdrawalRequests?: WithdrawalRequestEntity[];

  constructor(partial: Partial<Wallet>) {
    Object.assign(this, partial);
    this.createdAt = this.createdAt || new Date();
    this.updatedAt = this.updatedAt || new Date();
  }
}
