package com.focusguard.monitor

import android.app.AppOpsManager
import android.os.Process
import com.focusguard.RobolectricKeeptTestCase
import com.focusguard.storage.PersistSchema
import com.focusguard.storage.UsageAccessGrantStore
import org.junit.After
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class UsageAccessTest : RobolectricKeeptTestCase() {

    @Before
    fun setUpUsageAccess() {
        UsageAccess.resetForTests()
    }

    @After
    fun tearDownUsageAccess() {
        UsageAccess.resetForTests()
    }

    @Test
    fun confirmedGrantSurvivesAppOpsFlickerToDefault() {
        UsageAccess.markGrantedForTests()
        assertTrue(UsageAccess.hasAccess(context))
        assertTrue(UsageAccessGrantStore.isGranted())

        setUsageAppOpMode(AppOpsManager.MODE_DEFAULT)

        assertTrue(UsageAccess.hasAccess(context))
        assertTrue(UsageAccessGrantStore.isGranted())
    }

    @Test
    fun explicitDenyClearsConfirmedGrant() {
        UsageAccess.markGrantedForTests()
        assertTrue(UsageAccess.hasAccess(context))

        setUsageAppOpMode(AppOpsManager.MODE_IGNORED)

        assertFalse(UsageAccess.hasAccess(context))
        assertFalse(UsageAccessGrantStore.isGranted())
        assertFalse(containsTestKey(PersistSchema.USAGE_ACCESS_GRANTED_KEY))
    }

    @Test
    fun pinBeforeOtherSettingsConfirmsWhenAppOpsAllowed() {
        setUsageAppOpMode(AppOpsManager.MODE_ALLOWED)

        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)

        assertTrue(UsageAccessGrantStore.isGranted())
        assertTrue(UsageAccess.hasAccess(context))
    }

    @Test
    fun pinBeforeOtherSettingsNoOpsWhenDenied() {
        setUsageAppOpMode(AppOpsManager.MODE_IGNORED)

        UsageAccess.pinGrantBeforeOtherPermissionSettings(context)

        assertFalse(UsageAccessGrantStore.isGranted())
        assertFalse(UsageAccess.hasAccess(context))
    }

    private fun setUsageAppOpMode(mode: Int) {
        val appOps = context.getSystemService(AppOpsManager::class.java)
        Shadows.shadowOf(appOps)
            .setMode(
                AppOpsManager.OPSTR_GET_USAGE_STATS,
                Process.myUid(),
                context.packageName,
                mode,
            )
    }
}
