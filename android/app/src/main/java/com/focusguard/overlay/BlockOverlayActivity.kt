package com.focusguard.overlay

import android.content.Intent
import android.os.Bundle
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.focusguard.R

/**
 * Full-screen overlay shown when a tracked app exceeds its hard block limit.
 */
class BlockOverlayActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (intent.action == ACTION_DISMISS) {
            finish()
            return
        }

        setFinishOnTouchOutside(false)
        window.addFlags(
            WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED,
        )

        setContentView(R.layout.activity_block_overlay)

        val packageName = intent.getStringExtra(BlockOverlayManager.EXTRA_PACKAGE_NAME).orEmpty()
        val appName = intent.getStringExtra(BlockOverlayManager.EXTRA_APP_NAME).orEmpty()
        val strictMode = intent.getBooleanExtra(BlockOverlayManager.EXTRA_STRICT_MODE, false)

        findViewById<TextView>(R.id.block_overlay_title).text =
            getString(R.string.block_overlay_title)
        findViewById<TextView>(R.id.block_overlay_message).text =
            getString(R.string.block_overlay_message, appName.ifEmpty { getString(R.string.app_name) })

        val snoozeButton = findViewById<Button>(R.id.block_overlay_snooze)
        if (strictMode) {
            snoozeButton.visibility = android.view.View.GONE
        } else {
            snoozeButton.setOnClickListener {
                if (packageName.isNotEmpty()) {
                    TrackingSnoozeStore.setSnooze(packageName, SNOOZE_MINUTES * 60_000L)
                }
                finish()
            }
        }

        findViewById<Button>(R.id.block_overlay_home).setOnClickListener {
            startActivity(
                Intent(Intent.ACTION_MAIN).apply {
                    addCategory(Intent.CATEGORY_HOME)
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                },
            )
            finish()
        }

        BlockOverlayManager.onActivityShown()
    }

    override fun onDestroy() {
        BlockOverlayManager.onActivityHidden()
        super.onDestroy()
    }

    companion object {
        const val ACTION_DISMISS = "com.focusguard.action.DISMISS_BLOCK_OVERLAY"
        const val SNOOZE_MINUTES = 5
    }
}
