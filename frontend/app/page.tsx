import PostGenerator from "@/components/PostGenerator";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              LinkedIn Ghost Writer
            </h1>
            <p className="mt-2 text-muted-foreground">
              Generate high-performing LinkedIn posts in seconds
            </p>
          </div>
          <PostGenerator />
        </div>
      </div>
    </main>
  );
}
