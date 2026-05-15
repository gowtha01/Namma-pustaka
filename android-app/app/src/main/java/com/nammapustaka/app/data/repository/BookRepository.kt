package com.nammapustaka.app.data.repository

import com.nammapustaka.app.data.local.dao.BookDao
import com.nammapustaka.app.data.local.dao.ReviewDao
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.data.local.entity.ReviewEntity
import com.nammapustaka.app.data.local.model.ReviewWithUser
import com.nammapustaka.app.data.service.AiSummaryService
import com.nammapustaka.app.data.service.OcrPrefillService
import android.graphics.Bitmap
import kotlinx.coroutines.flow.Flow

class BookRepository(
    private val bookDao: BookDao,
    private val reviewDao: ReviewDao,
    private val aiSummaryService: AiSummaryService,
    private val ocrPrefillService: OcrPrefillService
) {
    fun observeBooks(query: String): Flow<List<BookEntity>> {
        return if (query.isBlank()) {
            bookDao.observeBooks()
        } else {
            bookDao.searchBooks(query)
        }
    }

    suspend fun getBook(bookId: Long): BookEntity? = bookDao.getBook(bookId)

    suspend fun addBook(title: String, author: String, category: String, totalPages: Int): Long {
        val summary = aiSummaryService.generateKannadaSummary(title, author)
        val book = BookEntity(
            title = title,
            author = author,
            category = category,
            summaryKn = summary,
            totalPages = totalPages,
            qrCode = "BOOK-${System.currentTimeMillis()}"
        )
        return bookDao.insert(book)
    }

    suspend fun suggestBookPrefill(bitmap: Bitmap): OcrPrefillService.BookPrefill = ocrPrefillService.extractBookPrefill(bitmap)

    fun observeReviews(bookId: Long): Flow<List<ReviewWithUser>> = reviewDao.observeReviews(bookId)

    suspend fun addReview(bookId: Long, userId: String, rating: Int, reviewText: String) {
        reviewDao.insert(
            ReviewEntity(
                bookId = bookId,
                userId = userId,
                rating = rating,
                reviewText = reviewText
            )
        )
    }
}
