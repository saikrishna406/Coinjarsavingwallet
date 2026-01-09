import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, updateData: any): Promise<any>;
    linkUpi(user: any, upiId: string): Promise<any>;
}
