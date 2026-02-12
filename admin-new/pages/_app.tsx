import "../styles/globals.css";
import "../styles/app.css";
import type { AppProps } from "next/app";
import { Toaster } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-700 rounded">
      <h2 className="font-bold">Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Toaster />
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
