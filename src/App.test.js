import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './theme/ThemeContext';
import { CollectionProvider } from './context/CollectionContext/CollectionContext';

function renderApp() {
  return render(
    <ThemeProvider>
      <CollectionProvider>
        <App />
      </CollectionProvider>
    </ThemeProvider>
  );
}

test('renders Mini API shell with Send button', () => {
  renderApp();
  expect(screen.getAllByRole('heading', { name: /mini api/i }).length).toBeGreaterThan(0);
  expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
});

test('renders theme toggle', () => {
  renderApp();
  expect(
    screen.getAllByRole('button', { name: /switch to (light|dark) theme/i }).length
  ).toBeGreaterThan(0);
});

test('renders open sidebar control', () => {
  renderApp();
  expect(
    screen.getByRole('button', { name: /open sidebar/i })
  ).toBeInTheDocument();
});

test('renders response panel resize handle', () => {
  renderApp();
  expect(
    screen.getByRole('separator', { name: /resize response panel/i })
  ).toBeInTheDocument();
});

test('renders add collection control', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }));
  expect(
    screen.getByRole('button', { name: /\+ collection/i })
  ).toBeInTheDocument();
});

test('can add a new collection', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }));
  fireEvent.click(screen.getByRole('button', { name: /\+ collection/i }));
  expect(screen.getByText('New Collection')).toBeInTheDocument();
});

test('open sidebar sets aria-expanded on menu button', () => {
  renderApp();
  const menuButton = screen.getByRole('button', { name: /open sidebar/i });
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('button', { name: /^close sidebar$/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /dismiss sidebar/i })).toBeInTheDocument();
});
