import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../helper/prisma';
import { readAllRoutes } from ".";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // Generate routes or update in case of not generated previously
    await readAllRoutes();

    const groups = (await prisma.routeGroup.findMany({include:{children: true, parent: true, routes: true}})).map(group => {
        return {
            ...group,
            roles: group.roles.split(",").filter(v => v) as any,
            routes: group.routes.map(route => ({
                ...route,
                roles: route.roles.split(",").filter(v => v) as any
            }))
        };
    })
    
    return res.json(groups);
}