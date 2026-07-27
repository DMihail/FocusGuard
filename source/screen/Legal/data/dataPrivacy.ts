/** @format */

import type { LegalDocument, LegalSection } from '../types';
import { type LegalBuildContext, legalText } from './localize';

const lastUpdated = ({ language, platform }: LegalBuildContext): string =>
  platform === 'android'
    ? legalText(language, 'July 15, 2026', '15 июля 2026 г.')
    : legalText(language, 'May 19, 2026', '19 мая 2026 г.');

const commitment = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Our commitment', 'Наши обязательства'),
  paragraphs: [
    legalText(
      language,
      `${appDisplayName} is built to help you understand and limit distracting app use. Your activity data is meant to stay on your phone. We do not run advertising profiles, sell data, or operate a cloud account that stores your usage history.`,
      `${appDisplayName} создан, чтобы помочь вам понимать и ограничивать отвлекающее использование приложений. Данные о вашей активности должны оставаться на телефоне. Мы не ведём рекламные профили, не продаём данные и не используем облачный аккаунт для хранения истории использования.`,
    ),
  ],
});

const processedOnDevice = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'Information processed on your device', 'Информация, обрабатываемая на устройстве'),
      paragraphs: [
        legalText(
          language,
          `To provide focus monitoring and limits, ${appDisplayName} may process:`,
          `Для мониторинга фокуса и лимитов ${appDisplayName} может обрабатывать:`,
        ),
        legalText(
          language,
          '• Apps you choose to track (package name, display name, and icon shown in the app).',
          '• Приложения, которые вы выбираете для отслеживания (имя пакета, отображаемое имя и иконка в приложении).',
        ),
        legalText(
          language,
          '• Usage statistics from Android Usage Access (time in foreground, last used time, and related metrics exposed by the system).',
          '• Статистику использования из Android «Доступ к использованию» (время на переднем плане, время последнего использования и связанные метрики системы).',
        ),
        legalText(
          language,
          '• Settings you configure in the app, such as selected apps, notification preferences, and onboarding completion.',
          '• Настройки в приложении: выбранные приложения, уведомления и прохождение знакомства.',
        ),
        legalText(
          language,
          '• Technical data required for the app to run (for example, app version and permission status checks).',
          '• Технические данные, необходимые для работы приложения (например, версия и статус разрешений).',
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'Information processed on your device', 'Информация, обрабатываемая на устройстве'),
    paragraphs: [
      legalText(
        language,
        `To provide focus monitoring and limits, ${appDisplayName} may process:`,
        `Для мониторинга фокуса и лимитов ${appDisplayName} может обрабатывать:`,
      ),
      legalText(
        language,
        '• Apps you choose to track through Apple’s Screen Time picker (opaque app tokens — not bundle IDs — plus display labels shown in the app).',
        '• Приложения, выбранные через средство выбора «Экранное время» Apple (непрозрачные токены приложений — не bundle ID — и отображаемые названия в приложении).',
      ),
      legalText(
        language,
        '• Usage time for tracked apps from Apple Screen Time / Device Activity APIs.',
        '• Время использования отслеживаемых приложений из API «Экранное время» / Device Activity.',
      ),
      legalText(
        language,
        '• Settings you configure in the app, such as selected apps, notification preferences, and onboarding completion.',
        '• Настройки в приложении: выбранные приложения, уведомления и прохождение знакомства.',
      ),
      legalText(
        language,
        '• Technical data required for the app to run (for example, app version and permission status checks).',
        '• Технические данные, необходимые для работы приложения (например, версия и статус разрешений).',
      ),
    ],
  };
};

const whereStored = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'Where data is stored', 'Где хранятся данные'),
      paragraphs: [
        legalText(
          language,
          `This information is stored locally on your device using on-device storage (including encrypted-capable local storage used by the app). It is not uploaded to ${appDisplayName} servers as part of the current version of the app.`,
          `Эта информация хранится локально на устройстве (в том числе в локальном хранилище с поддержкой шифрования). В текущей версии приложения она не загружается на серверы ${appDisplayName}.`,
        ),
        legalText(
          language,
          `If you uninstall ${appDisplayName} or clear app data, locally stored settings and selections are removed according to your device settings.`,
          `При удалении ${appDisplayName} или очистке данных приложения локальные настройки и выбор удаляются согласно настройкам устройства.`,
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'Where data is stored', 'Где хранятся данные'),
    paragraphs: [
      legalText(
        language,
        `This information is stored locally on your device and, for monitoring extensions, in a shared App Group container (\`group.com.keept.shared\`). It is not uploaded to ${appDisplayName} servers as part of the current version of the app.`,
        `Эта информация хранится локально на устройстве и, для расширений мониторинга, в общем контейнере App Group (\`group.com.keept.shared\`). В текущей версии приложения она не загружается на серверы ${appDisplayName}.`,
      ),
      legalText(
        language,
        `If you uninstall ${appDisplayName} or clear app data, locally stored settings and selections are removed according to your device settings.`,
        `При удалении ${appDisplayName} или очистке данных приложения локальные настройки и выбор удаляются согласно настройкам устройства.`,
      ),
    ],
  };
};

const permissions = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'Android permissions we use', 'Разрешения Android, которые мы используем'),
      paragraphs: [
        legalText(
          language,
          `${appDisplayName} requests system permissions only to deliver its features:`,
          `${appDisplayName} запрашивает системные разрешения только для своих функций:`,
        ),
        legalText(
          language,
          '• Usage Access — to read app usage statistics for apps you manage.',
          '• Доступ к использованию — для чтения статистики приложений, которыми вы управляете.',
        ),
        legalText(
          language,
          '• Display over other apps — to show blocking or warning overlays when limits apply.',
          '• Поверх других приложений — для показа блокирующих или предупреждающих окон при лимитах.',
        ),
        legalText(
          language,
          '• Notifications — for reminders and limit alerts (you can turn these off in Settings).',
          '• Уведомления — для напоминаний и предупреждений о лимитах (можно отключить в настройках).',
        ),
        legalText(
          language,
          '• Run in background / battery optimization exemption — so monitoring can continue after you leave the app or restart the device.',
          '• Работа в фоне / исключение из оптимизации батареи — чтобы мониторинг продолжался после выхода из приложения или перезагрузки.',
        ),
        legalText(
          language,
          '• Foreground service — to keep focus monitoring active with a visible ongoing notification while protection is enabled.',
          '• Служба переднего плана — для активного мониторинга с видимым постоянным уведомлением, пока защита включена.',
        ),
        legalText(
          language,
          '• Installed apps visibility — to list apps you can select for limits on supported Android versions.',
          '• Видимость установленных приложений — для списка приложений, которым можно задать лимиты на поддерживаемых версиях Android.',
        ),
        legalText(
          language,
          'You can revoke permissions at any time in Android settings. Some features will stop working if a required permission is disabled.',
          'Вы можете отозвать разрешения в настройках Android. Часть функций перестанет работать без обязательных разрешений.',
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'iOS permissions we use', 'Разрешения iOS, которые мы используем'),
    paragraphs: [
      legalText(
        language,
        `${appDisplayName} requests system access only to deliver its features:`,
        `${appDisplayName} запрашивает системный доступ только для своих функций:`,
      ),
      legalText(
        language,
        '• Screen Time authorization — to let you pick apps to manage and enforce limits you configure (self-control mode).',
        '• Авторизация «Экранное время» — чтобы вы могли выбрать приложения для управления и применить настроенные лимиты (режим самоконтроля).',
      ),
      legalText(
        language,
        '• Notifications — for limit warnings (you can turn these off in Settings).',
        '• Уведомления — для предупреждений о лимитах (можно отключить в настройках).',
      ),
      legalText(
        language,
        'Apple does not expose bundle IDs for apps selected through the Screen Time picker; Keept uses stable opaque tokens instead.',
        'Apple не раскрывает bundle ID приложений, выбранных через «Экранное время»; Keept использует стабильные непрозрачные токены.',
      ),
      legalText(
        language,
        'You can revoke Screen Time access or notifications at any time in iOS Settings. Some features will stop working if a required permission is disabled.',
        'Вы можете отозвать доступ к «Экранному времени» или уведомлениям в настройках iOS. Часть функций перестанет работать без обязательных разрешений.',
      ),
    ],
  };
};

const crashReporting = ({ language, platform }: LegalBuildContext): LegalSection => {
  const intro = legalText(
    language,
    `To diagnose crashes and improve stability, release builds may send crash reports to Google Firebase Crashlytics. Reports can include stack traces, device model, OS version, and app version. They do not include your usage history, selected apps, or limit settings.`,
    `Чтобы исправлять ошибки и повышать стабильность, release-сборки могут отправлять отчёты о сбоях в Google Firebase Crashlytics. В отчётах могут быть трассировки стека, модель устройства, версия ОС и версия приложения. Они не содержат историю использования, выбранные приложения или настройки лимитов.`,
  );

  // Preserve existing EN Android opt-out sentence (RU Android / both iOS omit it).
  const debugNote =
    platform === 'android' && language === 'en'
      ? 'Crash reporting is disabled in debug builds. You can opt out by not using release builds from app stores, or contact us if you need more detail about data processed by Crashlytics.'
      : legalText(
          language,
          'Crash reporting is disabled in debug builds.',
          'В debug-сборках отчёты о сбоях отключены.',
        );

  return {
    title: legalText(language, 'Crash reporting', 'Отчёты о сбоях'),
    paragraphs: [intro, debugNote],
  };
};

const whatWeDoNotDo = ({ appDisplayName, language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'What we do not do', 'Чего мы не делаем'),
      paragraphs: [
        legalText(language, `${appDisplayName} does not:`, `${appDisplayName} не:`),
        legalText(
          language,
          '• Collect your contacts, messages, photos, or browsing history.',
          '• Собирает контакты, сообщения, фото или историю браузера.',
        ),
        legalText(
          language,
          '• Record keystrokes or screen contents outside what Android Usage Access provides for app usage metrics.',
          '• Записывает нажатия клавиш или содержимое экрана сверх того, что даёт «Доступ к использованию» для метрик приложений.',
        ),
        legalText(
          language,
          '• Share your usage data with third parties for marketing.',
          '• Передаёт данные об использовании третьим лицам в маркетинговых целях.',
        ),
        legalText(
          language,
          '• Require an account to use the core on-device experience described in this policy.',
          '• Требует аккаунт для основного локального опыта, описанного в этой политике.',
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'What we do not do', 'Чего мы не делаем'),
    paragraphs: [
      legalText(language, `${appDisplayName} does not:`, `${appDisplayName} не:`),
      legalText(
        language,
        '• Collect your contacts, messages, photos, or browsing history.',
        '• Собирает контакты, сообщения, фото или историю браузера.',
      ),
      legalText(
        language,
        '• Record keystrokes or screen contents.',
        '• Записывает нажатия клавиш или содержимое экрана.',
      ),
      legalText(
        language,
        '• Share your usage data with third parties for marketing.',
        '• Передаёт данные об использовании третьим лицам в маркетинговых целях.',
      ),
      legalText(
        language,
        '• Require an account to use the core on-device experience described in this policy.',
        '• Требует аккаунт для основного локального опыта, описанного в этой политике.',
      ),
      legalText(
        language,
        '• Monitor other people’s devices (parental controls are out of scope for this app).',
        '• Мониторит устройства других людей (родительский контроль вне scope приложения).',
      ),
    ],
  };
};

const choicesAndControls = ({ language, platform }: LegalBuildContext): LegalSection => {
  if (platform === 'android') {
    return {
      title: legalText(language, 'Your choices and controls', 'Ваш выбор и контроль'),
      paragraphs: [
        legalText(
          language,
          'You can change which apps are tracked, adjust notification preferences in Settings, and revoke Android permissions in system settings.',
          'Вы можете менять отслеживаемые приложения, настройки уведомлений в приложении и отзывать разрешения Android в системных настройках.',
        ),
        legalText(
          language,
          'Because processing happens on your device, you remain in control of whether monitoring and overlays stay active by managing permissions and app settings.',
          'Поскольку обработка происходит на устройстве, вы контролируете, остаются ли мониторинг и оверлеи активными, через разрешения и настройки приложения.',
        ),
      ],
    };
  }

  return {
    title: legalText(language, 'Your choices and controls', 'Ваш выбор и контроль'),
    paragraphs: [
      legalText(
        language,
        'You can change which apps are tracked via the Screen Time picker, adjust notification preferences in Settings, and revoke Screen Time or notification access in iOS Settings.',
        'Вы можете менять отслеживаемые приложения через средство выбора «Экранное время», настройки уведомлений в приложении и отзывать доступ в настройках iOS.',
      ),
      legalText(
        language,
        'Because processing happens on your device, you remain in control of whether monitoring stays active by managing permissions and app settings.',
        'Поскольку обработка происходит на устройстве, вы контролируете, остаётся ли мониторинг активным, через разрешения и настройки приложения.',
      ),
    ],
  };
};

const children = ({ appDisplayName, language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Children', 'Дети'),
  paragraphs: [
    legalText(
      language,
      `${appDisplayName} is not directed at children under 13. If you are a parent or guardian and believe a child has provided personal information through the app, contact us using the details in Terms & Privacy.`,
      `${appDisplayName} не предназначен для детей младше 13 лет. Если вы родитель или опекун и считаете, что ребёнок передал персональные данные через приложение, свяжитесь с нами по контактам в разделе «Условия и конфиденциальность».`,
    ),
  ],
});

const changes = ({ language }: LegalBuildContext): LegalSection => ({
  title: legalText(language, 'Changes to this notice', 'Изменения этого уведомления'),
  paragraphs: [
    legalText(
      language,
      'We may update this Data Privacy notice when features or legal requirements change. The “Last updated” date at the top of this screen will change when we do. Continued use of the app after an update means you accept the revised notice.',
      'Мы можем обновлять это уведомление о конфиденциальности при изменении функций или требований закона. Дата «Обновлено» вверху экрана изменится при обновлении. Продолжение использования приложения после изменений означает принятие новой версии.',
    ),
  ],
});

export const buildDataPrivacyDocument = (ctx: LegalBuildContext): LegalDocument => ({
  title: legalText(ctx.language, 'Data Privacy', 'Конфиденциальность данных'),
  subtitle: legalText(
    ctx.language,
    `How ${ctx.appDisplayName} handles information on your device`,
    `Как ${ctx.appDisplayName} обрабатывает информацию на вашем устройстве`,
  ),
  lastUpdated: lastUpdated(ctx),
  sections: [
    commitment(ctx),
    processedOnDevice(ctx),
    whereStored(ctx),
    permissions(ctx),
    crashReporting(ctx),
    whatWeDoNotDo(ctx),
    choicesAndControls(ctx),
    children(ctx),
    changes(ctx),
  ],
});
