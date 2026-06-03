import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma';
import { generateToken } from '../../utils/jwt';
import { throwBadInput, throwUnauthorized } from '../../utils/errors';
import { SignupInput, LoginInput, signupSchema, loginSchema } from './auth.validation';

export class AuthService {
  async signup(input: SignupInput) {
    const validated = signupSchema.parse(input);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      throwBadInput('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(input: LoginInput) {
    const validated = loginSchema.parse(input);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throwUnauthorized('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(validated.password, user.password);

    if (!validPassword) {
      throwUnauthorized('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }
}

export const authService = new AuthService();
