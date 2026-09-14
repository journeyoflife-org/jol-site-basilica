import { describe, it, expect } from 'vitest';
import { churchEntity, massEventEntity, breadcrumbListEntity } from '@journeyoflife-org/seo';

describe('churchEntity', () => {
  const baseInput = {
    kind: 'basilica' as const,
    preciseCatholic: true,
    name: 'Vilniaus arkikatedra bazilika',
    url: 'https://katedra.lt',
    address: {
      streetAddress: 'Katedros a. 2',
      addressLocality: 'Vilnius',
      postalCode: '01143',
      addressCountry: 'LT',
    },
  };

  it('emits correct @context', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result['@context']).toBe('https://schema.org');
  });

  it('emits Church, CatholicChurch, PlaceOfWorship types for basilica with preciseCatholic', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result['@type']).toEqual(['Church', 'CatholicChurch', 'PlaceOfWorship']);
  });

  it('includes name and url', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result.name).toBe('Vilniaus arkikatedra bazilika');
    expect(result.url).toBe('https://katedra.lt');
  });

  it('includes PostalAddress with correct fields', () => {
    const result = churchEntity(baseInput) as any;
    expect(result.address['@type']).toBe('PostalAddress');
    expect(result.address.streetAddress).toBe('Katedros a. 2');
    expect(result.address.addressLocality).toBe('Vilnius');
    expect(result.address.postalCode).toBe('01143');
    expect(result.address.addressCountry).toBe('LT');
  });

  it('omits geo when not provided', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result).not.toHaveProperty('geo');
  });

  it('includes geo when provided', () => {
    const result = churchEntity({
      ...baseInput,
      geo: { latitude: 54.6862, longitude: 25.2903 },
    }) as any;
    expect(result.geo['@type']).toBe('GeoCoordinates');
    expect(result.geo.latitude).toBe(54.6862);
    expect(result.geo.longitude).toBe(25.2903);
  });

  it('omits telephone when not provided', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result).not.toHaveProperty('telephone');
  });

  it('includes telephone when provided', () => {
    const result = churchEntity({
      ...baseInput,
      telephone: '+370 5 261 0731',
    }) as Record<string, unknown>;
    expect(result.telephone).toBe('+370 5 261 0731');
  });

  it('omits parentOrganization when not provided', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result).not.toHaveProperty('parentOrganization');
  });

  it('includes parentOrganization as ReligiousOrganization', () => {
    const result = churchEntity({
      ...baseInput,
      parent: { name: 'Vilniaus arkivyskupija', url: 'https://vilnensis.lt' },
    }) as any;
    expect(result.parentOrganization['@type']).toBe('ReligiousOrganization');
    expect(result.parentOrganization.name).toBe('Vilniaus arkivyskupija');
    expect(result.parentOrganization.url).toBe('https://vilnensis.lt');
  });

  it('omits image when not provided', () => {
    const result = churchEntity(baseInput) as Record<string, unknown>;
    expect(result).not.toHaveProperty('image');
  });

  it('includes image when provided', () => {
    const result = churchEntity({
      ...baseInput,
      image: '/images/exterior.jpg',
    }) as Record<string, unknown>;
    expect(result.image).toBe('/images/exterior.jpg');
  });

  it('emits ReligiousOrganization for deanery kind', () => {
    const result = churchEntity({
      kind: 'deanery',
      name: 'Vilniaus dekanatas',
      url: 'https://example.lt',
      address: { streetAddress: 'Test g. 1', addressLocality: 'Vilnius' },
    }) as Record<string, unknown>;
    expect(result['@type']).toBe('ReligiousOrganization');
  });
});

describe('massEventEntity', () => {
  it('emits Event type with correct context', () => {
    const result = massEventEntity({
      name: 'Šv. Mišios',
      startDate: '2026-09-13T10:00:00',
      location: {
        name: 'Vilniaus arkikatedra bazilika',
        address: { streetAddress: 'Katedros a. 2', addressLocality: 'Vilnius' },
      },
    }) as Record<string, unknown>;
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('Event');
  });

  it('includes name and startDate', () => {
    const result = massEventEntity({
      name: 'Šv. Mišios',
      startDate: '2026-09-13T10:00:00',
      location: { name: 'Katedra', address: {} },
    }) as Record<string, unknown>;
    expect(result.name).toBe('Šv. Mišios');
    expect(result.startDate).toBe('2026-09-13T10:00:00');
  });

  it('includes location as Place with PostalAddress', () => {
    const result = massEventEntity({
      name: 'Šv. Mišios',
      startDate: '2026-09-13T10:00:00',
      location: {
        name: 'Katedra',
        address: { streetAddress: 'Katedros a. 2' },
      },
    }) as any;
    expect(result.location['@type']).toBe('Place');
    expect(result.location.name).toBe('Katedra');
    expect(result.location.address['@type']).toBe('PostalAddress');
    expect(result.location.address.streetAddress).toBe('Katedros a. 2');
  });
});

describe('breadcrumbListEntity', () => {
  it('emits BreadcrumbList with correct context', () => {
    const result = breadcrumbListEntity([{ name: 'Home', url: '/' }]) as Record<string, unknown>;
    expect(result['@context']).toBe('https://schema.org');
    expect(result['@type']).toBe('BreadcrumbList');
  });

  it('maps items to ListItem with 1-based positions', () => {
    const result = breadcrumbListEntity([
      { name: 'Home', url: '/' },
      { name: 'Privacy', url: '/privacy' },
    ]) as any;
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0]['@type']).toBe('ListItem');
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[0].name).toBe('Home');
    expect(result.itemListElement[0].item).toBe('/');
    expect(result.itemListElement[1].position).toBe(2);
    expect(result.itemListElement[1].name).toBe('Privacy');
  });

  it('handles empty items array', () => {
    const result = breadcrumbListEntity([]) as any;
    expect(result.itemListElement).toHaveLength(0);
  });
});
