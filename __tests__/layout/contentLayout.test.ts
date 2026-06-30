/** @format */

import {
  CONTENT_MAX_WIDTH,
  getContentHorizontalPadding,
  getContentInnerWidth,
  getContentLayoutMetrics,
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

  it('caps content column width on wide screens', () => {
    expect(getContentLayoutMetrics(390).columnWidth).toBe(390);
    expect(getContentLayoutMetrics(1024).columnWidth).toBe(CONTENT_MAX_WIDTH);
  });

  it('derives inner width from column and padding', () => {
    const phoneInner = getContentInnerWidth(390);

    expect(phoneInner).toBe(390 - spacing.xl * 2);

    const tabletInner = getContentInnerWidth(1024);

    expect(tabletInner).toBe(CONTENT_MAX_WIDTH - spacing.xxxl * 2);
  });
});
