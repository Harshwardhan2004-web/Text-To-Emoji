import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Globe,
  AlertTriangle,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold gradient-text">
              About SecureText
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how our passkey-based encryption system protects your
              messages with cutting-edge security technology.
            </p>
          </div>

          {/* What are Passkeys */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Key className="h-6 w-6 text-primary" />
                What are Passkeys?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Passkeys are a new type of digital credential that replaces
                passwords with cryptographic key pairs. They're built on the
                WebAuthn standard and provide the highest level of security
                while being incredibly user-friendly.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Benefits:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Phishing resistant</li>
                    <li>• No passwords to remember</li>
                    <li>• Biometric authentication</li>
                    <li>• Cryptographically secure</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">How they work:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Generate unique key pairs</li>
                    <li>• Private key never leaves device</li>
                    <li>• Biometric verification required</li>
                    <li>• Works across devices & platforms</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How SecureText Works */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                How SecureText Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Passkey Creation</h4>
                    <p className="text-muted-foreground text-sm">
                      When you create a passkey, your device generates a unique
                      cryptographic key pair. The private key is securely stored
                      on your device and protected by biometric authentication.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Message Encryption</h4>
                    <p className="text-muted-foreground text-sm">
                      Your message is encrypted using AES-256-GCM encryption.
                      The encryption key is derived from your passkey signature
                      using PBKDF2 with 100,000 iterations, ensuring maximum
                      security.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Emoji Encoding</h4>
                    <p className="text-muted-foreground text-sm">
                      The encrypted data is converted into a sequence of emojis
                      for easy sharing. Each byte of encrypted data maps to a
                      specific emoji from our curated set of 96 colorful
                      symbols.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secure Decryption</h4>
                    <p className="text-muted-foreground text-sm">
                      To decrypt, you authenticate with your passkey, which
                      recreates the encryption key. The emojis are decoded back
                      to encrypted data, then decrypted to reveal the original
                      message.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Encryption
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• AES-256-GCM symmetric encryption</li>
                      <li>• PBKDF2 key derivation (100k iterations)</li>
                      <li>• Random IV for each encryption</li>
                      <li>• Authenticated encryption prevents tampering</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Authentication
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• WebAuthn/FIDO2 standard compliance</li>
                      <li>• Biometric user verification required</li>
                      <li>• Private keys never leave your device</li>
                      <li>• Replay attack protection</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2">Privacy</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Zero-knowledge architecture</li>
                      <li>• No server-side message storage</li>
                      <li>• Client-side encryption only</li>
                      <li>• No tracking or analytics</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-2">
                      Compatibility
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Works on modern browsers</li>
                      <li>• Supports various authenticators</li>
                      <li>• Cross-platform passkey sync</li>
                      <li>• Hardware security key support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Compatibility */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Smartphone className="h-6 w-6 text-primary" />
                Device Compatibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <Globe className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">Browsers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Chrome 67+</li>
                    <li>Firefox 60+</li>
                    <li>Safari 14+</li>
                    <li>Edge 18+</li>
                  </ul>
                </div>
                <div className="text-center space-y-3">
                  <Smartphone className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">Mobile</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>iOS 16+ (Face ID/Touch ID)</li>
                    <li>Android 9+ (Fingerprint)</li>
                    <li>Windows Hello</li>
                    <li>Hardware keys</li>
                  </ul>
                </div>
                <div className="text-center space-y-3">
                  <Key className="h-8 w-8 text-primary mx-auto" />
                  <h4 className="font-semibold">Security Keys</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>YubiKey 5 Series</li>
                    <li>SoloKeys</li>
                    <li>Google Titan</li>
                    <li>Any FIDO2 key</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="glass border-warning/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-warning">
                <AlertTriangle className="h-6 w-6" />
                Important Security Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p>
                  <strong>Backup your passkeys:</strong> If you lose access to
                  your passkey, you won't be able to decrypt your messages. Make
                  sure your passkeys are synced to your cloud provider (iCloud,
                  Google, etc.) or backed up properly.
                </p>
                <p>
                  <strong>Device security:</strong> Since your private key is
                  stored on your device, keep your device secure with screen
                  locks and up-to-date software.
                </p>
                <p>
                  <strong>Emoji sharing:</strong> While emojis make sharing fun
                  and easy, remember that anyone with the emoji sequence and
                  your passkey could potentially decrypt the message.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
