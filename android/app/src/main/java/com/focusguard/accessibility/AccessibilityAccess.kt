package com.focusguard.accessibility

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.text.TextUtils
import com.focusguard.permissions.ActivityIntents

/** Checks whether [FocusGuardAccessibilityService] is enabled in system settings. */
internal object AccessibilityAccess {

    fun isEnabled(context: Context): Boolean {
        if (!isAccessibilityEnabledGlobally(context)) {
            return false
        }

        val expectedComponent = ComponentName(context, FocusGuardAccessibilityService::class.java)
        val enabledServices =
            Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
            ) ?: return false

        val splitter = TextUtils.SimpleStringSplitter(':')
        splitter.setString(enabledServices)

        while (splitter.hasNext()) {
            val componentName = ComponentName.unflattenFromString(splitter.next())
            if (componentName != null && componentName == expectedComponent) {
                return true
            }
        }

        return false
    }

    fun openSettings(context: Context) {
        if (isEnabled(context)) {
            return
        }

        val intents =
            listOf(
                Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS),
                Intent(Settings.ACTION_SETTINGS),
            )

        ActivityIntents.startFirstAvailable(context, intents)
    }

    private fun isAccessibilityEnabledGlobally(context: Context): Boolean =
        Settings.Secure.getInt(
            context.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED,
            0,
        ) == 1
}
