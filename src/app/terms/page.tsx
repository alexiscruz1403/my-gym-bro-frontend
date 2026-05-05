import type { Metadata } from 'next';
import DOMPurify from 'isomorphic-dompurify';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TermsBackButton } from '@/components/terms/TermsBackButton';
import type { TermsSection } from '@/types/domain.types';

function renderContent(raw: string): string {
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(raw);
  const withBreaks = hasHtmlTags ? raw : raw.replace(/\n/g, '<br>');
  return DOMPurify.sanitize(withBreaks);
}

export const metadata: Metadata = {
  title: 'MyGymBro — Términos y condiciones',
};

async function fetchTermsSections(): Promise<TermsSection[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/terms`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TermsPage() {
  const sections = await fetchTermsSections();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <TermsBackButton />

        <div>
          <h1 className="font-display text-3xl font-bold">Términos y condiciones</h1>
        </div>

        <Card>
          <CardContent className="space-y-8 pt-6">
            {sections.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No hay términos y condiciones disponibles en este momento.
              </p>
            )}

            {sections.map((section, index) => (
              <div key={section._id}>
                {index > 0 && <Separator className="mb-8" />}
                <section className="space-y-2">
                  <h2 className="font-display text-base font-semibold">
                    {index + 1}. {section.header}
                  </h2>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_strong]:text-foreground [&_strong]:font-medium [&_span]:text-foreground [&_span]:font-medium [&_p]:mb-2 last:[&_p]:mb-0"
                    // Content comes from our own database, sanitized before render
                    dangerouslySetInnerHTML={{
                      __html: renderContent(section.content),
                    }}
                  />
                </section>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
