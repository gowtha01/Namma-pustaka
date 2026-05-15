package com.nammapustaka.app.data.service

import com.nammapustaka.app.BuildConfig
import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class AiSummaryService {
    suspend fun generateKannadaSummary(title: String, author: String): String {
        val apiKey = BuildConfig.GEMINI_API_KEY.trim()
        if (apiKey.isBlank()) {
            return "Kannada summary is unavailable right now for $title by $author."
        }

        return runCatching {
            val connection = URL("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey")
                .openConnection() as HttpURLConnection
            connection.requestMethod = "POST"
            connection.doOutput = true
            connection.setRequestProperty("Content-Type", "application/json")

            val prompt = "Generate a simple 3 sentence Kannada summary for the book '$title' by '$author'. Keep it easy for school students."
            val payload = JSONObject()
                .put("contents", JSONArray().put(JSONObject().put("parts", JSONArray().put(JSONObject().put("text", prompt)))))

            OutputStreamWriter(connection.outputStream).use { it.write(payload.toString()) }

            val responseText = connection.inputStream.bufferedReader().use(BufferedReader::readText)
            val json = JSONObject(responseText)
            json.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text")
        }.getOrElse {
            "Kannada summary is unavailable right now for $title by $author."
        }
    }
}
