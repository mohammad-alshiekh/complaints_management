"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
   Edit2, 
  Trash2, 
  Building2, 
    Loader2,
  X,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import apiClient from "@/app/lib/api";
import { toast } from "sonner";
import Image from "next/image";
import { getToken } from "@/lib/auth";
import { Modal } from "@/components/Modal";
import { useLanguage } from "@/lib/language-context";

interface Agency {
  id: string;
  name: string;
  logoUrl: string | null;
}

const isValidUrl = (url: string | null | undefined) => {
  if (!url) return false;
  return url.startsWith("http") || url.startsWith("https") || url.startsWith("/") || url.startsWith("data:");
};

const getFullImageUrl = (url: string | null | undefined) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("data:")) return url;
   const apiBaseUrl = "https://complaint.runasp.net";
  return `${apiBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

const AgenciesPage = () => {
  const { t, dir } = useLanguage();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  const [currentAgency, setCurrentAgency] = useState<Agency | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    logoFile: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      const data = await apiClient.getAgencies(token);
      setAgencies(data);
    } catch (error: any) {
      toast.error(error.message || t("failedToFetchAgencies") || "Failed to fetch agencies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logoFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", logoUrl: "", logoFile: null });
    setPreviewUrl(null);
    setCurrentAgency(null);
  };

  const handleCreate = async () => {
    if (!formData.name) return toast.error(t('agencyNameRequired'));

    try {
      setIsProcessing(true);
      const token = getToken();
      
      if (!token) {
        toast.error(t('loginRequiredToCreate'));
        return;
      }
      
      const form = new FormData();
      form.append("Name", formData.name);
      form.append("LogoUrl", formData.logoUrl || "string");
      if (formData.logoFile) {
        form.append("Logo", formData.logoFile);
      }

      await apiClient.createAgency(form, token);
      toast.success(t('agencyCreated'));
      setModals(prev => ({ ...prev, add: false }));
      resetForm();
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || t('failedToCreateAgency'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    if (!currentAgency || !formData.name) return;

    try {
      setIsProcessing(true);
      const token = getToken();
      
      if (!token) {
        toast.error(t('loginRequiredToUpdate'));
        return;
      }
      
      const form = new FormData();
      form.append("Name", formData.name);
      form.append("LogoUrl", formData.logoUrl || "string");
      if (formData.logoFile) {
        form.append("Logo", formData.logoFile);
      }

      await apiClient.updateAgency(currentAgency.id, form, token);
      toast.success(t('agencyUpdated'));
      setModals(prev => ({ ...prev, edit: false }));
      resetForm();
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || t('failedToUpdateAgency'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!currentAgency) return;

    try {
      setIsProcessing(true);
      const token = getToken();
      await apiClient.deleteAgency(currentAgency.id, token);
      toast.success(t('agencyDeleted'));
      setModals(prev => ({ ...prev, delete: false }));
      setCurrentAgency(null);
      fetchAgencies();
    } catch (error: any) {
      toast.error(error.message || t('failedToDeleteAgency'));
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen" dir={dir}>
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-700">{t('agenciesTitle')}</h1>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{t('manageAgencies') || 'Manage Government Entities'}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 max-w-md">
            <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors`} />
            <Input 
              placeholder={t('searchAgencies') || 'Search agencies...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`rounded-xl border-slate-200 ${dir === 'rtl' ? 'pr-11' : 'pl-11'} h-11 bg-white focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all`}
            />
          </div>
          <Button 
            onClick={() => setModals(prev => ({ ...prev, add: true }))}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-11 font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addAgency')}</span>
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl border-none shadow-md overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" dir={dir}>
            <thead className="border-b bg-slate-50/50">
              <tr>
                <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('agencies')}</th>
                <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('accountStatus')}</th>
                <th className={`px-6 py-4 font-medium text-slate-500 uppercase tracking-wider text-[11px] ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100" />
                        <div className="h-4 bg-slate-100 rounded w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-full w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-9 h-9 bg-slate-50 rounded-lg" />
                        <div className="w-9 h-9 bg-slate-50 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{t('noAgenciesFound')}</h3>
                      <p className="text-slate-500 max-w-xs mx-auto mt-1">
                        {searchQuery ? `${t('noAgenciesFound')} "${searchQuery}"` : t('getStartedAdding')}
                      </p>
                      {searchQuery && (
                        <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-4 rounded-xl">
                          {t('clearSearch')}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden relative shadow-sm">
                          {isValidUrl(agency.logoUrl) ? (
                            <Image 
                              src={getFullImageUrl(agency.logoUrl)} 
                              alt={agency.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{agency.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {agency.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                        <span className="text-xs font-semibold text-slate-600">{t('active')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentAgency(agency);
                            setFormData({ name: agency.name, logoUrl: agency.logoUrl || "", logoFile: null });
                            setModals(prev => ({ ...prev, edit: true }));
                          }}
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentAgency(agency);
                            setModals(prev => ({ ...prev, delete: true }));
                          }}
                          className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Agency Modal */}
      {modals.add && (
        <Modal 
          onClose={() => { setModals(prev => ({ ...prev, add: false })); resetForm(); }}
          title={t('addAgency')}
        >
          <div className="space-y-6" dir={dir}>
            <div className="space-y-4 px-6 py-4">
              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('agencyName')}</label>
                <Input 
                  placeholder={t('agencyName')} 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-2xl border-slate-200 h-12 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('logoUrl')}</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="rounded-2xl border-slate-200 h-12 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            

              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('uploadLogo')}</label>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${isValidUrl(previewUrl) ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                    {isValidUrl(previewUrl) ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                        <Image 
                          src={getFullImageUrl(previewUrl)} 
                          alt="Preview" 
                          fill
                          className="object-cover" 
                        />
                        <button 
                          onClick={(e) => { e.stopPropagation();   setFormData(prev => ({ ...prev, logoFile: null })); }}
                          className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 z-20`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{t('clickToUpload') || 'Click or drag image to upload'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 px-6 pb-6">
              <Button 
                variant="outline" 
                onClick={() => { setModals(prev => ({ ...prev, add: false })); resetForm(); }}
                className="flex-1 rounded-2xl h-12 font-bold text-slate-600"
              >
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={isProcessing}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-blue-500/20 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t('addAgency')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Agency Modal */}
      {modals.edit && (
        <Modal 
          onClose={() => { setModals(prev => ({ ...prev, edit: false })); resetForm(); }}
          title={t('editAgency')}
        >
          <div className="space-y-6" dir={dir}>
            <div className="space-y-4 px-6 py-4">
              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('agencyName')}</label>
                <Input 
                  placeholder={t('agencyName')} 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-2xl border-slate-200 h-12 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('logoUrl')}</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.logoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="rounded-2xl border-slate-200 h-12 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-sm font-bold text-slate-700 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>{t('uploadLogo')}</label>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${previewUrl || (currentAgency?.logoUrl) ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}>
                    {(previewUrl || currentAgency?.logoUrl) ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl">
                        <Image 
                          src={getFullImageUrl(previewUrl || currentAgency?.logoUrl)} 
                          alt="Preview" 
                          fill 
                          className="object-cover" 
                        />
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setPreviewUrl(null); 
                            setFormData(prev => ({ ...prev, logoFile: null }));
                            if (currentAgency) {
                              setCurrentAgency({...currentAgency, logoUrl: null});
                            }
                          }}
                          className={`absolute top-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 z-20`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-500">{t('clickToUpload') || 'Click or drag image to update'}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 px-6 pb-6">
              <Button 
                variant="outline" 
                onClick={() => { setModals(prev => ({ ...prev, edit: false })); resetForm(); }}
                className="flex-1 rounded-2xl h-12 font-bold text-slate-600"
              >
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={isProcessing}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-blue-500/20 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t('save')}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Agency Modal */}
      {modals.delete && (
        <Modal 
          onClose={() => setModals(prev => ({ ...prev, delete: false }))}
          title={t('deleteAgency')}
        >
          <div className="space-y-6 text-center p-6" dir={dir}>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
              <Trash2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">{t('deleteAgency')}</h3>
              <p className="text-slate-500">
                {t('confirmDelete')} <span className="font-bold text-slate-700">"{currentAgency?.name}"</span>? 
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setModals(prev => ({ ...prev, delete: false }))}
                className="flex-1 rounded-2xl h-12 font-bold text-slate-600"
              >
                {t('cancel')}
              </Button>
              <Button 
                onClick={handleDelete}
                disabled={isProcessing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl h-12 font-bold shadow-lg shadow-red-500/20 disabled:opacity-70"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : t('deleteAgency')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AgenciesPage;
