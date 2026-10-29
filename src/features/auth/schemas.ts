import { z } from 'zod';

const email = z.string().trim().toLowerCase().pipe(z.email('Ingresá un email válido.'));

// 6 es el mínimo que exige Supabase Auth en el servidor; 72 es el límite de bcrypt.
export const passwordSchema = z
  .string()
  .min(6, 'Mínimo 6 caracteres.')
  .max(72, 'Máximo 72 caracteres.');

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Ingresá tu contraseña.'),
});

export const signUpSchema = z
  .object({
    email,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export const forgotPasswordSchema = z.object({ email });

export const newPasswordSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
  });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type NewPasswordValues = z.infer<typeof newPasswordSchema>;
