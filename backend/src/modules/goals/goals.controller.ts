import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
    constructor(private readonly goalsService: GoalsService) { }

    @Get()
    async getGoals(@CurrentUser() user: any) {
        return this.goalsService.getGoals(user.id);
    }

    @Post()
    async createGoal(@CurrentUser() user: any, @Body() body: any) {
        return this.goalsService.createGoal(user.id, body);
    }

    @Post(':id/add-savings')
    async addSavings(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body('amount') amount: number
    ) {
        return this.goalsService.addSavings(user.id, id, amount);
    }

    @Post(':id/withdraw')
    async withdraw(
        @CurrentUser() user: any,
        @Param('id') id: string,
        @Body('amount') amount: number
    ) {
        return this.goalsService.withdrawFunds(user.id, id, amount);
    }
}
