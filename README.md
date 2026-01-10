
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Brush,
  Camera,
  Code,
  Download,
  FileText,
  Grid,
  ImageIcon,
  Layers,
  LayoutGrid,
  Palette,
  Play,
  Plus,
  Sparkles,
  Video,
  Clock,
  MoreHorizontal,
  Type,
  CuboidIcon,
  Users,
 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { useLanguage } from "@/lib/language-context"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "MotionFX",
    icon: <Sparkles className="text-blue-500" />,
    description: "Stunning visual effects and animations",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "PageCraft",
    icon: <Layers className="text-red-500" />,
    description: "Professional page design and layout",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "PhotoLab",
    icon: <Camera className="text-teal-500" />,
    description: "Advanced photo editing and organization",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "DocMaster",
    icon: <FileText className="text-red-600" />,
    description: "Document editing and management",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-emerald-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
  {
    name: "FontForge",
    icon: <Type className="text-amber-500" />,
    description: "Typography and font creation",
    category: "Typography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "ColorPalette",
    icon: <Palette className="text-purple-500" />,
    description: "Color scheme creation and management",
    category: "Design",
    recent: false,
    new: false,
    progress: 100,
  },
]

const recentFiles = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "8.2 MB",
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "1.2 GB",
    collaborators: 0,
  },
  {
    name: "UI Animation.mfx",
    app: "MotionFX",
    modified: "Last week",
    icon: <Sparkles className="text-blue-500" />,
    shared: true,
    size: "345 MB",
    collaborators: 4,
  },
  {
    name: "Magazine Layout.pgc",
    app: "PageCraft",
    modified: "2 weeks ago",
    icon: <Layers className="text-red-500" />,
    shared: false,
    size: "42.8 MB",
    collaborators: 0,
  },
  {
    name: "Mobile App Design.uxf",
    app: "UXFlow",
    modified: "3 weeks ago",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    shared: true,
    size: "18.3 MB",
    collaborators: 5,
  },
  {
    name: "Product Photography.phl",
    app: "PhotoLab",
    modified: "Last month",
    icon: <Camera className="text-teal-500" />,
    shared: false,
    size: "156 MB",
    collaborators: 0,
  },
]

const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
  {
    name: "Marketing Campaign",
    description: "Summer promotion materials",
    progress: 40,
    dueDate: "August 10, 2025",
    members: 5,
    files: 31,
  },
]

const tutorials = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
  {
    title: "Video Editing Masterclass",
    description: "Professional techniques for cinematic video editing",
    duration: "3h 10m",
    level: "Advanced",
    instructor: "James Wilson",
    category: "Video",
    views: "32K",
  },
  {
    title: "Typography Essentials",
    description: "Create beautiful and effective typography for any project",
    duration: "1h 30m",
    level: "Beginner",
    instructor: "Emma Thompson",
    category: "Typography",
    views: "18K",
  },
  {
    title: "Color Theory for Designers",
    description: "Understanding color relationships and psychology",
    duration: "2h 05m",
    level: "Intermediate",
    instructor: "David Kim",
    category: "Design",
    views: "41K",
  },
]


const chartData = [
  { name: "Jan", sales: 4000, views: 2400, workflows: 240 },
  { name: "Feb", sales: 3000, views: 1398, workflows: 221 },
  { name: "Mar", sales: 2000, views: 9800, workflows: 229 },
  { name: "Apr", sales: 2780, views: 3908, workflows: 200 },
  { name: "May", sales: 1890, views: 4800, workflows: 218 },
  { name: "Jun", sales: 2390, views: 3800, workflows: 250 },
  { name: "Jul", sales: 3490, views: 4300, workflows: 210 },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("home")
  const { t, dir } = useLanguage()

  const apps = [
    {
      name: "PixelMaster",
      icon: <ImageIcon className="text-violet-500" />,
      description: t('pixelMasterDesc'),
      category: t('creative'),
      recent: true,
      new: false,
      progress: 100,
    },
    {
      name: "VectorPro",
      icon: <Brush className="text-orange-500" />,
      description: t('vectorProDesc'),
      category: t('creative'),
      recent: true,
      new: false,
      progress: 100,
    },
    {
      name: "VideoStudio",
      icon: <Video className="text-pink-500" />,
      description: t('videoStudioDesc'),
      category: t('video'),
      recent: true,
      new: false,
      progress: 100,
    },
    {
      name: "MotionFX",
      icon: <Sparkles className="text-blue-500" />,
      description: t('motionFXDesc'),
      category: t('video'),
      recent: false,
      new: false,
      progress: 100,
    },
    {
      name: "PageCraft",
      icon: <Layers className="text-red-500" />,
      description: t('pageCraftDesc'),
      category: t('creative'),
      recent: false,
      new: false,
      progress: 100,
    },
    {
      name: "UXFlow",
      icon: <LayoutGrid className="text-fuchsia-500" />,
      description: t('uxFlowDesc'),
      category: t('design'),
      recent: false,
      new: true,
      progress: 85,
    },
    {
      name: "PhotoLab",
      icon: <Camera className="text-teal-500" />,
      description: t('photoLabDesc'),
      category: t('photography'),
      recent: false,
      new: false,
      progress: 100,
    },
    {
      name: "DocMaster",
      icon: <FileText className="text-red-600" />,
      description: t('docMasterDesc'),
      category: t('document'),
      recent: false,
      new: false,
      progress: 100,
    },
    {
      name: "WebCanvas",
      icon: <Code className="text-emerald-500" />,
      description: t('webCanvasDesc'),
      category: t('web'),
      recent: false,
      new: true,
      progress: 70,
    },
    {
      name: "3DStudio",
      icon: <CuboidIcon className="text-indigo-500" />,
      description: t('threeDStudioDesc'),
      category: t('threeD'),
      recent: false,
      new: true,
      progress: 60,
    },
    {
      name: "FontForge",
      icon: <Type className="text-amber-500" />,
      description: t('fontForgeDesc'),
      category: t('typography'),
      recent: false,
      new: false,
      progress: 100,
    },
    {
      name: "ColorPalette",
      icon: <Palette className="text-purple-500" />,
      description: t('colorPaletteDesc'),
      category: t('design'),
      recent: false,
      new: false,
      progress: 100,
    },
  ]

  const recentFiles = [
    {
      name: t('brandRedesign'),
      app: "PixelMaster",
      modified: t('twoHoursAgo'),
      icon: <ImageIcon className="text-violet-500" />,
      shared: true,
      size: "24.5 MB",
      collaborators: 3,
    },
    {
      name: t('companyLogo'),
      app: "VectorPro",
      modified: t('yesterday'),
      icon: <Brush className="text-orange-500" />,
      shared: true,
      size: "8.2 MB",
      collaborators: 2,
    },
    {
      name: t('productLaunchVideo'),
      app: "VideoStudio",
      modified: t('threeDaysAgo'),
      icon: <Video className="text-pink-500" />,
      shared: false,
      size: "1.2 GB",
      collaborators: 0,
    },
    {
      name: t('uiAnimation'),
      app: "MotionFX",
      modified: t('lastWeek'),
      icon: <Sparkles className="text-blue-500" />,
      shared: true,
      size: "345 MB",
      collaborators: 4,
    },
    {
      name: t('magazineLayout'),
      app: "PageCraft",
      modified: t('twoWeeksAgo'),
      icon: <Layers className="text-red-500" />,
      shared: false,
      size: "42.8 MB",
      collaborators: 0,
    },
    {
      name: t('mobileAppDesign'),
      app: "UXFlow",
      modified: t('threeWeeksAgo'),
      icon: <LayoutGrid className="text-fuchsia-500" />,
      shared: true,
      size: "18.3 MB",
      collaborators: 5,
    },
    {
      name: t('productPhotography'),
      app: "PhotoLab",
      modified: t('lastMonth'),
      icon: <Camera className="text-teal-500" />,
      shared: false,
      size: "156 MB",
      collaborators: 0,
    },
  ]

  const projects = [
    {
      name: t('websiteRedesign'),
      description: t('websiteRedesignDesc'),
      progress: 75,
      dueDate: "June 15, 2025",
      members: 4,
      files: 23,
    },
    {
      name: t('mobileAppLaunch'),
      description: t('mobileAppLaunchDesc'),
      progress: 60,
      dueDate: "July 30, 2025",
      members: 6,
      files: 42,
    },
    {
      name: t('brandIdentity'),
      description: t('brandIdentityDesc'),
      progress: 90,
      dueDate: "May 25, 2025",
      members: 3,
      files: 18,
    },
    {
      name: t('marketingCampaign'),
      description: t('marketingCampaignDesc'),
      progress: 40,
      dueDate: "August 10, 2025",
      members: 5,
      files: 31,
    },
  ]

  const tutorials = [
    {
      title: t('digitalIllustrationMasterclass'),
      description: t('digitalIllustrationMasterclassDesc'),
      duration: "1h 45m",
      level: t('advanced'),
      instructor: "Sarah Chen",
      category: t('illustration'),
      views: "24K",
    },
    {
      title: t('uxDesignFundamentals'),
      description: t('uxDesignFundamentalsDesc'),
      duration: "2h 20m",
      level: t('intermediate'),
      instructor: "Michael Rodriguez",
      category: t('design'),
      views: "56K",
    },
    {
      title: t('videoEditingMasterclass'),
      description: t('videoEditingMasterclassDesc'),
      duration: "3h 10m",
      level: t('advanced'),
      instructor: "James Wilson",
      category: t('video'),
      views: "32K",
    },
    {
      title: t('typographyEssentials'),
      description: t('typographyEssentialsDesc'),
      duration: "1h 30m",
      level: t('beginner'),
      instructor: "Emma Thompson",
      category: t('typography'),
      views: "18K",
    },
    {
      title: t('colorTheoryForDesigners'),
      description: t('colorTheoryForDesignersDesc'),
      duration: "2h 05m",
      level: t('intermediate'),
      instructor: "David Kim",
      category: t('design'),
      views: "41K",
    },
  ]

  return (
    <div className="space-y-8" dir={dir}>
      <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="grid w-full max-w-[600px] grid-cols-5 rounded-2xl p-1">
            <TabsTrigger value="home" className="rounded-xl data-[state=active]:rounded-xl">
              {t('home')}
            </TabsTrigger>
            <TabsTrigger value="apps" className="rounded-xl data-[state=active]:rounded-xl">
              {t('apps')}
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-xl data-[state=active]:rounded-xl">
              {t('files')}
            </TabsTrigger>
            <TabsTrigger value="projects" className="rounded-xl data-[state=active]:rounded-xl">
              {t('projects')}
            </TabsTrigger>
            <TabsTrigger value="learn" className="rounded-xl data-[state=active]:rounded-xl">
              {t('learn')}
            </TabsTrigger>
          </TabsList>
          <div className="hidden md:flex gap-2">
            <Button variant="outline" className="rounded-2xl">
              <Download className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('installApp')}
            </Button>
            <Button className="rounded-2xl">
              <Plus className={`h-4 w-4 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
              {t('newProject')}
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="home" className="space-y-8 mt-0">
              <section>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white"
                >
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className={`space-y-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{t('premium')}</Badge>
                      <h2 className="text-3xl font-bold">{t('welcomeTitle')}</h2>
                      <p className="max-w-[600px] text-white/80">
                        {t('welcomeDesc')}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                          {t('explorePlans')}
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10"
                        >
                          {t('takeTour')}
                        </Button>
                      </div>
                    </div>
                    <div className="hidden lg:block">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="relative h-40 w-40"
                      >
                        <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
                        <div className="absolute inset-4 rounded-full bg-white/20" />
                        <div className="absolute inset-8 rounded-full bg-white/30" />
                        <div className="absolute inset-12 rounded-full bg-white/40" />
                        <div className="absolute inset-16 rounded-full bg-white/50" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </section>
<CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="workflows"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold">{t('recentProjects')}</h3>
                      <Button variant="link" className="text-primary">
                        {t('viewAll')}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {projects.map((project, i) => (
                        <motion.div
                          key={project.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Card className="overflow-hidden rounded-2xl transition-all hover:shadow-lg">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className={`text-lg ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{project.name}</CardTitle>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">{t('progress')}</span>
                                  <span className="font-medium">{project.progress}%</span>
                                </div>
                                <Progress value={project.progress} className="h-1.5" />
                              </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{t('due')} {project.dueDate}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{project.members}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  <span>{project.files}</span>
                                </div>
                              </div>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-bold">{t('recommendedForYou')}</h3>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          {t('design')}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          {t('illustration')}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {tutorials.slice(0, 2).map((tutorial, i) => (
                        <Card key={i} className="overflow-hidden rounded-2xl group cursor-pointer">
                          <div className="relative aspect-video overflow-hidden">
                            <img
                              src={`/placeholder.svg?height=200&width=400&text=${tutorial.category}`}
                              alt={tutorial.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center text-indigo-600 scale-0 group-hover:scale-100 transition-transform">
                                <Play className="h-6 w-6 fill-current" />
                              </div>
                            </div>
                            <div className={`absolute bottom-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white`}>
                              {tutorial.duration}
                            </div>
                          </div>
                          <CardHeader className="p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-[10px] h-4 rounded-md">
                                {tutorial.level}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{tutorial.category}</span>
                            </div>
                            <CardTitle className={`text-base line-clamp-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{tutorial.title}</CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-8">
                  <section>
                    <h3 className={`mb-4 text-xl font-bold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('recentActivity')}</h3>
                    <Card className="rounded-2xl border-none bg-muted/30 shadow-none">
                      <CardContent className="p-4">
                        <div className="space-y-6">
                          {[
                            {
                              user: "Alex Morgan",
                              action: "commented on",
                              target: "Website Redesign",
                              time: "2m ago",
                              avatar: "AM",
                            },
                            {
                              user: "Sarah Chen",
                              action: "uploaded",
                              target: "Logo_v2.pxm",
                              time: "15m ago",
                              avatar: "SC",
                            },
                            {
                              user: "James Wilson",
                              action: "shared",
                              target: "Mobile App Assets",
                              time: "1h ago",
                              avatar: "JW",
                            },
                            {
                              user: "Emma Thompson",
                              action: "started",
                              target: "New Tutorial",
                              time: "3h ago",
                              avatar: "ET",
                            },
                          ].map((activity, i) => (
                            <div key={i} className={`flex gap-3 ${dir === 'rtl' ? 'flex-row-reverse text-right' : 'flex-row'}`}>
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                {activity.avatar}
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs">
                                  <span className="font-bold">{activity.user}</span> {activity.action}{" "}
                                  <span className="font-medium text-primary cursor-pointer hover:underline">
                                    {activity.target}
                                  </span>
                                </p>
                                <p className="text-[10px] text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-primary">
                          {t('viewAllActivity')}
                        </Button>
                      </CardFooter>
                    </Card>
                  </section>

                  <section>
                    <h3 className={`mb-4 text-xl font-bold ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('storage')}</h3>
                    <Card className="rounded-2xl border-none bg-muted/30 shadow-none">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t('usedSpace')}</span>
                          <span className="font-bold">78%</span>
                        </div>
                        <Progress value={78} className="h-2 bg-muted-foreground/10" />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-xl bg-background p-2 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('images')}</p>
                            <p className="text-xs font-bold">12.4 GB</p>
                          </div>
                          <div className="rounded-xl bg-background p-2 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('videos')}</p>
                            <p className="text-xs font-bold">45.8 GB</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="outline" className="w-full rounded-xl text-xs">
                          {t('upgradeStorage')}
                        </Button>
                      </CardFooter>
                    </Card>
                  </section>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apps" className="space-y-8 mt-0">
              <section>
                <div className={`mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <h3 className="text-2xl font-bold">{t('allApplications')}</h3>
                    <p className="text-muted-foreground">{t('exploreManageTools')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">
                      {t('allCategories')}
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      {t('latestUpdates')}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {apps.map((app, i) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader>
                          <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted transition-colors group-hover:bg-primary/10">
                              {app.icon}
                            </div>
                            <div className="flex gap-1">
                              {app.new && (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 rounded-md text-[10px] h-5">
                                  {t('new')}
                                </Badge>
                              )}
                              {app.recent && (
                                <Badge variant="secondary" className="rounded-md text-[10px] h-5">
                                  {t('recent')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className={`mt-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{app.name}</CardTitle>
                          <CardDescription className={`line-clamp-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{app.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className={`flex items-center justify-between text-xs ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-muted-foreground">{t('status')}</span>
                              <span className="font-medium text-emerald-500 flex items-center gap-1">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                {t('upToDate')}
                              </span>
                            </div>
                            <Progress value={app.progress} className="h-1" />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button className="w-full rounded-xl group-hover:bg-primary group-hover:text-primary-foreground">
                            {t('openApp')}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="files" className="mt-0">
              <section className="space-y-6">
                <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <h3 className="text-2xl font-bold">{t('recentFiles')}</h3>
                  <div className={`flex gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Grid className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {t('grid')}
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <LayoutGrid className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} /> {t('list')}
                    </Button>
                  </div>
                </div>
                <Card className="rounded-2xl border-none bg-muted/20 shadow-none overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className={`w-full text-sm ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('name')}</th>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('app')}</th>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('modified')}</th>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('size')}</th>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('shared')}</th>
                          <th className={`px-6 py-4 font-medium ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-muted/50">
                        {recentFiles.map((file, i) => (
                          <tr key={i} className="group hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background group-hover:bg-muted transition-colors">
                                  {file.icon}
                                </div>
                                <span className="font-medium">{file.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{file.app}</td>
                            <td className="px-6 py-4 text-muted-foreground">{file.modified}</td>
                            <td className="px-6 py-4 text-muted-foreground">{file.size}</td>
                            <td className="px-6 py-4">
                              <div className={`flex ${dir === 'rtl' ? 'flex-row-reverse space-x-reverse' : '-space-x-2'}`}>
                                {[1, 2, 3].slice(0, file.collaborators).map((_, j) => (
                                  <Avatar key={j} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-[10px] bg-indigo-100 text-indigo-600">
                                      {j + 1}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {file.collaborators > 3 && (
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px]">
                                    +{file.collaborators - 3}
                                  </div>
                                )}
                                {file.collaborators === 0 && <span className="text-xs text-muted-foreground italic">{t('private')}</span>}
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </section>
            </TabsContent>
            <TabsContent value="projects" className="space-y-8 mt-0">
              <section>
                <div className={`mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <h3 className="text-2xl font-bold">{t('allProjects')}</h3>
                    <p className="text-muted-foreground">{t('manageProjectsDesc') || 'Manage and track your creative projects'}</p>
                  </div>
                  <Button className="rounded-xl">
                    <Plus className={`${dir === 'rtl' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('createNewProject')}
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, i) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="overflow-hidden rounded-2xl transition-all hover:shadow-lg">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className={`text-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{project.name}</CardTitle>
                            <Badge variant="secondary" className="rounded-lg">
                              {project.progress === 100 ? t('completed') : t('active')}
                            </Badge>
                          </div>
                          <CardDescription className={`${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className={`flex items-center justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <span className="text-muted-foreground">{t('progress')}</span>
                              <span className="font-bold">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <div className={`flex items-center justify-between text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{project.members} {t('members')}</span>
                            </div>
                            <div className={`flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{project.files} {t('files')}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/20 py-3">
                          <div className={`flex w-full items-center justify-between text-xs ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <span className="text-muted-foreground">{t('due')} {project.dueDate}</span>
                            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-primary">
                              {t('viewDetails')}
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="learn" className="space-y-8 mt-0">
              <section>
                <div className={`mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div>
                    <h3 className="text-2xl font-bold">{t('learningCenter')}</h3>
                    <p className="text-muted-foreground">{t('learningCenterDesc') || 'Master your tools with professional tutorials'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl">{t('tutorials')}</Button>
                    <Button variant="outline" className="rounded-xl">{t('courses')}</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tutorials.map((tutorial, i) => (
                    <motion.div
                      key={tutorial.title}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="group overflow-hidden rounded-2xl cursor-pointer hover:shadow-xl transition-all">
                        <div className="relative aspect-video">
                          <img
                            src={`/placeholder.svg?height=200&width=400&text=${tutorial.category}`}
                            alt={tutorial.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary">
                              <Play className="h-6 w-6 fill-current" />
                            </div>
                          </div>
                          <div className={`absolute bottom-2 ${dir === 'rtl' ? 'left-2' : 'right-2'} rounded bg-black/70 px-2 py-1 text-xs text-white`}>
                            {tutorial.duration}
                          </div>
                        </div>
                        <CardHeader className="p-4">
                          <div className={`flex items-center gap-2 mb-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Badge variant="secondary" className="rounded-md">
                              {t(tutorial.level.toLowerCase())}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{tutorial.category}</span>
                          </div>
                          <CardTitle className={`text-lg leading-tight ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{tutorial.title}</CardTitle>
                        </CardHeader>
                        <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
                          <div className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                            <Users className="h-3 w-3" />
                            <span>{tutorial.views} {t('views')}</span>
                          </div>
                          <span>{t('instructor')}: {tutorial.instructor}</span>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </section>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
