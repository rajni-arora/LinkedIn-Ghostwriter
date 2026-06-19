"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generatePost } from "@/lib/api";

type Tone = "professional" | "casual" | "conversational" | "viral-hook";

const TONES: { value: Tone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "conversational", label: "Conversational" },
  { value: "viral-hook", label: "Viral-Hook Style" },
];

export default function PostGenerator() {
  const [apiKey, setApiKey] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key.");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a topic or brief.");
      return;
    }
    setError("");
    setPost("");
    setLoading(true);
    try {
      const result = await generatePost({ topic, tone, api_key: apiKey });
      setPost(result.post);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Generate a LinkedIn Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            OpenAI API Key
          </label>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Used locally only — never stored or sent anywhere except OpenAI.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <Badge
                key={t.value}
                variant={tone === t.value ? "default" : "outline"}
                className="cursor-pointer select-none px-3 py-1 text-sm"
                onClick={() => setTone(t.value)}
              >
                {t.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Topic / Brief
          </label>
          <Textarea
            placeholder="e.g. The biggest mistake founders make when hiring their first 10 employees"
            rows={4}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button className="w-full" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating…" : "Generate Post"}
        </Button>

        {post && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Post
            </label>
            <Textarea
              rows={10}
              value={post}
              onChange={(e) => setPost(e.target.value)}
              className="resize-none"
            />
            <Button variant="outline" className="w-full" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
