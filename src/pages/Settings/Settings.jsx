// import React, { useState, useEffect, useMemo } from 'react';
// import useListSettings from '@/hooks/Settings/useListSettings';
// import useUpdateSettings from '@/hooks/Settings/useUpdateSettings';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Loader2,
//   Save,
//   Percent,
//   Building2,
//   Settings as SettingsIcon,
//   ShoppingBag,
//   CreditCard,
//   BellRing,
//   Globe,
//   ChevronDown,
//   ChevronUp,
//   Languages
// } from 'lucide-react';
// import PageHeader from '@/components/shared/PageHeader';

// const GROUP_CONFIG = {
//   tax: { label: 'Taxation', icon: Percent },
//   company: { label: 'Company Profile', icon: Building2 },
//   system: { label: 'System Settings', icon: SettingsIcon },
//   // orders: { label: 'Order Management', icon: ShoppingBag },
//   // credit: { label: 'Credit & Payments', icon: CreditCard },
//   notification: { label: 'Notifications', icon: BellRing },
//   general: { label: 'General Settings', icon: Globe },
// };

// export default function Settings() {
//   const { data: settingsData, isLoading } = useListSettings();
//   const updateSettings = useUpdateSettings();
//   const [formValues, setFormValues] = useState({});

//   useEffect(() => {
//     if (settingsData?.data) {
//       const initialValues = {};
//       settingsData.data.forEach((setting) => {
//         initialValues[setting.key] = {
//           value: setting.value,
//           label: setting.label || { en: '', ar: '' },
//           description: setting.description || { en: '', ar: '' },
//           type: setting.type,
//           group: setting.group,
//         };
//       });
//       setFormValues(initialValues);
//     }
//   }, [settingsData]);

//   const groupedSettings = useMemo(() => {
//     if (!settingsData?.data) return {};

//     const HIDDEN_GROUPS = ['general', 'credit', 'orders'];

//     return settingsData.data.reduce((acc, setting) => {
//       const group = setting.group || 'general';

//       if (HIDDEN_GROUPS.includes(group)) return acc;

//       const keyStr = setting.key?.toLowerCase() || '';
//       const labelStr = (setting.label?.en || '').toLowerCase();

//       if (
//         keyStr.includes('date_format') || labelStr.includes('date format') ||
//         keyStr.includes('default_tax') || labelStr.includes('default tax')
//       ) {
//         return acc;
//       }

//       if (!acc[group]) acc[group] = [];
//       acc[group].push(setting);
//       return acc;
//     }, {});
//   }, [settingsData]);

//   const handleValueChange = (key, value) => {
//     setFormValues((prev) => ({
//       ...prev,
//       [key]: { ...prev[key], value },
//     }));
//   };

//   const handleSave = () => {
//     const updatedSettings = Object.keys(formValues).map((key) => ({
//       key,
//       value: String(formValues[key].value),
//       type: formValues[key].type,
//       group: formValues[key].group,
//       label: formValues[key].label,
//       description: formValues[key].description,
//     }));

//     updateSettings.mutate({ body: { settings: updatedSettings } });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-[400px] items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!settingsData?.data) {
//     return (
//       <div className="container mx-auto p-10 text-center">
//         <p className="text-lg text-muted-foreground">No settings found.</p>
//       </div>
//     );
//   }

//   const groups = Object.keys(groupedSettings);

//   return (
//     <div className="container mx-auto space-y-6 pb-10">
//       <div className="flex items-center justify-between">
//         <PageHeader title="System Settings" subTitle="Configure your platform preferences and metadata." />
//         <Button
//           onClick={handleSave}
//           disabled={updateSettings.isPending}
//           className="px-8 py-6 text-lg font-bold shadow-lg transition-all hover:scale-105"
//         >
//           {updateSettings.isPending ? (
//             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//           ) : (
//             <Save className="mr-2 h-5 w-5" />
//           )}
//           Save Changes
//         </Button>
//       </div>

//       <Tabs defaultValue={groups[0]} className="w-full">
//         <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-3 bg-transparent p-0">
//           {groups.map((group) => {
//             const config = GROUP_CONFIG[group] || { label: group, icon: SettingsIcon };
//             const Icon = config.icon;
//             return (
//               <TabsTrigger
//                 key={group}
//                 value={group}
//                 className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md border border-border/50 px-6 py-3 text-sm font-semibold transition-all"
//               >
//                 <Icon className="mr-2 h-4 w-4" />
//                 {config.label}
//               </TabsTrigger>
//             );
//           })}
//         </TabsList>

//         {Object.entries(groupedSettings).map(([group, settings]) => (
//           <TabsContent key={group} value={group} className="space-y-6 mt-6! outline-none animate-in fade-in-50 duration-500">
//             <Card className="overflow-hidden border-none shadow-xl">
//               <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 border-b border-border/40 pb-6">
//                 <CardTitle className="text-2xl font-black text-secondary">
//                   {(GROUP_CONFIG[group]?.label || group)}
//                 </CardTitle>
//                 <CardDescription className="text-base">
//                   Detailed configuration for {group.toLowerCase()} parameters.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="divide-y divide-border/30 p-0">
//                 {settings.map((setting) => (
//                   <div key={setting.id} className="group/item transition-colors hover:bg-muted/10">
//                     <div className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
//                       <div className="space-y-1.5 flex-1">
//                         <div className="flex items-center gap-3">
//                           <Label className="text-lg font-bold text-secondary">
//                             {formValues[setting.key]?.label?.en || setting.key}
//                           </Label>
//                           {setting.type && (
//                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
//                                {setting.type}
//                              </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
//                           {formValues[setting.key]?.description?.en}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <div className="w-full md:w-64">
//                           {setting.type === 'boolean' ? (
//                             <div className="flex justify-end pr-4">
//                               <Switch
//                                 checked={formValues[setting.key]?.value === 'true' || formValues[setting.key]?.value === true}
//                                 onCheckedChange={(checked) => handleValueChange(setting.key, checked)}
//                                 size="default"
//                               />
//                             </div>
//                           ) : (
//                             <Input
//                               type={['integer', 'float', 'decimal'].includes(setting.type) ? 'number' : 'text'}
//                               value={formValues[setting.key]?.value || ''}
//                               onChange={(e) => handleValueChange(setting.key, e.target.value)}
//                               className="h-11 bg-input-bg border-none font-medium shadow-sm focus-visible:ring-primary/30"
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import useListSettings from "@/hooks/Settings/useListSettings";
import useUpdateSettings from "@/hooks/Settings/useUpdateSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Save,
  Percent,
  Building2,
  Settings as SettingsIcon,
  ShoppingBag,
  CreditCard,
  BellRing,
  Globe,
  FileText, // Added icon for RFQ
} from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

import usePermission from "@/hooks/usePermission";

const getSettingFileUrl = (value) => {
  if (!value || typeof value !== "string") return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://api.forsa.cloud/${value.replace(/^\//, "")}`;
};

const GROUP_CONFIG = {
  tax: { label: "Taxation", icon: Percent },
  company: { label: "Company Profile", icon: Building2 },
  system: { label: "System Settings", icon: SettingsIcon },
  notification: { label: "Notifications", icon: BellRing },
  rfq: { label: "RFQ Terms & Conditions", icon: FileText },
  bank: { label: "Bank Accounts", icon: CreditCard },
  general: { label: "General Settings", icon: Globe },
};

export default function Settings() {
  const { data: settingsData, isLoading } = useListSettings();
  const updateSettings = useUpdateSettings();
  const { hasPermission } = usePermission();
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    if (settingsData?.data) {
      const initialValues = {};
      settingsData.data.forEach((setting) => {
        initialValues[setting.key] = {
          value: setting.value,
          label: setting.label || { en: "", ar: "" },
          description: setting.description || { en: "", ar: "" },
          type: setting.type,
          group: setting.group,
        };
      });
      setFormValues(initialValues);
    }
  }, [settingsData]);

  const groupedSettings = useMemo(() => {
    if (!settingsData?.data) return {};

    // Explicitly made sure 'rfq' is not inside this array
    const HIDDEN_GROUPS = ["general", "credit", "orders"];

    return settingsData.data.reduce((acc, setting) => {
      const group = setting.group || "general";

      if (HIDDEN_GROUPS.includes(group)) return acc;

      const keyStr = setting.key?.toLowerCase() || "";
      const labelStr = (setting.label?.en || "").toLowerCase();

      if (
        keyStr.includes("date_format") ||
        labelStr.includes("date format") ||
        keyStr.includes("default_tax") ||
        labelStr.includes("default tax")
      ) {
        return acc;
      }

      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    }, {});
  }, [settingsData]);

  const handleValueChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleSave = () => {
    const isMultipart = Object.keys(formValues).some(
      (key) =>
        formValues[key].type === "file" &&
        formValues[key].value instanceof File,
    );

    if (isMultipart) {
      const formData = new FormData();
      Object.keys(formValues).forEach((key, index) => {
        formData.append(`settings[${index}][key]`, key);
        formData.append(`settings[${index}][type]`, formValues[key].type);
        formData.append(`settings[${index}][group]`, formValues[key].group);
        if (formValues[key].label) {
          formData.append(
            `settings[${index}][label][en]`,
            formValues[key].label.en || "",
          );
          formData.append(
            `settings[${index}][label][ar]`,
            formValues[key].label.ar || "",
          );
        }
        if (formValues[key].description) {
          formData.append(
            `settings[${index}][description][en]`,
            formValues[key].description.en || "",
          );
          formData.append(
            `settings[${index}][description][ar]`,
            formValues[key].description.ar || "",
          );
        }
        if (formValues[key].type === "file") {
          if (formValues[key].value instanceof File) {
            formData.append(`settings[${index}][value]`, formValues[key].value);
          } else {
            formData.append(
              `settings[${index}][value]`,
              String(formValues[key].value || ""),
            );
          }
        } else {
          formData.append(
            `settings[${index}][value]`,
            String(formValues[key].value ?? ""),
          );
        }
      });
      updateSettings.mutate({ body: formData });
    } else {
      const updatedSettings = Object.keys(formValues).map((key) => ({
        key,
        value: String(formValues[key].value ?? ""),
        type: formValues[key].type,
        group: formValues[key].group,
        label: formValues[key].label,
        description: formValues[key].description,
      }));
      updateSettings.mutate({ body: { settings: updatedSettings } });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settingsData?.data) {
    return (
      <div className="container mx-auto p-10 text-center">
        <p className="text-lg text-muted-foreground">No settings found.</p>
      </div>
    );
  }

  const groups = Object.keys(groupedSettings);

  return (
    <div className="container mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <PageHeader
          title="System Settings"
          subTitle="Configure your platform preferences and metadata."
        />
        {hasPermission("edit_settings") && (
          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="px-8 py-6 text-lg font-bold shadow-lg transition-all hover:scale-105"
          >
            {updateSettings.isPending ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue={groups[0]} className="w-full">
        <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-3 bg-transparent p-0">
          {groups.map((group) => {
            const config = GROUP_CONFIG[group] || {
              label: group,
              icon: SettingsIcon,
            };
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={group}
                value={group}
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md border border-border/50 px-6 py-3 text-sm font-semibold transition-all"
              >
                <Icon className="mr-2 h-4 w-4" />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(groupedSettings).map(([group, settings]) => (
          <TabsContent
            key={group}
            value={group}
            className="space-y-6 mt-6! outline-none animate-in fade-in-50 duration-500"
          >
            <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 border-b border-border/40 pb-6">
                <CardTitle className="text-2xl font-black text-secondary">
                  {GROUP_CONFIG[group]?.label || group}
                </CardTitle>
                <CardDescription className="text-base">
                  Detailed configuration for {group.toLowerCase()} parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/30 p-0">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="group/item transition-colors hover:bg-muted/10"
                  >
                    {/* Altered spacing layout rules slightly here to account for vertical layouts on larger text areas */}
                    <div className="flex flex-col gap-4 p-8 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <Label className="text-lg font-bold text-secondary">
                            {formValues[setting.key]?.label?.en || setting.key}
                          </Label>
                          {setting.type && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                              {setting.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground max-w-2xl">
                          {formValues[setting.key]?.description?.en}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-full md:w-80 lg:w-[450px]">
                          {setting.type === "boolean" ? (
                            <div className="flex justify-end pr-4">
                              <Switch
                                checked={
                                  formValues[setting.key]?.value === "true" ||
                                  formValues[setting.key]?.value === true
                                }
                                onCheckedChange={(checked) =>
                                  handleValueChange(setting.key, checked)
                                }
                                size="default"
                              />
                            </div>
                          ) : setting.type === "file" ? (
                            <div className="flex flex-col gap-2.5">
                              {formValues[setting.key]?.value && (
                                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/30">
                                  {typeof formValues[setting.key].value ===
                                  "string" ? (
                                    <img
                                      src={getSettingFileUrl(
                                        formValues[setting.key].value,
                                      )}
                                      alt="Preview"
                                      className="w-12 h-12 object-cover rounded-lg border border-border"
                                    />
                                  ) : formValues[setting.key].value instanceof
                                    File ? (
                                    <img
                                      src={URL.createObjectURL(
                                        formValues[setting.key].value,
                                      )}
                                      alt="Local Preview"
                                      className="w-12 h-12 object-cover rounded-lg border border-border"
                                    />
                                  ) : null}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">
                                      {formValues[setting.key].value instanceof
                                      File
                                        ? formValues[setting.key].value.name
                                        : formValues[setting.key].value
                                            .split("/")
                                            .pop()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {formValues[setting.key].value instanceof
                                      File
                                        ? `${(formValues[setting.key].value.size / 1024).toFixed(1)} KB`
                                        : "Uploaded Image"}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`file-input-${setting.key}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handleValueChange(setting.key, file);
                                    }
                                  }}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    document
                                      .getElementById(
                                        `file-input-${setting.key}`,
                                      )
                                      ?.click()
                                  }
                                  className="h-10 px-4 rounded-xl border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 gap-2 shadow-sm"
                                >
                                  Choose Image
                                </Button>
                                {formValues[setting.key]?.value && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                      handleValueChange(setting.key, "")
                                    }
                                    className="h-10 px-4 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold"
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : setting.key === "rfq_terms_and_conditions" ? (
                            /* Supported multi-line text input for Terms & Conditions */
                            <Textarea
                              value={formValues[setting.key]?.value || ""}
                              onChange={(e) =>
                                handleValueChange(setting.key, e.target.value)
                              }
                              className="min-h-32 bg-input-bg border-none font-medium shadow-sm focus-visible:ring-primary/30 resize-y"
                              placeholder="Enter terms and conditions..."
                            />
                          ) : (
                            <Input
                              type={
                                ["integer", "float", "decimal"].includes(
                                  setting.type,
                                )
                                  ? "number"
                                  : "text"
                              }
                              value={formValues[setting.key]?.value || ""}
                              onChange={(e) =>
                                handleValueChange(setting.key, e.target.value)
                              }
                              className="h-11 bg-input-bg border-none font-medium shadow-sm focus-visible:ring-primary/30"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
