package com.focusguard.apps

import android.content.pm.ApplicationInfo
import android.os.Build

/** Maps [ApplicationInfo.category] constants to display labels. */
internal object AppCategoryMapper {

    private const val APPLICATION_CATEGORY_SHOPPING = 9

    fun fromApplicationInfo(appInfo: ApplicationInfo): String {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return "Other"
        }

        return fromCategory(appInfo.category)
    }

    fun fromCategory(category: Int): String =
        when (category) {
            ApplicationInfo.CATEGORY_GAME -> "Game"
            ApplicationInfo.CATEGORY_AUDIO -> "Audio"
            ApplicationInfo.CATEGORY_VIDEO -> "Video"
            ApplicationInfo.CATEGORY_IMAGE -> "Image"
            ApplicationInfo.CATEGORY_SOCIAL -> "Social"
            ApplicationInfo.CATEGORY_NEWS -> "News"
            ApplicationInfo.CATEGORY_MAPS -> "Maps"
            ApplicationInfo.CATEGORY_PRODUCTIVITY -> "Productivity"
            else ->
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
                    category == APPLICATION_CATEGORY_SHOPPING
                ) {
                    "Shopping"
                } else {
                    "Other"
                }
        }
}
