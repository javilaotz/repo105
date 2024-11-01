import { render, screen, fireEvent } from '@testing-library/react';


import { GPTContext } from '../utils/providers/GPTContext';
import CodeComponent from '../components/CodeComponent';
import userEvent from '@testing-library/user-event';

// Mocking the useContext value
const mockSetContent = jest.fn();
const mockMessages = [
  { role: 'user', content: 'This is a normal message.' },
  { role: 'user', content: 'This message contains code ```const a = 10;```' },
  { role: 'system', content: 'This is a system message and should not be shown.' }
];

const GPTContextValue = {
  messages: mockMessages,
  setContent: mockSetContent,
  prompt: '',
  setPrompt: mockSetPrompt,
  setMessages: mockSetMessages,
  clickHandler: mockClickHandler,
};


const renderComponent = () => {
  return render(
    <GPTContext.Provider value={{ messages: mockMessages, setContent: mockSetContent }}>
      <CodeComponent setToastType={jest.fn()} setToastMessage={jest.fn()} />
    </GPTContext.Provider>
  );
};

describe('CodeComponent', () => {
  test('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('This is a normal message.')).toBeInTheDocument();
  });

  test('filters out system messages', () => {
    renderComponent();
    expect(screen.queryByText('This is a system message')).not.toBeInTheDocument();
  });

  test('parses and renders code blocks from messages', () => {
    renderComponent();
    expect(screen.getByText('Render snippet')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  test('calls setContent with correct content when "Render snippet" is clicked', () => {
    renderComponent();
    const renderButton = screen.getByText('Render snippet');
    userEvent.click(renderButton);
    expect(mockSetContent).toHaveBeenCalledWith('const a = 10;');
  });

  test('copies content to clipboard and triggers toast messages when "Copy" is clicked', () => {
    const mockSetToastType = jest.fn();
    const mockSetToastMessage = jest.fn();

    render(
      <GPTContext.Provider value={{ messages: mockMessages, setContent: mockSetContent }}>
        <CodeComponent setToastType={mockSetToastType} setToastMessage={mockSetToastMessage} />
      </GPTContext.Provider>
    );

    const copyButton = screen.getByText('Copy');
    userEvent.click(copyButton);
    expect(mockSetToastType).toHaveBeenCalledWith('success');
    expect(mockSetToastMessage).toHaveBeenCalledWith('Copied to clipboard');
  });

  test('handles no code block in message', () => {
    renderComponent();
    expect(screen.getByText('This is a normal message.')).toBeInTheDocument();
    expect(screen.queryByText('Render snippet')).not.toBeInTheDocument();
  });
});
