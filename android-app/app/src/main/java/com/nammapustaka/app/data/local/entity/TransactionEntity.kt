package com.nammapustaka.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDate

@Entity(tableName = "transactions")
data class TransactionEntity(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "txn_id")
    val transactionId: Long = 0,
    @ColumnInfo(name = "book_id")
    val bookId: Long,
    @ColumnInfo(name = "user_id")
    val userId: String,
    @ColumnInfo(name = "issue_date")
    val issueDate: LocalDate,
    @ColumnInfo(name = "due_date")
    val dueDate: LocalDate,
    @ColumnInfo(name = "return_date")
    val returnDate: LocalDate? = null,
    val status: String = "issued"
)
