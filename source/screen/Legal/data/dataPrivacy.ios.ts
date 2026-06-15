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
        '• Apps you choose to track through Apple’s Screen Time picker (opaque app tokens — not bundle IDs — plus display labels shown in the app).',
        '• Usage time for tracked apps from Apple Screen Time / Device Activity APIs.',
        '• Settings you configure in the app, such as selected apps, notification preferences, and onboarding completion.',
        '• Technical data required for the app to run (for example, app version and permission status checks).',
      ],
    },
    {
      title: 'Where data is stored',
      paragraphs: [
        `This information is stored locally on your device and, for monitoring extensions, in a shared App Group container (\`group.com.keept.shared\`). It is not uploaded to ${appDisplayName} servers as part of the current version of the app.`,
        `If you uninstall ${appDisplayName} or clear app data, locally stored settings and selections are removed according to your device settings.`,
      ],
    },
    {
      title: 'iOS permissions we use',
      paragraphs: [
        `${appDisplayName} requests system access only to deliver its features:`,
        '• Screen Time authorization — to let you pick apps to manage and enforce limits you configure (self-control mode).',
        '• Notifications — for limit warnings (you can turn these off in Settings).',
        'Apple does not expose bundle IDs for apps selected through the Screen Time picker; Keept uses stable opaque tokens instead.',
        'You can revoke Screen Time access or notifications at any time in iOS Settings. Some features will stop working if a required permission is disabled.',
      ],
    },
    {
      title: 'What we do not do',
      paragraphs: [
        `${appDisplayName} does not:`,
        '• Collect your contacts, messages, photos, or browsing history.',
        '• Record keystrokes or screen contents.',
        '• Share your usage data with third parties for marketing.',
        '• Require an account to use the core on-device experience described in this policy.',
        '• Monitor other people’s devices (parental controls are out of scope for this app).',
      ],
    },
    {
      title: 'Your choices and controls',
      paragraphs: [
        'You can change which apps are tracked via the Screen Time picker, adjust notification preferences in Settings, and revoke Screen Time or notification access in iOS Settings.',
        'Because processing happens on your device, you remain in control of whether monitoring stays active by managing permissions and app settings.',
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
