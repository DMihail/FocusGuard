/** @format */

import {
  clampStepIndex,
  createGetItemLayout,
  createScrollToIndexFailedHandler,
  getStepFromOffset,
} from '../../../../source/screen/Onboarding/utils/scroll';

describe('scroll utils', () => {
  describe('clampStepIndex', () => {
    it('clamps values below zero', () => {
      expect(clampStepIndex(-2, 2)).toBe(0);
    });

    it('clamps values above last index', () => {
      expect(clampStepIndex(5, 2)).toBe(2);
    });

    it('returns the same index when within range', () => {
      expect(clampStepIndex(1, 2)).toBe(1);
    });
  });

  describe('getStepFromOffset', () => {
    const lastStepIndex = 2;

    it('returns 0 when page width is not ready', () => {
      expect(getStepFromOffset(150, 0, lastStepIndex)).toBe(0);
    });

    it('maps offset to the nearest step', () => {
      expect(getStepFromOffset(0, 300, lastStepIndex)).toBe(0);
      expect(getStepFromOffset(149, 300, lastStepIndex)).toBe(0);
      expect(getStepFromOffset(150, 300, lastStepIndex)).toBe(1);
      expect(getStepFromOffset(600, 300, lastStepIndex)).toBe(2);
    });

    it('does not exceed the last step index', () => {
      expect(getStepFromOffset(9999, 300, lastStepIndex)).toBe(2);
    });
  });

  describe('createGetItemLayout', () => {
    it('returns layout metrics for each index', () => {
      const getItemLayout = createGetItemLayout(300);
      expect(getItemLayout(null, 0)).toEqual({ length: 300, offset: 0, index: 0 });
      expect(getItemLayout(null, 2)).toEqual({ length: 300, offset: 600, index: 2 });
    });
  });

  describe('createScrollToIndexFailedHandler', () => {
    it('scrolls to the computed offset', () => {
      const scrollToOffset = jest.fn();
      const listRef = { current: { scrollToOffset } };
      const handler = createScrollToIndexFailedHandler(listRef, 250);

      handler({ index: 2 });

      expect(scrollToOffset).toHaveBeenCalledWith({ offset: 500, animated: true });
    });

    it('does nothing when list ref is empty', () => {
      const handler = createScrollToIndexFailedHandler({ current: null }, 250);
      expect(() => handler({ index: 1 })).not.toThrow();
    });
  });
});
