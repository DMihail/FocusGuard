/** @format */

/* eslint-env jest */

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  const noop = () => undefined;
  const identity = (value) => value;

  return {
    __esModule: true,
    default: {
      View,
      createAnimatedComponent: (component) => component,
      call: noop,
    },
    useSharedValue: (initial) => ({ value: initial }),
    useAnimatedStyle: (factory) => factory(),
    useDerivedValue: (factory) => ({ value: factory() }),
    useAnimatedScrollHandler: (handlers) => handlers.onScroll ?? noop,
    withTiming: (toValue) => toValue,
    withDelay: (_delay, animation) => animation,
    withRepeat: (animation) => animation,
    withSequence: (...animations) => animations[animations.length - 1],
    cancelAnimation: noop,
    makeMutable: (initial) => ({ value: initial }),
    interpolate: (_value, _input, output) => output[0],
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      linear: identity,
      ease: identity,
      in: () => identity,
      out: () => identity,
      inOut: () => identity,
      cubic: identity,
    },
    runOnJS: (fn) => fn,
    useReducedMotion: () => false,
    LinearTransition: {
      duration: () => ({
        easing: () => ({}),
      }),
    },
    FadeIn: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
    FadeOut: {
      duration: () => ({
        delay: () => ({
          easing: () => ({}),
        }),
        easing: () => ({}),
      }),
      easing: () => ({}),
    },
    FadeInDown: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
    FadeOutUp: {
      duration: () => ({
        delay: () => ({
          easing: () => ({
            withInitialValues: () => ({}),
          }),
        }),
        easing: () => ({
          withInitialValues: () => ({}),
        }),
      }),
      easing: () => ({
        withInitialValues: () => ({}),
      }),
      withInitialValues: () => ({}),
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');

  return {
    GestureHandlerRootView: View,
    GestureDetector: ({ children }) => children,
    Gesture: {
      Pan: () => ({
        minDistance: () => ({
          onBegin: () => ({
            onUpdate: () => ({}),
          }),
        }),
      }),
    },
  };
});

jest.mock('@/store/mmkv', () => ({
  zustandStorage: require('./__tests__/helpers/mockZustandMmkv').mockZustandStorage,
}));
