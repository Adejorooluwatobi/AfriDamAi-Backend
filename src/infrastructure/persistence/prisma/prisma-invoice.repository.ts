import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { InvoiceRepositoryInterface } from '../../../domain/repositories/invoice.repository.interface';
import { InvoiceMapper } from '../../mappers/invoice.mapper';
import { Prisma } from '@prisma/client';
import { InvoiceEntity } from 'src/domain/entities/invoice.entity';

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepositoryInterface {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: any): Promise<InvoiceEntity> {
        try {
            const { items = [], ...invoice } = data;

            const result = await this.prisma.invoice.create({
                data: {
                    ...invoice,
                    items: {
                        create: items.map((i: any) => ({
                            productId: i.productId,
                            description: i.description || 'Product',
                            quantity: i.quantity,
                            unitPrice: i.unitPrice,
                            totalPrice: i.totalPrice,
                        })),
                    },
                },
                include: { items: true },
            });

            return InvoiceMapper.toDomain(result);
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new BadRequestException('Duplicate invoice');
                }
                if (e.code === 'P2003') {
                    throw new BadRequestException(
                        'Invalid orderId or userId (foreign key violation)',
                    );
                }
            }
            throw e;
        }
    }

    async findById(id: string): Promise<InvoiceEntity | null> {
        const result = await this.prisma.invoice.findUnique({
            where: { id },
            include: { items: true },
        });
        return result ? InvoiceMapper.toDomain(result) : null;
    }

    async findByInvoiceNumber(invoiceNumber: string): Promise<InvoiceEntity | null> {
        const result = await this.prisma.invoice.findUnique({
            where: { invoiceNumber },
            include: { items: true },
        });
        return result ? InvoiceMapper.toDomain(result) : null;
    }

    async findByOrderId(orderId: string): Promise<InvoiceEntity | null> {
        const result = await this.prisma.invoice.findUnique({
            where: { orderId },
            include: { items: true },
        });
        return result ? InvoiceMapper.toDomain(result) : null;
    }

    async findByUserId(userId: string): Promise<InvoiceEntity[]> {
        const results = await this.prisma.invoice.findMany({
            where: { userId },
            include: { items: true },
        });
        return results.map(InvoiceMapper.toDomain);
    }

    async findAll(): Promise<InvoiceEntity[]> {
        const results = await this.prisma.invoice.findMany({
            include: { items: true },
        });
        return results.map(InvoiceMapper.toDomain);
    }

    async update(id: string, data: any): Promise<InvoiceEntity> {
        const result = await this.prisma.invoice.update({
            where: { id },
            data,
            include: { items: true },
        });
        return InvoiceMapper.toDomain(result);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.invoice.delete({ where: { id } });
    }
}
