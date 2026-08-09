plugins {
    id("org.jetbrains.kotlin.multiplatform")
    id("com.android.library")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.compose")
    id("org.jetbrains.kotlin.plugin.serialization")
}

kotlin {
    androidTarget {
        compilations.all {
            kotlinOptions {
                jvmTarget = "17"
            }
        }
    }
    
    listOf(
        iosX64(),
        iosArm64(),
        iosSimulatorArm64()
    ).forEach { iosTarget ->
        iosTarget.binaries.framework {
            baseName = "shared"
            isStatic = true
        }
    }

    sourceSets {
        commonMain.dependencies {
            implementation(compose.runtime)
            implementation(compose.foundation)
            implementation(compose.material3)
            implementation(compose.ui)
            implementation(compose.components.resources)
            
            // Coroutines & Serialization
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1")
            implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.6.3")
            
            // Koin DI & Multiplatform Settings
            implementation("io.insert-koin:koin-core:3.5.6")
            implementation("com.russhwolf:multiplatform-settings:1.1.1")
            
            // Ktor Socket Networking
            implementation("io.ktor:ktor-client-core:2.3.11")
            implementation("io.ktor:ktor-client-websockets:2.3.11")
        }

        androidMain.dependencies {
            implementation("androidx.activity:activity-compose:1.9.0")
            implementation("io.ktor:ktor-client-okhttp:2.3.11")
        }

        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:2.3.11")
        }
    }
}

android {
    namespace = "com.mafia.game.shared"
    compileSdk = 34
    defaultConfig {
        minSdk = 24
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
