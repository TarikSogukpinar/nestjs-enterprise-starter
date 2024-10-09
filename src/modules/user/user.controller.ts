
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, HttpCode, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UserService } from './user.service';


@Controller({ path: 'user', version: '1' })
@ApiTags('User')
@ApiBearerAuth()
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users' })
    @ApiOkResponse({ description: 'User retrieved successfully' })
    @UseGuards(JwtAuthGuard)
    async getALlUsers() {
        return await this.userService.getAllUsers();
    }
}
