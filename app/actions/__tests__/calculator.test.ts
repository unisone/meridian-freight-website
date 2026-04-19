import { beforeEach, describe, expect, it, vi } from 'vitest';

import { buildRateBookSignature } from '@/lib/calculator-contract.server';
import type {
  EquipmentPackingRate,
  OceanFreightRate,
} from '@/lib/types/calculator';

const {
  afterMock,
  fetchEquipmentRatesMock,
  fetchOceanRatesMock,
  resendSendMock,
  trackMock,
  notifySlackMock,
  sendCapiEventMock,
  logMock,
  timerErrorMock,
  timerDoneMock,
} = vi.hoisted(() => ({
  afterMock: vi.fn(),
  fetchEquipmentRatesMock: vi.fn(),
  fetchOceanRatesMock: vi.fn(),
  resendSendMock: vi.fn(),
  trackMock: vi.fn(),
  notifySlackMock: vi.fn(),
  sendCapiEventMock: vi.fn(),
  logMock: vi.fn(),
  timerErrorMock: vi.fn(),
  timerDoneMock: vi.fn(),
}));

vi.mock('next/server', () => ({
  after: afterMock,
}));

vi.mock('@/lib/supabase-rates', () => ({
  fetchEquipmentRates: fetchEquipmentRatesMock,
  fetchOceanRates: fetchOceanRatesMock,
}));

vi.mock('resend', () => ({
  Resend: vi.fn(function Resend() {
    return {
      emails: {
        send: resendSendMock,
      },
    };
  }),
}));

vi.mock('@vercel/analytics/server', () => ({
  track: trackMock,
}));

vi.mock('@/lib/slack', () => ({
  notifySlack: notifySlackMock,
}));

vi.mock('@/lib/meta-capi', () => ({
  sendCAPIEvent: sendCapiEventMock,
}));

vi.mock('@/lib/logger', () => ({
  startTimer: () => ({
    error: timerErrorMock,
    done: timerDoneMock,
  }),
  log: logMock,
}));

import { submitCalculator } from '@/app/actions/calculator';

const equipmentRates: EquipmentPackingRate[] = [
  {
    id: 'combine-1',
    equipment_category: 'combine',
    equipment_type: 'combine_small',
    display_name_en: 'Combine - Small Series',
    models: 'S660, S670',
    delivery_per_mile: 10,
    packing_cost: 8250,
    packing_unit: 'flat',
    wash_usda_cost: 900,
    container_type: 'fortyhc',
  },
  {
    id: 'tractor-1',
    equipment_category: 'tractor',
    equipment_type: 'tractor_4wd',
    display_name_en: 'Tractor 4WD',
    models: '8R Series',
    delivery_per_mile: 6.5,
    packing_cost: 5400,
    packing_unit: 'flat',
    wash_usda_cost: 700,
    container_type: 'fortyhc',
  },
];

const oceanRates: OceanFreightRate[] = [
  {
    id: 'hc-uy',
    container_type: 'fortyhc',
    origin_port: 'Chicago, IL',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'HAPAG',
    ocean_rate: 2800,
    drayage: 650,
    packing_drayage: null,
    transit_time_days: '35-40',
  },
  {
    id: 'hc-ar',
    container_type: 'fortyhc',
    origin_port: 'Chicago, IL',
    destination_port: 'Buenos Aires',
    destination_country: 'AR',
    carrier: 'Maersk',
    ocean_rate: 3200,
    drayage: 700,
    packing_drayage: null,
    transit_time_days: '40-45',
  },
  {
    id: 'fr-uy',
    container_type: 'flatrack',
    origin_port: 'Houston, TX',
    destination_port: 'Montevideo',
    destination_country: 'UY',
    carrier: 'MSC',
    ocean_rate: 4500,
    drayage: null,
    packing_drayage: 800,
    transit_time_days: '30-35',
  },
];

function buildPayload(
  overrides: Partial<Parameters<typeof submitCalculator>[0]> = {},
): Parameters<typeof submitCalculator>[0] {
  return {
    email: 'customer@example.com',
    name: 'Customer',
    company: 'Meridian Test',
    equipmentId: 'tractor-1',
    equipmentCategory: 'tractor',
    equipmentType: 'tractor_4wd',
    equipmentDisplayName: 'Tractor 4WD',
    equipmentSize: null,
    equipmentValueUsd: null,
    containerType: 'fortyhc',
    destinationCountry: 'UY',
    zipCode: '50005',
    rateBookSignature: buildRateBookSignature({ equipmentRates, oceanRates }),
    website: '',
    source_page: '/pricing/calculator',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    ...overrides,
  };
}

describe('submitCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = 'test-key';
    afterMock.mockImplementation(() => {});
    fetchEquipmentRatesMock.mockResolvedValue(equipmentRates);
    fetchOceanRatesMock.mockResolvedValue(oceanRates);
    resendSendMock.mockResolvedValue({ error: null });
    trackMock.mockResolvedValue(undefined);
    notifySlackMock.mockResolvedValue(undefined);
    sendCapiEventMock.mockResolvedValue(undefined);
  });

  it('enforces declared equipment value for canonical flatrack routes on the server', async () => {
    const result = await submitCalculator(
      buildPayload({
        equipmentId: 'combine-1',
        equipmentCategory: 'combine',
        equipmentType: 'combine_small',
        equipmentDisplayName: 'Combine - Small Series',
        containerType: 'fortyhc',
        destinationCountry: 'UY',
        zipCode: '',
        equipmentValueUsd: null,
      }),
    );

    expect(result).toEqual({
      success: false,
      error: 'Equipment value is required for flat rack estimates.',
      currentRateBookSignature: buildRateBookSignature({
        equipmentRates,
        oceanRates,
      }),
    });
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('rejects routes that are unsupported for the canonical container type', async () => {
    const result = await submitCalculator(
      buildPayload({
        equipmentId: 'combine-1',
        equipmentCategory: 'combine',
        equipmentType: 'combine_small',
        equipmentDisplayName: 'Combine - Small Series',
        containerType: 'fortyhc',
        destinationCountry: 'AR',
        zipCode: '',
        equipmentValueUsd: 120000,
      }),
    );

    expect(result).toEqual({
      success: false,
      error:
        'No live freight rate is currently published for this equipment and destination. Please request a manual quote.',
      currentRateBookSignature: buildRateBookSignature({
        equipmentRates,
        oceanRates,
      }),
    });
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns a refreshed estimate when the client ratebook signature is stale', async () => {
    const result = await submitCalculator(
      buildPayload({
        rateBookSignature: 'stale-signature',
      }),
    );

    expect(result.success).toBe(false);
    expect(result.rateBookChanged).toBe(true);
    expect(result.error).toBe(
      'Freight rates were updated while you were using the calculator. Review the refreshed estimate and submit again.',
    );
    expect(result.currentRateBookSignature).toBe(
      buildRateBookSignature({
        equipmentRates,
        oceanRates,
      }),
    );
    expect(result.estimate?.containerType).toBe('fortyhc');
    expect(result.estimate?.estimatedTotal).toBeGreaterThan(0);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('routes calculator emails to the CEO with alex.z cc and contact inbox replies', async () => {
    afterMock.mockImplementation(async (callback: () => Promise<void>) => {
      await callback();
    });

    const result = await submitCalculator(buildPayload(), 'es');

    expect(result.success).toBe(true);
    expect(resendSendMock).toHaveBeenCalledTimes(2);
    expect(resendSendMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: 'alex.r@meridianexport.com',
        cc: ['alex.z@meridianexport.com'],
        replyTo: 'customer@example.com',
      }),
    );
    expect(resendSendMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        to: 'customer@example.com',
        replyTo: 'contact@meridianexport.com',
      }),
    );
  });
});
