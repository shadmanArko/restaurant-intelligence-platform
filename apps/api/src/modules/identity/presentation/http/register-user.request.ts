import { z } from 'zod';

export const registerUserRequestSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(1),
  roleIds: z.array(z.string().uuid()).default([]),
  branchAccess: z
    .array(
      z.object({
        branchId: z.string().uuid(),
        roleIds: z.array(z.string().uuid()).min(1),
      }),
    )
    .default([]),
});

export type RegisterUserRequest = z.infer<typeof registerUserRequestSchema>;
