import { lazy } from "react"

const Home = lazy(() => import('@/pages/Home/Home'));
const Products  = lazy(() => import("@/pages/Products/Products"));
const Quotations = lazy(() => import("@/pages/Quotations/Quotations"));
const PurchaseRequest = lazy(() => import("@/pages/PurchaseRequest/PurchaseRequest"))
const AddProduct =  lazy(() => import("@/pages/Products/AddProduct"));
const CreateQuotation = lazy(() => import("@/pages/Quotations/CreateQuotation"));

export const routesData = [ 
  {
    id:1,
    name:"Home",
    index: true,
    path:"/",
    component: Home,
    hidden:false,
    active_icon:'/images/home.svg',
    inactive_icon:"/images/typcn_home.svg",
  },
   {
    id:2,
    name:"Product Catalog",
    path:"/products",
    component: Products,
    hidden:false,
    active_icon:"/images/fluent-mdl2_product-variant.svg",
    inactive_icon:'/images/product.svg',
  },
   {
    id:3,
    name:"Quotations",
    path:"/quotations",
    component: Quotations,
    hidden:false,
    active_icon:"/images/ion_pricetags-sharp.svg",
    inactive_icon:'/images/ion_pricetags-sharp-gray.svg',
  },
  {
    id:4,
    name:"Purchase Request",
    path:"/purchaseRequest",
    component: PurchaseRequest,
    hidden:false,
    active_icon:"/images/icon-park-solid_shopping-bag.svg",
    inactive_icon:'/images/icon-park-solid_shopping-bag-gray.svg',
  },
  {
    id:5,
    name:"Add Prodcut",
    path:"/add_product",
    component: AddProduct,
    hidden:true,
    active_icon:"/images/icon-park-solid_shopping-bag.svg",
    inactive_icon:'/images/icon-park-solid_shopping-bag-gray.svg',
  },
   {
    id:6,
    name:"Create Quotations",
    path:"/create_quote",
    component: CreateQuotation,
    hidden:true,
    active_icon:"/images/icon-park-solid_shopping-bag.svg",
    inactive_icon:'/images/icon-park-solid_shopping-bag-gray.svg',
  }
]