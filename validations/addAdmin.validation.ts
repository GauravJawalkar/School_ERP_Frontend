import z from "zod";

export const addAdminSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.email('Enter a valid email address'),
    instituteId: z.number({ error: 'Institute is required' }),
    phone: z.string().min(1, 'Phone number is required').regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    gender: z.string().refine(
        (val): val is 'Male' | 'Female' | 'Other' => ['Male', 'Female', 'Other'].includes(val),
        { message: 'Gender is required' }
    ),                                     // ✅ optional so undefined default works
    password: z.string().min(6, 'Password must be at least 6 characters'),
    isActive: z.boolean(),
    roleName: z.string().min(1, 'Role name is required'),
});

export type AddAdminSchemaFormValues = z.infer<typeof addAdminSchema>