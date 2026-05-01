import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private otps = new Map<string, string>(); // Mock Redis

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async requestOtp(phone: string) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    this.otps.set(phone, otp);

    console.log(`[OTP] Sent code ${otp} to phone ${phone}`); // Mock SMS

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string) {
    const savedOtp = this.otps.get(phone);

    if (!savedOtp || savedOtp !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    this.otps.delete(phone);

    const user = await this.usersService.findOrCreateByPhone(phone);

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
