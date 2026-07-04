package com.focusguard.storage

import com.tencent.mmkv.MMKV
import java.util.concurrent.ConcurrentHashMap

internal interface MmkvReaderWriter {
    fun decodeBool(key: String, defaultValue: Boolean = false): Boolean

    fun encode(key: String, value: Boolean): Boolean

    fun decodeString(key: String, defaultValue: String? = null): String?

    fun encode(key: String, value: String): Boolean

    fun allKeys(): Array<String>?

    fun removeValueForKey(key: String)

    fun containsKey(key: String): Boolean

    fun clearAll()
}

internal class RealMmkvAdapter(
    private val mmkv: MMKV,
) : MmkvReaderWriter {
    override fun decodeBool(key: String, defaultValue: Boolean): Boolean = mmkv.decodeBool(key, defaultValue)

    override fun encode(key: String, value: Boolean): Boolean = mmkv.encode(key, value)

    override fun decodeString(key: String, defaultValue: String?): String? = mmkv.decodeString(key, defaultValue)

    override fun encode(key: String, value: String): Boolean = mmkv.encode(key, value)

    override fun allKeys(): Array<String>? = mmkv.allKeys()

    override fun removeValueForKey(key: String) {
        mmkv.removeValueForKey(key)
    }

    override fun containsKey(key: String): Boolean = mmkv.containsKey(key)

    override fun clearAll() {
        mmkv.clearAll()
    }
}

/** In-memory MMKV substitute for JVM unit tests (avoids native library load). */
internal class InMemoryMmkv : MmkvReaderWriter {
    private val values = ConcurrentHashMap<String, Any>()

    override fun decodeBool(key: String, defaultValue: Boolean): Boolean = values[key] as? Boolean ?: defaultValue

    override fun encode(key: String, value: Boolean): Boolean {
        values[key] = value
        return true
    }

    override fun decodeString(key: String, defaultValue: String?): String? = values[key] as? String ?: defaultValue

    override fun encode(key: String, value: String): Boolean {
        values[key] = value
        return true
    }

    override fun allKeys(): Array<String>? = values.keys.toTypedArray().takeIf { it.isNotEmpty() }

    override fun removeValueForKey(key: String) {
        values.remove(key)
    }

    override fun containsKey(key: String): Boolean = values.containsKey(key)

    override fun clearAll() {
        values.clear()
    }
}

/** Resolves MMKV reads for native stores; unit tests swap in [InMemoryMmkv]. */
internal object KeeptStorage {
    @Volatile
    private var testOverride: MmkvReaderWriter? = null

    val mmkv: MmkvReaderWriter
        get() = testOverride ?: RealMmkvAdapter(KeeptMmkv.instance)

    internal fun installForTests(store: MmkvReaderWriter) {
        testOverride = store
    }

    internal fun resetForTests() {
        testOverride = null
    }
}
