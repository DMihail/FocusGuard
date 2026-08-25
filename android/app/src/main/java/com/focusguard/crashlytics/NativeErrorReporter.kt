package com.focusguard.crashlytics

import com.google.firebase.crashlytics.FirebaseCrashlytics

/** Reports non-fatal native errors to Firebase Crashlytics. */
internal object NativeErrorReporter {

    fun recordNonFatal(throwable: Throwable, message: String? = null) {
        val crashlytics = FirebaseCrashlytics.getInstance()

        if (message != null) {
            crashlytics.log(message)
        }

        crashlytics.recordException(throwable)
    }

    /**
     * Breadcrumb-only for expected platform restrictions (e.g. API 34+ FGS start from
     * background). Avoids Crashlytics noise from [recordException].
     */
    fun logExpected(message: String) {
        FirebaseCrashlytics.getInstance().log(message)
    }
}
