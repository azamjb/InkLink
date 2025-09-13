import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { ClientOnly } from 'remix-utils/client-only';
import { Header } from '~/components/header/Header';
import { loadChallenge, type Challenge } from '~/lib/challenges';
import { ChallengeWorkbench } from '~/components/challenge/ChallengeWorkbench.client';
import { BaseChallengeWorkbench } from '~/components/challenge/BaseChallengeWorkbench';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.challenge) {
    return [{ title: 'Challenge Not Found - Kleos Frontend' }];
  }

  return [
    { title: `${data.challenge.title} - Kleos Frontend` },
    { name: 'description', content: data.challenge.question }
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const challengeId = params.id;

  if (!challengeId) {
    throw new Response('Not Found', { status: 404 });
  }

  const challenge = loadChallenge(challengeId);

  if (!challenge) {
    throw new Response('Not Found', { status: 404 });
  }

  return json({ challenge });
}

export default function ChallengePage() {
  const { challenge } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col h-full w-full">
      <Header />
      <ClientOnly fallback={<BaseChallengeWorkbench />}>
        {() => <ChallengeWorkbench challenge={challenge} />}
      </ClientOnly>
    </div>
  );
}