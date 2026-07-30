import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const expected = process.env.API_KEY;
    const key = req.headers['x-api-key'];

    console.log('ENV KEY:', expected);
    console.log('REQ KEY:', key);

    if (!expected) {
      console.warn(
        '[ApiKeyGuard] API_KEY belum di-set — semua request ditembus tanpa cek key!',
      );
      return true;
    }

    if (key !== expected) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}