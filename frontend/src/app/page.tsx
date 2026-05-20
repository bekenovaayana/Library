import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ROUTES } from "@/shared/constants/routes";
import { createPageMetadata, siteConfig } from "@/shared/lib/seo";

export const metadata = createPageMetadata(
  siteConfig.name,
  siteConfig.description,
  ROUTES.HOME,
);

export default function HomePage() {  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-4 md:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-5 w-5" />
          {siteConfig.name}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
          <Button asChild>
            <Link href={ROUTES.REGISTER}>Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Manage your library with ease
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Browse books, track borrows, and manage your collection — all in one modern
          interface.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <Link href={ROUTES.REGISTER}>
              Create account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.BOOKS}>Browse books</Link>
          </Button>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { title: "Book Catalog", desc: "Search and filter thousands of titles" },
            { title: "Borrow Tracking", desc: "Manage your borrowed books easily" },
            { title: "Admin Tools", desc: "Full control for library administrators" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
