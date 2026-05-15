package com.nammapustaka.app.data.local.model

import androidx.room.ColumnInfo
import java.time.LocalDate

data class TransactionWithDetails(
    @ColumnInfo(name = "txn_id")
    val transactionId: Long,
    @ColumnInfo(name = "book_id")
    val bookId: Long,
    @ColumnInfo(name = "user_id")
    val userId: String,
    val title: String,
    @ColumnInfo(name = "student_name")
    val studentName: String,
    @ColumnInfo(name = "issue_date")
    val issueDate: LocalDate,
    @ColumnInfo(name = "due_date")
    val dueDate: LocalDate,
    @ColumnInfo(name = "return_date")
    val returnDate: LocalDate?,
    val status: String
) {
    val isOverdue: Boolean
        get() = status == "issued" && dueDate.isBefore(LocalDate.now())
}
