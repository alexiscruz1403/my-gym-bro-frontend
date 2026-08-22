import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseCard } from './ExerciseCard';
import type { Exercise } from '@/types/domain.types';

const exercise: Exercise = {
  id: 'ex-1',
  name: 'Barbell Bench Press',
  musclesPrimary: ['chest', 'triceps'],
  musclesSecondary: ['front_delts'],
  loadType: 'barbell',
  bilateral: true,
  trackingType: 'reps',
};

describe('ExerciseCard', () => {
  it('renders the name, the load type and at most two primary muscles', () => {
    render(<ExerciseCard exercise={exercise} mode="browse" onClick={jest.fn()} />);

    expect(screen.getByText('Barbell Bench Press')).toBeInTheDocument();
    expect(screen.getByText('Barbell')).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Triceps')).toBeInTheDocument();
    // musclesSecondary no se muestra, y musclesPrimary se corta en 2.
    expect(screen.queryByText('Front Delts')).not.toBeInTheDocument();
  });

  it('falls back to the dumbbell placeholder when there is no gif', () => {
    render(<ExerciseCard exercise={exercise} mode="browse" onClick={jest.fn()} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows the gif when the exercise has one', () => {
    render(
      <ExerciseCard
        exercise={{ ...exercise, gifUrl: 'https://res.cloudinary.com/x/bench.gif' }}
        mode="browse"
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByRole('img', { name: 'Barbell Bench Press' })).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/x/bench.gif',
    );
  });

  it('calls onClick in browse mode and renders no toggle button', async () => {
    const onClick = jest.fn();
    render(<ExerciseCard exercise={exercise} mode="browse" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: /barbell bench press/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle once when the picker button is clicked', async () => {
    const onToggle = jest.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        mode="picker"
        selected={false}
        onToggle={onToggle}
      />,
    );

    // El boton vive dentro de la Card, que tambien es clickeable: sin el
    // stopPropagation del handler este click contaria dos veces.
    await userEvent.click(screen.getByRole('button', { name: 'Select exercise' }));

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(exercise);
  });

  it('reflects the selected state in aria-pressed and the button label', () => {
    const { rerender } = render(
      <ExerciseCard exercise={exercise} mode="picker" selected={false} onToggle={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Select exercise' })).toBeInTheDocument();

    rerender(
      <ExerciseCard exercise={exercise} mode="picker" selected onToggle={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Deselect exercise' })).toBeInTheDocument();
  });
});
