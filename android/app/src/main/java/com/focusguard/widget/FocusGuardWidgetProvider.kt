package com.focusguard.widget

import android.appwidget.AppWidgetManager
import android.content.Context

/** Home-screen widget showing time until the nearest tracked-app hard block. */
class FocusGuardWidgetProvider : android.appwidget.AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray,
    ) {
        WidgetUpdater.updateAll(context, appWidgetManager, appWidgetIds)
    }

    override fun onEnabled(context: Context) {
        WidgetUpdater.scheduleUpdate(context.applicationContext, force = true)
    }
}
