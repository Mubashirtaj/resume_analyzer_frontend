'use client';

import { useState } from 'react';
import { X, Edit2, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUser } from '@/context/userdataContext';
import api from '@/lib/axios'; 

interface ProfilePopupProps {
  onClose: () => void;
}

type User = {
  id: string;
  name: string;
  email: string;
  profileimg?: string;
  credits: number;
  provider: string;
  geminimodel?: string | null;
  geminkey?: string | null;
};

const GEMINI_MODELS = [
  { value: 'models/gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'models/gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'models/gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
  { value: 'models/gemini-live-2.5-flash-preview', label: 'Gemini 2.5 Flash (Live / Preview)' },
  { value: 'models/gemini-2.5-flash-preview-native-audio-dialog', label: 'Gemini 2.5 Flash Native Audio' },
  { value: 'models/gemini-2.5-pro-preview-tts', label: 'Gemini 2.5 Pro Preview TTS' },
  { value: 'models/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'models/gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite' },
  { value: 'models/gemini-1.5-pro', label: 'Gemini 1.5 Pro (deprecated)' }
];


export default function ProfilePopup({ onClose }: ProfilePopupProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { user, loading } = useUser() as {
    user: User | null;
    loading: boolean;
  };

  const [profile, setProfile] = useState({
    fileName: user?.name || 'John Doe Profile',
    email: user?.email || 'john.doe@example.com',
    password: 'Change Password',
    provider: user?.provider || 'Google OAuth',
    geminiKey: user?.geminkey || 'Not Have',
    geminiModel: user?.geminimodel || 'gemini-1.5-flash',
    profileImage: user?.profileimg || '/defaultimage.png',
  });

  const [editData, setEditData] = useState(profile);

  const hasGeminiKey = profile.geminiKey && profile.geminiKey !== 'Not Have';

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const updateData = {
        name: editData.fileName,
        geminiKey: editData.geminiKey === 'Not Have' ? null : editData.geminiKey,
        geminiModel: editData.geminiModel || profile.geminiModel,
        ...(editData.password !== 'Change Password' && { password: editData.password }),
        provider: editData.provider,
      };


      const response = await api.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-profile`, updateData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setProfile(editData);
        setIsEditing(false);
        
        
        // refreshUserData();
        
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSaveError(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
    setSaveError(null);
  };

  const handleChange = (field: keyof typeof editData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (saveError) setSaveError(null);
  };
const validValue = GEMINI_MODELS.find(m => m.value === editData.geminiModel)
  ? editData.geminiModel
  : undefined;
 if (loading) {
  return <>
  <div>Loading</div>
  </>
 }
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="bg-card text-card-foreground rounded-2xl shadow-2xl max-w-md w-full border border-border animate-in zoom-in-95 duration-300">
          
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Profile</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-secondary rounded-lg"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            
            {saveError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in duration-300">
                <p className="text-destructive text-sm text-center">{saveError}</p>
              </div>
            )}

            <div className="flex justify-center">
              <div className="relative group">
                <img
                  src={profile.profileImage || "/defaultimage.png"}
                  alt={profile.fileName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
              
              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500">
                <label className="text-sm font-semibold text-muted-foreground">File Name</label>
                {isEditing ? (
                  <Input
                    value={editData.fileName}
                    onChange={(e) => handleChange('fileName', e.target.value)}
                    className="bg-secondary text-secondary-foreground border-border"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                    {profile.fileName}
                  </p>
                )}
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-100">
                <label className="text-sm font-semibold text-muted-foreground">
                  Email
                  <span className="text-xs ml-2 text-primary">(Primary - Cannot be changed)</span>
                </label>
                <p className="p-3 bg-secondary/50 rounded-lg text-secondary-foreground opacity-75 cursor-not-allowed">
                  {profile.email}
                </p>
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-200">
                <label className="text-sm font-semibold text-muted-foreground">Password</label>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={editData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="flex-1 bg-secondary text-secondary-foreground border-border"
                      placeholder="Enter new password"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="flex-1 p-3 bg-secondary rounded-lg text-secondary-foreground">
                      {showPassword ? profile.password : '••••••••••'}
                    </p>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-300">
                <label className="text-sm font-semibold text-muted-foreground">Provider</label>
                {isEditing ? (
                  <Input
                    value={editData.provider}
                    onChange={(e) => handleChange('provider', e.target.value)}
                    className="bg-secondary text-secondary-foreground border-border"
                    disabled={true}
                  />
                ) : (
                  <p className="p-3 bg-secondary rounded-lg text-secondary-foreground">
                    {profile.provider}
                  </p>
                )}
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-400">
                <label className="text-sm font-semibold text-muted-foreground">Gemini API Key</label>
                <div className="flex gap-2">
                  {isEditing ? (
                    <Input
                      type={showGeminiKey ? 'text' : 'password'}
                      value={editData.geminiKey}
                      onChange={(e) => handleChange('geminiKey', e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="flex-1 bg-secondary text-secondary-foreground border-border"
                      disabled={isSaving}
                    />
                  ) : (
                    <p className="flex-1 p-3 bg-secondary rounded-lg text-secondary-foreground">
                      {showGeminiKey ? profile.geminiKey : hasGeminiKey ? '••••••••••••••••••••' : 'Not Have'}
                    </p>
                  )}
                  {!isEditing && hasGeminiKey && (
                    <button
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                    >
                      {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 animate-in fade-in slide-in-from-left duration-500 delay-500">
                <label className="text-sm font-semibold text-muted-foreground">
                  Gemini Model
                  {!hasGeminiKey && (
                    <span className="text-xs ml-2 text-amber-500">(Requires API key)</span>
                  )}
                </label>
                {editData.geminiModel}
                {isEditing && hasGeminiKey ? (
                  <Select
                    value={validValue}
                    onValueChange={(value) => handleChange('geminiModel', value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger className="w-full bg-secondary text-secondary-foreground border-border">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {GEMINI_MODELS.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className={`p-3 rounded-lg ${
                    hasGeminiKey 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'bg-secondary/50 text-muted-foreground opacity-60 cursor-not-allowed'
                  }`}>
                    {hasGeminiKey 
                      ? GEMINI_MODELS.find(m => m.value === profile.geminiModel)?.label || profile.geminiModel
                      : 'No API key configured'
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-border bg-secondary/50">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Edit2 size={18} className="mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}