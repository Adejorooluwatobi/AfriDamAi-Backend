import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishlistService } from 'src/domain/services/wishlist.service';
import { CreateWishlistItemDto } from 'src/application/DTOs/wishlists/create-wishlist-item.dto';
import { WishlistResponseDto } from 'src/application/DTOs/wishlists/wishlist-response.dto';
import { WishlistResponseMapper } from 'src/infrastructure/mappers/wishlist-response.mapper';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}

    /**
     * Create a new wishlist for the logged-in user
     * Creates a wishlist if one doesn't exist
     */
    @Post()
    @ApiOperation({ summary: 'Create a new wishlist for the current user' })
    @ApiResponse({ status: 201, description: 'Wishlist created successfully', type: WishlistResponseDto })
    async create(@Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        const wishlist = await this.wishlistService.createWishlist({ userId: userInfo.id }, userInfo.id, userInfo.type);
        return {
            succeeded: true,
            message: 'Wishlist created successfully',
            resultData: WishlistResponseMapper.toResponseDto(wishlist)
        };
    }

    /**
     * Get the current user's wishlist with all items and product details
     * This is the main endpoint to fetch user's wishlist when they login
     */
    @Get('me')
    @ApiOperation({ summary: 'Get my wishlist with all items and product details' })
    @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully', type: WishlistResponseDto })
    async getMyWishlist(@Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        const wishlist = await this.wishlistService.getWishlistByUserId(userInfo.id);
        
        if (!wishlist) {
            return {
                succeeded: true,
                message: 'You do not have a wishlist yet',
                resultData: {
                    id: null,
                    userId: userInfo.id,
                    items: [],
                    totalItems: 0,
                    createdAt: null,
                    updatedAt: null
                }
            };
        }

        return {
            succeeded: true,
            message: 'Wishlist retrieved successfully',
            resultData: WishlistResponseMapper.toResponseDto(wishlist)
        };
    }

    /**
     * Get wishlist by ID (only owner can access)
     * For fetching a specific wishlist
     */
    @Get(':id')
    @ApiOperation({ summary: 'Get wishlist by ID (only owner can access)' })
    @ApiParam({ name: 'id', description: 'Wishlist ID' })
    @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully', type: WishlistResponseDto })
    async getWishlist(@Param('id') id: string, @Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        const wishlist = await this.wishlistService.getWishlistById(id, userInfo.id);
        
        if (!wishlist) {
            throw new Error('Wishlist not found');
        }

        return {
            succeeded: true,
            message: 'Wishlist retrieved successfully',
            resultData: WishlistResponseMapper.toResponseDto(wishlist)
        };
    }

    /**
     * Add a product to the user's wishlist
     */
    @Put(':id/additem')
    @ApiOperation({ summary: 'Add item to wishlist' })
    @ApiBody({ type: CreateWishlistItemDto })
    @ApiParam({ name: 'id', description: 'Product id' })
    @ApiResponse({ status: 200, description: 'Item added to wishlist successfully', type: WishlistResponseDto })
    async addItem(@Param('id') productId: string, @Body() dto: CreateWishlistItemDto, @Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        const updatedWishlist = await this.wishlistService.addItemToWishlist({
            productId: productId,
        }, userInfo.id);
        
        return {
            succeeded: true,
            message: 'Item added to wishlist successfully',
            resultData: WishlistResponseMapper.toResponseDto(updatedWishlist)
        };
    }

    /**
     * Remove a product from the user's wishlist
     */
    @Put(':id/removeitem')
    @ApiOperation({ summary: 'Remove item from wishlist' })
    @ApiBody({ type: CreateWishlistItemDto })
    @ApiParam({ name: 'id', description: 'Product id' })
    @ApiResponse({ status: 200, description: 'Item removed from wishlist successfully', type: WishlistResponseDto })
    async removeItem(@Param('id') productId: string, @Body() dto: CreateWishlistItemDto, @Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        const updatedWishlist = await this.wishlistService.removeItemFromWishlist({
            productId: productId,
        }, userInfo.id);
        
        return {
            succeeded: true,
            message: 'Item removed from wishlist successfully',
            resultData: WishlistResponseMapper.toResponseDto(updatedWishlist)
        };
    }

    /**
     * Clear all items from the user's wishlist
     */
    @Delete(':id/clear')
    @ApiOperation({ summary: 'Clear all items from wishlist' })
    @ApiParam({ name: 'id', description: 'Wishlist ID' })
    @ApiResponse({ status: 201, description: 'Wishlist cleared successfully', type: WishlistResponseDto })
    async clearWishlist(@Param('id') id: string, @Request() req: Record<string, unknown>) {
        const userInfo = this.extractUserId(req.user as Record<string, unknown>);
        
        // Verify ownership
        const wishlist = await this.wishlistService.getWishlistById(id, userInfo.id);
        if (!wishlist) {
            return {
                succeeded: false,
                message: 'Wishlist not found',
                resultData: null
            };
        }

        await this.wishlistService.clearWishlist(id);
        
        return {
            succeeded: true,
            message: 'Wishlist cleared successfully',
            resultData: { 
                id, 
                items: [],
                totalItems: 0
            }
        };
    }

    /**
     * Extract user ID and type from JWT token
     */
    private extractUserId(user: Record<string, unknown>): { id: string; type: string } {
        const userObj = user as Record<string, unknown>;
        if (userObj.user) {
            const userSubObj = userObj.user as Record<string, unknown>;
            if (userSubObj.id) {
                return { id: userSubObj.id as string, type: 'user' };
            }
        }
        throw new Error('User ID not found in token');
    }
}