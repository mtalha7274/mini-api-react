import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './theme/ThemeContext';
import { CollectionProvider } from './context/CollectionContext/CollectionContext';
import { EnvironmentProvider } from './context/EnvironmentContext/EnvironmentContext';

function renderApp() {
  return render(
    <ThemeProvider>
      <CollectionProvider>
        <EnvironmentProvider>
          <App />
        </EnvironmentProvider>
      </CollectionProvider>
    </ThemeProvider>
  );
}

test('renders Mini API shell with Send button', () => {
  renderApp();
  expect(screen.getAllByText('Mini API').length).toBeGreaterThan(0);
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

test('renders sidebar resize handle on desktop layout', () => {
  renderApp();
  expect(
    screen.getByRole('separator', { name: /resize sidebar/i })
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

test('renders Environments sidebar tab', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }));
  expect(screen.getByRole('tab', { name: /environments/i })).toBeInTheDocument();
});

test('can open Environments tab and see seed environment', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /open sidebar/i }));
  fireEvent.click(screen.getByRole('tab', { name: /environments/i }));
  expect(
    screen.getByRole('button', { name: /\+ environment/i })
  ).toBeInTheDocument();
  expect(screen.getByText('Variables — Development')).toBeInTheDocument();
});

test('shows environment name in top bar', () => {
  renderApp();
  const main = screen.getByRole('main');
  expect(within(main).getByText('Development')).toBeInTheDocument();
  expect(
    within(main).queryByText(/collection environment/i)
  ).not.toBeInTheDocument();
});

test('renders environment variables in URL as highlighted tokens', () => {
  renderApp();
  const urlField = screen.getByRole('textbox', { name: /request url/i });
  expect(urlField).toHaveValue('{{BASE_URL}}/users');
  expect(screen.getByText('{{BASE_URL}}')).toHaveClass('text-accent');
});

test('URL field is editable', () => {
  renderApp();
  const urlField = screen.getByRole('textbox', { name: /request url/i });
  fireEvent.change(urlField, {
    target: { value: 'https://example.com/new-path' },
  });
  expect(urlField).toHaveValue('https://example.com/new-path');
});

test('Send button is enabled with valid URL', () => {
  renderApp();
  expect(screen.getByRole('button', { name: /^send$/i })).not.toBeDisabled();
});

test('can edit environment variables from top bar', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /edit variables/i }));
  const envEditor = screen.getByLabelText('Development environment variables');
  expect(
    within(envEditor).getByRole('button', { name: /\+ add row/i })
  ).toBeInTheDocument();
  const baseUrlInput = within(envEditor).getByDisplayValue(
    'http://localhost:3000/api'
  );
  fireEvent.change(baseUrlInput, {
    target: { value: 'http://localhost:3000/api?v=1' },
  });
  expect(baseUrlInput).toHaveValue('http://localhost:3000/api?v=1');
});
