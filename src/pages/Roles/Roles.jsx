import React, { useState, useMemo } from "react";
import PageHeader from "@/components/shared/PageHeader";
import CustomTable from "@/components/shared/CustomTable";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import useListRoles from "@/hooks/Roles/useListRoles";
import useCreateRole from "@/hooks/Roles/useCreateRole";
import useUpdateRole from "@/hooks/Roles/useUpdateRole";
import useDeleteRole from "@/hooks/Roles/useDeleteRole";
import CustomSelect from "@/components/shared/CustomSelect";
import { Shield, Plus, Edit, Trash2, ShieldCheck, Loader2, Key, Search, Filter, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useDebounce from "@/hooks/useDebounce";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { PERMISSIONS } from "@/constants/permissions";

export default function Roles() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState(""); // "" | "1" | "0"
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const params = useMemo(() => ({
    search: debouncedSearch,
    is_active: isActive,
    per_page: 15,
    page: currentPage
  }), [debouncedSearch, isActive, currentPage]);

  const { data: rolesData, isLoading: isListLoading } = useListRoles(params);
  
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      display_name: { en: "", ar: "" },
      description: { en: "", ar: "" },
      is_active: true,
      permission_ids: []
    }
  });

  const permissionOptions = PERMISSIONS.map(p => ({
    label: p.title_en,
    value: p.id,
    textValue: `${p.title_en} ${p.title_ar}`
  }));

  const getPermissionTitles = (ids) => {
    if (!ids || !Array.isArray(ids)) return [];
    return ids.map(id => {
      const perm = PERMISSIONS.find(p => p.id === Number(id));
      return perm ? perm.title_en : `ID: ${id}`;
    });
  };

  const onSubmit = (data) => {
    const data_send = {
      ...data ,
      permission_ids: data?.permission_ids?.map(id => Number(id)) || []
    }
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, body: data_send }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setEditingRole(null);
          reset();
        }
      });
    } else {
      createMutation.mutate({ body: data_send }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setValue("name", role.name);
    setValue("display_name", role.display_name || { en: "", ar: "" });
    setValue("description", role.description || { en: "", ar: "" });
    setValue("is_active", Boolean(role.is_active));
    const pIds = role.permissions?.map(p => p.id) || role.permission_ids || [];
    setValue("permission_ids", pIds.map(id => Number(id)));
    setIsDialogOpen(true);
  };

  const columns = [
    {
      title: "Display Name",
      key: "display_name",
      align: "left",
      render: (_, record) => (
        <div className="flex flex-col gap-1 py-2">
          <span className="font-bold text-secondary">{record.display_name?.en || record.name}</span>
          <span className="text-xs text-muted-foreground" dir="rtl">{record.display_name?.ar}</span>
        </div>
      ),
    },
    {
      title: "System Name",
      dataIndex: "name",
      render: (name) => <code className="bg-muted px-2 py-1 rounded text-xs">{name}</code>,
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_, record) => {
        const pIds = record.permissions?.map(p => p.id) || record.permission_ids || [];
        const titles = getPermissionTitles(pIds);
        const count = titles.length;
        
        return (
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            <span className="font-medium">{count} Permissions</span>
            {count > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-primary/10 text-primary">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 max-w-xs bg-white shadow-2xl border-none">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1 border-b pb-1">Assigned Access</p>
                      <div className="flex flex-wrap gap-1">
                        {titles.map((t, idx) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0 border-none bg-muted font-normal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      }
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (active) => (
        <Badge className={Boolean(active) ? "bg-success/10 text-success border-none" : "bg-danger/10 text-danger border-none"}>
          {Boolean(active) ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/10"
            onClick={() => handleEdit(record)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-danger hover:bg-danger/10"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this role?")) {
                deleteMutation.mutate({ id: record.id });
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader 
          title="Roles & Permissions" 
          subTitle="Define user access levels and dashboard permissions."
        />
        
        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingRole(null);
              reset();
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-lg">
                <Plus className="mr-2 h-4 w-4" />
                Add New Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-black">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  {editingRole ? "Edit Role" : "Create New Role"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-bold">System Name (Unique Key)</Label>
                        <Input 
                          id="name" 
                          placeholder="e.g., sales_manager" 
                          disabled={!!editingRole}
                          {...register("name", { required: "System name is required" })}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                      </div>
                      <div className="flex items-center gap-3 pt-8">
                        <Label htmlFor="is_active">Active Status</Label>
                        <Controller
                          control={control}
                          name="is_active"
                          render={({ field }) => (
                            <Switch
                              id="is_active"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 border-r border-border/40 pr-6">
                     <Badge className="bg-primary/5 text-primary border-none text-[10px] uppercase font-black tracking-widest px-2 py-1">English Metadata</Badge>
                     <div className="space-y-2">
                        <Label htmlFor="display_en" className="text-sm font-bold">Display Name (EN)</Label>
                        <Input id="display_en" {...register("display_name.en", { required: "English name is required" })} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="desc_en" className="text-sm font-bold">Description (EN)</Label>
                        <Textarea id="desc_en" rows={3} {...register("description.en")} />
                     </div>
                  </div>

                  <div className="space-y-5 pl-2">
                     <Badge className="bg-primary/5 text-primary border-none text-[10px] uppercase font-black tracking-widest px-2 py-1">Arabic Metadata</Badge>
                     <div className="space-y-2">
                        <Label htmlFor="display_ar" className="text-sm font-bold">Display Name (AR)</Label>
                        <Input id="display_ar" dir="rtl" className="font-cairo text-right" {...register("display_name.ar", { required: "Arabic name is required" })} />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="desc_ar" className="text-sm font-bold">Description (AR)</Label>
                        <Textarea id="desc_ar" dir="rtl" rows={3} className="font-cairo text-right" {...register("description.ar")} />
                     </div>
                  </div>

                  <div className="md:col-span-2 pt-4 border-t">
                    <CustomSelect
                      control={control}
                      name="permission_ids"
                      label="Assigned Permissions (Pages)"
                      placeholder="Search and select pages..."
                      options={permissionOptions}
                      isLoading={false}
                      multiple={true}
                      isRequired={true}
                    />
                    <p className="text-[10px] text-muted-foreground mt-2">Select the pages and modules this role has permission to access.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-11 shadow-lg">
                    {createMutation.isPending || updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    {editingRole ? "Update Role" : "Create Role"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border-none overflow-hidden p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search roles by name..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11 bg-muted/20 border-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              className="h-11 px-4 bg-muted/20 border-none rounded-md outline-none text-sm"
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="1">Active Only</option>
              <option value="0">Inactive Only</option>
            </select>
          </div>
        </div>

        <CustomTable
          columns={columns}
          dataSource={rolesData?.data || []}
          loading={isListLoading}
          containerClassName="border-none"
          bodyRowClassName="border-b border-muted/10 last:border-none hover:bg-muted/5 transition-all"
          emptyProps={{
            title: "No Roles Found",
            description: "Try adjusting your filters or search terms."
          }}
        />

        {rolesData?.meta && rolesData.meta.last_page > 1 && (
          <div className="flex justify-end pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={rolesData.meta.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
