package com.nammapustaka.app.data.service

import android.graphics.Bitmap
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import kotlinx.coroutines.tasks.await

class OcrPrefillService {
    data class BookPrefill(
        val title: String,
        val author: String,
        val category: String,
        val totalPages: Int
    )

    suspend fun extractBookPrefill(bitmap: Bitmap): BookPrefill {
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        val text = recognizer.process(InputImage.fromBitmap(bitmap, 0)).await().text
        recognizer.close()

        val lines = text.lines().map { it.trim() }.filter { it.isNotBlank() }
        val title = lines.firstOrNull().orEmpty()
        val authorLine = lines.drop(1).firstOrNull { line ->
            line.contains("by ", ignoreCase = true) || line.contains("author", ignoreCase = true)
        }.orEmpty()
        val author = authorLine
            .substringAfter("by ", authorLine)
            .substringAfter("author", authorLine)
            .replace(":", "")
            .trim()

        val totalPages = lines.firstNotNullOfOrNull { line ->
            Regex("(\\d{2,4})").find(line)?.groupValues?.get(1)?.toIntOrNull()
        } ?: 100

        return BookPrefill(
            title = title.ifBlank { "Detected Book Title" },
            author = author.ifBlank { "Detected Author" },
            category = inferCategory(lines),
            totalPages = totalPages
        )
    }

    private fun inferCategory(lines: List<String>): String {
        val blob = lines.joinToString(" ").lowercase()
        return when {
            "science" in blob -> "Science"
            "history" in blob -> "History"
            "language" in blob || "grammar" in blob -> "Language"
            else -> "Story"
        }
    }
}
