import {
  HomeIcon,
  Grid2x2Plus,
  LayoutList,
  FileText,
  Box,
  ShoppingCart,
  PlusCircle,
  Users,
  Settings2,
  Bell,
  Shield,
  UsersIcon,
  Truck,
  CreditCard,
  File,
} from "lucide-react"; // Importing more relevant icons
import { lazy } from "react";

const Home = lazy(() => import("@/pages/Home/Home"));
const Products = lazy(() => import("@/pages/Products/Products"));
const Quotations = lazy(() => import("@/pages/Quotations/Quotations"));
const PurchaseRequest = lazy(
  () => import("@/pages/PurchaseRequest/PurchaseRequest"),
);
const AddProduct = lazy(() => import("@/pages/Products/AddProduct"));
const CreateQuotation = lazy(
  () => import("@/pages/Quotations/CreateQuotation"),
);
const CreatePurchaseRequest = lazy(
  () => import("@/pages/PurchaseRequest/CreatePurchaseRequest"),
);
const EditPurchaseRequest = lazy(
  () => import("@/pages/PurchaseRequest/EditPurchaseRequest"),
);
const PurchaseRequestDetails = lazy(
  () => import("@/pages/PurchaseRequest/PurchaseRequestDetails"),
);
const PRRFQs = lazy(() => import("@/pages/PurchaseRequest/PRRFQs"));
const CreateRFQ = lazy(() => import("@/pages/PurchaseRequest/CreateRFQ"));
const RFQDetails = lazy(() => import("@/pages/PurchaseRequest/RFQDetails"));
const RFQs = lazy(() => import("@/pages/RFQs/RFQs"));
const CategorisPage = lazy(() => import("@/pages/Category/Category"));
const CreateCategory = lazy(() => import("@/pages/Category/CreateCategory"));
const UnitsPage = lazy(() => import("@/pages/Units/Units"));
const CreateUnit = lazy(() => import("@/pages/Units/CreateUnit"));
const SuppliersPage = lazy(() => import("@/pages/Supplier/Supplier"));
const ProductDetails = lazy(() => import("@/pages/Products/ProductDetails"));
const AddSupplierPage = lazy(() => import("@/pages/Supplier/AddSupplier"));
const SupplierDetailsPage = lazy(
  () => import("@/pages/Supplier/SupplierDetails"),
);
const CustomersPage = lazy(() => import("@/pages/Customers/Customers"));
const AddCustomerPage = lazy(() => import("@/pages/Customers/AddCustomer"));
const CustomerDetailsPage = lazy(
  () => import("@/pages/Customers/CustomerDetails"),
);
const SettingsPage = lazy(() => import("@/pages/Settings/Settings"));
const NotificationsPage = lazy(
  () => import("@/pages/Notifications/Notifications"),
);
const RolesPage = lazy(() => import("@/pages/Roles/Roles"));
const UsersPage = lazy(() => import("@/pages/Users/Users"));
const QuotationDetails = lazy(
  () => import("@/pages/Quotations/QuotationDetails"),
);
import EditQuotation from "@/pages/Quotations/EditQuotation";
const DeliveryNotes = lazy(() => import("@/pages/DeliveryNotes/DeliveryNotes"));
const CreateDeliveryNote = lazy(
  () => import("@/pages/DeliveryNotes/CreateDeliveryNote"),
);
const EditDeliveryNote = lazy(
  () => import("@/pages/DeliveryNotes/EditDeliveryNote"),
);
const DeliveryNoteDetails = lazy(
  () => import("@/pages/DeliveryNotes/DeliveryNoteDetails"),
);
const DeliveryTypes = lazy(() => import("@/pages/DeliveryNotes/DeliveryTypes"));
const PaymentTerms = lazy(() => import(`@/pages/PaymentTerms/PaymentTerms`));

const GRNs = lazy(() => import("@/pages/GRNs/GRNs"));
const CreateGRN = lazy(() => import("@/pages/GRNs/CreateGRN"));
const EditGRN = lazy(() => import("@/pages/GRNs/EditGRN"));
const GRNDetails = lazy(() => import("@/pages/GRNs/GRNDetails"));

const CustomerInvoices = lazy(
  () => import("@/pages/CustomerInvoices/CustomerInvoices"),
);
const CreateCustomerInvoice = lazy(
  () => import("@/pages/CustomerInvoices/CreateCustomerInvoice"),
);
const CustomerInvoiceDetails = lazy(
  () => import("@/pages/CustomerInvoices/CustomerInvoiceDetails"),
);
const EditCustomerInvoice = lazy(
  () => import("@/pages/CustomerInvoices/EditCustomerInvoice"),
);
export const routesData = [
  {
    id: "home",
    name: "Home",
    index: true,
    path: "/",
    component: Home,
    hidden: false,
    icon: HomeIcon, // Home icon is appropriate for the home page
  },
  {
    id: "edit-quotation",
    name: "Edit Quotation",
    path: "/quotations/:id/edit",
    component: EditQuotation,
    hidden: true,
    permission: "edit_quotations",
  },
  {
    id: "categories",
    name: "Categories",
    path: "/categories",
    component: CategorisPage,
    hidden: false,
    icon: Grid2x2Plus, // Grid icon fits well for Categories (listing/grid view)
    permission: "manage_categories",
  },
  {
    id: 3,
    name: "Categories",
    path: "/create-categories",
    component: CreateCategory,
    hidden: true,
    icon: Grid2x2Plus, // Grid icon fits well for Categories (listing/grid view)
    permission: "manage_categories",
  },
  {
    id: "units",
    name: "Units",
    path: "/units",
    component: UnitsPage,
    hidden: false,
    icon: Box, // Box icon fits products or catalog
    permission: "manage_categories",
  },
  {
    id: "create-units",
    name: "Units",
    path: "/create-unit",
    component: CreateUnit,
    hidden: true,
    icon: Box, // Box icon fits products or catalog
    permission: "manage_categories",
  },
  {
    id: "products",
    name: "Product Catalog",
    path: "/products",
    component: Products,
    hidden: false,
    icon: Box, // Box icon fits products or catalog
    permission: "view_items",
  },
  // {
  //   id: "quoteatio",
  //   name: "Quotations",
  //   path: "/quotations",
  //   component: Quotations,
  //   hidden: false,
  //   active_icon: "/images/ion_pricetags-sharp.svg",
  //   inactive_icon: "/images/ion_pricetags-sharp-gray.svg",
  //   icon: FileText, // File/Document icon fits for Quotations
  // },
  // {
  //   id: "CustomerInvoices",
  //   name: "Customer Invoices",
  //   path: "/customer-invoices",
  //   component: CustomerInvoices,
  //   hidden: false,
  //   icon: File, // File/Document icon fits for Quotations
  // },
  {
    id: "CreateCustomerInvoice",
    name: "CreateCustomerInvoice",
    path: "/create-invoice/:id",
    component: CreateCustomerInvoice,
    hidden: true,
    icon: File, // File/Document icon fits for Quotations
    permission: "create_customer_invoices",
  },
  {
    id: "CustomerInvoiceDetails",
    name: "Customer Invoice Details",
    path: "/customer-invoices/:id/details",
    component: CustomerInvoiceDetails,
    hidden: true,
    permission: "view_customer_invoices",
  },
  {
    id: "EditCustomerInvoice",
    name: "Edit Customer Invoice",
    path: "/customer-invoices/:id/edit",
    component: EditCustomerInvoice,
    hidden: true,
    permission: "edit_customer_invoices",
  },
  {
    id: "create-quote",
    name: "Create Quotation",
    path: "/create_quote",
    component: CreateQuotation,
    hidden: true,
    permission: "create_quotations",
  },
  {
    id: "quotation-details",
    name: "Quotation Details",
    path: "/quotations/:id/details",
    component: QuotationDetails,
    hidden: true,
    permission: "view_quotations",
  },
  // {
  //   id: "delivery-notes",
  //   name: "Delivery Notes",
  //   path: "/delivery-notes",
  //   component: DeliveryNotes,
  //   hidden: false,
  //   icon: Truck,
  // },
  {
    id: "create-delivery-note",
    name: "Create Delivery Note",
    path: "/create-delivery-note/:id",
    component: CreateDeliveryNote,
    hidden: true,
    permission: "create_delivery_orders",
  },
  {
    id: "edit-delivery-note",
    name: "Edit Delivery Note",
    path: "/edit-delivery-note/:id",
    component: EditDeliveryNote,
    hidden: true,
    permission: "edit_delivery_orders",
  },
  {
    id: "delivery-note-details",
    name: "Delivery Note Details",
    path: "/delivery-note-details/:id",
    component: DeliveryNoteDetails,
    hidden: true,
    permission: "view_delivery_orders",
  },
  // {
  //   id: "delivery-types",
  //   name: "Delivery Types",
  //   path: "/delivery-types",
  //   component: DeliveryTypes,
  //   hidden: false,
  //   icon: Truck,
  // },
  {
    id: 5,
    name: "Purchase Request",
    path: "/purchaseRequest",
    component: PurchaseRequest,
    hidden: false,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: ShoppingCart, // Shopping cart icon fits for Purchase Requests
    permission: "view_purchase_requests",
  },

  {
    id: 6,
    name: "Add Product",
    path: "/add_product",
    component: AddProduct,
    hidden: true,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: PlusCircle, // Plus circle for "Add Product"
    permission: "create_items",
  },
  {
    id: "product details",
    name: "Add Product",
    path: "/product-details/:id",
    component: ProductDetails,
    hidden: true,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: PlusCircle, // Plus circle for "Add Product"
    permission: "view_items",
  },
  {
    id: 7,
    name: "Create Purchase Request",
    path: "/create_purchase_request",
    component: CreatePurchaseRequest,
    hidden: true,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: PlusCircle, // Plus circle for "Create Purchase Request"
    permission: "create_purchase_requests",
  },
  {
    id: "edit-purchase-request",
    name: "Edit Purchase Request",
    path: "/edit_purchase_request/:id",
    component: EditPurchaseRequest,
    hidden: true,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: PlusCircle,
    permission: "edit_purchase_requests",
  },
  {
    id: 8,
    name: "Purchase Request Details",
    path: "/purchase_request_details/:id",
    component: PurchaseRequestDetails,
    hidden: true,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: ShoppingCart, // Shopping cart icon can also work for "Purchase Request Details"
    permission: "view_purchase_requests",
  },
  {
    id: "pr-rfqs",
    name: "Purchase Request RFQs",
    path: "/purchase-requests/:prId/rfqs",
    component: PRRFQs,
    hidden: true,
    permission: "view_rfqs",
  },
  {
    id: "create-rfq",
    name: "Create RFQ",
    path: "/purchase-requests/:prId/create-rfq",
    component: CreateRFQ,
    hidden: true,
    permission: "create_rfqs",
  },
  {
    id: "edit-rfq",
    name: "Edit RFQ",
    path: "/rfqs/:rfqId/edit",
    component: CreateRFQ, // Reusing the same component for edit
    hidden: true,
    permission: "edit_rfqs",
  },
  {
    id: "rfq-details",
    name: "RFQ Details",
    path: "/rfqs/:rfqId/details",
    component: RFQDetails,
    hidden: true,
    permission: "view_rfqs",
  },
  {
    id: "rfqs",
    name: "RFQs",
    path: "/rfqs",
    component: RFQs,
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: ShoppingCart,
    permission: "view_rfqs",
  },
  {
    id: "quoteatio",
    name: "Quotations",
    path: "/quotations",
    component: Quotations,
    hidden: false,
    active_icon: "/images/ion_pricetags-sharp.svg",
    inactive_icon: "/images/ion_pricetags-sharp-gray.svg",
    icon: FileText, // File/Document icon fits for Quotations
    permission: "view_quotations",
  },
  {
    id: "CustomerInvoices",
    name: "Customer Invoices",
    path: "/customer-invoices",
    component: CustomerInvoices,
    hidden: false,
    icon: File, // File/Document icon fits for Quotations
    permission: "view_customer_invoices",
  },
  {
    id: "delivery-notes",
    name: "Delivery Notes",
    path: "/delivery-notes",
    component: DeliveryNotes,
    hidden: false,
    icon: Truck,
    permission: "view_delivery_orders",
  },
  {
    id: "payment terms",
    name: "Payment Terms",
    path: "/payment_terms",
    component: PaymentTerms,
    hidden: false,
    icon: CreditCard,
    permission: "view_settings",
  },
  {
    id: "grns",
    name: "Goods Received Notes",
    path: "/grns",
    component: GRNs,
    hidden: false,
    icon: Box,
    permission: "view_grns",
  },
  {
    id: "suppliers",
    name: "Suppliers",
    path: "/suppliers",
    component: SuppliersPage,
    hidden: false,
    icon: Users, // Plus circle for "Add Product"
    permission: "view_suppliers",
  },
  {
    id: "create suppliers",
    name: "Suppliers",
    path: "/create-supplier",
    component: AddSupplierPage,
    hidden: true,
    icon: Users, // Plus circle for "Add Product"
    permission: "create_suppliers",
  },
  {
    id: "supplier details",
    name: "Supplier Details",
    path: "/suppliers/:id/details",
    component: SupplierDetailsPage,
    hidden: true,
    icon: Users,
    permission: "view_suppliers",
  },
  {
    id: "customers",
    name: "Customers",
    path: "/customers",
    component: CustomersPage,
    hidden: false,
    icon: Users,
    permission: "view_customers",
  },
  {
    id: "create customers",
    name: "Customers",
    path: "/create-customer",
    component: AddCustomerPage,
    hidden: true,
    icon: Users,
    permission: "create_customers",
  },
  {
    id: "customer details",
    name: "Customer Details",
    path: "/customer-details/:id",
    component: CustomerDetailsPage,
    hidden: true,
    icon: Users,
    permission: "view_customers",
  },
  {
    id: "users",
    name: "Users",
    path: "/users",
    component: UsersPage,
    hidden: false,
    icon: UsersIcon,
    permission: "manage_users",
  },
  {
    id: "roles",
    name: "Roles & Permissions",
    path: "/roles",
    component: RolesPage,
    hidden: false,
    icon: Shield,
    permission: "manage_roles",
  },

  // {
  //   id: "payment terms",
  //   name: "Payment Terms",
  //   path: "/payment_terms",
  //   component: PaymentTerms,
  //   hidden: false,
  //   icon: CreditCard,
  // },
  // {
  //   id: "grns",
  //   name: "Goods Received Notes",
  //   path: "/grns",
  //   component: GRNs,
  //   hidden: false,
  //   icon: Box,
  // },
  {
    id: "create-grn",
    name: "Create GRN",
    path: "/create-grn/:id",
    component: CreateGRN,
    hidden: true,
    permission: "create_grns",
  },
  {
    id: "edit-grn",
    name: "Edit GRN",
    path: "/grns/:id/edit",
    component: EditGRN,
    hidden: true,
    permission: "edit_grns",
  },
  {
    id: "grn-details",
    name: "GRN Details",
    path: "/grns/:id/details",
    component: GRNDetails,
    hidden: true,
    permission: "view_grns",
  },
  {
    id: "settings",
    name: "Settings",
    path: "/settings",
    component: SettingsPage,
    hidden: false,
    icon: Settings2,
    permission: "view_settings",
  },
  {
    id: "notifications",
    name: "Notifications",
    path: "/notifications",
    component: NotificationsPage,
    hidden: true,
    icon: Bell,
    permission: "view_settings",
  },
];
