import { prisma } from './prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || UserRole.GENERAL_MEMBER,
    },
  });

  return { id: user.id, email: user.email };
}

export async function loginUser(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(data.password, user.password);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
    },
  };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: UserRole;
    };
  } catch {
    return null;
  }
}

export function getAuthUserId(): string | null {
  // This will be used in server components
  // Actual implementation depends on how you handle sessions
  return null;
}
