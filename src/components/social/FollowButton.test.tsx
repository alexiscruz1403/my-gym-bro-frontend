import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FollowButton } from './FollowButton';
import { useFollow } from '@/hooks/useFollow';

// El hook toca el store de auth y la API: aca solo interesa como el
// componente traduce su estado a una etiqueta.
jest.mock('@/hooks/useFollow');
const mockUseFollow = jest.mocked(useFollow);

const followState = (overrides: Partial<ReturnType<typeof useFollow>> = {}) => ({
  isFollowing: false,
  isRequestPending: false,
  isLoading: false,
  toggle: jest.fn(),
  ...overrides,
});

describe('FollowButton', () => {
  afterEach(() => jest.clearAllMocks());

  it.each([
    [{ isFollowing: false, isRequestPending: false }, '+ Seguir'],
    [{ isFollowing: false, isRequestPending: true }, 'Solicitud enviada'],
    [{ isFollowing: true, isRequestPending: false }, '✓ Siguiendo'],
    // isFollowing gana sobre isRequestPending: una solicitud ya aceptada
    // puede llegar con las dos banderas en true.
    [{ isFollowing: true, isRequestPending: true }, '✓ Siguiendo'],
  ])('renders %j as "%s"', (state, label) => {
    mockUseFollow.mockReturnValue(followState(state));

    render(<FollowButton userId="u1" initialIsFollowing={false} />);

    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  });

  it('is disabled while the request is in flight', () => {
    mockUseFollow.mockReturnValue(followState({ isLoading: true }));

    render(<FollowButton userId="u1" initialIsFollowing={false} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls toggle on click', async () => {
    const toggle = jest.fn();
    mockUseFollow.mockReturnValue(followState({ toggle }));

    render(<FollowButton userId="u1" initialIsFollowing={false} />);
    await userEvent.click(screen.getByRole('button'));

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it('forwards its props to the hook', () => {
    const onFollowed = jest.fn();
    mockUseFollow.mockReturnValue(followState());

    render(
      <FollowButton
        userId="u1"
        initialIsFollowing
        initialIsRequestPending
        onFollowed={onFollowed}
      />,
    );

    expect(mockUseFollow).toHaveBeenCalledWith('u1', true, true, onFollowed);
  });
});
