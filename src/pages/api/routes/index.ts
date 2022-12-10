import { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, lstatSync } from 'fs';
import path from 'path';
import prisma from '../../../helper/prisma';
import { upperFirst, toKebabCase } from "../../../helper/utility";
import { groupBy } from "elements";
import { RoleRoutes } from "@prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const routes = await readAllRoutes();
    if(req.query.groupId) {
        const grouped = groupBy<RoleRoutes>(routes, "groupId");
        return res.json(grouped[req.query.groupId as string]);
    }
    return res.json(routes);
}

export const readAllRoutes = async () => {
    console.log('routes')
    const root = path.resolve(process.cwd(), "src", "pages");

    const ignoreRoute = ['api', '_document.tsx', '_app.tsx', 'routes.tsx'];

    const processItem = async (route: string, prefix: string, group = ""): Promise<any> => {

        if (ignoreRoute.includes(route)) return null;

        if (lstatSync(path.resolve(prefix, route)).isDirectory()) {
            if (!group) await getOrCreateGroup(route);
            const groupRoutes = [];
            for (const r of readdirSync(path.resolve(prefix, route))) {
                groupRoutes.push(await processItem(r, path.resolve(prefix, route), group || toKebabCase(route)))
            }
            return groupRoutes.flat(10).filter(v => v);
        }

        if (path.extname(route) !== ".tsx") return null;

        const link = `${prefix.replace(root, "").replaceAll("\\", "/")}/${route.replace(path.extname(route), "")}`.replace("/index", "");

        return await getOrCreateRoute(link, group)
    }

    await getOrCreateGroup("root")
    
    const processedItems = [];
    for (const route of readdirSync(root)) {
        processedItems.push(await processItem(route, root, ""))
    }

    return processedItems.flat(10).filter(v => v);
}

const getOrCreateRoute = async (link: string, groupId: string | null = null) => {
    let route = await prisma.roleRoutes.findUnique({
        where: { link },
    });
    if (!route) {
        route = await prisma.roleRoutes.create({
            data: {
                link,
                iconName: "",
                title: link,
                roles: "",
                menu: true,
                groupId: groupId || "root",
            }
        })
    }
    route.roles = route.roles.split(",").filter(v => v) as any;
    return route;
}

const getOrCreateGroup = async (groupId: string) => {
    let group = await prisma.routeGroup.findUnique({
        where: { id: toKebabCase(groupId) }
    });

    if (!group) {
        group = await prisma.routeGroup.create({
            data: {
                id: toKebabCase(groupId),
                iconName: "",
                title: upperFirst(groupId),
                roles: "",
                menu: true,
                parentId: null,
            }
        })
    }
    group.roles = group.roles.split(",").filter(v => v) as any;
    return group;
}