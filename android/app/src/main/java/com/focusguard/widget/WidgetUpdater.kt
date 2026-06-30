package com.focusguard.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.view.View
import android.widget.RemoteViews
import com.focusguard.R
import com.focusguard.navigation.DeepLinks
import java.util.concurrent.Executors

/** Pushes [WidgetNextBlockResolver] snapshots into placed home-screen widgets. */
object WidgetUpdater {

    private const val THROTTLE_MS = 60_000L
    private const val LIVE_USAGE_THROTTLE_MS = 30_000L
    private const val URGENT_LIVE_THROTTLE_MS = 5_000L
    private const val URGENT_REMAINING_MS = 15 * 60_000L
    private const val PENDING_INTENT_REQUEST_CODE = 4101

    private val executor = Executors.newSingleThreadExecutor()

    @Volatile
    private var lastUpdateMs = 0L

    @Volatile
    private var lastLiveUsageUpdateMs = 0L

    fun scheduleUpdate(
        context: Context,
        usageOverrides: Map<String, Long>? = null,
        force: Boolean = false,
        urgent: Boolean = false,
    ) {
        val appContext = context.applicationContext
        val now = System.currentTimeMillis()

        if (!force) {
            when {
                usageOverrides != null -> {
                    val throttleMs = if (urgent) URGENT_LIVE_THROTTLE_MS else LIVE_USAGE_THROTTLE_MS
                    if (now - lastLiveUsageUpdateMs < throttleMs) {
                        return
                    }
                }
                now - lastUpdateMs < THROTTLE_MS -> return
            }
        }

        executor.execute {
            val manager = AppWidgetManager.getInstance(appContext)
            val componentName = ComponentName(appContext, FocusGuardWidgetProvider::class.java)
            val widgetIds = manager.getAppWidgetIds(componentName)

            if (widgetIds.isEmpty()) {
                return@execute
            }

            val updatedAt = System.currentTimeMillis()
            lastUpdateMs = updatedAt
            if (usageOverrides != null) {
                lastLiveUsageUpdateMs = updatedAt
            }

            updateAll(appContext, manager, widgetIds, usageOverrides)
        }
    }

    fun updateAll(
        context: Context,
        manager: AppWidgetManager = AppWidgetManager.getInstance(context),
        widgetIds: IntArray = manager.getAppWidgetIds(
            ComponentName(context, FocusGuardWidgetProvider::class.java),
        ),
        usageOverrides: Map<String, Long>? = null,
    ) {
        if (widgetIds.isEmpty()) {
            return
        }

        val snapshot = WidgetNextBlockResolver.resolve(context, usageOverrides)

        for (widgetId in widgetIds) {
            manager.updateAppWidget(widgetId, buildRemoteViews(context, snapshot))
        }
    }

    private fun buildRemoteViews(
        context: Context,
        snapshot: WidgetNextBlockResolver.Snapshot,
    ): RemoteViews {
        val theme = WidgetTheme.colors(context)
        val views = RemoteViews(context.packageName, R.layout.widget_focus_guard)
        applyTheme(views, theme)
        val clickIntent =
            when (snapshot) {
                is WidgetNextBlockResolver.Snapshot.Countdown ->
                    DeepLinks.configureIntent(context, snapshot.next.packageName)
                else -> DeepLinks.dashboardIntent(context)
            }

        views.setOnClickPendingIntent(
            R.id.widget_root,
            DeepLinks.activityPendingIntent(context, clickIntent, PENDING_INTENT_REQUEST_CODE),
        )

        when (snapshot) {
            is WidgetNextBlockResolver.Snapshot.Countdown -> {
                views.setViewVisibility(R.id.widget_content, View.VISIBLE)
                views.setViewVisibility(R.id.widget_empty, View.GONE)
                views.setTextViewText(
                    R.id.widget_time,
                    WidgetUsageFormatter.formatRemaining(context, snapshot.next.remainingMs),
                )
                val subtitleRes =
                    if (snapshot.next.isSnoozeCountdown) {
                        R.string.widget_until_reblock
                    } else {
                        R.string.widget_until_block
                    }
                views.setTextViewText(R.id.widget_subtitle, context.getString(subtitleRes))
                views.setTextViewText(R.id.widget_app_name, snapshot.next.appLabel)

                val timeColor =
                    if (snapshot.next.remainingMs <= URGENT_REMAINING_MS) {
                        theme.overLimit
                    } else {
                        theme.accent
                    }
                views.setTextColor(R.id.widget_time, timeColor)

                bindMonitoringStatus(views, context, snapshot.monitoringEnabled)
            }

            is WidgetNextBlockResolver.Snapshot.AllBlocked -> {
                views.setViewVisibility(R.id.widget_content, View.GONE)
                views.setViewVisibility(R.id.widget_empty, View.VISIBLE)
                views.setTextViewText(
                    R.id.widget_empty_title,
                    context.getString(R.string.widget_all_blocked),
                )
                views.setTextViewText(
                    R.id.widget_empty_subtitle,
                    snapshot.appLabel ?: context.getString(R.string.widget_all_blocked_subtitle),
                )

                bindMonitoringStatus(views, context, snapshot.monitoringEnabled)
            }

            is WidgetNextBlockResolver.Snapshot.NoTrackedApps -> {
                views.setViewVisibility(R.id.widget_content, View.GONE)
                views.setViewVisibility(R.id.widget_empty, View.VISIBLE)
                views.setTextViewText(R.id.widget_empty_title, context.getString(R.string.widget_no_apps))
                views.setTextViewText(R.id.widget_empty_subtitle, context.getString(R.string.widget_no_apps_subtitle))
                bindMonitoringStatus(views, context, snapshot.monitoringEnabled)
            }
        }

        return views
    }

    private fun applyTheme(views: RemoteViews, theme: WidgetTheme.Colors) {
        views.setInt(R.id.widget_root, "setBackgroundColor", theme.cardBackground)
        views.setInt(R.id.widget_icon_box, "setBackgroundColor", theme.surface)
        views.setInt(R.id.widget_empty_icon_box, "setBackgroundColor", theme.surface)
        views.setInt(R.id.widget_shield, "setColorFilter", theme.shieldStroke)
        views.setInt(R.id.widget_empty_shield, "setColorFilter", theme.shieldStroke)
        views.setTextColor(R.id.widget_brand, theme.accent)
        views.setTextColor(R.id.widget_subtitle, theme.textSecondary)
        views.setTextColor(R.id.widget_app_name, theme.accent)
        views.setInt(R.id.widget_app_name, "setBackgroundColor", theme.accentIconBg)
        views.setTextColor(R.id.widget_empty_title, theme.textPrimary)
        views.setTextColor(R.id.widget_empty_subtitle, theme.textSecondary)
        views.setTextColor(R.id.widget_status, theme.textSecondary)
        views.setInt(R.id.widget_status, "setBackgroundColor", theme.accentIconBg)
    }

    private fun bindMonitoringStatus(
        views: RemoteViews,
        context: Context,
        monitoringEnabled: Boolean,
    ) {
        if (monitoringEnabled) {
            views.setViewVisibility(R.id.widget_status, View.GONE)
        } else {
            views.setViewVisibility(R.id.widget_status, View.VISIBLE)
            views.setTextViewText(R.id.widget_status, context.getString(R.string.widget_monitoring_off))
        }
    }
}
