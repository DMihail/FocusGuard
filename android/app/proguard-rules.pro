# FocusGuard release shrinking (R8). Add keeps for reflection / JNI / TurboModules.

# React Native & Hermes
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# MMKV (native + Java)
-keep class com.tencent.mmkv.** { *; }

# App TurboModule & Kotlin monitoring
-keep class com.nativeusagestats.** { *; }
-keep class com.focusguard.** { *; }

# Kotlin coroutines (service scope)
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

-dontwarn com.facebook.**
-dontwarn okhttp3.**
-dontwarn okio.**
