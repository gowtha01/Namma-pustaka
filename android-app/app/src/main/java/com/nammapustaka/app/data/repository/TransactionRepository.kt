package com.nammapustaka.app.data.repository

import com.nammapustaka.app.data.local.dao.BookDao
import com.nammapustaka.app.data.local.dao.TransactionDao
import com.nammapustaka.app.data.local.dao.UserDao
import com.nammapustaka.app.data.local.model.TransactionWithDetails
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

class TransactionRepository(
    private val transactionDao: TransactionDao,
    private val bookDao: BookDao,
    private val userDao: UserDao
) {
    fun observeTransactions(): Flow<List<TransactionWithDetails>> = transactionDao.observeTransactionsWithDetails()

    suspend fun borrowBook(bookId: Long, userId: String) {
        val book = bookDao.getBook(bookId) ?: return
        if (!book.available) return
        val issueDate = LocalDate.now()
        val dueDate = issueDate.plusDays(14)
        transactionDao.insert(
            com.nammapustaka.app.data.local.entity.TransactionEntity(
                bookId = bookId,
                userId = userId,
                issueDate = issueDate,
                dueDate = dueDate
            )
        )
        bookDao.update(book.copy(available = false))
    }

    suspend fun borrowBookByQrCode(qrCode: String, userId: String): Boolean {
        val normalized = qrCode.substringAfterLast("/").ifBlank { qrCode }
        val book = bookDao.getBookByQrCode(normalized) ?: return false
        if (!book.available) return false
        borrowBook(book.bookId, userId)
        return true
    }

    suspend fun returnBook(transactionId: Long) {
        val transaction = transactionDao.getTransaction(transactionId) ?: return
        val book = bookDao.getBook(transaction.bookId) ?: return
        transactionDao.markReturned(transactionId, LocalDate.now())
        bookDao.update(book.copy(available = true))
        userDao.incrementPagesRead(transaction.userId, book.totalPages)
    }
}
