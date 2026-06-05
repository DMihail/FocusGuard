package com.focusguard.apps

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import java.io.File
import java.io.FileOutputStream

/** Caches launcher icons as PNG files under `cacheDir/app_icons/`. */
internal class AppIconCache(
    private val context: Context,
) {
    private val iconDir = File(context.cacheDir, "app_icons")

    fun getUri(packageName: String): String {
        return try {
            val iconFile = File(iconDir, "$packageName.png")
            if (iconFile.exists()) {
                return Uri.fromFile(iconFile).toString()
            }

            iconDir.mkdirs()

            val drawable = context.packageManager.getApplicationIcon(packageName)
            val bitmap = drawable.toBitmap()
            val scaled =
                Bitmap.createScaledBitmap(bitmap, ICON_SIZE_PX, ICON_SIZE_PX, true).also {
                    if (it !== bitmap) {
                        bitmap.recycle()
                    }
                }

            FileOutputStream(iconFile).use { stream ->
                scaled.compress(Bitmap.CompressFormat.PNG, 100, stream)
            }
            if (scaled !== bitmap) {
                scaled.recycle()
            }

            Uri.fromFile(iconFile).toString()
        } catch (_: Exception) {
            ""
        }
    }

    private fun Drawable.toBitmap(): Bitmap {
        if (this is BitmapDrawable && bitmap != null) {
            return bitmap
        }

        val width = intrinsicWidth.coerceAtLeast(1)
        val height = intrinsicHeight.coerceAtLeast(1)
        return Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888).also { bmp ->
            Canvas(bmp).also { canvas ->
                setBounds(0, 0, canvas.width, canvas.height)
                draw(canvas)
            }
        }
    }

    private companion object {
        const val ICON_SIZE_PX = 96
    }
}
