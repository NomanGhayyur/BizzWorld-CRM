import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../helper/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== 'PUT') return res.status(405).send({ message: 'Method is not POST' })
    
    const { roles, title, iconName, menu, link, groupId } = req.body;
    
    const data = {
        roles: (roles || []).join(",") || "",
        link,
        title,
        iconName,
        groupId,
        menu
    }

    return res.json(await prisma.roleRoutes.upsert({ where: { link }, update: { ...data }, create: { ...data } }))
}