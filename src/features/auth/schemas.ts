import { z } from 'zod';

import { getStrings } from '@/i18n';

import { authStrings } from './strings';

// Los mensajes se resuelven al validar (no al cargar el módulo) para seguir el idioma de la interfaz.
const v = () => getStrings(authStrings).validation;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: () => v().invalidEmail }));

// 6 es el mínimo que exige Supabase Auth en el servidor; 72 es el límite de bcrypt.
export const passwordSchema = z
  .string()
  .min(6, { error: () => v().passwordMin })
  .max(72, { error: () => v().passwordMax });

export const signInSchema = z.object({
  email,
  password: z.string().min(1, { error: () => v().passwordRequired }),
});

export const signUpSchema = z
  .object({
    email,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((x) => x.password === x.confirmPassword, {
    path: ['confirmPassword'],
    error: () => v().passwordsDontMatch,
  });

export const forgotPasswordSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((x) => x.password === x.confirmPassword, {
    path: ['confirmPassword'],
    error: () => v().passwordsDontMatch,
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
