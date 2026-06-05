/** @format */

import React from 'react';
import { View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useOnboardingPager } from './hooks/useOnboardingPager';
import { onboardingStyles } from './styles';

import { OnboardingFooter, OnboardingHeader, WalkthroughPager } from './components';
import { ScreenSafeArea } from '@/components';

export const OnboardingScreen = () => {
  const pager = useOnboardingPager();

  return (
    <ScreenSafeArea style={onboardingStyles.screen} testID={testIds.onboarding.screen}>
      <OnboardingHeader indicatorProps={pager.indicatorProps} onSkip={pager.onSkip} />

      <View style={onboardingStyles.pagerContainer} onLayout={pager.handlePagerContainerLayout}>
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
    </ScreenSafeArea>
  );
};
