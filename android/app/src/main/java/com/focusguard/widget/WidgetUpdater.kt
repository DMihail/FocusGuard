package com.focusguard.widget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.view.View
import android.widget.RemoteViews
import com.focusguard.R
import com.focusguard.navigation.DeepLinks
import java.util.concurrent.Executors

/** Pushes [WidgetNextBlockResolver] snapshots into placed home-screen widgets. */
object WidgetUpdater {

    private const val THROTTLE_MS = 60_000L
    private const val LIVE_USAGE_THROTTLE_MS = 60_000L
    private const val URGENT_LIVE_THROTTLE_MS = 5_000L
    private const val URGENT_REMAINING_MS = 15 * 60_000L
    private const val PENDING_INTENT_REQUEST_CODE = 4101

    private data class PendingWidgetUpdate(
        val usageOverrides: Map<String, Long>?,
        val force: Boolean,
        val urgent: Boolean,
    )

    private val executor = Executors.newSingleThreadExecutor()
    private val mainHandler = Handler(Looper.getMainLooper())
    private val componentNameClass = FocusGuardWidgetProvider::class.java

    @Volatile
    private var lastUpdateMs = 0L

    @Volatile
    private var lastLiveUsageUpdateMs = 0L

    @Volatile
    private var hasPlacedWidgets: Boolean? = null

    @Volatile
    private var pendingUpdate: PendingWidgetUpdate? = null

    @Volatile
    private var deferredRunnable: Runnable? = null

    fun onWidgetsEnabled() {
        hasPlacedWidgets = true
    }

    fun onWidgetsDisabled() {
        hasPlacedWidgets = false
        pendingUpdate = null
        cancelDeferredUpdate()
    }

    /** Skips building usage maps when no widget is on the home screen. */
    fun shouldSkipUsagePrecomputation(): Boolean = hasPlacedWidgets == false

    fun scheduleUpdate(
        context: Context,
        usageOverrides: Map<String, Long>? = null,
        force: Boolean = false,
        urgent: Boolean = false,
    ) {
        val appContext = context.applicationContext
        if (!force && hasPlacedWidgets == false) {
            return
        }

        val request =
            PendingWidgetUpdate(
                usageOverrides = usageOverrides,
                force = force,
                urgent = urgent,
            )
        pendingUpdate = mergePendingUpdate(pendingUpdate, request)

        val now = System.currentTimeMillis()
        val snapshot = pendingUpdate ?: return

        if (snapshot.force || !isThrottled(now, snapshot)) {
            cancelDeferredUpdate()
            flushPendingUpdate(appContext)
            return
        }

        scheduleDeferredUpdate(appContext, now, snapshot)
    }

    fun updateAll(
        context: Context,
        manager: AppWidgetManager = AppWidgetManager.getInstance(context),
        widgetIds: IntArray = manager.getAppWidgetIds(
            ComponentName(context, componentNameClass),
        ),
        usageOverrides: Map<String, Long>? = null,
    ) {
        if (widgetIds.isEmpty()) {
            hasPlacedWidgets = false
            return
        }

        hasPlacedWidgets = true
        val snapshot = WidgetNextBlockResolver.resolve(context, usageOverrides)

        for (widgetId in widgetIds) {
            manager.updateAppWidget(widgetId, buildRemoteViews(context, snapshot))
        }
    }

    private fun flushPendingUpdate(context: Context) {
        val snapshot = pendingUpdate ?: return
        pendingUpdate = null

        executor.execute {
            val manager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, componentNameClass)
            val widgetIds = manager.getAppWidgetIds(componentName)
            hasPlacedWidgets = widgetIds.isNotEmpty()

            if (widgetIds.isEmpty()) {
                return@execute
            }

            val updatedAt = System.currentTimeMillis()
            lastUpdateMs = updatedAt
            if (snapshot.usageOverrides != null) {
                lastLiveUsageUpdateMs = updatedAt
            }

            updateAll(context, manager, widgetIds, snapshot.usageOverrides)
        }
    }

    private fun scheduleDeferredUpdate(
        context: Context,
        now: Long,
        snapshot: PendingWidgetUpdate,
    ) {
        if (deferredRunnable != null) {
            return
        }

        val delayMs = remainingThrottleMs(now, snapshot).coerceAtLeast(0L)
        val appContext = context.applicationContext
        val runnable =
            Runnable {
                deferredRunnable = null
                flushPendingUpdate(appContext)
            }

        deferredRunnable = runnable
        mainHandler.postDelayed(runnable, delayMs)
    }

    private fun cancelDeferredUpdate() {
        deferredRunnable?.let(mainHandler::removeCallbacks)
        deferredRunnable = null
    }

    private fun isThrottled(now: Long, snapshot: PendingWidgetUpdate): Boolean {
        return remainingThrottleMs(now, snapshot) > 0L
    }

    private fun remainingThrottleMs(now: Long, snapshot: PendingWidgetUpdate): Long {
        return when {
            snapshot.usageOverrides != null -> {
                val throttleMs = if (snapshot.urgent) URGENT_LIVE_THROTTLE_MS else LIVE_USAGE_THROTTLE_MS
                throttleMs - (now - lastLiveUsageUpdateMs)
            }
            else -> THROTTLE_MS - (now - lastUpdateMs)
        }
    }

    private fun mergePendingUpdate(
        previous: PendingWidgetUpdate?,
        next: PendingWidgetUpdate,
    ): PendingWidgetUpdate {
        if (previous == null) {
            return next
        }

        val mergedOverrides =
            when {
                previous.usageOverrides == null -> next.usageOverrides
                next.usageOverrides == null -> previous.usageOverrides
                else -> previous.usageOverrides + next.usageOverrides
            }

        return PendingWidgetUpdate(
            usageOverrides = mergedOverrides,
            force = previous.force || next.force,
            urgent = previous.urgent || next.urgent,
        )
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
