import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SharedCrypto } from "@/lib/shared-crypto";
import { EmojiEncoder } from "@/lib/emoji-encoder";
import {
  Lock,
  Unlock,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EncryptDecrypt() {
  const [plainText, setPlainText] = useState("");
  const [encryptedEmojis, setEncryptedEmojis] = useState(""); // For encrypt output
  const [decryptInput, setDecryptInput] = useState(""); // For decrypt input
  const [decryptedText, setDecryptedText] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [activeTab, setActiveTab] = useState("encrypt");
  const [encryptPassword, setEncryptPassword] = useState("");
  const [decryptPassword, setDecryptPassword] = useState("");
  const [showEncryptPassword, setShowEncryptPassword] = useState(false);
  const [showDecryptPassword, setShowDecryptPassword] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const showStatus = useCallback(
    (type: "success" | "error" | "info", message: string) => {
      setStatus({ type, message });
      setTimeout(() => setStatus(null), 5000);
    },
    [],
  );

  const handleEncrypt = async () => {
    if (!plainText.trim()) {
      showStatus("error", "Please enter text to encrypt");
      return;
    }

    if (!encryptPassword.trim()) {
      showStatus("error", "Please enter a password to encrypt");
      return;
    }

    const validation = SharedCrypto.validatePassword(encryptPassword);
    if (!validation.valid) {
      showStatus("error", validation.message);
      return;
    }

    setIsEncrypting(true);
    try {
      // Encrypt with the password
      const encryptedMessage = await SharedCrypto.encryptWithPassword(
        plainText,
        encryptPassword,
      );

      const base64Encrypted =
        SharedCrypto.encryptedMessageToBase64(encryptedMessage);
      const emojis = EmojiEncoder.encodeToEmojis(base64Encrypted);

      setEncryptedEmojis(emojis);
      showStatus(
        "success",
        "Text encrypted! Share both the emojis and the password with others.",
      );
    } catch (error) {
      showStatus("error", `Encryption failed: ${error}`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!decryptInput.trim()) {
      showStatus("error", "Please enter encrypted emojis to decrypt");
      return;
    }

    if (!decryptPassword.trim()) {
      showStatus("error", "Please enter the password to decrypt");
      return;
    }

    setIsDecrypting(true);
    try {
      // Decode emojis back to base64
      const base64Encrypted = EmojiEncoder.decodeFromEmojis(decryptInput);

      // Convert base64 to encrypted message
      const encryptedMessage =
        SharedCrypto.base64ToEncryptedMessage(base64Encrypted);

      // Decrypt with the provided password
      const decrypted = await SharedCrypto.decryptWithPassword(
        encryptedMessage,
        decryptPassword,
      );

      setDecryptedText(decrypted);
      showStatus("success", "Text decrypted successfully!");
    } catch (error) {
      showStatus("error", `Decryption failed: ${error}`);
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showStatus("success", "Copied to clipboard!");
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showStatus("success", "Copied to clipboard!");
      } catch (fallbackError) {
        showStatus("error", "Failed to copy to clipboard");
        console.error("Copy error:", error, fallbackError);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Status Bar */}
      {status && (
        <div
          className={cn(
            "p-4 rounded-lg glass border flex items-center gap-3 animate-fade-in",
            status.type === "success" && "border-green-500/50 bg-green-500/10",
            status.type === "error" && "border-red-500/50 bg-red-500/10",
            status.type === "info" && "border-blue-500/50 bg-blue-500/10",
          )}
        >
          {status.type === "success" && (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
          {status.type === "error" && (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )}
          {status.type === "info" && (
            <CheckCircle className="h-5 w-5 text-blue-400" />
          )}
          <span className="text-sm">{status.message}</span>
        </div>
      )}

      {/* Main Encryption/Decryption Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 glass">
          <TabsTrigger value="encrypt" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Encrypt
          </TabsTrigger>
          <TabsTrigger value="decrypt" className="flex items-center gap-2">
            <Unlock className="h-4 w-4" />
            Decrypt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encrypt" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Encrypt Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Message</label>
                <Textarea
                  placeholder="Enter your secret message here..."
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  className="min-h-[120px] glass"
                />
                <div className="text-xs text-muted-foreground">
                  Estimated emoji count:{" "}
                  {EmojiEncoder.estimateEmojiCount(plainText.length)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showEncryptPassword ? "text" : "password"}
                    placeholder="Enter password (5-8 letters/numbers)"
                    value={encryptPassword}
                    onChange={(e) => setEncryptPassword(e.target.value)}
                    className="glass pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEncryptPassword(!showEncryptPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showEncryptPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleEncrypt}
                disabled={
                  isEncrypting || !encryptPassword.trim() || !plainText.trim()
                }
                className="w-full"
              >
                {isEncrypting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Encrypting...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Encrypt with Password
                  </>
                )}
              </Button>

              {encryptedEmojis && (
                <div className="space-y-3 p-4 glass-strong rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Encrypted Emojis
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(encryptedEmojis)}
                      className="glass"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="font-mono text-2xl leading-relaxed p-3 bg-background/30 rounded border border-primary/20 select-all">
                      {encryptedEmojis}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click to select all emojis, then copy and share with your
                      password
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decrypt" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg">Decrypt Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Encrypted Emojis</label>
                <Textarea
                  placeholder="Paste the encrypted emoji sequence here..."
                  value={decryptInput}
                  onChange={(e) => setDecryptInput(e.target.value)}
                  className="min-h-[120px] font-mono text-lg glass"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showDecryptPassword ? "text" : "password"}
                    placeholder="Enter password (5-8 letters/numbers)"
                    value={decryptPassword}
                    onChange={(e) => setDecryptPassword(e.target.value)}
                    className="glass pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDecryptPassword(!showDecryptPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  >
                    {showDecryptPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleDecrypt}
                disabled={
                  isDecrypting ||
                  !decryptInput.trim() ||
                  !decryptPassword.trim()
                }
                className="w-full"
              >
                {isDecrypting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Decrypting...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Decrypt with Password
                  </>
                )}
              </Button>

              {decryptedText && (
                <div className="space-y-3 p-4 glass-strong rounded-lg">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Decrypted Message
                    </label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(decryptedText)}
                      className="glass"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="p-3 bg-background/50 rounded border text-foreground">
                    {decryptedText}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
