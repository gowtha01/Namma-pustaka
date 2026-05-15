package com.nammapustaka.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import com.nammapustaka.app.data.local.entity.TransactionEntity
import com.nammapustaka.app.data.local.model.TransactionWithDetails
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

@Dao
interface TransactionDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(transaction: TransactionEntity): Long

    @Query("UPDATE transactions SET return_date = :returnDate, status = 'returned' WHERE txn_id = :transactionId")
    suspend fun markReturned(transactionId: Long, returnDate: LocalDate)

    @Query("SELECT * FROM transactions WHERE txn_id = :transactionId")
    suspend fun getTransaction(transactionId: Long): TransactionEntity?

    @Transaction
    @Query(
        """
        SELECT t.txn_id, t.book_id, t.user_id, b.title, u.name AS student_name, t.issue_date, t.due_date, t.return_date, t.status
        FROM transactions t
        INNER JOIN books b ON b.book_id = t.book_id
        INNER JOIN users u ON u.id = t.user_id
        ORDER BY t.due_date ASC
        """
    )
    fun observeTransactionsWithDetails(): Flow<List<TransactionWithDetails>>
}
