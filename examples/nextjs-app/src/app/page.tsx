import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12">
      <h1 className="text-4xl font-bold">NextJS App with Firebase</h1>

      <div className="max-w-3xl text-center">
        <p className="mb-4">
          This template includes Firebase App Hosting, Firestore, dark theme support, and
          comprehensive testing setup.
        </p>
        <p>
          Edit <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">src/app/page.tsx</code> to
          get started.
        </p>
      </div>

      <div className="flex flex-col items-center mt-8">
        <p className="mb-2">Toggle between light and dark mode:</p>
        <ThemeToggle />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        <a
          href="https://nextjs.org/docs"
          className="group p-4 border rounded-lg hover:border-blue-500 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-500">
            NextJS Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </h2>
          <p>Find in-depth information about Next.js features and API.</p>
        </a>

        <a
          href="https://firebase.google.com/docs"
          className="group p-4 border rounded-lg hover:border-orange-500 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="text-xl font-semibold mb-2 group-hover:text-orange-500">
            Firebase Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </h2>
          <p>Learn about Firebase features and how to integrate them.</p>
        </a>
      </div>
    </div>
  );
}
