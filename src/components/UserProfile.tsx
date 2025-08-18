import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Camera, User, Edit3, Upload, X, Globe } from 'lucide-react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
import { FlagIcon } from '@/components/FlagIcon';

interface UserProfileData {
  name: string;
  avatar: string;
  initials: string;
  nationality: string;
}

const countries = [
  { code: 'cn', name: '中国' },
  { code: 'us', name: '美国' },
  { code: 'jp', name: '日本' },
  { code: 'kr', name: '韩国' },
  { code: 'sg', name: '新加坡' },
  { code: 'hk', name: '香港' },
  { code: 'tw', name: '台湾' },
  { code: 'gb', name: '英国' },
  { code: 'de', name: '德国' },
  { code: 'fr', name: '法国' },
  { code: 'ca', name: '加拿大' },
  { code: 'au', name: '澳大利亚' },
  { code: 'th', name: '泰国' },
  { code: 'my', name: '马来西亚' },
  { code: 'ph', name: '菲律宾' },
  { code: 'in', name: '印度' },
  { code: 'id', name: '印度尼西亚' },
  { code: 'vn', name: '越南' },
];
import { useLanguage } from "@/hooks/useLanguage";

export const UserProfile = () => {
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    avatar: '',
    initials: '',
    nationality: 'cn'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');
  const [tempNationality, setTempNationality] = useState('cn');
  const [isUploading, setIsUploading] = useState(false);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load profile data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      // Handle backward compatibility for existing profiles without nationality
      const profileWithDefaults = {
        nationality: 'cn',
        ...parsed
      };
      setProfileData(profileWithDefaults);
      setTempName(profileWithDefaults.name);
      setTempAvatar(profileWithDefaults.avatar);
      setTempNationality(profileWithDefaults.nationality);
    }
  }, []);

  // Generate initials from name
  const generateInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Save profile data to localStorage
  const saveProfile = () => {
    const initials = generateInitials(tempName);
    const updatedProfile = {
      name: tempName,
      avatar: tempAvatar,
      initials,
      nationality: tempNationality
    };
    
    setProfileData(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setIsEditing(false);
    
    toast({
      title: t('profile.saved'),
      description: t('profile.updated'),
    });
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件太大",
        description: "请选择小于5MB的图片文件",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "文件格式错误",
        description: "请选择有效的图片文件",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      let processedImageUrl = '';

      // Apply background removal if enabled
      if (removeBackgroundEnabled) {
        toast({
          title: "正在处理图片",
          description: "正在移除背景，请稍候...",
        });

        const imageElement = await loadImage(file);
        const processedBlob = await removeBackground(imageElement);
        
        // Convert processed blob to base64
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setTempAvatar(result);
          
          toast({
            title: "头像上传成功",
            description: "背景已自动移除",
          });
        };
        reader.readAsDataURL(processedBlob);
        return;
      }

      // Normal upload without background removal
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempAvatar(result);
        
        toast({
          title: "头像上传成功",
          description: "头像已更新",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
      toast({
        title: "上传失败",
        description: "头像上传失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset editing state
  const cancelEdit = () => {
    setTempName(profileData.name);
    setTempAvatar(profileData.avatar);
    setTempNationality(profileData.nationality);
    setIsEditing(false);
  };

  // Remove avatar
  const removeAvatar = () => {
    setTempAvatar('');
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild>
        <div className="group cursor-pointer">
          <div className="flex items-center gap-4 px-5 py-3 bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-accent/20">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-accent/30 ring-offset-2 ring-offset-transparent transition-all duration-300 group-hover:ring-accent/50 shadow-lg">
                <AvatarImage src={profileData.avatar} alt={profileData.name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-accent/30 to-accent/20 text-accent text-lg font-bold">
                  {profileData.initials || <User className="w-6 h-6" />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <Edit3 className="w-3 h-3 text-accent-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-accent truncate">
                  {profileData.name || 'LINYUAN'}
                </h3>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Globe className="w-3 h-3 text-accent/70" />
                  <p className="text-sm text-accent/70 truncate">
                    {t('profile.personal')}
                  </p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full border border-accent/20">
                  <FlagIcon countryCode={profileData.nationality} size="sm" />
                  <span className="text-xs text-accent/80 font-medium">
                    {countries.find(c => c.code === profileData.nationality)?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('profile.edit')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-blue-500/30">
                <AvatarImage src={tempAvatar} alt={tempName} />
                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-xl">
                  {generateInitials(tempName) || <User className="w-8 h-8" />}
                </AvatarFallback>
              </Avatar>
              
              {tempAvatar && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={removeAvatar}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2" />
                    {t('profile.processing')}
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    {t('profile.upload_avatar')}
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  id="removeBackground"
                  checked={removeBackgroundEnabled}
                  onChange={(e) => setRemoveBackgroundEnabled(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="removeBackground" className="text-muted-foreground cursor-pointer">
                  {t('profile.remove_background')}
                </Label>
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('profile.name_label')}
            </Label>
            <Input
              id="name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={t('profile.name_placeholder')}
              className="bg-slate-700 border-slate-600 text-foreground"
            />
          </div>

          {/* Nationality Section */}
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              国籍
            </Label>
            <Select value={tempNationality} onValueChange={setTempNationality}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-foreground">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <FlagIcon countryCode={tempNationality} size="sm" />
                    <span>{countries.find(c => c.code === tempNationality)?.name}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 z-50">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code} className="text-foreground hover:bg-slate-600">
                    <div className="flex items-center gap-2">
                      <FlagIcon countryCode={country.code} size="sm" />
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="flex-1"
            >
              {t('profile.cancel')}
            </Button>
            <Button
              onClick={saveProfile}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!tempName.trim()}
            >
              {t('profile.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};