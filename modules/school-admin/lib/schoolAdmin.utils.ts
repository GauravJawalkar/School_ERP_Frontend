import { SchoolDetails } from "../types/schoolAdmin.types";

/**
 * Maps school details API schema into flat schema required by AddSchoolForm
 */
export const getMappedSchoolData = (schoolDetails?: SchoolDetails | null) => {
    if (!schoolDetails) return null;
    const { contactInfo, additionalInfo, ...rest } = schoolDetails;
    return {
        schoolName: rest.schoolName || "",
        primaryEmail: contactInfo?.emails?.primary || "",
        affiliationNumber: rest.affiliationNumber || "",
        instituteLogo: rest.logoUrl || "",
        medium: rest.medium || "",
        establishedYear: String(additionalInfo?.establishedYear || "") || "",
        main_phone: contactInfo?.main_phone || "",
        website: contactInfo?.website || "",
        city: contactInfo?.address_details?.city || "",
        state: contactInfo?.address_details?.state || "",
        address: rest.address || "",
        landmark: contactInfo?.address_details?.landmark || "",
        office_hours_Mon_Fri: contactInfo?.office_hours?.monday_to_friday || "",
        office_hours_Sat: contactInfo?.office_hours?.saturday || "",
        pincode: contactInfo?.address_details?.pincode || "",
        founderName: additionalInfo?.founderName || "",
        missionStatement: additionalInfo?.missionStatement || "",
        visionStatement: additionalInfo?.visionStatement || "",
        coreValues: additionalInfo?.coreValues || [],
        tags: additionalInfo?.tags || [],
        boardsAffiliated: additionalInfo?.boardsAffiliated || [],
        notableAlumni: additionalInfo?.notableAlumni || [],
    };
};
