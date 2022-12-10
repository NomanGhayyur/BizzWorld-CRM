import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ILead } from "../../../model/lead";
import { AppThunkDispatch, RootState } from "../../../redux/types";
import { useInfiniteQuery } from 'react-query';
import { getLeadList } from "../../../api/lead";
import LeadList from "../../../components/Lead/LeadList";
import { IBrand } from "../../../model/brand";

type propTypes = {
    leads?: Array<ILead>;
    className?: string;
    style?: React.CSSProperties;
    // leadId?: ILead['lead_id'];
    brandId?: IBrand['brand_id'];

}

const BrandLeadList = React.memo<propTypes>((props) => {
    const dispatch = useDispatch<AppThunkDispatch>();
    const user = useSelector((store: RootState) => store.auth.user);
    const router = useRouter();

    const brandId: IBrand['brand_id'] = (props.brandId || router.query?.id) as IBrand['brand_id'];

    // const leadId: ILead['lead_id'] = (props.leadId || router.query?.id) as ILead['lead_id'];

    const { data: leads, isLoading } = useInfiniteQuery<ILead>(`LeadList`, async () => {
        const params = {
            data: {
                brand_id: brandId,
            }
        }
        const response = await dispatch(getLeadList(params));
        // return response.data;
        return Object.assign([], response.seniormanager);

        // return Object.assign([], response.seniormanager);
    }, {
        enabled: !props.leads,
    })

    return (
        <LeadList leads={leads?.pages?.flat() || []}/>
    )
});

export default BrandLeadList;