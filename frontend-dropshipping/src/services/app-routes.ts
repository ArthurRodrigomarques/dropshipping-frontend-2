export const APP_ROUTES = {
    private: {
        cart: {
            name: "/cart",
            admin: "/admin",
            AdminProducts: "/admin/adminproducts",
            postProduct: "/admin/adminproducts/postproduct",
        },
        unauthorized: {
            name: '/unauthorized'
        }
    },
    public: {
        dashboard: '/',
        createaccount: "/createAccount",
        login: "/login"
    }
}