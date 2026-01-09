import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser() user: any) {
        return this.usersService.getProfile(user.id);
    }

    @Patch('profile')
    async updateProfile(@CurrentUser() user: any, @Body() updateData: any) {
        return this.usersService.updateProfile(user.id, updateData);
    }

    @Patch('link-upi')
    async linkUpi(@CurrentUser() user: any, @Body('upi_id') upiId: string) {
        return this.usersService.linkUpi(user.id, upiId);
    }
}
