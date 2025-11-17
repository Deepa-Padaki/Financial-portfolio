import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Fingerprint } from 'lucide-react';

export function BiometricAuth() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  // NOTE: Biometric enablement should be tracked server-side in production
  // This component state is temporary - should be replaced with database storage
  const [isEnabled, setIsEnabled] = useState(false);

  const checkBiometricSupport = async () => {
    if (!window.PublicKeyCredential) {
      toast({
        title: 'Not supported',
        description: 'Biometric authentication is not supported on this device.',
        variant: 'destructive'
      });
      return false;
    }

    const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    if (!available) {
      toast({
        title: 'Not available',
        description: 'No biometric authenticator found on this device.',
        variant: 'destructive'
      });
      return false;
    }

    return true;
  };

  const handleEnableBiometric = async () => {
    setIsLoading(true);
    try {
      const supported = await checkBiometricSupport();
      if (!supported) {
        setIsLoading(false);
        return;
      }

      // Generate a challenge (in production, this should come from the server)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'TradeShift',
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: 'user@example.com', // Should be actual user email
          displayName: 'User'
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },  // ES256
          { alg: -257, type: 'public-key' } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: 60000,
        attestation: 'none'
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        // TODO: Send credential to server for secure storage in database
        // Should be stored in profiles table with has_biometric_auth boolean column
        setIsEnabled(true);
        toast({
          title: 'Biometric enabled',
          description: 'You can now use biometric authentication to sign in.'
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Biometric setup error:', error);
      }
      toast({
        title: 'Setup failed',
        description: 'Could not set up biometric authentication.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableBiometric = () => {
    // TODO: Remove credential from server-side storage
    setIsEnabled(false);
    toast({
      title: 'Biometric disabled',
      description: 'Biometric authentication has been turned off.'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Biometric Login
        </CardTitle>
        <CardDescription>
          Use fingerprint or face recognition to sign in
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEnabled ? (
          <Button variant="outline" onClick={handleDisableBiometric}>
            Disable Biometric
          </Button>
        ) : (
          <Button onClick={handleEnableBiometric} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : 'Enable Biometric'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
