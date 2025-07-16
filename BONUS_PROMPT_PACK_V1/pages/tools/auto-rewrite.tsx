import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ToolsLayout from "@/components/ToolsLayout";
import { useState } from "react";

const toneOptions = [
  { value: "humor", label: "Humor" },
  { value: "adhd", label: "ADHD-Friendly" },
  { value: "etsy", label: "Etsy Listing" },
  { value: "technical", label: "Technical" },
  { value: "casual", label: "Casual" },
  { value: "professional", label: "Professional" }
];

export default function AutoRewrite() {
  const [inputText, setInputText] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRewrite = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOutputText(`Rewritten in ${selectedTone} tone:\n\n${inputText}`);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ToolsLayout
      title="AutoRewrite Engine"
      description="Transform your text into different tones while preserving meaning"
    >
      <div className="space-y-6 p-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="input">Input Text</Label>
              <Textarea
                id="input"
                placeholder="Enter the text you want to rewrite..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-32"
              />
            </div>

            <div>
              <Label htmlFor="tone">Select Tone</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger id="tone" className="w-full">
                  <SelectValue placeholder="Choose a tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((tone) => (
                    <SelectItem key={tone.value} value={tone.value}>
                      {tone.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleRewrite} 
              disabled={!inputText || !selectedTone || isLoading}
              className="w-full"
            >
              {isLoading ? "Rewriting..." : "Rewrite Text"}
            </Button>

            {outputText && (
              <div>
                <Label htmlFor="output">Rewritten Text</Label>
                <Textarea
                  id="output"
                  value={outputText}
                  readOnly
                  className="h-32 bg-muted"
                />
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Guidelines</h2>
          <ul className="space-y-2 list-disc pl-4">
            <li>Enter your original text in the input field</li>
            <li>Select your desired tone from the dropdown</li>
            <li>Click "Rewrite Text" to transform your content</li>
            <li>The rewritten text will preserve your original meaning while adapting the tone</li>
            <li>Copy the output text to use in your content</li>
          </ul>
        </Card>
      </div>
    </ToolsLayout>
  );
} 