import { useState } from "react";
import Navigation from "@/components/Navigation";
import EncryptDecrypt from "@/components/EncryptDecrypt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function Index() {
  const [showApp, setShowApp] = useState(false);

  if (!showApp) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 animated-gradient opacity-10" />
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="gradient-text">Secure</span>
                  <span className="text-foreground">Text</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Encrypt your messages with shared passwords and share them as
                  beautiful emoji sequences
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-6 py-8">
                <div className="flex items-center gap-3 text-sm">
                  <Key className="h-5 w-5 text-primary" />
                  <span>Password Protected</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="h-5 w-5 text-primary" />
                  <span>AES-256 Encrypted</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Emoji Encoded</span>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setShowApp(true)}
                className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              >
                <Key className="h-5 w-5 mr-2" />
                Start Encrypting
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                How It Works
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="glass text-center">
                  <CardHeader>
                    <Key className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Create Shared Key</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Create a custom password that you can share with others to
                      encrypt and decrypt messages together.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass text-center">
                  <CardHeader>
                    <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Encrypt Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Type your secret message and encrypt it using
                      military-grade AES-256 encryption with your shared
                      password.
                    </p>
                  </CardContent>
                </Card>

                <Card className="glass text-center">
                  <CardHeader>
                    <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Share as Emojis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Your encrypted message becomes a sequence of colorful
                      emojis that can be safely shared anywhere.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Security Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-2xl font-bold">Military-Grade Security</h2>
              <p className="text-muted-foreground">
                SecureText uses password-based encryption with AES-256-GCM
                combined with PBKDF2 key derivation. Your messages are protected
                by the same cryptographic standards used by governments and
                financial institutions.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span>• AES-256-GCM Encryption</span>
                <span>• PBKDF2 Key Derivation</span>
                <span>• Shared Password System</span>
                <span>• Client-Side Encryption</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8">
        <EncryptDecrypt />
      </div>
    </div>
  );
}
