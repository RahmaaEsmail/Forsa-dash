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


   // purchase
   get_purchase_request :"purchase-requests",
   payment_terms: "payment-terms",
   rfqs: "rfqs",

   // suppliers
   supplier:"suppliers",

   // categories
   categories :"categories",

   // units
   units :"units",

   // customers
   customers: "customers",

   // currencies
   currencies: "currencies",

   // settings
   list_settings:"settings",

   // customer payment
   list_customer_payment:"customer-payments",

   // notifications
   notifications: "notifications",
   unread_notifications_count: "notifications/unread-count",
   mark_all_notifications_read: "notifications/mark-all-read",
   mark_notification_read: "notifications/:id/mark-read",
  
   // users
   users:"users",

   // roles
   roles: "roles",
   permissions: "permissions",

   // quotations
   quotations_list:"quotations",

   // delivery_notes:
   delivery_notes:'delivery-notes',

   // delivery_types
   deliver_types:"delivery-types",

   // GRNS
   grns:"grns",

   // payment_terms

   // customer_invoices
   get_customer_invoices :"customer-invoices",

   // activity logs
   get_activity:"activity-logs",
   get_activity_mentions:"activity-logs/my-mentions",
   add_comment:"activity-logs/comments",
   

}
