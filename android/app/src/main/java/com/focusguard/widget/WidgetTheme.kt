package com.focusguard.widget

import android.content.Context
import android.content.res.Configuration
import com.focusguard.R
import com.focusguard.SettingsRepository

/** Resolves widget colors from the same theme preference as the React Native app. */
internal object WidgetTheme {

    data class Colors(
        val cardBackground: Int,
        val accent: Int,
        val textPrimary: Int,
        val textSecondary: Int,
        val overLimit: Int,
        val accentIconBg: Int,
        val surface: Int,
        val shieldStroke: Int,
    )

    fun colors(context: Context): Colors {
        val themed = themedContext(context)

        return Colors(
            cardBackground = themed.getColor(R.color.widget_card_background),
            accent = themed.getColor(R.color.accent),
            textPrimary = themed.getColor(R.color.text_primary),
            textSecondary = themed.getColor(R.color.text_secondary),
            overLimit = themed.getColor(R.color.over_limit),
            accentIconBg = themed.getColor(R.color.widget_accent_icon_bg),
            surface = themed.getColor(R.color.surface),
            shieldStroke = themed.getColor(R.color.splash_accent),
        )
    }

    fun themedContext(context: Context): Context {
        val appContext = context.applicationContext
        val config = Configuration(appContext.resources.configuration)
        config.uiMode =
            (config.uiMode and Configuration.UI_MODE_NIGHT_MASK.inv()) or
                resolveNightMode(appContext, SettingsRepository.getThemePreference())
        return appContext.createConfigurationContext(config)
    }

    private fun resolveNightMode(context: Context, preference: String): Int =
        when (preference) {
            "light" -> Configuration.UI_MODE_NIGHT_NO
            "dark" -> Configuration.UI_MODE_NIGHT_YES
            else ->
                context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        }
}
