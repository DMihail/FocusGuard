import { getSelectedAppsLayout } from '@/screen/ManageApps/selectedAppsLayout';

describe('getSelectedAppsLayout', () => {
  it('uses row wrap until two rows are full on a typical phone width', () => {
    const fourChips = getSelectedAppsLayout(400, 4);

    expect(fourChips.stripWidth).toBe(352);
    expect(fourChips.chipsPerRow).toBe(2);
    expect(fourChips.usesColumnScroll).toBe(false);
    expect(fourChips.expandedHeight).toBe(128);
  });

  it('switches to column scroll once two rows overflow', () => {
    const fiveChips = getSelectedAppsLayout(400, 5);

    expect(fiveChips.usesColumnScroll).toBe(true);
    expect(fiveChips.expandedHeight).toBe(128);
    expect(fiveChips.columnStripHeight).toBe(92);
  });

  it('uses one row height for a single chip', () => {
    expect(getSelectedAppsLayout(400, 1).expandedHeight).toBe(78);
  });
});
