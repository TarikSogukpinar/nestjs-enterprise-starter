import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }

    async findByPassword(password: string) {
        return this.userRepository.findByPassword(password);
    }

    async createUser(newUser: any) {
        return this.userRepository.createUser(newUser);
    }
}