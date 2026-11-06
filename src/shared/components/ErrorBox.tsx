import { buttonStyles } from './styles';

export function ErrorBox({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <div className="mt-12 max-w-md rounded-lg bg-velvet-800 p-6 ring-1 ring-white/10" role="alert">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-dust">Check your internet connection, then try again.</p>
      <button type="button" onClick={onRetry} className={`${buttonStyles.primary} mt-5`}>
        Try again
      </button>
    </div>
  );
}
