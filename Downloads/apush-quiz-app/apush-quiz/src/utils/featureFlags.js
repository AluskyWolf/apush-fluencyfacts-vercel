import { unstable_flag as flag } from '@vercel/flags/next';

// Define your feature flags
export const shuffleEnabledFlag = flag({
  key: 'shuffle-enabled',
  decide: () => true, // Default value
  description: 'Enable/disable term shuffling in quizzes',
  origin: 'https://your-app.vercel.app'
});

export const flashcardModeFlag = flag({
  key: 'flashcard-mode-enhanced',
  decide: () => false,
  description: 'Enhanced flashcard mode with animations',
  origin: 'https://your-app.vercel.app'
});

export const unitSelectionFlag = flag({
  key: 'advanced-unit-selection',
  decide: () => false,
  description: 'Advanced unit selection with search and filters',
  origin: 'https://your-app.vercel.app'
});