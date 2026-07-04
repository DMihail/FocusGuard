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
-keep class com.keept.turbomodule.KeeptTurboModulePackage { *; }
-keep class com.keept.turbomodule.KeeptTurboModule { *; }
-keep class com.keept.turbomodule.NativeKeeptTurboModuleSpec { *; }

# ---------------------------------------------------------------------------
# MMKV (JNI)
# ---------------------------------------------------------------------------
-keep class com.tencent.mmkv.** { *; }
-keepclasseswithmembers class com.tencent.mmkv.** {
    native <methods>;
}

# ---------------------------------------------------------------------------
# react-native-screens (fragment restoration + RNScreensFragmentFactory)
# ---------------------------------------------------------------------------
-keepnames class com.swmansion.rnscreens.ScreenFragment { *; }
-keepnames class com.swmansion.rnscreens.ScreenStackFragment { *; }
-keepnames class com.swmansion.rnscreens.ScreenModalFragment { *; }

# ---------------------------------------------------------------------------
# Kotlin coroutines (monitor service scope)
# ---------------------------------------------------------------------------
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ---------------------------------------------------------------------------
# Benign missing classes (transitive / optional SDK surfaces)
# ---------------------------------------------------------------------------
-dontwarn com.facebook.**
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.jetbrains.annotations.**
