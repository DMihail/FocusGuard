/** @format */

import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingFooter, OnboardingHeader, WalkthroughPager } from './components';
import { useOnboardingPager } from './hooks/useOnboardingPager';
import { testIds } from '../../testing/testIds';
import { onboardingStyles } from './styles';

export const OnboardingScreen = () => {
  const pager = useOnboardingPager();

  return (
    <SafeAreaView style={onboardingStyles.screen} edges={['top', 'bottom']} testID={testIds.onboarding.screen}>
      <OnboardingHeader indicatorProps={pager.indicatorProps} onSkip={pager.onSkip} />

      <View
        style={onboardingStyles.pagerContainer}
        onLayout={(event) => pager.handlePagerLayout(event.nativeEvent.layout.width)}
      >
        {pager.isPagerReady ? (
          <WalkthroughPager
            listRef={pager.listRef}
            steps={pager.steps}
            pageWidth={pager.pageWidth}
            onScroll={pager.handleScroll}
            onMomentumScrollEnd={pager.handleMomentumScrollEnd}
            getItemLayout={pager.getItemLayout}
            onScrollToIndexFailed={pager.handleScrollToIndexFailed}
          />
        ) : null}
      </View>

      <OnboardingFooter
        isLastStep={pager.isLastStep}
        indicatorProps={pager.indicatorProps}
        onContinue={pager.handleContinue}
      />
    </SafeAreaView>
  );
};
