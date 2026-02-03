import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private dashboardService: DashboardService) { }

    @Get('summary')
    async getDashboardSummary(@CurrentUser() user: any) {
        return this.dashboardService.getDashboardData(user.id);
    }
}
