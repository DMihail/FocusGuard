/** @format */

import React, { Activity } from 'react';
import { View } from 'react-native';

import { testIds } from '@/testing/testIds';

import { useOnboardingPager } from './hooks/useOnboardingPager';
import { useOnboardingStyles } from './styles';

import { OnboardingFooter, OnboardingHeader, WalkthroughPager } from './components';
import { ScreenSafeArea } from '@/components';

export const OnboardingScreen = () => {
  const styles = useOnboardingStyles();
  const pager = useOnboardingPager();

  return (
    <ScreenSafeArea style={styles.screen} testID={testIds.onboarding.screen} accessibilityLabel="Onboarding">
      <OnboardingHeader indicatorProps={pager.indicatorProps} onSkip={pager.onSkip} />

      <View style={styles.pagerContainer} onLayout={pager.handlePagerContainerLayout}>
        <Activity mode={pager.isPagerReady ? 'visible' : 'hidden'}>
          <WalkthroughPager
            listRef={pager.listRef}
            steps={pager.steps}
            pageWidth={pager.pageWidth}
            onScroll={pager.handleScroll}
            onMomentumScrollEnd={pager.handleMomentumScrollEnd}
            getItemLayout={pager.getItemLayout}
            onScrollToIndexFailed={pager.handleScrollToIndexFailed}
          />
        </Activity>
      </View>

      <OnboardingFooter
        isLastStep={pager.isLastStep}
        indicatorProps={pager.indicatorProps}
        onContinue={pager.handleContinue}
      />
    </ScreenSafeArea>
  );
};
