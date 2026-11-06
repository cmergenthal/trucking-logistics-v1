import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { API_BASE_URL } from './config';

test('loads trucks from the configured API on the trucks route', async () => {
  const originalFetch = global.fetch;
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [{
      id: 'T-1201',
      unitNumber: '1201',
      year: 2021,
      make: 'Freightliner',
      model: 'Cascadia',
      status: 'AVAILABLE',
      currentLocation: 'Omaha, NE',
    }],
  });

  const { unmount } = render(
    <MemoryRouter initialEntries={['/trucks']}>
      <App />
    </MemoryRouter>
  );

  try {
    expect(await screen.findByText('1201')).toBeInTheDocument();
    expect(screen.getByText('Omaha, NE')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${API_BASE_URL}/trucks?`),
      { cache: 'no-store' }
    );
  } finally {
    unmount();
    global.fetch = originalFetch;
  }
});
