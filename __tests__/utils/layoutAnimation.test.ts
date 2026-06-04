/** @format */

import { LayoutAnimation } from 'react-native';

import { configurePermissionCardLayoutAnimation, configureSectionLayoutAnimation } from '@/utils/layoutAnimation';

describe('layoutAnimation', () => {
  const configureNextSpy = jest.spyOn(LayoutAnimation, 'configureNext').mockImplementation(() => undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    configureNextSpy.mockRestore();
  });

  it('configures section and permission card animations', () => {
    configureSectionLayoutAnimation();
    configurePermissionCardLayoutAnimation();

    expect(configureNextSpy).toHaveBeenCalledTimes(2);
  });
});
