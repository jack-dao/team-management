import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockMembers = [
  { id: 1, fullName: 'Jack Dao', email: 'jack@example.com', role: 'ADMIN', function: 'ENGINEERING' }
];

describe('Team Management Frontend Tests', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    document.body.innerHTML = ''; 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- TABLE + EMPTY STATES ---

  test('1. Displays "Add your first team member..." when API returns an empty array', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<App />);
    expect(await screen.findByText(/Add your first team member/i)).toBeInTheDocument();
  });

  test('2. Displays "No team members match your search" when search returns no results', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<App />);
    const searchInput = document.querySelector('input[type="text"]') || document.querySelector('input');
    await userEvent.type(searchInput, 'NonExistentUser');
    expect(await screen.findByText(/No team members match your search/i)).toBeInTheDocument();
  });

  test('3. Displays "No team members match the selected filters" when filters return no results', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<App />);
    
    await screen.findByText(/Add your first team member/i);
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    await userEvent.click(dropdownTriggers[0]);
    const engineeringOption = await screen.findByText('Engineering');
    await userEvent.click(engineeringOption);
    expect(await screen.findByText(/No team members match the selected filters/i)).toBeInTheDocument();
  });

  // --- ADD TEAM MEMBER DIALOG ---

  test('4. Clicking "Add Member" opens the Add dialog', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Add Member/i }));
    await waitFor(() => expect(document.querySelectorAll('input').length).toBeGreaterThan(1));
  });

  test('5. Submitting invalid form shows inline validation errors', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) }));
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Add Member/i }));
    
    const emailInput = await screen.findByPlaceholderText(/email@company.com/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  test('6. Successful submission closes dialog and shows success toast "New Member Added"', async () => {
    let isPosted = false;
    fetch.mockImplementation((url, options) => {
      if (options?.method === 'POST') {
         isPosted = true;
         return Promise.resolve({ ok: true, json: () => Promise.resolve(mockMembers[0]) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(isPosted ? mockMembers : []) });
    });

    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /Add Member/i }));
    
    await userEvent.type(await screen.findByPlaceholderText(/Full name/i), 'Jack Dao');
    await userEvent.type(await screen.findByPlaceholderText(/email@company.com/i), 'jack@example.com');
    
    await userEvent.click(await screen.findByText(/Select Function/i));
    await userEvent.click(await screen.findByText('Engineering'));
    await userEvent.click(await screen.findByText(/Select Role/i));
    await userEvent.click(await screen.findByText('Admin'));
    
    await userEvent.click(screen.getByRole('button', { name: /Add to Team/i }));
    
    await waitFor(() => expect(screen.queryByText(/Select Function/i)).not.toBeInTheDocument());
    expect(await screen.findByText(/New Member Added/i)).toBeInTheDocument();
  });

  // --- EDIT TEAM MEMBER DIALOG ---

  test('7. Clicking "Edit" opens dialog with fields pre-filled', async () => {
    fetch.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockMembers) }));
    render(<App />);
    await screen.findByText('Jack Dao');
    
    await userEvent.click(document.querySelector('.menu-btn')); 
    await userEvent.click(await screen.findByText('Edit'));     
    
    await waitFor(() => {
      const inputs = document.querySelectorAll('input');
      const hasValue = Array.from(inputs).some(input => input.value === 'Jack Dao');
      expect(hasValue).toBe(true);
    });
  });

  test('8. Successful save shows "Member Updated" toast and updates table row', async () => {
    let isPut = false;
    fetch.mockImplementation((url, options) => {
      if (options?.method === 'PUT') {
         isPut = true;
         return Promise.resolve({ ok: true, json: () => Promise.resolve({...mockMembers[0], fullName: 'Jack Updated'}) });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(isPut ? [{...mockMembers[0], fullName: 'Jack Updated'}] : mockMembers) });
    });

    render(<App />);
    await screen.findByText('Jack Dao');
    
    await userEvent.click(document.querySelector('.menu-btn'));
    await userEvent.click(await screen.findByText('Edit'));
    
    await waitFor(() => expect(document.querySelectorAll('input').length).toBeGreaterThan(1));
    
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs.find(i => i.value === 'Jack Dao');
    
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jack Updated');
    
    await userEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    
    expect(await screen.findByText('Jack Updated')).toBeInTheDocument();
    expect(await screen.findByText(/Member Updated/i)).toBeInTheDocument();
  });

  // --- DELETE FLOW ---

  test('9. Clicking Delete -> confirm dialog -> confirming removes row and shows "Member Deleted"', async () => {
    let isDeleted = false;
    fetch.mockImplementation((url, options) => {
      if (options?.method === 'DELETE') {
         isDeleted = true;
         return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(isDeleted ? [] : mockMembers) });
    });

    render(<App />);
    await screen.findByText('Jack Dao');
    
    await userEvent.click(document.querySelector('.menu-btn'));
    await userEvent.click(await screen.findByText('Delete'));
    
    const confirmBtn = await screen.findByText(/Delete|Confirm|Yes/i, { selector: 'button:not(.menu-btn)' });
    await userEvent.click(confirmBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('Jack Dao')).not.toBeInTheDocument();
    });
    expect(await screen.findByText(/Member Deleted/i)).toBeInTheDocument();
  });
});
