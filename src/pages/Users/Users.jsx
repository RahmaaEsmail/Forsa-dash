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
import { useForm, Controller } from "react-hook-form";
import useListUsers from "@/hooks/Users/useListUsers";
import useCreateUser from "@/hooks/Users/useCreateUser";
import useUpdateUser from "@/hooks/Users/useUpdateUser";
import useDeleteUser from "@/hooks/Users/useDeleteUser";
import useListRoles from "@/hooks/Roles/useListRoles";
import CustomSelect from "@/components/shared/CustomSelect";
import { Users as UsersIcon, Plus, Edit, Trash2, UserCheck, Loader2, Key, Search, Mail, Shield, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useDebounce from "@/hooks/useDebounce";
import { PERMISSIONS } from "@/constants/permissions";

export default function Users() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const params = useMemo(() => ({
    search: debouncedSearch,
    per_page: 15,
    page: currentPage
  }), [debouncedSearch, currentPage]);

  const { data: usersData, isLoading: isListLoading } = useListUsers(params);
  const { data: rolesData, isLoading: isRolesLoading } = useListRoles({ per_page: 100 });
  
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role_ids: "",
      permission_ids: []
    }
  });

  const watchedRole = watch("role_ids");

  // Automatically update permissions when role changes
  React.useEffect(() => {
    if (watchedRole) {
      const selectedRole = rolesData?.data?.find(r => r.id === Number(watchedRole));
      if (selectedRole?.permissions) {
        setValue("permission_ids", selectedRole.permissions.map(p => p.id));
      } else {
        setValue("permission_ids", []);
      }
    } else {
      setValue("permission_ids", []);
    }
  }, [watchedRole, rolesData, setValue]);

  const password = watch("password");

  const roleOptions = rolesData?.data?.map(r => ({
    label: r.display_name?.en || r.name,
    value: r.id
  })) || [];

  const permissionOptions = PERMISSIONS.map(p => ({
    label: p.title_en,
    value: p.id,
    textValue: `${p.title_en} ${p.title_ar}`
  }));

  const onSubmit = (data) => {
  const transformedData = {
    ...data,
    role_ids: data.role_ids ? [Number(data.role_ids)] : [],
    permission_ids: data.permission_ids?.map(id => Number(id)) || []
  };
  
  if (editingUser) {
    // Don't send empty passwords on update
    const updateData = { ...transformedData };
    if (!updateData.password) {
      delete updateData.password;
      delete updateData.password_confirmation;
    }
    updateMutation.mutate({ id: editingUser.id, body: updateData }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        setEditingUser(null);
        reset();
      }
    });
  } else {
    createMutation.mutate({ body: transformedData }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        reset();
      }
    });
  }
};

  const handleEdit = (user) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("password", "");
    setValue("password_confirmation", "");
    setValue("role_ids", user.roles?.[0]?.id ? +user.roles[0].id : "");
    setValue("permission_ids", user.permissions?.map(p => p.id) || []);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const columns = [
    {
      title: "User",
      key: "user",
      align: "left",
      render: (_, record) => (
        <div className="flex items-center gap-3 py-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {record.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-secondary">{record.name}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {record.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Roles",
      key: "roles",
      render: (_, record) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {record.roles?.map(r => (
            <Badge key={r.id} variant="outline" className="bg-primary/5 text-primary border-none text-[10px]">
              {r.display_name?.en || r.name}
            </Badge>
          )) || <span className="text-xs text-muted-foreground italic">No Roles</span>}
        </div>
      ),
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_, record) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Key className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">
            {(record.permissions?.length || 0) + (record.roles?.reduce((acc, r) => acc + (r.permissions?.length || 0), 0) || 0)} Total
          </span>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => <span className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-secondary hover:bg-secondary/10"
            onClick={() => handleViewDetails(record)}
          >
            <Eye className="h-4 w-4" />
          </Button>
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
              if (window.confirm("Are you sure you want to delete this user?")) {
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
          title="Users Management" 
          subTitle="Create and manage dashboard users and their access levels."
        />
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingUser(null);
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-lg">
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-black">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                {editingUser ? "Edit User Profile" : "Create User Account"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold">Full Name</Label>
                    <Input id="name" {...register("name", { required: "Name is required" })} />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold">Email Address</Label>
                    <Input id="email" type="email" {...register("email", { required: "Email is required" })} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Password Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold">
                      {editingUser ? "New Password (Leave blank to keep current)" : "Password"}
                    </Label>
                    <Input id="password" type="password" {...register("password", { required: !editingUser ? "Password is required" : false })} />
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation" className="font-bold">Confirm Password</Label>
                    <Input id="password_confirmation" type="password" {...register("password_confirmation", { 
                      required: (password && password.length > 0) ? "Please confirm your password" : false,
                      validate: (val) => val === password || "Passwords do not match"
                    })} />
                    {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation.message}</p>}
                  </div>
                </div>

                {/* Access Role */}
                <div className="md:col-span-2 pt-4 border-t">
                  <CustomSelect
                    control={control}
                    name="role_ids"
                    label="Assigned Role"
                    placeholder="Select user role..."
                    options={roleOptions}
                    isLoading={isRolesLoading}
                    multiple={false}
                    isRequired={true}
                  />
                  <p className="text-[10px] text-muted-foreground mt-2 italic">Permissions will be automatically assigned based on the selected role.</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="px-10 h-11 shadow-lg">
                  {createMutation.isPending || updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                  {editingUser ? "Update User" : "Create User"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border-none overflow-hidden p-6 space-y-6">
        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users by name or email..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-11 bg-muted/20 border-none"
            />
          </div>
        </div>

        <CustomTable
          columns={columns}
          dataSource={usersData?.data || []}
          loading={isListLoading}
          containerClassName="border-none"
          bodyRowClassName="border-b border-muted/10 last:border-none hover:bg-muted/5 transition-all"
          emptyProps={{
            title: "No Users Found",
            description: "Try adjusting your search or add a new user."
          }}
        />

        {usersData?.meta && usersData.meta.last_page > 1 && (
          <div className="flex justify-end pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={usersData.meta.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-black">
              User Profile Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-6 pb-6 border-b">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl font-black shadow-inner">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-secondary">{selectedUser.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {selectedUser.email}
                  </p>
                  <Badge variant="outline" className="bg-success/5 text-success border-none text-[10px] uppercase font-bold">
                    Active Account
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                    <Shield className="h-4 w-4" /> Assigned Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.roles?.map(r => (
                      <Badge key={r.id} className="bg-secondary/10 text-secondary border-none px-3 py-1">
                        {r.display_name?.en || r.name}
                      </Badge>
                    ))}
                    {!selectedUser.roles?.length && <span className="text-xs italic text-muted-foreground">No roles assigned</span>}
                  </div>
                </div>

                {/* <div className="space-y-3">
                  <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                    <Key className="h-4 w-4" /> Permissions Summary
                  </h4>
                  <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>From Roles:</span>
                      <span className="font-bold text-primary">{selectedUser.roles?.reduce((acc, r) => acc + (r.permissions?.length || 0), 0) || 0}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Directly Granted:</span>
                      <span className="font-bold text-primary">{selectedUser.permissions?.length || 0}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between text-sm font-black">
                      <span>Total Access Points:</span>
                      <span className="text-primary">{(selectedUser.permissions?.length || 0) + (selectedUser.roles?.reduce((acc, r) => acc + (r.permissions?.length || 0), 0) || 0)}</span>
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="rounded-xl px-8">
                  Close Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
