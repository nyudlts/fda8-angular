import {
  COLLECTION_CONFIGS,
  DEFAULT_CONFIG,
  getConfigForCollection,
} from './item-field-config';

describe('Item Field Configuration', () => {

  describe('getConfigForCollection', () => {

    it('should return default config for unknown handle', () => {
      const config = getConfigForCollection('unknown/handle');
      expect(config).toBe(DEFAULT_CONFIG);
    });

    it('should return default config for empty handle', () => {
      const config = getConfigForCollection('');
      expect(config).toBe(DEFAULT_CONFIG);
    });

    it('should return default config for null handle', () => {
      const config = getConfigForCollection(null as any);
      expect(config).toBe(DEFAULT_CONFIG);
    });

    it('should have fields array in returned config', () => {
      const config = getConfigForCollection('any/handle');
      expect(config.fields).toBeDefined();
      expect(Array.isArray(config.fields)).toBe(true);
      expect(config.fields.length).toBeGreaterThan(0);
    });
  });

  describe('DEFAULT_CONFIG', () => {

    it('should have empty handles array', () => {
      expect(DEFAULT_CONFIG.handles).toEqual([]);
    });

    it('should have empty i18nPrefix', () => {
      expect(DEFAULT_CONFIG.i18nPrefix).toBe('');
    });

    it('should have required default fields', () => {
      const fieldNames = DEFAULT_CONFIG.fields.map(f => f.field);
      expect(fieldNames).toContain('dc.title');
      expect(fieldNames).toContain('dc.identifier.uri');
    });
  });

  describe('COLLECTION_CONFIGS', () => {

    it('should be an array', () => {
      expect(Array.isArray(COLLECTION_CONFIGS)).toBe(true);
    });

    it('should have unique i18nPrefix for each config', () => {
      const prefixes = COLLECTION_CONFIGS.map(c => c.i18nPrefix).filter(p => p);
      const uniquePrefixes = [...new Set(prefixes)];
      expect(prefixes.length).toBe(uniquePrefixes.length);
    });
  });
});
