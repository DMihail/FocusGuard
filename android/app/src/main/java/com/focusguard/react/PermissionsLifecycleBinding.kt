package com.focusguard.react

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.LifecycleEventListener

/** Notifies JS when the host activity resumes so permission state can be re-read. */
internal class PermissionsLifecycleBinding(
    private val onPermissionsMayHaveChanged: () -> Unit,
) : LifecycleEventListener {

  private val handler = Handler(Looper.getMainLooper())
  private val recheckPermissions = Runnable { onPermissionsMayHaveChanged() }

  override fun onHostResume() {
    onPermissionsMayHaveChanged()
    handler.removeCallbacks(recheckPermissions)
    handler.postDelayed(recheckPermissions, RESUME_RECHECK_DELAY_MS)
  }

  override fun onHostPause() {
    handler.removeCallbacks(recheckPermissions)
  }

  override fun onHostDestroy() {
    handler.removeCallbacks(recheckPermissions)
  }

  private companion object {
    const val RESUME_RECHECK_DELAY_MS = 350L
  }
}
