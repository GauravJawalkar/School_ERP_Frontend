import { z } from 'zod'

export const loginFormSchema = z.object(
    {
        email: z.email('Enter a valid email address'),
        password: z.string()
    }
)

export type LoginSchemaFormValues = z.infer<typeof loginFormSchema>