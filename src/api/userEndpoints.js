export const userEndpoints = {
   // auth
   login:"auth/login",
   logout:"auth/logout",
   refresh_token:"auth/refresh",
   get_current_user:"auth/me",

   // products
   get_products:"products",
   add_product:"products",
   active_status:"products/1/toggle-active",
}