import { APP_ROUTES } from "@/services/app-routes";


export const checkIsPublicRouter = (asPath: string) => {
    const appPublicRoutes = Object.values(APP_ROUTES.public);

    return appPublicRoutes.includes(asPath)
}