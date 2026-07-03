package com.focusguard

import android.app.Application
import com.focusguard.overlay.DailyWarningStore
import com.focusguard.react.TurboModuleEventDispatchers
import com.focusguard.storage.InMemoryMmkv
import com.focusguard.storage.KeeptStorage
import com.focusguard.usage.LocalDayChangeNotifier
import org.junit.After
import org.junit.Before
import org.robolectric.RuntimeEnvironment

open class RobolectricKeeptTestCase {
    private lateinit var inMemoryMmkv: InMemoryMmkv

    protected val context: Application
        get() = RuntimeEnvironment.getApplication()

    @Before
    fun setUpRobolectricKeept() {
        inMemoryMmkv = InMemoryMmkv()
        KeeptStorage.installForTests(inMemoryMmkv)
        DailyWarningStore.resetForTests()
        LocalDayChangeNotifier.resetForTests()
        TurboModuleEventDispatchers.resetForTests()
    }

    @After
    fun tearDownRobolectricKeept() {
        TurboModuleEventDispatchers.resetForTests()
        DailyWarningStore.resetForTests()
        LocalDayChangeNotifier.resetForTests()
        KeeptStorage.resetForTests()
    }

    protected fun encodeTestValue(key: String, value: Boolean) {
        inMemoryMmkv.encode(key, value)
    }

    protected fun decodeTestBool(key: String, defaultValue: Boolean = false): Boolean =
        inMemoryMmkv.decodeBool(key, defaultValue)

    protected fun encodeTestValue(key: String, value: String) {
        inMemoryMmkv.encode(key, value)
    }

    protected fun decodeTestString(key: String, defaultValue: String? = null): String? =
        inMemoryMmkv.decodeString(key, defaultValue)

    protected fun containsTestKey(key: String): Boolean = inMemoryMmkv.containsKey(key)

    protected fun removeTestKey(key: String) {
        inMemoryMmkv.removeValueForKey(key)
    }
}
