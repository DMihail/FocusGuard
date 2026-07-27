package com.focusguard.storage

import com.focusguard.RobolectricKeeptTestCase
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(application = com.focusguard.TestKeeptApplication::class, sdk = [28])
class UsageAccessGrantStoreTest : RobolectricKeeptTestCase() {

    @Test
    fun markGrantedPersistsAcrossReads() {
        assertFalse(UsageAccessGrantStore.isGranted())

        UsageAccessGrantStore.markGranted()

        assertTrue(UsageAccessGrantStore.isGranted())
        assertTrue(decodeTestBool(PersistSchema.USAGE_ACCESS_GRANTED_KEY))
    }

    @Test
    fun clearRemovesPersistedGrant() {
        UsageAccessGrantStore.markGranted()
        UsageAccessGrantStore.clear()

        assertFalse(UsageAccessGrantStore.isGranted())
        assertFalse(containsTestKey(PersistSchema.USAGE_ACCESS_GRANTED_KEY))
    }
}
