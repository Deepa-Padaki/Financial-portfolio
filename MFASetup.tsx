import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Shield, Copy, Check } from 'lucide-react';

export function MFASetup() {
  const { enrollMFA, verifyMFA } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'idle' | 'setup' | 'verify'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [factorId, setFactorId] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      const mfaData = await enrollMFA();
      if (mfaData) {
        setQrCode(mfaData.qrCode);
        setSecret(mfaData.secret);
        setStep('setup');
      } else {
        toast({
          title: 'Setup failed',
          description: 'Could not initialize MFA. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during MFA setup.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      toast({
        title: 'Invalid code',
        description: 'Please enter a 6-digit code.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await verifyMFA(code, factorId);
      if (error) {
        toast({
          title: 'Verification failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'MFA enabled',
          description: 'Two-factor authentication is now active.'
        });
        setStep('idle');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during verification.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied',
      description: 'Secret key copied to clipboard.'
    });
  };

  if (step === 'idle') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleEnroll} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : 'Enable MFA'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'setup') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
          <CardDescription>
            Use an authenticator app like Google Authenticator or Authy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
          </div>
          <div className="space-y-2">
            <Label>Or enter this code manually:</Label>
            <div className="flex gap-2">
              <Input value={secret} readOnly className="font-mono" />
              <Button variant="outline" size="icon" onClick={copySecret}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button onClick={() => setStep('verify')} className="w-full">
            Continue to Verification
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Setup</CardTitle>
        <CardDescription>
          Enter the 6-digit code from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="mfa-code">Verification Code</Label>
          <Input
            id="mfa-code"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="text-center text-2xl tracking-widest"
          />
        </div>
        <Button onClick={handleVerify} disabled={isLoading} className="w-full">
          {isLoading ? <LoadingSpinner size="sm" /> : 'Verify and Enable'}
        </Button>
      </CardContent>
    </Card>
  );
}
