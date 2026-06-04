package com.focusguard.navigation

import android.content.Context
import android.content.Intent
import android.net.Uri
import com.focusguard.MainActivity

/** Deep link URLs shared with the React Navigation `linking` config. */
object DeepLinks {

    const val SCHEME = "focusguard"

    fun dashboardUri(): Uri = Uri.parse("$SCHEME://dashboard")

    fun configureLimitsUri(packageName: String): Uri =
        Uri.parse("$SCHEME://configure/${Uri.encode(packageName)}")

    fun dashboardTapIntent(context: Context): Intent = viewIntent(context, dashboardUri())

    fun configureLimitsTapIntent(context: Context, packageName: String): Intent =
        viewIntent(context, configureLimitsUri(packageName))

    private fun viewIntent(context: Context, uri: Uri): Intent =
        Intent(Intent.ACTION_VIEW, uri, context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        }
}
