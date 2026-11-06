import { Link } from 'react-router';

import { useLists } from '../hooks/useLists';
import type { Media } from '../types';
import { CheckIcon, EyeIcon, PlusIcon, UndoIcon } from './icons';
import { buttonStyles } from './styles';

export function MediaActions({ media, size = 'small' }: { media: Media; size?: 'small' | 'large' }) {
  const { listOf, add, remove } = useLists();
  const where = listOf(media);
  const large = size === 'large';
  const base = large ? buttonStyles.secondary : buttonStyles.small;
  const active = large ? buttonStyles.secondaryActive : buttonStyles.smallActive;
  const muted = large ? buttonStyles.secondaryMuted : buttonStyles.smallMuted;
  const icon = large ? 'size-4' : 'size-3.5';
  const name = <span className="sr-only">: {media.title}</span>;

  if (where === 'watched') {
    return (
      <>
        <Link to="/watched" className={active}>
          <CheckIcon className={icon} />
          Watched
        </Link>
        {large && (
          <>
            <button type="button" className={base} onClick={() => add('watchlist', media)}>
              <UndoIcon className={icon} />
              Watch again{name}
            </button>
            <button type="button" className={muted} onClick={() => remove('watched', media)}>
              Remove{name}
            </button>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {where === 'watchlist' ? (
        <Link to="/watchlist" className={active}>
          <CheckIcon className={icon} />
          To watch
        </Link>
      ) : (
        <button type="button" className={base} onClick={() => add('watchlist', media)}>
          <PlusIcon className={icon} />
          To watch{name}
        </button>
      )}
      <button type="button" className={base} onClick={() => add('watched', media)}>
        <EyeIcon className={icon} />
        Watched{name}
      </button>
      {large && where === 'watchlist' && (
        <button type="button" className={muted} onClick={() => remove('watchlist', media)}>
          Remove{name}
        </button>
      )}
    </>
  );
}
