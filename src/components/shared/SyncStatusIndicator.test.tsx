import { render, screen } from '@testing-library/react';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import useOfflineStore from '@/store/offline.store';

const INITIAL = useOfflineStore.getState();

// Zustand: no hace falta mockear el modulo, alcanza con empujar estado.
const setState = (partial: Partial<ReturnType<typeof useOfflineStore.getState>>) =>
  useOfflineStore.setState({ ...INITIAL, ...partial });

describe('SyncStatusIndicator', () => {
  afterEach(() => useOfflineStore.setState(INITIAL));

  it('renders nothing when online, idle and with nothing pending', () => {
    setState({ isOnline: true, isSyncing: false, syncError: null, pendingCount: 0 });

    const { container } = render(<SyncStatusIndicator />);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the pending count when there are queued mutations', () => {
    setState({ isOnline: true, pendingCount: 3 });

    render(<SyncStatusIndicator />);

    expect(screen.getByTitle('3 pending changes')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('prioritises offline over every other state', () => {
    setState({ isOnline: false, isSyncing: true, syncError: 'boom', pendingCount: 2 });

    render(<SyncStatusIndicator />);

    expect(screen.getByTitle('Offline')).toBeInTheDocument();
    expect(screen.queryByTitle('Syncing...')).not.toBeInTheDocument();
    expect(screen.queryByTitle('boom')).not.toBeInTheDocument();
  });

  it('prioritises syncing over an error from the previous attempt', () => {
    setState({ isOnline: true, isSyncing: true, syncError: 'boom' });

    render(<SyncStatusIndicator />);

    expect(screen.getByTitle('Syncing...')).toBeInTheDocument();
    expect(screen.queryByTitle('boom')).not.toBeInTheDocument();
  });

  it('surfaces the sync error once the attempt finished', () => {
    setState({ isOnline: true, isSyncing: false, syncError: 'network unreachable' });

    render(<SyncStatusIndicator />);

    expect(screen.getByTitle('network unreachable')).toBeInTheDocument();
  });
});
