import CreateLead from '../../../components/Lead/CreateLead/CreateLead'
import { NextPage } from 'next';
import { Roles } from '../../../constant/app';
import { useProtectedRoute } from '../../../hooks/useRouteProtections';
import { useRouter } from 'next/router';


const LeadUpdate: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    return <CreateLead leadId={id as string}/>
};

export default LeadUpdate;