/**
 * Tema Gen-Z — calm dark navy + soft indigo-violet accent.
 * Import: import { C, AVATAR_COLORS } from '../../theme/colors';
 */
export const C = {
  bg:      '#0C0C14',   // Root — deep dark navy
  surface: '#13131E',   // Header, nav bar, panels
  card:    '#1B1B2A',   // Elevated card, input bg, received bubble

  accent:      '#7C6BFF',
  accentLight: '#A89BFF',
  accentDim:   'rgba(124,107,255,0.14)',

  bubbleSent:     '#5B50C8',   // Sent — deeper indigo
  bubbleReceived: '#1B1B2A',   // Received — elevated surface

  text1: '#EEEDF8',   // Primary
  text2: '#8685A0',   // Secondary (timestamps, subtitles)
  text3: '#4D4C65',   // Muted (placeholders)

  online:  '#4ADE80',
  offline: '#555566',

  border:      'rgba(255,255,255,0.07)',
  borderLight: 'rgba(255,255,255,0.04)',
  danger:      '#F87171',
  readTick:    '#A89BFF',
};

/** Avatar background per alias */
export const AVATAR_COLORS = {
  sanqua:    '#6A5BEF',
  hass:      '#059669',
  vit:       '#7C3AED',
  cleo:      '#DB2777',
  lemineral: '#EA580C',
};
