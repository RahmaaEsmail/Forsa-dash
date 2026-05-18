import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Circles } from 'react-loader-spinner';
import { handleGetSupplierDetails } from '../../services/suppliers';
import PageHeader from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { 
  ArrowLeft, Edit, Mail, Phone, Globe, Building2, 
  User, MapPin, CreditCard, ShieldCheck, Briefcase, Landmark, Hash, Award, Star
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';

export default function SupplierDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: supplierResponse, isLoading } = useQuery({
    queryKey: ["supplier", id],
    queryFn: ({ signal }) => handleGetSupplierDetails({ id, signal }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center w-full">
        <Circles height="50" width="50" color="#C94544" ariaLabel="circles-loading" visible />
      </div>
    );
  }

  const supplier = supplierResponse?.data;
  if (!supplier) return <div className="p-8 text-center text-gray-500">Supplier not found</div>;

  const displayName = supplier.company_name || `${supplier.first_name || ''} ${supplier.last_name || ''}`;

  return (
    <div className="flex pb-10 flex-col gap-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* 1. Action Header */}
      <PageHeader title="Supplier Profile" subTitle="Manage and view detailed supplier information">
        <div className="flex gap-3">
          <Button onClick={() => navigate("/suppliers")} variant="outline" className="shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={() => navigate(`/create-supplier?id=${id}`)} className="bg-primary hover:bg-primary/90 shadow-sm text-white font-bold">
            <Edit className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </div>
      </PageHeader>

      {/* 2. Hero Info Section */}
      <div className="bg-white border border-[#E6EFF5] rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Building2 size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-secondary">{displayName}</h1>
              {supplier.code && <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 uppercase font-bold text-xs">{supplier.code}</Badge>}
              <Badge className={supplier.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50" : "bg-red-50 text-red-600 border-red-100 hover:bg-red-50"}>
                {supplier.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {supplier.email || 'No email'}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {supplier.phone || supplier.mobile || 'No phone'}</span>
              {supplier.rating && (
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {supplier.rating} / 5
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Primary Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Addresses Section */}
          <Card className="shadow-sm border-[#E6EFF5]">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-[#E6EFF5] bg-slate-50/50">
              <MapPin className="w-5 h-5 text-slate-400" />
              <CardTitle className="text-secondary text-lg">Addresses</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {supplier.addresses && supplier.addresses.length > 0 ? (
                supplier.addresses.map((addr, idx) => (
                  <div key={idx} className="relative group p-4 border border-slate-200 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{addr.label || 'Address'}</span>
                      {addr.is_default && <Badge className="bg-primary/10 text-primary border-none text-[10px]">DEFAULT</Badge>}
                    </div>
                    <div className="text-sm text-secondary space-y-1">
                      <p className="font-semibold">{addr.address_line_1}</p>
                      {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                      <p>{[addr.city, addr.state, addr.postal_code].filter(Boolean).join(", ")}</p>
                      <p className="text-slate-500 font-medium pt-1">{addr.country}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 col-span-2">No addresses available.</div>
              )}
            </CardContent>
          </Card>

          {/* Contacts Section */}
          <Card className="shadow-sm border-[#E6EFF5]">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-[#E6EFF5] bg-slate-50/50">
              <Briefcase className="w-5 h-5 text-slate-400" />
              <CardTitle className="text-secondary text-lg">Key Contacts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {supplier.contacts && supplier.contacts.length > 0 ? (
                supplier.contacts.map((contact, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/30">
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center font-bold text-primary">
                        {contact.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-secondary">
                          {contact.name} 
                          {contact.is_primary && <span className="text-primary text-[10px] ml-2 px-1.5 py-0.5 bg-primary/10 rounded">PRIMARY</span>}
                        </p>
                        <p className="text-xs text-slate-500">{contact.position || 'No Title'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:flex gap-4 mt-4 md:mt-0 text-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Email</span>
                        <span className="text-secondary">{contact.email || '-'}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Phone</span>
                        <span className="text-secondary">{contact.phone || contact.mobile || '-'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">No contacts available.</div>
              )}
            </CardContent>
          </Card>

          {/* Bank Accounts Section */}
          {/* <Card className="shadow-sm border-[#E6EFF5]">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-[#E6EFF5] bg-slate-50/50">
              <Landmark className="w-5 h-5 text-slate-400" />
              <CardTitle className="text-secondary text-lg">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {supplier.bank_accounts && supplier.bank_accounts.length > 0 ? (
                supplier.bank_accounts.map((bank, idx) => (
                  <div key={idx} className="flex flex-col p-4 rounded-xl border border-slate-100 bg-slate-50/30 gap-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border">
                          <Landmark className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-secondary">{bank.bank_name}</p>
                          <p className="text-xs text-slate-500">Branch: {bank.branch || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {bank.is_primary && <Badge className="bg-primary/10 text-primary border-none text-[10px]">PRIMARY</Badge>}
                        <Badge variant="outline" className="text-slate-500 font-bold uppercase">{bank.currency || 'SAR'}</Badge>
                      </div>
                    </div>
                    <Separator className="my-1" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Holder</span>
                        <span className="font-medium">{bank.account_holder_name}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Account Number</span>
                        <span className="font-mono">{bank.account_number}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">IBAN</span>
                        <span className="font-mono">{bank.iban || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400">No bank accounts available.</div>
              )}
            </CardContent>
          </Card> */}
        </div>

        {/* Right Column: Sidebar / Meta Info */}
        <div className="flex flex-col gap-6">
          
          {/* Payment Terms Sidebar */}
          <Card className="shadow-sm border-[#E6EFF5]">
            <CardHeader className="flex flex-row items-center gap-2 border-b border-[#E6EFF5] bg-slate-50/50">
              <CreditCard className="w-5 h-5 text-slate-400" />
              <CardTitle className="text-secondary text-lg">Billing & Credit</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {supplier.payment_terms && supplier.payment_terms.length > 0 ? (
                supplier.payment_terms.map((term, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Term #{term.payment_term_id}</span>
                      {term.is_default && <Badge className="bg-primary/10 text-primary border-none text-[10px]">DEFAULT</Badge>}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Credit Limit</span>
                      <span className="font-bold text-secondary">${term.credit_limit?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Credit Days</span>
                      <span className="font-bold text-secondary">{term.credit_days || 0} Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Status</span>
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 uppercase text-[10px]">
                        {term.credit_status}
                      </Badge>
                    </div>
                    <Separator className="my-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400">No payment terms configured.</div>
              )}
              
              <div className="space-y-3 pt-2 text-sm text-secondary">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Tax Treatment</span>
                  <span className="font-semibold">{supplier.tax_treatment || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">VAT No.</span>
                  <span className="font-semibold">{supplier.vat_number || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">CR Number</span>
                  <span className="font-semibold">{supplier.commercial_register || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Website</span>
                  {supplier.website ? (
                    <a href={supplier.website} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                      Visit Site <Globe className="w-3 h-3" />
                    </a>
                  ) : '-'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Card */}
          <Card className="shadow-sm border-[#E6EFF5] bg-amber-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase text-slate-400">Notes / Remarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                {supplier.notes || "No notes available for this supplier."}
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
