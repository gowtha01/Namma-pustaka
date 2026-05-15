package com.nammapustaka.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "books")
data class BookEntity(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "book_id")
    val bookId: Long = 0,
    val title: String,
    val author: String,
    val category: String,
    @ColumnInfo(name = "cover_uri")
    val coverUri: String = "",
    @ColumnInfo(name = "qr_code")
    val qrCode: String,
    @ColumnInfo(name = "summary_kn")
    val summaryKn: String,
    @ColumnInfo(name = "total_pages")
    val totalPages: Int,
    val available: Boolean = true
)
