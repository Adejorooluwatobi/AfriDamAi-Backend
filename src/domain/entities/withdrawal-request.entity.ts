import { ApiProperty } from "@nestjs/swagger";
import { WithdrawalStatus, WalletOwnerType } from "@prisma/client";
import { Wallet } from "./wallet.entity";

export class WithdrawalRequestEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  walletId: string;

  @ApiProperty({ type: () => Wallet })
  wallet?: Wallet;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: WithdrawalStatus })
  status: WithdrawalStatus;

  @ApiProperty()
  requestedById: string;

  @ApiProperty({ enum: WalletOwnerType })
  requestedByType: WalletOwnerType;

  @ApiProperty({ required: false })
  approvedById?: string;

  @ApiProperty()
  requestedAt: Date;

  @ApiProperty({ required: false })
  approvedAt?: Date;

  @ApiProperty({ required: false })
  paidAt?: Date;

  @ApiProperty({ required: false })
  adminNotes?: string;

  constructor(partial: Partial<WithdrawalRequestEntity>) {
    Object.assign(this, partial);
    this.requestedAt = this.requestedAt || new Date();
  }
}
