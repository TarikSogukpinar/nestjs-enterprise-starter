
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guard';


@Controller('user')
export class UserController {

    @Get('me')
    async getFullAccess(user: any): Promise<any> {
        return {
            message: 'Profile retrieved successfully',
            user,
        };
    }
}
