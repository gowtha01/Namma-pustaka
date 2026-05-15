package com.nammapustaka.app.data.local.model

import androidx.room.ColumnInfo

data class ReviewWithUser(
    @ColumnInfo(name = "review_id")
    val reviewId: Long,
    @ColumnInfo(name = "book_id")
    val bookId: Long,
    @ColumnInfo(name = "user_id")
    val userId: String,
    @ColumnInfo(name = "student_name")
    val studentName: String,
    val rating: Int,
    @ColumnInfo(name = "review_text")
    val reviewText: String
)
