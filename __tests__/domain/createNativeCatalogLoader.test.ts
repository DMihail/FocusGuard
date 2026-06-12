import { createNativeCatalogLoader, createNativeKeyedCatalogLoader } from '@/domain/createNativeCatalogLoader';

describe('createNativeCatalogLoader', () => {
  it('caches loaded values until invalidated', async () => {
    let reads = 0;
    const loader = createNativeCatalogLoader({
      label: 'testCatalog',
      fallback: [],
      read: () => {
        reads += 1;
        return ['app-a'];
      },
    });

    await expect(loader.load()).resolves.toEqual(['app-a']);
    await expect(loader.load()).resolves.toEqual(['app-a']);
    expect(reads).toBe(1);

    loader.invalidate();
    await expect(loader.load()).resolves.toEqual(['app-a']);
    expect(reads).toBe(2);
  });
});

describe('createNativeKeyedCatalogLoader', () => {
  it('loads only requested package keys and merges cache entries', async () => {
    const loader = createNativeKeyedCatalogLoader<Record<string, number>>({
      label: 'usageCatalog',
      readKeys: (keys) =>
        Object.fromEntries(keys.map((key) => [key, key === 'com.social.chat' ? 15 : 45])) as Record<string, number>,
    });

    await expect(loader.loadForKeys(['com.social.chat'])).resolves.toEqual({
      'com.social.chat': 15,
    });

    await expect(loader.loadForKeys(['com.social.chat', 'com.game.puzzle'])).resolves.toEqual({
      'com.social.chat': 15,
      'com.game.puzzle': 45,
    });
  });

  it('loads all keys when concurrent requests use different key sets', async () => {
    const readKeys = jest.fn(
      (keys: readonly string[]) => Object.fromEntries(keys.map((key) => [key, key.length])) as Record<string, number>,
    );
    const loader = createNativeKeyedCatalogLoader<Record<string, number>>({
      label: 'usageCatalog',
      readKeys,
    });

    const [first, second] = await Promise.all([loader.loadForKeys(['com.a']), loader.loadForKeys(['com.a', 'com.bb'])]);

    expect(first).toEqual({ 'com.a': 5 });
    expect(second).toEqual({ 'com.a': 5, 'com.bb': 6 });
    expect(readKeys).toHaveBeenCalledTimes(1);
    expect(readKeys).toHaveBeenCalledWith(['com.a', 'com.bb']);
  });
});
