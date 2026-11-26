import { readFileSync } from 'fs';
import { join } from 'path';

import {
  ADS_MODE,
  REQUEST_OPTIONS,
  TEST_APP_IDS,
  adUnitsFor,
  assertTestAdUnit,
  isGoogleTestId,
} from '../config';
import { createAdsController } from '../controller';
import { resolveAdsEligibility, type EligibilityInput } from '../eligibility';
import { resolveEntitlements } from '@shared/plus';
import { createInterstitialService } from '../interstitial';
import { createRewardedService } from '../rewarded';
import { adsCanServe, createAdsStore } from '../state';
import type { AdReward, AdsNativeAdapter, ConsentState, FullscreenAdHandle } from '../types';

const REAL_PUBLISHER = '6557649928705174';
const root = join(__dirname, '..', '..', '..', '..');

describe('config: sólo IDs de prueba', () => {
  it('las unidades de iOS y Android son del publisher de prueba de Google', () => {
    for (const platform of ['ios', 'android']) {
      const units = adUnitsFor(platform)!;
      for (const id of Object.values(units)) {
        expect(isGoogleTestId(id)).toBe(true);
        expect(id).not.toContain(REAL_PUBLISHER);
      }
    }
    expect(adUnitsFor('web')).toBeNull();
  });

  it('los App IDs de app.json son los de prueba y coinciden con config.ts', () => {
    const appJson = JSON.parse(readFileSync(join(root, 'app.json'), 'utf8'));
    const entry = appJson.expo.plugins.find(
      (p: unknown) => Array.isArray(p) && p[0] === 'react-native-google-mobile-ads',
    );
    expect(entry).toBeDefined();
    expect(entry[1].androidAppId).toBe(TEST_APP_IDS.android);
    expect(entry[1].iosAppId).toBe(TEST_APP_IDS.ios);
    expect(isGoogleTestId(entry[1].androidAppId)).toBe(true);
    expect(isGoogleTestId(entry[1].iosAppId)).toBe(true);
    // Sin ATT: no se declara NSUserTrackingUsageDescription.
    expect(entry[1].userTrackingUsageDescription).toBeUndefined();
    expect(JSON.stringify(appJson)).not.toContain(REAL_PUBLISHER);
  });

  it('rechaza cualquier unidad que no sea de prueba', () => {
    // ID ficticio con formato válido (no es de ninguna cuenta real).
    expect(() => assertTestAdUnit('ca-app-pub-1111111111111111/2222222222')).toThrow(
      'ads_non_test_unit_blocked',
    );
    expect(() => assertTestAdUnit('ca-app-pub-3940256099942544/1033173712')).not.toThrow();
  });

  it('en Jest (__DEV__) el modo es test y los pedidos son no personalizados', () => {
    expect(ADS_MODE).toBe('test');
    expect(REQUEST_OPTIONS.requestNonPersonalizedAdsOnly).toBe(true);
  });
});

describe('elegibilidad: Plus || Ad-Free ⇒ ningún anuncio', () => {
  const base: EligibilityInput = {
    adsEnabled: true,
    signedIn: true,
    onboarded: true,
    plus: false,
    adFree: false,
  };

  it('usuario gratuito con onboarding: elegible', () => {
    expect(resolveAdsEligibility(base)).toBe('eligible');
  });

  it('Plus o Ad-Free: excluido aunque falte lo demás', () => {
    expect(resolveAdsEligibility({ ...base, plus: true })).toBe('excluded');
    expect(resolveAdsEligibility({ ...base, adFree: true })).toBe('excluded');
    expect(resolveAdsEligibility({ ...base, plus: true, onboarded: undefined })).toBe('excluded');
    expect(resolveAdsEligibility({ ...base, adFree: true, plus: undefined })).toBe('excluded');
  });

  it('sin sesión, sin onboarding o con anuncios apagados: excluido', () => {
    expect(resolveAdsEligibility({ ...base, signedIn: false })).toBe('excluded');
    expect(resolveAdsEligibility({ ...base, onboarded: false })).toBe('excluded');
    expect(resolveAdsEligibility({ ...base, adsEnabled: false })).toBe('excluded');
  });

  it('mientras Plus o el perfil no se conocen: unknown (no hay anuncios)', () => {
    expect(resolveAdsEligibility({ ...base, plus: undefined })).toBe('unknown');
    expect(resolveAdsEligibility({ ...base, onboarded: undefined })).toBe('unknown');
    expect(resolveAdsEligibility({ ...base, adFree: undefined })).toBe('unknown');
  });

  it('Plus y Sin publicidad (del servidor, vía resolveEntitlements) excluyen todo anuncio', () => {
    const noAds = (plus: boolean | undefined, adFree: boolean | undefined) =>
      resolveAdsEligibility({ ...base, plus, adFree: resolveEntitlements({ plus, adFree }).noAds });
    expect(noAds(false, false)).toBe('eligible');
    expect(noAds(true, false)).toBe('excluded');
    expect(noAds(false, true)).toBe('excluded');
    expect(noAds(true, undefined)).toBe('excluded');
    expect(noAds(false, undefined)).toBe('unknown');
  });
});

// ---------- adaptador falso ----------

class FakeAd implements FullscreenAdHandle {
  loaded = false;
  loads = 0;
  destroyed = false;
  private listeners: Record<string, ((arg?: unknown) => void)[]> = {};
  constructor(readonly adUnitId: string) {}
  private on(event: string, fn: (arg?: unknown) => void) {
    (this.listeners[event] ??= []).push(fn);
    return () => {
      this.listeners[event] = (this.listeners[event] ?? []).filter((f) => f !== fn);
    };
  }
  emit(event: string, arg?: unknown) {
    for (const fn of this.listeners[event] ?? []) fn(arg);
  }
  load() {
    this.loads += 1;
  }
  finishLoad() {
    this.loaded = true;
    this.emit('loaded');
  }
  async show() {
    this.loaded = false;
    this.emit('opened');
  }
  onLoaded = (fn: () => void) => this.on('loaded', fn);
  onError = (fn: (e: unknown) => void) => this.on('error', fn);
  onOpened = (fn: () => void) => this.on('opened', fn);
  onClosed = (fn: () => void) => this.on('closed', fn);
  onEarned = (fn: (r: AdReward) => void) => this.on('earned', fn as (arg?: unknown) => void);
  destroy() {
    this.destroyed = true;
  }
}

function fakeAdapter(consent: Partial<ConsentState> = {}, opts: { failConsent?: boolean } = {}) {
  const calls = { gather: 0, init: 0 };
  const ads: FakeAd[] = [];
  const state: ConsentState = {
    canRequestAds: true,
    privacyOptionsRequired: false,
    status: 'OBTAINED',
    ...consent,
  };
  const adapter: AdsNativeAdapter = {
    supported: true,
    gatherConsent: async () => {
      calls.gather += 1;
      if (opts.failConsent) throw new Error('network');
      return state;
    },
    getConsentInfo: async () => ({ ...state, canRequestAds: false }),
    showPrivacyOptionsForm: async () => state,
    initialize: async () => {
      calls.init += 1;
    },
    createInterstitial: (id) => {
      const ad = new FakeAd(id);
      ads.push(ad);
      return ad;
    },
    createRewarded: (id) => {
      const ad = new FakeAd(id);
      ads.push(ad);
      return ad;
    },
  };
  return { adapter, calls, ads };
}

function setup(consent?: Partial<ConsentState>, opts?: { failConsent?: boolean }) {
  const fake = fakeAdapter(consent, opts);
  const store = createAdsStore(true);
  const stopped = jest.fn();
  const controller = createAdsController({
    adapter: fake.adapter,
    store,
    enabled: true,
    onStopServing: stopped,
  });
  return { ...fake, store, controller, stopped };
}

describe('controlador: elegibilidad → UMP → initialize', () => {
  it('usuario excluido o desconocido: ni UMP ni SDK', async () => {
    const { controller, calls, store } = setup();
    await controller.setEligibility('excluded');
    await controller.setEligibility('unknown');
    expect(calls).toEqual({ gather: 0, init: 0 });
    expect(store.getState().status).toBe('idle');
  });

  it('elegible: consentimiento y después una sola inicialización', async () => {
    const { controller, calls, store } = setup();
    await Promise.all([
      controller.setEligibility('eligible'),
      controller.setEligibility('eligible'),
    ]);
    await controller.setEligibility('eligible');
    expect(calls.gather).toBe(1);
    expect(calls.init).toBe(1);
    expect(store.getState().status).toBe('ready');
    expect(adsCanServe(store.getState())).toBe(true);
  });

  it('UMP dice que no: no se inicializa ni se sirve nada', async () => {
    const { controller, calls, store } = setup({ canRequestAds: false, status: 'REQUIRED' });
    await controller.setEligibility('eligible');
    expect(calls.init).toBe(0);
    expect(store.getState().status).toBe('unavailable');
    expect(adsCanServe(store.getState())).toBe(false);
  });

  it('falla UMP y no hay consentimiento previo: error, sin anuncios, reintento posible', async () => {
    const { controller, calls, store } = setup({}, { failConsent: true });
    await controller.setEligibility('eligible');
    expect(store.getState().status).toBe('error');
    expect(store.getState().lastError).toBe('network');
    expect(calls.init).toBe(0);
    await controller.retryIfFailed();
    expect(calls.gather).toBe(2);
  });

  it('pasar a Plus deja de servir y descarta lo precargado', async () => {
    const { controller, store, stopped } = setup();
    await controller.setEligibility('eligible');
    await controller.setEligibility('excluded');
    expect(stopped).toHaveBeenCalledTimes(1);
    expect(adsCanServe(store.getState())).toBe(false);
  });

  it('formulario de privacidad que retira el consentimiento: deja de servir', async () => {
    const fake = fakeAdapter();
    const store = createAdsStore(true);
    const stopped = jest.fn();
    fake.adapter.showPrivacyOptionsForm = async () => ({
      canRequestAds: false,
      privacyOptionsRequired: true,
      status: 'OBTAINED',
    });
    const controller = createAdsController({
      adapter: fake.adapter,
      store,
      enabled: true,
      onStopServing: stopped,
    });
    await controller.setEligibility('eligible');
    await controller.openPrivacyOptions();
    expect(stopped).toHaveBeenCalled();
    expect(store.getState().status).toBe('unavailable');
  });

  it('anuncios apagados (producción / web): estado off, nada se ejecuta', async () => {
    const fake = fakeAdapter();
    const store = createAdsStore(false);
    const controller = createAdsController({
      adapter: fake.adapter,
      store,
      enabled: false,
      onStopServing: jest.fn(),
    });
    await controller.setEligibility('eligible');
    expect(store.getState().status).toBe('off');
    expect(fake.calls).toEqual({ gather: 0, init: 0 });
  });
});

describe('servicios de interstitial y rewarded', () => {
  const unit = 'ca-app-pub-3940256099942544/1033173712';

  it('bloqueado si no se puede servir: no crea ni carga anuncios', async () => {
    const { adapter, ads } = fakeAdapter();
    const service = createInterstitialService({
      adUnitId: unit,
      createInterstitial: adapter.createInterstitial,
      canServe: () => false,
    });
    service.preload();
    expect(ads).toHaveLength(0);
    expect(await service.show()).toEqual({ outcome: 'blocked' });
  });

  it('sin anuncio cargado: not_ready sin esperar, y pide la carga', async () => {
    const { adapter, ads } = fakeAdapter();
    const service = createInterstitialService({
      adUnitId: unit,
      createInterstitial: adapter.createInterstitial,
      canServe: () => true,
    });
    expect(await service.show()).toEqual({ outcome: 'not_ready' });
    expect(ads[0]!.loads).toBe(1);
  });

  it('interstitial: se muestra, se cierra y se precarga el siguiente', async () => {
    const { adapter, ads } = fakeAdapter();
    const service = createInterstitialService({
      adUnitId: unit,
      createInterstitial: adapter.createInterstitial,
      canServe: () => true,
    });
    service.preload();
    ads[0]!.finishLoad();
    expect(service.isReady).toBe(true);
    const shown = service.show();
    await Promise.resolve();
    ads[0]!.emit('closed');
    expect(await shown).toEqual({ outcome: 'closed' });
    expect(ads[0]!.loads).toBe(2);
  });

  it('rewarded: «watched» sólo informa al cliente; cerrar antes es «dismissed»', async () => {
    const { adapter, ads } = fakeAdapter();
    const service = createRewardedService({
      placement: 'energy',
      adUnitId: unit,
      createRewarded: adapter.createRewarded,
      canServe: () => true,
    });
    service.preload();
    ads[0]!.finishLoad();
    const watched = service.show();
    await Promise.resolve();
    ads[0]!.emit('earned', { type: 'coins', amount: 10 });
    ads[0]!.emit('closed');
    expect(await watched).toEqual({
      outcome: 'watched',
      clientReward: { type: 'coins', amount: 10 },
    });

    ads[0]!.finishLoad();
    const dismissed = service.show();
    await Promise.resolve();
    ads[0]!.emit('closed');
    expect(await dismissed).toEqual({ outcome: 'dismissed' });
  });

  it('discard durante la presentación espera al cierre y no deja promesas colgadas', async () => {
    const { adapter, ads } = fakeAdapter();
    const service = createRewardedService({
      placement: 'skin',
      adUnitId: unit,
      createRewarded: adapter.createRewarded,
      canServe: () => true,
    });
    service.preload();
    ads[0]!.finishLoad();
    const shown = service.show();
    await Promise.resolve();
    service.discard();
    expect(ads[0]!.destroyed).toBe(false);
    ads[0]!.emit('closed');
    expect(await shown).toEqual({ outcome: 'dismissed' });
    expect(ads[0]!.destroyed).toBe(true);
  });

  it('un error de carga no reintenta solo', () => {
    const { adapter, ads } = fakeAdapter();
    const service = createInterstitialService({
      adUnitId: unit,
      createInterstitial: adapter.createInterstitial,
      canServe: () => true,
    });
    service.preload();
    ads[0]!.emit('error', { code: 'googleMobileAds/no-fill' });
    expect(service.lastError).toBe('googleMobileAds/no-fill');
    expect(ads[0]!.loads).toBe(1);
    service.preload();
    expect(ads[0]!.loads).toBe(2);
  });
});
