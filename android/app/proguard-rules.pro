# FocusGuard — app-specific R8 rules.
#
# Library consumer rules (react-android, Hermes, Firebase, RN libraries) are merged automatically.
# Use proguard-android-optimize.txt in build.gradle for bytecode optimizations.
#
# Avoid blanket `-keep com.focusguard.**` / `-keep com.facebook.react.**` — they block shrinking.

# ---------------------------------------------------------------------------
# Crash reports & annotations
# ---------------------------------------------------------------------------
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions

# ---------------------------------------------------------------------------
# React Native JNI / TurboModules (supplements react-android consumer rules)
# ---------------------------------------------------------------------------
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
}
-keep @com.facebook.jni.annotations.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.jni.annotations.DoNotStrip *;
}

# Codegen Turbo Module — loaded by name from the RN bridge
-keep class com.nativeusagestats.NativeUsageStatsPackage { *; }
-keep class com.nativeusagestats.NativeUsageStatsModule { *; }
-keep class com.nativeusagestats.NativeUsageStatsSpec { *; }

# ---------------------------------------------------------------------------
# MMKV (JNI)
# ---------------------------------------------------------------------------
-keep class com.tencent.mmkv.** { *; }
-keepclasseswithmembers class com.tencent.mmkv.** {
    native <methods>;
}

# ---------------------------------------------------------------------------
# Kotlin coroutines (monitor service scope)
# ---------------------------------------------------------------------------
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ---------------------------------------------------------------------------
# Detox E2E (e2eRelease APK only — class absent from production release)
# ---------------------------------------------------------------------------
-keep class androidx.test.platform.app.InstrumentationRegistry {
    public static android.os.Bundle getArguments();
}
-dontwarn androidx.test.**

# ---------------------------------------------------------------------------
# Benign missing classes (transitive / optional SDK surfaces)
# ---------------------------------------------------------------------------
-dontwarn com.facebook.**
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.jetbrains.annotations.**
