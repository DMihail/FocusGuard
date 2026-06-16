package com.focusguard.navigation

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build

/** Builds deep-link VIEW intents consumed by React Navigation linking on JS. */
object DeepLinks {

    /** Preferred scheme — see docs/MIGRATION_KEEPT.md. */
    const val SCHEME = "keept"

    fun dashboardUri(): Uri =
        Uri.Builder()
            .scheme(SCHEME)
            .authority("dashboard")
            .build()

    fun configureUri(packageName: String): Uri =
        Uri.Builder()
            .scheme(SCHEME)
            .authority("configure")
            .appendPath(packageName)
            .build()

    fun trackedAppsUri(): Uri =
        Uri.Builder()
            .scheme(SCHEME)
            .authority("tracked-apps")
            .build()

    fun dashboardIntent(context: Context): Intent =
        Intent(Intent.ACTION_VIEW, dashboardUri()).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }

    fun configureIntent(context: Context, packageName: String): Intent =
        Intent(Intent.ACTION_VIEW, configureUri(packageName)).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }

    fun trackedAppsIntent(context: Context): Intent =
        Intent(Intent.ACTION_VIEW, trackedAppsUri()).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
        }

    fun activityPendingIntent(context: Context, intent: Intent, requestCode: Int): PendingIntent {
        val immutableFlag =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                PendingIntent.FLAG_IMMUTABLE
            } else {
                0
            }

        return PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or immutableFlag,
        )
    }
}
