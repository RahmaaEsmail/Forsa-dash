import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import useListNotifications from "@/hooks/Notifications/useListNotifications";
import useCreateNotification from "@/hooks/Notifications/useCreateNotification";
import useMarkRead from "@/hooks/Notifications/useMarkRead";
import useMarkAllRead from "@/hooks/Notifications/useMarkAllRead";
import useDeleteNotification from "@/hooks/Notifications/useDeleteNotification";
import useUnreadCount from "@/hooks/Notifications/useUnreadCount";
import CustomSelect from "@/components/shared/CustomSelect";
import { useQuery } from "@tanstack/react-query";
import getCustomerOptions from "@/hooks/customers/getCustomerOptions";
import { Bell, Check, Trash2, Eye, Plus, Mail, MessageSquare, CheckCheck, Loader2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Notifications() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: notifications, isLoading: isListLoading } = useListNotifications({ page: currentPage });
  const { data: unreadCountData } = useUnreadCount();
  const createMutation = useCreateNotification();
  const markReadMutation = useMarkRead();
  const markAllReadMutation = useMarkAllRead();
  const deleteMutation = useDeleteNotification();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      user_id: [],
      type: "custom_message",
      title: { en: "", ar: "" },
      message: { en: "", ar: "" },
      data: { policy_id: "", deadline: "" }
    }
  });

  const { data: customerData, isLoading: isCustomersLoading } = useQuery(getCustomerOptions());
  const customerOptions = customerData?.data?.map(c => ({
    label: c.company_name || `${c.first_name} ${c.last_name}`,
    value: c.id
  })) || [];

  const onSubmit = (data) => {
    // Ensure deadline is ISO string if provided
    if (data.data?.deadline) {
      data.data.deadline = new Date(data.data.deadline).toISOString();
    }
    
    createMutation.mutate({ body: data }, {
      onSuccess: () => {
        setIsDialogOpen(false);
        reset();
      }
    });
  };

  const renderTitle = (title) => {
    if (typeof title === "string") return <span>{title}</span>;
    if (typeof title === "object" && title !== null) {
      return (
        <div className="flex flex-col gap-1">
          <span className="font-bold text-secondary">{title.en || "No Title"}</span>
          <span className="text-xs text-muted-foreground" dir="rtl">{title.ar}</span>
        </div>
      );
    }
    return "---";
  };

  const renderMessage = (message) => {
    if (typeof message === "string") return <span className="line-clamp-2">{message}</span>;
    if (typeof message === "object" && message !== null) {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm line-clamp-2">{message.en}</span>
          <span className="text-xs text-muted-foreground italic" dir="rtl">{message.ar}</span>
        </div>
      );
    }
    return "---";
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      align: "left",
      render: (_, record) => {
        console.log("record", record);
        const isUnread = !record.read_at && record.is_read === false;
        return (
          <div className="flex items-center gap-3 py-2">
            {isUnread && <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary animate-pulse" />}
            <div className={`${isUnread ? "font-bold text-secondary" : "text-muted-foreground font-normal"}`}>
              {renderTitle(record.title)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Message",
      key: "message",
      align: "left",
      render: (_, record) => (
        <div className="max-w-md">
          {renderMessage(record.message)}
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => (
        <Badge variant="outline" className="capitalize bg-muted/30 border-none px-3">
          {type?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      title: "Extra Data",
      dataIndex: "data",
      render: (data) => (
        data ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="p-4 space-y-2">
                {data.policy_id && <p><span className="font-bold">Policy ID:</span> {data.policy_id}</p>}
                {data.deadline && <p><span className="font-bold">Deadline:</span> {new Date(data.deadline).toLocaleDateString()}</p>}
                {!data.policy_id && !data.deadline && <p>No extra data</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : "---"
      )
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (date) => (
        <div className="flex flex-col text-xs text-muted-foreground">
          <span>{new Date(date).toLocaleDateString()}</span>
          <span>{new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isUnread = !record.read_at && record.is_read === false;
        return (
          <div className="flex justify-center gap-2">
            {isUnread && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-success hover:bg-success/10 rounded-full"
                onClick={() => markReadMutation.mutate({ id: record.id })}
                disabled={markReadMutation.isPending}
              >
                <Check className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-danger hover:bg-danger/10 rounded-full"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this notification?")) {
                  deleteMutation.mutate({ id: record.id });
                }
              }}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const unreadCount = unreadCountData?.data?.count || 0;

  return (
    <div className="container mx-auto space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader 
          title="Notification Center" 
          subTitle={
            <div className="flex items-center gap-2">
              <span>Manage system and user notifications.</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
          }
        />
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="border-primary/30 text-primary hover:bg-primary/5 h-11"
          >
            {markAllReadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCheck className="mr-2 h-4 w-4" />}
            Mark All Read
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 h-11 px-6 shadow-lg hover:shadow-primary/20 transition-all">
                <Plus className="mr-2 h-4 w-4" />
                Create Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-black text-secondary">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  New Notification
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <CustomSelect
                      control={control}
                      name="user_id"
                      label="Recipients"
                      placeholder="Select users (empty for all)"
                      options={customerOptions}
                      isLoading={isCustomersLoading}
                      multiple={true}
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Leave empty to broadcast to all registered customers.</p>
                  </div>

                  <div className="space-y-5 border-r border-border/40 pr-6">
                    <Label className="text-primary font-black uppercase text-[10px] tracking-[0.2em] bg-primary/5 px-2 py-1 rounded">English Content</Label>
                    <div className="space-y-2">
                      <Label htmlFor="title_en" className="text-sm font-bold">Title (EN)</Label>
                      <Input 
                        id="title_en" 
                        placeholder="Notification Title" 
                        className="bg-muted/30 border-none h-11"
                        {...register("title.en", { required: "English title is required" })}
                      />
                      {errors.title?.en && <p className="text-xs text-red-500">{errors.title.en.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message_en" className="text-sm font-bold">Message (EN)</Label>
                      <Textarea 
                        id="message_en" 
                        placeholder="Detailed message..." 
                        rows={4}
                        className="bg-muted/30 border-none resize-none"
                        {...register("message.en", { required: "English message is required" })}
                      />
                      {errors.message?.en && <p className="text-xs text-red-500">{errors.message.en.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-5 pl-2">
                    <Label className="text-primary font-black uppercase text-[10px] tracking-[0.2em] bg-primary/5 px-2 py-1 rounded">Arabic Content</Label>
                    <div className="space-y-2">
                      <Label htmlFor="title_ar" className="text-sm font-bold">Title (AR)</Label>
                      <Input 
                        id="title_ar" 
                        dir="rtl"
                        placeholder="عنوان الإشعار" 
                        className="font-cairo text-right bg-muted/30 border-none h-11"
                        {...register("title.ar", { required: "Arabic title is required" })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message_ar" className="text-sm font-bold">Message (AR)</Label>
                      <Textarea 
                        id="message_ar" 
                        dir="rtl"
                        placeholder="محتوى الإشعار..." 
                        rows={4}
                        className="font-cairo text-right bg-muted/30 border-none resize-none"
                        {...register("message.ar", { required: "Arabic message is required" })}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-2 gap-6 pt-6 border-t border-border/40 bg-muted/10 -mx-6 px-6 pb-6 rounded-b-xl">
                    {/* <div className="space-y-2">
                      <Label htmlFor="policy_id" className="text-xs font-bold text-muted-foreground uppercase">Policy ID (Optional)</Label>
                      <Input id="policy_id" className="bg-white border-none h-10" type="number" {...register("data.policy_id")} />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-xs font-bold text-muted-foreground uppercase">Deadline (Optional)</Label>
                      <Input id="deadline" className="bg-white border-none h-10" type="datetime-local" {...register("data.deadline")} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-11 px-6">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} className="px-10 h-11 bg-secondary hover:bg-secondary/90 shadow-lg">
                    {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                    Send Notification
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <CustomTable
          columns={columns}
          dataSource={notifications?.data || []}
          loading={isListLoading}
          containerClassName="bg-white rounded-2xl shadow-2xl border-none overflow-hidden p-2"
          headerRowClassName="bg-muted/20 border-none rounded-xl"
          bodyRowClassName="border-b border-muted/20 last:border-none hover:bg-muted/5 transition-all duration-200"
          bodyCellClassName="p-5"
          emptyProps={{
            title: "No Notifications",
            description: "You're all caught up! No notifications found."
          }}
        />

        {notifications?.meta && notifications?.meta?.last_page > 1 && (
          <div className="flex justify-end pt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={notifications.meta.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
