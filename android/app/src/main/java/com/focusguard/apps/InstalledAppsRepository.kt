package com.focusguard.apps

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager

/** Lists launchable apps installed on the device (excluding this app). */
internal class InstalledAppsRepository(
    context: Context,
) {
    private val appContext = context.applicationContext
    private val packageManager = appContext.packageManager
    private val iconCache = AppIconCache(appContext)
    private val ownPackage = appContext.packageName
    private var cachedLaunchableApps: List<InstalledApp>? = null

    data class InstalledApp(
        val packageName: String,
        val appName: String,
        val appImage: String,
        val category: String,
    )

    fun getLaunchableApps(): List<InstalledApp> {
        cachedLaunchableApps?.let { return it }

        val launcherIntent =
            Intent(Intent.ACTION_MAIN, null).apply { addCategory(Intent.CATEGORY_LAUNCHER) }
        val launchableApps =
            packageManager.queryIntentActivities(launcherIntent, PackageManager.MATCH_ALL)

        val seenPackages = linkedSetOf<String>()
        val result = ArrayList<InstalledApp>(launchableApps.size)

        for (resolveInfo in launchableApps) {
            val packageName = resolveInfo.activityInfo.packageName
            if (packageName == ownPackage || !seenPackages.add(packageName)) {
                continue
            }

            try {
                val appInfo = packageManager.getApplicationInfo(packageName, 0)
                result.add(
                    InstalledApp(
                        packageName = packageName,
                        appName = packageManager.getApplicationLabel(appInfo).toString(),
                        appImage = iconCache.getUri(packageName),
                        category = AppCategoryMapper.fromApplicationInfo(appInfo),
                    ),
                )
            } catch (_: PackageManager.NameNotFoundException) {
                // Package was uninstalled between query and lookup.
            }
        }

        return result.also { cachedLaunchableApps = it }
    }
}
