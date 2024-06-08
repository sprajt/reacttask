
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders the title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Germany 2023/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders the start button', () => {
  render(<App />);
  const startButton = screen.getByRole('button', { name: /start/i });
  expect(startButton).toBeInTheDocument();
});

test('starts the game when the start button is clicked', () => {
  render(<App />);
  const startButton = screen.getByRole('button', { name: /start/i });
  fireEvent.click(startButton);
  const ongoingGame = screen.getByRole('button', { name: /finish/i });
  expect(ongoingGame).toBeInTheDocument();
});

test('finishes the game when the finish button is clicked', () => {
  render(<App />);
  const startButton = screen.getByRole('button', { name: /start/i });
  fireEvent.click(startButton);
  const finishButton = screen.getByRole('button', { name: /finish/i });
  fireEvent.click(finishButton);
  const stoppedGame = screen.getByRole('button', { name: /restart/i });
  expect(stoppedGame).toBeInTheDocument();
});

test('restarts the game when the restart button is clicked', () => {
  render(<App />);
  const startButton = screen.getByRole('button', { name: /start/i });
  fireEvent.click(startButton);
  const finishButton = screen.getByRole('button', { name: /finish/i });
  fireEvent.click(finishButton);
  const restartButton = screen.getByRole('button', { name: /restart/i });
  fireEvent.click(restartButton);
  const ongoingGame = screen.getByRole('button', { name: /finish/i });
  expect(ongoingGame).toBeInTheDocument();
});