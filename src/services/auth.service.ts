import { Injectable, UnauthorizedException, HttpException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly http: HttpService
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.prismaService.user.findUnique({where: { email: email }})
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { userId: user.id, username: user.email, userOccupation: user.occupation };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInOCPP(): Promise<any> {

    const body = new URLSearchParams({
      grant_type: process.env.OCPP_GRANT_TYPE || 'password',
      username: process.env.OCPP_USER || 'demo',
      password: process.env.OCPP_PASSWORD || 'demo',
    });

    try {
      const { data } = await firstValueFrom(
        this.http.post('https://ocpp-css.com/oauth2/token', body.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json, text/plain, */*',
          },
        }),
      );
      return data;
    } catch (err) {
      const e = err as AxiosError;
      const status = e.response?.status ?? 500;
      const payload = e.response?.data ?? e.message;
      throw new HttpException(
        { message: 'OCPP sign-in failed', details: payload },
        status,
      );
    }
  }
}