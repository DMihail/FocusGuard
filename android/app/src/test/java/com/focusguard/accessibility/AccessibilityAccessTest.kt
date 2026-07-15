package com.focusguard.accessibility

import android.content.ComponentName
import android.provider.Settings
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RuntimeEnvironment
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class AccessibilityAccessTest {
    private val context = RuntimeEnvironment.getApplication()

    @Test
    fun `isEnabled returns false when accessibility is globally disabled`() {
        Settings.Secure.putInt(
            context.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED,
            0,
        )

        assertFalse(AccessibilityAccess.isEnabled(context))
    }

    @Test
    fun `isEnabled returns true when service is listed and accessibility is enabled`() {
        val component = ComponentName(context, FocusGuardAccessibilityService::class.java)

        Settings.Secure.putInt(
            context.contentResolver,
            Settings.Secure.ACCESSIBILITY_ENABLED,
            1,
        )
        Settings.Secure.putString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
            component.flattenToString(),
        )

        assertTrue(AccessibilityAccess.isEnabled(context))
    }
}
