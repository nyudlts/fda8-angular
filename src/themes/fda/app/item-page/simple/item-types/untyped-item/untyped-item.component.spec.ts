describe('UntypedItemComponent Logic', () => {

  describe('extractHandle function', () => {
    // Copy the extractHandle logic from your component
    function extractHandle(handleOrUrl: string): string {
      if (!handleOrUrl) {
        return '';
      }

      if (handleOrUrl.includes('/handle/')) {
        const parts = handleOrUrl.split('/handle/');
        return parts[parts.length - 1];
      }

      if (handleOrUrl.includes('://')) {
        const parts = handleOrUrl.split('/');
        if (parts.length >= 2) {
          return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
        }
      }

      return handleOrUrl;
    }

    it('should extract handle from localhost URL', () => {
      const result = extractHandle('http://localhost:4000/handle/2451/48010');
      expect(result).toBe('2451/48010');
    });

    it('should extract handle from production URL', () => {
      const result = extractHandle('https://example.com/handle/2451/48010');
      expect(result).toBe('2451/48010');
    });

    it('should return handle as-is if already in correct format', () => {
      const result = extractHandle('2451/48010');
      expect(result).toBe('2451/48010');
    });

    it('should handle empty string', () => {
      const result = extractHandle('');
      expect(result).toBe('');
    });

    it('should handle null', () => {
      const result = extractHandle(null as any);
      expect(result).toBe('');
    });
  });

  describe('getI18nKey function', () => {
    function getI18nKey(collectionConfig: any, baseKey: string): string {
      if (collectionConfig.i18nPrefix) {
        return `${collectionConfig.i18nPrefix}.${baseKey}`;
      }
      return baseKey;
    }

    it('should return base key when no prefix', () => {
      const config = { handles: [], fields: [], i18nPrefix: '' };
      const result = getI18nKey(config, 'item.page.title');
      expect(result).toBe('item.page.title');
    });

    it('should return prefixed key when prefix exists', () => {
      const config = { handles: [], fields: [], i18nPrefix: 'jones' };
      const result = getI18nKey(config, 'item.page.title');
      expect(result).toBe('jones.item.page.title');
    });

    it('should handle relics prefix', () => {
      const config = { handles: [], fields: [], i18nPrefix: 'relics' };
      const result = getI18nKey(config, 'item.page.description');
      expect(result).toBe('relics.item.page.description');
    });
  });

  describe('getFieldValues function', () => {
    function getFieldValues(mockObject: any, fieldConfig: any): string[] {
      const fields = fieldConfig.field.split(',');
      return mockObject.allMetadataValues(fields);
    }

    it('should return values from metadata', () => {
      const mockObject = {
        allMetadataValues: (fields: string[]) => ['Test Title'],
      };
      const fieldConfig = { field: 'dc.title', labelKey: 'test', type: 'text' };

      const result = getFieldValues(mockObject, fieldConfig);
      expect(result).toEqual(['Test Title']);
    });

    it('should handle multiple fields', () => {
      const mockObject = {
        allMetadataValues: (fields: string[]) => {
          if (fields.includes('dc.contributor.author')) {return ['Author 1', 'Author 2'];}
          return [];
        },
      };
      const fieldConfig = {
        field: 'dc.contributor.author,dc.creator',
        labelKey: 'test',
        type: 'authors',
      };

      const result = getFieldValues(mockObject, fieldConfig);
      expect(result).toEqual(['Author 1', 'Author 2']);
    });

    it('should return empty array for non-existent fields', () => {
      const mockObject = {
        allMetadataValues: (fields: string[]) => [],
      };
      const fieldConfig = { field: 'dc.nonexistent', labelKey: 'test', type: 'text' };

      const result = getFieldValues(mockObject, fieldConfig);
      expect(result).toEqual([]);
    });
  });

  describe('hasFieldValue function', () => {
    function hasFieldValue(mockObject: any, fieldConfig: any): boolean {
      const fields = fieldConfig.field.split(',');
      const values = mockObject.allMetadataValues(fields);
      return values.length > 0;
    }

    it('should return true when values exist', () => {
      const mockObject = {
        allMetadataValues: (fields: string[]) => ['Value 1'],
      };
      const fieldConfig = { field: 'dc.title', labelKey: 'test', type: 'text' };

      expect(hasFieldValue(mockObject, fieldConfig)).toBe(true);
    });

    it('should return false when no values', () => {
      const mockObject = {
        allMetadataValues: (fields: string[]) => [],
      };
      const fieldConfig = { field: 'dc.title', labelKey: 'test', type: 'text' };

      expect(hasFieldValue(mockObject, fieldConfig)).toBe(false);
    });
  });

  describe('getFirstFieldValue function', () => {
    function getFirstFieldValue(mockObject: any, fieldConfig: any): string {
      const fields = fieldConfig.field.split(',');
      return mockObject.firstMetadataValue(fields);
    }

    it('should return first value', () => {
      const mockObject = {
        firstMetadataValue: (fields: string[]) => 'Test Title',
      };
      const fieldConfig = { field: 'dc.title', labelKey: 'test', type: 'text' };

      const result = getFirstFieldValue(mockObject, fieldConfig);
      expect(result).toBe('Test Title');
    });

    it('should return null for non-existent field', () => {
      const mockObject = {
        firstMetadataValue: (fields: string[]) => null,
      };
      const fieldConfig = { field: 'dc.nonexistent', labelKey: 'test', type: 'text' };

      const result = getFirstFieldValue(mockObject, fieldConfig);
      expect(result).toBe(null);
    });
  });
});
