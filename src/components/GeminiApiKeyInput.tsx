
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeminiContext } from "@/context/GeminiContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info } from "lucide-react";

export default function GeminiApiKeyInput() {
  const { apiKey, modelName, setApiKey, setModelName } = useGeminiContext();
  const [inputApiKey, setInputApiKey] = useState(apiKey || "");
  const [isEditingKey, setIsEditingKey] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (!inputApiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive"
      });
      return;
    }

    setApiKey(inputApiKey.trim());
    setIsEditingKey(false);
    toast({
      title: "Success",
      description: "Gemini API key saved successfully",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Google Gemini API Configuration</CardTitle>
        <CardDescription>
          Configure your Google Gemini API settings for AI-powered features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isEditingKey ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Gemini API key is already configured and ready to use
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">API Key</p>
                <p className="text-sm text-muted-foreground">
                  •••••••••••••••••••••••{apiKey ? apiKey.slice(-4) : ""}
                </p>
              </div>
              <Button variant="outline" onClick={() => setIsEditingKey(true)}>
                Change
              </Button>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The app comes pre-configured with a default API key. You only need to change it if you want to use your own key.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="api-key"
              type="password"
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from the{" "}
              <a
                href="https://ai.google.dev/tutorials/setup"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium">
            Gemini Model
          </label>
          <Select value={modelName} onValueChange={setModelName}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-2.0-flash">gemini-2.0-flash (Recommended)</SelectItem>
              <SelectItem value="gemini-pro">gemini-pro</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            gemini-2.0-flash offers the best performance for most use cases
          </p>
        </div>
      </CardContent>
      {isEditingKey && (
        <CardFooter>
          <Button onClick={handleSaveApiKey}>Save API Key</Button>
        </CardFooter>
      )}
    </Card>
  );
}
