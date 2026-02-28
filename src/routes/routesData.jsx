import { HomeIcon, Grid2x2Plus, LayoutList, FileText, Box, ShoppingCart, PlusCircle, Users } from "lucide-react"; // Importing more relevant icons
import { lazy } from "react";

const Home = lazy(() => import('@/pages/Home/Home'));
const Products = lazy(() => import("@/pages/Products/Products"));
const Quotations = lazy(() => import("@/pages/Quotations/Quotations"));
const PurchaseRequest = lazy(() => import("@/pages/PurchaseRequest/PurchaseRequest"));
const AddProduct = lazy(() => import("@/pages/Products/AddProduct"));
const CreateQuotation = lazy(() => import("@/pages/Quotations/CreateQuotation"));
const CreatePurchaseRequest = lazy(() => import("@/pages/PurchaseRequest/CreatePurchaseRequest"));
const PurchaseRequestDetails = lazy(() => import("@/pages/PurchaseRequest/PurchaseRequestDetails"));
const CategorisPage = lazy(() => import("@/pages/Category/Category"));
const CreateCategory = lazy(() => import("@/pages/Category/CreateCategory"));
const UnitsPage = lazy(() => import("@/pages/Units/Units"));
const CreateUnit = lazy(() => import("@/pages/Units/CreateUnit"));
const SuppliersPage = lazy(() => import("@/pages/Supplier/Supplier"));
const ProductDetails = lazy(() => import("@/pages/Products/ProductDetails"));
const AddSupplierPage = lazy(() => import("@/pages/Supplier/AddSupplier"));
const CustomersPage = lazy(() => import("@/pages/Customers/Customers"));
const AddCustomerPage = lazy(() => import("@/pages/Customers/AddCustomer"));
const CustomerDetailsPage = lazy(() => import("@/pages/Customers/CustomerDetails"));

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
    id: "categories",
    name: "Categories",
    path: "/categories",
    component: CategorisPage,
    hidden: false,
    icon: Grid2x2Plus, // Grid icon fits well for Categories (listing/grid view)
  },
    {
    id: 3,
    name: "Categories",
    path: "/create-categories",
    component: CreateCategory,
    hidden: true,
    icon: Grid2x2Plus, // Grid icon fits well for Categories (listing/grid view)
  },
   {
    id: "units",
    name: "Units",
    path: "/units",
    component: UnitsPage,
    hidden: false,
    icon: Box, // Box icon fits products or catalog
  },
   {
    id: "create-units",
    name: "Units",
    path: "/create-unit",
    component: CreateUnit,
    hidden: true,
    icon: Box, // Box icon fits products or catalog
  },
  {
    id: "products",
    name: "Product Catalog",
    path: "/products",
    component: Products,
    hidden: false,
    icon: Box, // Box icon fits products or catalog
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
  {
    id: 5,
    name: "Purchase Request",
    path: "/purchaseRequest",
    component: PurchaseRequest,
    hidden: false,
    active_icon: "/images/icon-park-solid_shopping-bag.svg",
    inactive_icon: "/images/icon-park-solid_shopping-bag-gray.svg",
    icon: ShoppingCart, // Shopping cart icon fits for Purchase Requests
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
  },
   {
    id: "suppliers",
    name: "Suppliers",
    path: "/suppliers",
    component: SuppliersPage,
    hidden: false,
    icon: Users, // Plus circle for "Add Product"
  },
   {
    id: "create suppliers",
    name: "Suppliers",
    path: "/create-supplier",
    component: AddSupplierPage,
    hidden: true,
    icon: Users, // Plus circle for "Add Product"
  },
   {
    id: "customers",
    name: "Customers",
    path: "/customers",
    component: CustomersPage,
    hidden: false,
    icon: Users, 
  },
   {
    id: "create customers",
    name: "Customers",
    path: "/create-customer",
    component: AddCustomerPage,
    hidden: true,
    icon: Users, 
  },
   {
    id: "customer details",
    name: "Customer Details",
    path: "/customer-details/:id",
    component: CustomerDetailsPage,
    hidden: true,
    icon: Users,
  },
];
