const mockLogger = {
  logEvent: jest.fn(),
  logPurchase: jest.fn(),
  flush: jest.fn(),
  AppEvents: { CompletedRegistration: 'fb_mobile_complete_registration' },
  AppEventParams: { RegistrationMethod: 'fb_registration_method' },
};
const mockSettings = {
  initializeSDK: jest.fn(),
  setAdvertiserIDCollectionEnabled: jest.fn(),
  setAutoLogAppEventsEnabled: jest.fn(),
  setAdvertiserTrackingEnabled: jest.fn(async () => true),
};
jest.mock('react-native-fbsdk-next', () => ({
  AppEventsLogger: mockLogger,
  Settings: mockSettings,
}));
const mockExtra: { metaEnabled?: boolean } = { metaEnabled: true };
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      get extra() {
        return mockExtra;
      },
    },
  },
}));
const mockStore = new Map<string, string>();
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (k: string) => mockStore.get(k) ?? null),
  setItemAsync: jest.fn(async (k: string, v: string) => void mockStore.set(k, v)),
}));
jest.mock('../supabase', () => ({
  supabase: {
    auth: {
      getSession: async () => ({
        data: { session: { user: { app_metadata: { provider: 'google' } } } },
      }),
    },
  },
}));
let mockOptedIn = true;
jest.mock('../analytics', () => ({
  analyticsAvailable: () => true,
  analyticsEnabled: () => mockOptedIn,
}));

// eslint-disable-next-line import/first -- los mocks de arriba van antes que el módulo.
import {
  __resetMeta,
  initMeta,
  metaFirstLesson,
  metaPurchase,
  metaRegistration,
} from '../metaEvents';

const g = globalThis as { __DEV__?: boolean };

describe('metaEvents', () => {
  const dev = g.__DEV__;
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.clear();
    mockOptedIn = true;
    mockExtra.metaEnabled = true;
    g.__DEV__ = false;
    __resetMeta();
  });
  afterAll(() => {
    g.__DEV__ = dev;
  });

  it('registra la cuenta con el método y arranca el SDK una sola vez', async () => {
    await metaRegistration();
    await metaRegistration();
    expect(mockSettings.initializeSDK).toHaveBeenCalledTimes(1);
    expect(mockLogger.logEvent).toHaveBeenNthCalledWith(1, 'fb_mobile_complete_registration', {
      fb_registration_method: 'google',
    });
  });

  it('manda la primera lección una sola vez por cuenta', async () => {
    await metaFirstLesson('user-1', 'a1-u01-l01');
    await metaFirstLesson('user-1', 'a1-u01-l02');
    expect(mockLogger.logEvent).toHaveBeenCalledTimes(1);
    expect(mockLogger.logEvent).toHaveBeenCalledWith('first_lesson_completed', {
      fb_content_id: 'a1-u01-l01',
    });
  });

  it('registra la compra con precio y moneda, y no las de precio 0', () => {
    metaPurchase({ price: 4.99, currency: 'USD', productId: 'plus_monthly', kind: 'plus' });
    metaPurchase({ price: 0, currency: 'USD', productId: 'plus_monthly', kind: 'plus' });
    expect(mockLogger.logPurchase).toHaveBeenCalledTimes(1);
    expect(mockLogger.logPurchase).toHaveBeenCalledWith(4.99, 'USD', {
      fb_content_id: 'plus_monthly',
      fb_content_type: 'subscription',
    });
  });

  it('no manda nada si la persona apagó la analítica', async () => {
    mockOptedIn = false;
    initMeta();
    await metaRegistration();
    await metaFirstLesson('user-1', 'l1');
    metaPurchase({ price: 4.99, currency: 'USD', productId: 'x', kind: 'ad_free' });
    expect(mockSettings.initializeSDK).not.toHaveBeenCalled();
    expect(mockLogger.logEvent).not.toHaveBeenCalled();
    expect(mockLogger.logPurchase).not.toHaveBeenCalled();
  });

  it('no hace nada en una build sin las claves de Meta, ni en desarrollo', async () => {
    mockExtra.metaEnabled = false;
    await metaRegistration();
    mockExtra.metaEnabled = true;
    __resetMeta();
    g.__DEV__ = true;
    await metaRegistration();
    expect(mockSettings.initializeSDK).not.toHaveBeenCalled();
    expect(mockLogger.logEvent).not.toHaveBeenCalled();
  });
});
