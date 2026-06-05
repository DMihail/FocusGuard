package com.focusguard.permissions

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build

/** Runtime visibility into `QUERY_ALL_PACKAGES` (API 30+). */
internal object QueryAllPackagesAccess {

    fun isGranted(context: Context): Boolean {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) {
            return true
        }

        return context.checkSelfPermission(Manifest.permission.QUERY_ALL_PACKAGES) ==
            PackageManager.PERMISSION_GRANTED
    }
}
