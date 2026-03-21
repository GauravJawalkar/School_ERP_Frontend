import { z } from 'zod';

export const schoolSchema = z.object(
    {
        schoolName: z.string().min(3, "School Name must be atleast 3 characters"),
        primaryEmail: z.email('Enter a valid email address'),
        main_phone: z
            .string()
            .min(1, 'Phone number is required')
            .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
        city: z.string().min(2, "City is required"),
        state: z.string().min(2, "State is required"),
        instituteLogo: z
            .any()
            .refine((file) => !!file, 'Logo is required')
            .refine(
                (file) => ['image/png', 'image/jpeg', 'image/jpg'].includes(file?.type),
                'Only PNG or JPG allowed'
            )
            .refine(
                (file) => file?.size <= 2 * 1024 * 1024,
                'Max size is 2MB'
            ),
        affiliationNumber: z.string(),
        website: z
            .string()
            .min(1, 'Website is required')
            .regex(/^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/, 'Enter a valid website URL'),
        address: z.string(),
        landmark: z.string(),
        office_hours_Mon_Fri: z.string().min(1, 'Office hours are required'),
        office_hours_Sat: z.string().min(1, 'Saturday hours are required'),
        pincode: z.string().trim().length(6, "Pincode must be 6 digits").regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
    }
)

export type SchoolSchemaFormValues = z.infer<typeof schoolSchema>