import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly supabaseService: SupabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            throw new UnauthorizedException('Invalid token format');
        }

        try {
            const supabase = this.supabaseService.getClient();
            const { data, error } = await supabase.auth.getUser(token);

            if (error || !data.user) {
                throw new UnauthorizedException('Invalid token');
            }

            // Attach user to request
            request.user = data.user;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Could not validate token');
        }
    }
}
