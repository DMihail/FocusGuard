package com.focusguard.bridge

import com.facebook.react.bridge.LifecycleEventListener

/** Notifies JS when the host activity resumes so permission state can be re-read. */
internal class PermissionsLifecycleBinding(
    private val onPermissionsMayHaveChanged: () -> Unit,
) : LifecycleEventListener {

    override fun onHostResume() {
        onPermissionsMayHaveChanged()
    }

    override fun onHostPause() = Unit

    override fun onHostDestroy() = Unit
}
