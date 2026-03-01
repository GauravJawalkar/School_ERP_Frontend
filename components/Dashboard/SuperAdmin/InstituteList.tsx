import { CanAccess } from '@/components/Auth/CanAccess'

const InstituteList = () => {
    return (
        <CanAccess permission='saas.institute.create'>
            <div>InstituteList Rendering as per access</div>
        </CanAccess>
    )
}

export default InstituteList