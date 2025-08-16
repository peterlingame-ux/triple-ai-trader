import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      setError(error.message);
      toast({
        title: t('auth.registration_error'),
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: t('auth.check_email'),
        description: t('auth.confirmation_sent'),
      });
    }
    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast({
        title: t('auth.login_error'),
        description: error.message,
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Professional Background with Animated Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md p-6">
        {/* Back Button - Floating */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-16 left-0 text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('auth.back')}
        </Button>

        {/* Professional Glass Card */}
        <Card className="w-full backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl overflow-hidden animate-fade-in">
          {/* Header with Enhanced Branding */}
          <CardHeader className="text-center py-8 px-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/10">
            {/* Logo/Brand Section */}
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/25">
                <div className="text-2xl font-bold text-slate-900">MB</div>
              </div>
              <CardTitle className="text-3xl font-orbitron font-black bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 bg-clip-text text-transparent tracking-tight">
                {t('app.title')}
              </CardTitle>
            </div>
            
            <CardDescription className="text-slate-300 text-sm font-medium">
              {t('auth.login_description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8">
            {/* Enhanced Tabs */}
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1 mb-8">
                <TabsTrigger 
                  value="signin" 
                  className="rounded-lg text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:font-semibold transition-all duration-300"
                >
                  {t('auth.sign_in')}
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-lg text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-yellow-500 data-[state=active]:text-slate-900 data-[state=active]:font-semibold transition-all duration-300"
                >
                  {t('auth.sign_up')}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signin-email" className="text-white/90 font-medium">
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder={t('auth.email_placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25 rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signin-password" className="text-white/90 font-medium">
                      {t('auth.password')}
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder={t('auth.password_placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25 rounded-xl h-12"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-400/25 transition-all duration-300 hover:shadow-amber-400/40 hover:scale-[1.02]" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.sign_in')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-white/90 font-medium">
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t('auth.email_placeholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25 rounded-xl h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-white/90 font-medium">
                      {t('auth.password')}
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder={t('auth.create_password_placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-amber-400/50 focus:ring-amber-400/25 rounded-xl h-12"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-semibold rounded-xl shadow-lg shadow-amber-400/25 transition-all duration-300 hover:shadow-amber-400/40 hover:scale-[1.02]" 
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('auth.sign_up')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-6 bg-red-500/10 border-red-500/20 animate-fade-in">
                <AlertDescription className="text-red-300">{error}</AlertDescription>
              </Alert>
            )}

            {/* Enhanced Security Notice */}
            <div className="mt-8 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl">
              <p className="text-sm text-green-300 text-center flex items-center justify-center gap-2">
                <span className="text-lg">🔒</span>
                {t('auth.security_notice')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}