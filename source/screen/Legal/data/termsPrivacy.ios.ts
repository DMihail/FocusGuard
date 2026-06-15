/** @format */

import { SUPPORT_EMAIL } from '@/constants/branding';

import type { LegalDocument } from '../types';

export const buildTermsPrivacyDocument = (appDisplayName: string): LegalDocument => ({
  title: 'Terms & Privacy',
  subtitle: `Rules for using ${appDisplayName}`,
  lastUpdated: 'May 19, 2026',
  sections: [
    {
      title: 'Agreement',
      paragraphs: [
        `By installing or using ${appDisplayName} (“the app”), you agree to these Terms & Privacy. If you do not agree, do not use the app.`,
        'These terms work together with the Data Privacy screen, which explains what information the app processes on your device.',
      ],
    },
    {
      title: `What ${appDisplayName} provides`,
      paragraphs: [
        `${appDisplayName} helps you monitor time spent in selected apps and apply focus limits you configure. Features depend on your iPhone or iPad model, iOS version, and the Screen Time permissions you grant.`,
        'The app is provided for personal digital wellbeing (self-control). It is not medical, psychological, or legal advice, and it does not guarantee that you will meet specific productivity goals.',
      ],
    },
    {
      title: 'Permissions and your responsibility',
      paragraphs: [
        'You are responsible for granting and managing Screen Time authorization and notification permissions required for monitoring and alerts.',
        `You must use ${appDisplayName} only on devices you own or are authorized to manage. The app does not support monitoring another person’s device.`,
      ],
    },
    {
      title: 'Acceptable use',
      paragraphs: [
        'You agree not to:',
        '• Reverse engineer, tamper with, or misuse the app to bypass limits for harmful or unlawful purposes.',
        `• Use ${appDisplayName} in a way that violates applicable law or third-party rights.`,
        '• Rely on the app as the sole safety or compliance control for regulated environments.',
      ],
    },
    {
      title: 'Privacy summary',
      paragraphs: [
        `${appDisplayName} processes usage-related data locally on your device to show statistics and enforce limits you set. We do not sell your usage data.`,
        'See the Data Privacy screen for a full description of data categories, permissions, storage, and your controls.',
      ],
    },
    {
      title: 'Disclaimer',
      paragraphs: [
        'The app is provided “as is” and “as available” without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy of usage statistics, or uninterrupted operation.',
        `iOS updates, Low Power Mode, and Screen Time system behavior may affect monitoring. ${appDisplayName} may not detect or block every app interaction in all circumstances. Blocks use Apple’s system shields, not a custom overlay.`,
      ],
    },
    {
      title: 'Limitation of liability',
      paragraphs: [
        `To the maximum extent permitted by law, ${appDisplayName} and its developers are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or goodwill arising from your use of the app.`,
        'Our total liability for any claim related to the app is limited to the amount you paid for the app in the twelve months before the claim, or zero if the app was free.',
      ],
    },
    {
      title: 'Changes',
      paragraphs: [
        'We may update these terms or app features. Material changes will be reflected by updating the “Last updated” date. Your continued use after changes take effect constitutes acceptance of the updated terms.',
      ],
    },
    {
      title: 'Contact',
      paragraphs: [`Questions about these terms or privacy practices: ${SUPPORT_EMAIL}`],
    },
  ],
});
