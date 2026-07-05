import { registerRootComponent } from 'expo';
import App from './App';

// ============================================================
// GLOBAL ERROR HANDLER — tangkap semua JS Exception
// ============================================================
const originalHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('====================================');
  console.error('[GLOBAL ERROR HANDLER]');
  console.error('isFatal:', isFatal);
  console.error('message:', error?.message);
  console.error('name:', error?.name);
  console.error('stack:', error?.stack);
  console.error('====================================');
  if (originalHandler) originalHandler(error, isFatal);
});

// ============================================================
// UNHANDLED PROMISE REJECTION HANDLER
// ============================================================
const tracking = require('promise/setimmediate/rejection-tracking');
tracking.enable({
  allRejections: true,
  onUnhandled: (id, error) => {
    console.error('====================================');
    console.error('[UNHANDLED PROMISE REJECTION] id:', id);
    console.error('message:', error?.message);
    console.error('name:', error?.name);
    console.error('stack:', error?.stack);
    console.error('====================================');
  },
  onHandled: (id) => {},
});

console.log('[APP] registerRootComponent — app starting');
registerRootComponent(App);
