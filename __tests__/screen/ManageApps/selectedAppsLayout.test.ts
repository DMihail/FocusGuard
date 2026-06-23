import {
  getSelectedAppsColumnStripWidth,
  getSelectedAppsStripWidth,
  getSelectedChipsPerRow,
  getSelectedStripHeight,
  getSelectedStripRowCount,
  needsSelectedAppsHorizontalScroll,
} from '@/screen/ManageApps/selectedAppsLayout';

describe('selectedAppsLayout', () => {
  it('computes strip width from window width minus horizontal inset', () => {
    expect(getSelectedAppsStripWidth(400)).toBe(352);
  });

  it('fits two 148px chips per row on a typical phone width', () => {
    expect(getSelectedChipsPerRow(352)).toBe(2);
  });

  it('uses row layout until two rows are full', () => {
    expect(needsSelectedAppsHorizontalScroll(4, 2)).toBe(false);
    expect(needsSelectedAppsHorizontalScroll(5, 2)).toBe(true);
  });

  it('lays out overflow chips in columns for horizontal scroll', () => {
    expect(getSelectedAppsColumnStripWidth(5)).toBe(460);
  });

  it('uses one row height for a single chip', () => {
    expect(getSelectedStripRowCount(1, 2)).toBe(1);
    expect(getSelectedStripHeight(1, 2)).toBe(42);
  });

  it('uses two row height when chips overflow the first row without scroll', () => {
    expect(getSelectedStripRowCount(3, 2)).toBe(2);
    expect(getSelectedStripHeight(3, 2)).toBe(92);
  });

  it('uses full two-row height when horizontal scroll is active', () => {
    expect(getSelectedStripHeight(5, 2)).toBe(92);
  });
});
