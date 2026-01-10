"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  LogOut, 
  Edit3,
  Camera,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUser, getUserRole } from "@/lib/auth";
import { useLanguage } from "@/lib/language-context";

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<number | null>(null);
  const { language, setLanguage, t, dir } = useLanguage();

  useEffect(() => {
    setUser(getUser());
    setRole(getUserRole());
  }, []);

  const displayName = useMemo(() => {
    if (!user) return t('loading');
    return user.name || user.fullName || user.email?.split("@")[0] || t('user');
  }, [user, t]);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }, [displayName]);

  const getRoleBadge = (roleNum: number | null) => {
    switch (roleNum) {
      case 0: return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none px-3 py-1">{t('admin')}</Badge>;
      case 1: return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">{t('employee')}</Badge>;
      case 2: return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1">{t('citizen')}</Badge>;
      default: return <Badge variant="outline" className="px-3 py-1">{t('user')}</Badge>;
    }
  };

  return (
    <div className="min-h-full bg-slate-50/30 p-4 md:p-8" dir={dir}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card className="border-none shadow-sm overflow-hidden bg-white rounded-2xl">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
          </div>
          <CardContent className="relative pt-0 pb-8 px-8">
            <div className="flex flex-col md:flex-row items-end gap-6 -mt-12">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-3xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 pb-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                  {getRoleBadge(role)}
                </div>
                <p className="text-slate-500 mt-1">{user?.email}</p>
              </div>

              <div className="flex gap-3 pb-2">
                <Button variant="outline" className="rounded-xl px-5 border-slate-200">
                  <Edit3 className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                  {t('edit')}
                </Button>
                <Button variant="destructive" className="rounded-xl px-5" asChild>
                  <Link href="/logout">
                    <LogOut className={`w-4 h-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
                    {t('logout')}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-none shadow-sm bg-white rounded-2xl">
            <CardHeader className="border-b border-slate-50 px-8 py-6">
              <CardTitle className="text-lg font-semibold text-slate-900">{t('accountDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('fullName')}</label>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><User className="w-4 h-4 text-slate-400" /></div>
                    {displayName}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('emailAddress')}</label>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><Mail className="w-4 h-4 text-slate-400" /></div>
                    {user?.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('department')}</label>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><Building2 className="w-4 h-4 text-slate-400" /></div>
                    {user?.department || t('operations')}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('phoneNumber')}</label>
                  <div className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
                    {user?.phone || "+963 **********"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 px-6 py-6 bg-slate-50/30">
              <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Languages className="w-4 h-4" />
                {t('language')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-2">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'} 
                  className="justify-between rounded-xl h-12 px-4"
                  onClick={() => setLanguage('en')}
                >
                  <span>{t('english')}</span>
                  {language === 'en' && <div className="h-2 w-2 rounded-full bg-white" />}
                </Button>
                <Button 
                  variant={language === 'ar' ? 'default' : 'outline'} 
                  className="justify-between rounded-xl h-12 px-4 font-arabic"
                  onClick={() => setLanguage('ar')}
                >
                  <span>{t('arabic')}</span>
                  {language === 'ar' && <div className="h-2 w-2 rounded-full bg-white" />}
                </Button>
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">{t('activeSession')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

