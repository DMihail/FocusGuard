/** @format */

import {
  CONTENT_MAX_WIDTH,
  getContentHorizontalPadding,
  getContentInnerWidth,
  isTabletLayout,
} from '@/layout/contentLayout';
import { spacing } from '@/theme';

describe('contentLayout', () => {
  it('detects tablet widths', () => {
    expect(isTabletLayout(599)).toBe(false);
    expect(isTabletLayout(600)).toBe(true);
  });

  it('uses wider padding on large tablets', () => {
    expect(getContentHorizontalPadding(390)).toBe(spacing.xl);
    expect(getContentHorizontalPadding(768)).toBe(spacing.xxl);
    expect(getContentHorizontalPadding(1024)).toBe(spacing.xxxl);
  });

  it('derives inner width from column and padding', () => {
    expect(getContentInnerWidth(390)).toBe(390 - spacing.xl * 2);
    expect(getContentInnerWidth(1024)).toBe(CONTENT_MAX_WIDTH - spacing.xxxl * 2);
  });
});
