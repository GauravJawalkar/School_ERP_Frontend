import { z } from 'zod';

export const MEDIUM_OPTIONS = [
    'ENGLISH', 'HINDI', 'MARATHI', 'GUJARATI', 'BENGALI',
    'TAMIL', 'TELUGU', 'KANNADA', 'URDU', 'PUNJABI', 'OTHER'
] as const;

export const schoolSchema = z.object({
    // Step 1 — Basic Info
    schoolName: z.string().min(3, "School name must be at least 3 characters"),
    primaryEmail: z.email('Enter a valid email address'),
    affiliationNumber: z.string().min(1, 'Affiliation number is required'),
    instituteLogo: z
        .any()
        .refine((f) => !!f, 'Logo is required')
        .refine((f) => ['image/png', 'image/jpeg', 'image/jpg'].includes(f?.type), 'Only PNG or JPG allowed')
        .refine((f) => f?.size <= 2 * 1024 * 1024, 'Max size is 2MB'),
    medium: z.string().optional(),
    establishedYear: z.string().regex(/^\d{4}$/, 'Enter a valid 4-digit year').optional().or(z.literal('')),

    // Step 2 — Contact & Location
    main_phone: z.string().min(1, 'Phone number is required').regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    website: z.string().min(1, 'Website is required').regex(/^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/, 'Enter a valid website URL'),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    address: z.string().min(1, 'Address is required'),
    landmark: z.string().optional(),

    // Step 3 — Hours & Pincode
    office_hours_Mon_Fri: z.string().min(1, 'Office hours are required'),
    office_hours_Sat: z.string().min(1, 'Saturday hours are required'),
    pincode: z.string().trim().length(6, "Pincode must be 6 digits").regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),

    // Step 4 — Additional Info (all optional)
    founderName: z.string().optional(),
    missionStatement: z.string().optional(),
    visionStatement: z.string().optional(),
    // stored as string[] directly — tag chip input manages the array
    coreValues: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    boardsAffiliated: z.array(z.string()).optional(),
    notableAlumni: z.array(z.string()).optional(),
});

export type SchoolSchemaFormValues = z.infer<typeof schoolSchema>;