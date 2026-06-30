/** @format */

import React, { Activity } from 'react';
import { View } from 'react-native';

import { useTranslation } from '@/i18n';
import { testIds } from '@/testing/testIds';

import { useOnboardingPager } from './hooks/useOnboardingPager';
import { useOnboardingStyles } from './styles';

import { OnboardingFooter } from './components/OnboardingFooter';
import { OnboardingHeader } from './components/OnboardingHeader';
import { WalkthroughPager } from './components/WalkthroughPager';
import { ScreenContentFrame, ScreenSafeArea } from '@/components';

export const OnboardingScreen = () => {
  const styles = useOnboardingStyles();
  const { t } = useTranslation();
  const pager = useOnboardingPager();

  return (
    <ScreenSafeArea
      style={styles.screen}
      testID={testIds.onboarding.screen}
      accessibilityLabel={t('onboarding.screenLabel')}
    >
      <ScreenContentFrame>
        <OnboardingHeader indicatorProps={pager.indicatorProps} onSkip={pager.onSkip} />
      </ScreenContentFrame>

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

      <ScreenContentFrame>
        <OnboardingFooter
          isLastStep={pager.isLastStep}
          indicatorProps={pager.indicatorProps}
          onContinue={pager.handleContinue}
        />
      </ScreenContentFrame>
    </ScreenSafeArea>
  );
};
