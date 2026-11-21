import Link from 'next/link';
import Image from 'next/image';
import { getAllArticleEntries } from '@/lib/content';
import { ArticleCard } from '@/components/ArticleCard';
import { LeadMagnetForm } from '@/components/LeadMagnetForm';

const pillars = [
  {
    title: 'Speak up',
    detail: 'Prepare for appointments, put your pain story into words, and keep a plan for difficult days.',
    href: '/speak-up',
    cta: 'Prepare to be heard',
  },
  {
    title: 'Take action',
    detail: 'Write to your MP, share the facts, and join Pain Awareness Month.',
    href: '/take-action',
    cta: 'See ways to help',
  },
];

export default function HomePage() {
  const latest = getAllArticleEntries().slice(0, 6);

  return (
    <div>
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <div className="flex flex-col items-center gap-4">
            <Image src="/brand/logo.svg" alt="TJR Mind & Body mark" width={96} height={96} priority />
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal">Chronic pain awareness and advocacy</p>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-[1.02] tracking-tight text-navy sm:text-6xl">
              Be heard. Be understood. Be prepared.
            </h1>
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-ink sm:text-lg">
            Tools and a lived-experience voice for people with persistent pain, and for the people who want to understand it.
          </p>
          <p className="mx-auto mt-5 max-w-2xl border-t border-border pt-4 text-sm font-semibold leading-6 text-navy">
            Awareness and self-advocacy from lived experience, not medical advice.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/speak-up" className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-deep">
              Prepare to speak up
            </Link>
            <Link href="/get-involved" className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:border-teal">
              Get involved
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16">
        <section className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[28px] border border-border bg-white p-7">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-navy">A lived-experience voice</p>
            <h2 className="mb-4 font-serif text-3xl font-bold leading-tight tracking-tight text-navy">
              Does this sound familiar?
            </h2>
            <div className="space-y-4 text-ink-mid">
              <p>
                Living with persistent pain can mean years of appointments, trying many things, and feeling unheard along the way.
                If that sounds like you, you are not doing it wrong, and you are not alone.
              </p>
              <p>
                This site is an individual voice, built to help people be heard and better prepared to speak up.{' '}
                <Link href="/my-story" className="font-semibold text-blue hover:underline">Read Tim&apos;s story</Link>.
              </p>
            </div>
            <Link href="/about" className="mt-6 inline-flex rounded-lg border border-navy/20 px-5 py-3 text-sm font-semibold text-navy hover:border-teal">
              Who is behind this site
            </Link>
          </div>

          <div className="grid gap-2.5 rounded-[28px] border border-border bg-gradient-to-br from-navy to-teal p-6 text-white">
            <div className="grid grid-cols-[1.05fr_0.95fr] gap-2.5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] border border-white/15">
                <Image src="/images/founder/founder-portrait.jpg" alt="Tim seated in a reflective setting during a rebuilding stage" fill className="object-cover" sizes="(min-width: 1024px) 260px, 40vw" />
              </div>
              <div className="grid grid-rows-2 gap-2.5">
                <div className="relative overflow-hidden rounded-[22px] border border-white/15">
                  <Image src="/images/founder/founder-recovery.jpg" alt="Tim in hospital after surgery during a difficult stage of recovery" fill className="object-cover" sizes="(min-width: 1024px) 220px, 40vw" />
                </div>
                <div className="relative overflow-hidden rounded-[22px] border border-white/15">
                  <Image src="/images/founder/founder-with-dog.jpg" alt="Tim in a relaxed moment with his dog" fill className="object-cover" sizes="(min-width: 1024px) 220px, 40vw" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[34px] border border-border bg-white/80">
          <div className="border-b border-border px-7 py-6">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-navy">Speak up. Take action.</h2>
            <p className="mt-2 text-ink-mid">
              Practical help for being heard, and simple ways to help others understand.
            </p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="rounded-3xl border border-border bg-white p-5">
                <h3 className="mb-2 font-serif text-lg font-bold text-navy">{pillar.title}</h3>
                <p className="text-ink-mid">{pillar.detail}</p>
                {pillar.href && (
                  <Link href={pillar.href} className="mt-4 inline-block text-sm font-semibold text-blue hover:underline">
                    {pillar.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <LeadMagnetForm />

        <section className="mt-10 rounded-[34px] border border-border bg-navy p-7 text-white">
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-teal">Start somewhere steady</p>
              <h2 className="font-serif text-2xl font-bold tracking-tight">Choose the next useful step</h2>
              <p className="mt-2 text-white/75">
                Prepare to speak up, or get in touch if you want to share your experience, volunteer, or work together.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link href="/speak-up" className="rounded-lg bg-white px-5 py-3 text-center text-sm font-semibold text-navy hover:bg-blue-pale">
                Speak up
              </Link>
              <Link href="/get-involved" className="rounded-lg border border-white/25 px-5 py-3 text-center text-sm font-semibold text-white hover:border-teal">
                Get involved
              </Link>
            </div>
          </div>
        </section>

        {latest.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-serif text-2xl font-bold text-navy">Latest from the Library</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((entry) => (
                <ArticleCard key={`${entry.collection}:${entry.slug}`} entry={entry} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
