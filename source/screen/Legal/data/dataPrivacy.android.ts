/** @format */

import type { LegalDocument } from '../types';

export const buildDataPrivacyDocument = (appDisplayName: string): LegalDocument => ({
  title: 'Data Privacy',
  subtitle: `How ${appDisplayName} handles information on your device`,
  lastUpdated: 'May 19, 2026',
  sections: [
    {
      title: 'Our commitment',
      paragraphs: [
        `${appDisplayName} is built to help you understand and limit distracting app use. Your activity data is meant to stay on your phone. We do not run advertising profiles, sell data, or operate a cloud account that stores your usage history.`,
      ],
    },
    {
      title: 'Information processed on your device',
      paragraphs: [
        `To provide focus monitoring and limits, ${appDisplayName} may process:`,
        '• Apps you choose to track (package name, display name, and icon shown in the app).',
        '• Usage statistics from Android Usage Access (time in foreground, last used time, and related metrics exposed by the system).',
        '• Settings you configure in the app, such as selected apps, notification preferences, and onboarding completion.',
        '• Technical data required for the app to run (for example, app version and permission status checks).',
      ],
    },
    {
      title: 'Where data is stored',
      paragraphs: [
        `This information is stored locally on your device using on-device storage (including encrypted-capable local storage used by the app). It is not uploaded to ${appDisplayName} servers as part of the current version of the app.`,
        `If you uninstall ${appDisplayName} or clear app data, locally stored settings and selections are removed according to your device settings.`,
      ],
    },
    {
      title: 'Android permissions we use',
      paragraphs: [
        `${appDisplayName} requests system permissions only to deliver its features:`,
        '• Usage Access — to read app usage statistics for apps you manage.',
        '• Display over other apps — to show blocking or warning overlays when limits apply.',
        '• Notifications — for reminders and limit alerts (you can turn these off in Settings).',
        '• Run in background / battery optimization exemption — so monitoring can continue after you leave the app or restart the device.',
        '• Foreground service — to keep focus monitoring active with a visible ongoing notification while protection is enabled.',
        '• Installed apps visibility — to list apps you can select for limits on supported Android versions.',
        'You can revoke permissions at any time in Android settings. Some features will stop working if a required permission is disabled.',
      ],
    },
    {
      title: 'Crash reporting',
      paragraphs: [
        `To diagnose crashes and improve stability, release builds may send crash reports to Google Firebase Crashlytics. Reports can include stack traces, device model, OS version, and app version. They do not include your usage history, selected apps, or limit settings.`,
        'Crash reporting is disabled in debug builds. You can opt out by not using release builds from app stores, or contact us if you need more detail about data processed by Crashlytics.',
      ],
    },
    {
      title: 'What we do not do',
      paragraphs: [
        `${appDisplayName} does not:`,
        '• Collect your contacts, messages, photos, or browsing history.',
        '• Record keystrokes or screen contents outside what Android Usage Access provides for app usage metrics.',
        '• Share your usage data with third parties for marketing.',
        '• Require an account to use the core on-device experience described in this policy.',
      ],
    },
    {
      title: 'Your choices and controls',
      paragraphs: [
        'You can change which apps are tracked, adjust notification preferences in Settings, and revoke Android permissions in system settings.',
        'Because processing happens on your device, you remain in control of whether monitoring and overlays stay active by managing permissions and app settings.',
      ],
    },
    {
      title: 'Children',
      paragraphs: [
        `${appDisplayName} is not directed at children under 13. If you are a parent or guardian and believe a child has provided personal information through the app, contact us using the details in Terms & Privacy.`,
      ],
    },
    {
      title: 'Changes to this notice',
      paragraphs: [
        'We may update this Data Privacy notice when features or legal requirements change. The “Last updated” date at the top of this screen will change when we do. Continued use of the app after an update means you accept the revised notice.',
      ],
    },
  ],
});
