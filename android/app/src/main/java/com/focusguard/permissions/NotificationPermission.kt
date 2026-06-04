package com.focusguard.permissions

/** Shared constants for `POST_NOTIFICATIONS` runtime permission handling. */
object NotificationPermission {
  const val REQUEST_CODE_POST_NOTIFICATIONS = 1001
  const val PERMISSION_CHANGED_EVENT = "focusguard:notificationsPermissionChanged"
}
