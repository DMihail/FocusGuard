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
}
