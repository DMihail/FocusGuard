package com.focusguard.overlay

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.focusguard.R

/** Full-screen fallback when the overlay cannot attach or a full-screen intent fires. */
class BlockFallbackActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
        }

        val packageName = intent.getStringExtra(EXTRA_PACKAGE_NAME)
        if (packageName.isNullOrEmpty()) {
            finish()
            return
        }

        val appName = intent.getStringExtra(EXTRA_APP_NAME).orEmpty()
        val strictMode = intent.getBooleanExtra(EXTRA_STRICT_MODE, false)

        setContentView(R.layout.activity_block_overlay)

        BlockOverlayUi.bind(
            root = findViewById(R.id.block_overlay_root),
            context = this,
            packageName = packageName,
            appName = appName,
            strictMode = strictMode,
            onDismiss = { finish() },
        )
    }

    companion object {
        const val EXTRA_PACKAGE_NAME = BlockOverlayManager.EXTRA_PACKAGE_NAME
        const val EXTRA_APP_NAME = BlockOverlayManager.EXTRA_APP_NAME
        const val EXTRA_STRICT_MODE = BlockOverlayManager.EXTRA_STRICT_MODE

        fun createIntent(
            context: Context,
            packageName: String,
            appName: String,
            strictMode: Boolean,
        ): Intent =
            Intent(context, BlockFallbackActivity::class.java).apply {
                putExtra(EXTRA_PACKAGE_NAME, packageName)
                putExtra(EXTRA_APP_NAME, appName)
                putExtra(EXTRA_STRICT_MODE, strictMode)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            }
    }
}
