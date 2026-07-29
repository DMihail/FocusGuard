/** @format */

import { SUPPORT_EMAIL } from '@/constants/branding';

import type { LegalDocument, LegalSection } from '../types';
import { type LegalBuildContext, legalText } from './localize';

const lastUpdated = ({ language, platform }: LegalBuildContext): string =>
  platform === 'android'
    ? legalText(language, 'July 15, 2026', '15 июля 2026 г.')
    : legalText(language, 'May 19, 2026', '19 мая 2026 г.');

const agreement = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Agreement', 'Соглашение'),
  paragraphs: [
    legalText(
      language,
      `By installing or using ${appDisplayName} (“the app”), you agree to these Terms & Privacy. If you do not agree, do not use the app.`,
      `Устанавливая или используя ${appDisplayName} («приложение»), вы соглашаетесь с этими Условиями и политикой конфиденциальности. Если вы не согласны, не используйте приложение.`,
    ),
    legalText(
      language,
      'These terms work together with the Data Privacy screen, which explains what information the app processes on your device.',
      'Эти условия дополняют экран «Конфиденциальность данных», где описано, какую информацию приложение обрабатывает на устройстве.',
    ),
  ],
});

const whatAppProvides = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, `What ${appDisplayName} provides`, `Что предоставляет ${appDisplayName}`),
      paragraphs: [
        legalText(
          language,
          `${appDisplayName} helps you monitor time spent in selected apps and apply focus limits you configure. Features depend on your device, Android version, and the permissions you grant.`,
          `${appDisplayName} помогает отслеживать время в выбранных приложениях и применять настроенные лимиты фокуса. Возможности зависят от устройства, версии Android и выданных разрешений.`,
        ),
        legalText(
          language,
          'The app is provided for personal digital wellbeing. It is not medical, psychological, or legal advice, and it does not guarantee that you will meet specific productivity goals.',
          'Приложение предназначено для личного цифрового благополучия. Это не медицинская, психологическая или юридическая консультация, и оно не гарантирует достижение конкретных целей продуктивности.',
        ),
      ],
    };
  }

  return {
    title: legalText(language, `What ${appDisplayName} provides`, `Что предоставляет ${appDisplayName}`),
    paragraphs: [
      legalText(
        language,
        `${appDisplayName} helps you monitor time spent in selected apps and apply focus limits you configure. Features depend on your iPhone or iPad model, iOS version, and the Screen Time permissions you grant.`,
        `${appDisplayName} помогает отслеживать время в выбранных приложениях и применять настроенные лимиты фокуса. Возможности зависят от модели iPhone или iPad, версии iOS и разрешений «Экранного времени».`,
      ),
      legalText(
        language,
        'The app is provided for personal digital wellbeing (self-control). It is not medical, psychological, or legal advice, and it does not guarantee that you will meet specific productivity goals.',
        'Приложение предназначено для личного цифрового благополучия (самоконтроль). Это не медицинская, психологическая или юридическая консультация, и оно не гарантирует достижение конкретных целей продуктивности.',
      ),
    ],
  };
};

const permissionsAndResponsibility = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'Permissions and your responsibility', 'Разрешения и ваша ответственность'),
      paragraphs: [
        legalText(
          language,
          'You are responsible for granting and managing Android permissions required for monitoring, overlays, notifications, and background operation.',
          'Вы отвечаете за выдачу и управление разрешениями Android, необходимыми для мониторинга, оверлеев, уведомлений и фоновой работы.',
        ),
        legalText(
          language,
          `You must use ${appDisplayName} only on devices you own or are authorized to manage. Do not use the app to monitor another person’s device without their knowledge and consent where required by law.`,
          `Используйте ${appDisplayName} только на устройствах, которыми вы владеете или которыми уполномочены управлять. Не используйте приложение для мониторинга чужого устройства без ведома и согласия, если это требуется законом.`,
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'Permissions and your responsibility', 'Разрешения и ваша ответственность'),
    paragraphs: [
      legalText(
        language,
        'You are responsible for granting and managing Screen Time authorization and notification permissions required for monitoring and alerts.',
        'Вы отвечаете за выдачу и управление авторизацией «Экранного времени» и разрешениями на уведомления, необходимыми для мониторинга и предупреждений.',
      ),
      legalText(
        language,
        `You must use ${appDisplayName} only on devices you own or are authorized to manage. The app does not support monitoring another person’s device.`,
        `Используйте ${appDisplayName} только на устройствах, которыми вы владеете или которыми уполномочены управлять. Приложение не поддерживает мониторинг чужого устройства.`,
      ),
    ],
  };
};

const acceptableUse = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Acceptable use', 'Допустимое использование'),
  paragraphs: [
    legalText(language, 'You agree not to:', 'Вы соглашаетесь не:'),
    legalText(
      language,
      '• Reverse engineer, tamper with, or misuse the app to bypass limits for harmful or unlawful purposes.',
      '• Взламывать, подменять или злоупотреблять приложением, чтобы обходить лимиты в вредных или незаконных целях.',
    ),
    legalText(
      language,
      `• Use ${appDisplayName} in a way that violates applicable law or third-party rights.`,
      `• Использовать ${appDisplayName} способом, нарушающим применимое законодательство или права третьих лиц.`,
    ),
    legalText(
      language,
      '• Rely on the app as the sole safety or compliance control for regulated environments.',
      '• Полагаться на приложение как на единственный механизм безопасности или соответствия в регулируемых средах.',
    ),
  ],
});

const privacySummary = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Privacy summary', 'Кратко о конфиденциальности'),
  paragraphs: [
    legalText(
      language,
      `${appDisplayName} processes usage-related data locally on your device to show statistics and enforce limits you set. We do not sell your usage data.`,
      `${appDisplayName} обрабатывает данные об использовании локально на устройстве, чтобы показывать статистику и применять ваши лимиты. Мы не продаём данные об использовании.`,
    ),
    legalText(
      language,
      'See the Data Privacy screen for a full description of data categories, permissions, storage, and your controls.',
      'Полное описание категорий данных, разрешений, хранения и вашего контроля — на экране «Конфиденциальность данных».',
    ),
  ],
});

const disclaimer = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  const asIs = legalText(
    language,
    'The app is provided “as is” and “as available” without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy of usage statistics, or uninterrupted operation.',
    'Приложение предоставляется «как есть» и «по мере доступности» без каких-либо гарантий, явных или подразумеваемых, включая пригодность для конкретной цели, точность статистики или бесперебойную работу.',
  );

  if (platform === 'android') {
    return {
      title: legalText(language, 'Disclaimer', 'Отказ от гарантий'),
      paragraphs: [
        asIs,
        legalText(
          language,
          `Device manufacturers, OS updates, and battery optimizations may affect monitoring. ${appDisplayName} may not detect or block every app interaction in all circumstances.`,
          `Производители устройств, обновления ОС и оптимизация батареи могут влиять на мониторинг. ${appDisplayName} может не обнаруживать или не блокировать каждое взаимодействие с приложением во всех случаях.`,
        ),
        legalText(
          language,
          'Picture-in-picture, split-screen, and other multi-window modes may keep a blocked app visible above the block screen until you close that window manually.',
          'Режимы «картинка в картинке», split-screen и другие форматы multi-window могут оставлять заблокированное приложение видимым поверх экрана блокировки, пока вы не закроете это окно вручную.',
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'Disclaimer', 'Отказ от гарантий'),
    paragraphs: [
      asIs,
      legalText(
        language,
        `iOS updates, Low Power Mode, and Screen Time system behavior may affect monitoring. ${appDisplayName} may not detect or block every app interaction in all circumstances. Blocks use Apple’s system shields, not a custom overlay.`,
        `Обновления iOS, режим энергосбережения и поведение «Экранного времени» могут влиять на мониторинг. ${appDisplayName} может не обнаруживать или не блокировать каждое взаимодействие с приложением во всех случаях. Блокировки используют системные экраны Apple, а не собственный оверлей.`,
      ),
      legalText(
        language,
        'On iPad, Split View and Slide Over may keep a shielded app partially visible until you close that window manually.',
        'На iPad Split View и Slide Over могут оставлять заблокированное приложение частично видимым, пока вы не закроете это окно вручную.',
      ),
    ],
  };
};

const limitationOfLiability = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Limitation of liability', 'Ограничение ответственности'),
  paragraphs: [
    legalText(
      language,
      `To the maximum extent permitted by law, ${appDisplayName} and its developers are not liable for indirect, incidental, special, consequential, or punitive damages, or for loss of data, profits, or goodwill arising from your use of the app.`,
      `В максимальной степени, допустимой законом, ${appDisplayName} и его разработчики не несут ответственности за косвенный, случайный, особый, последующий или штрафной ущерб, а также за потерю данных, прибыли или деловой репутации из-за использования приложения.`,
    ),
    legalText(
      language,
      'Our total liability for any claim related to the app is limited to the amount you paid for the app in the twelve months before the claim, or zero if the app was free.',
      'Совокупная ответственность по любому иску, связанному с приложением, ограничена суммой, уплаченной за приложение за двенадцать месяцев до иска, или нулём, если приложение было бесплатным.',
    ),
  ],
});

const changes = ({ language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Changes', 'Изменения'),
  paragraphs: [
    legalText(
      language,
      'We may update these terms or app features. Material changes will be reflected by updating the “Last updated” date. Your continued use after changes take effect constitutes acceptance of the updated terms.',
      'Мы можем обновлять эти условия или функции приложения. Существенные изменения отражаются обновлением даты «Обновлено». Продолжение использования после вступления изменений в силу означает принятие обновлённых условий.',
    ),
  ],
});

const contact = ({ language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Contact', 'Контакты'),
  paragraphs: [
    legalText(
      language,
      `Questions about these terms or privacy practices: ${SUPPORT_EMAIL}`,
      `Вопросы об условиях или конфиденциальности: ${SUPPORT_EMAIL}`,
    ),
  ],
});

export const buildTermsPrivacyDocument = (ctx: LegalBuildContext): LegalDocument => ({
  title: legalText(ctx.language, 'Terms & Privacy', 'Условия и конфиденциальность'),
  subtitle: legalText(
    ctx.language,
    `Rules for using ${ctx.appDisplayName}`,
    `Правила использования ${ctx.appDisplayName}`,
  ),
  lastUpdated: lastUpdated(ctx),
  sections: [
    agreement(ctx),
    whatAppProvides(ctx),
    permissionsAndResponsibility(ctx),
    acceptableUse(ctx),
    privacySummary(ctx),
    disclaimer(ctx),
    limitationOfLiability(ctx),
    changes(ctx),
    contact(ctx),
  ],
});
