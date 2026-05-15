package com.nammapustaka.app.ui.book

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.switchMap
import androidx.lifecycle.viewModelScope
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.data.repository.BookRepository
import com.nammapustaka.app.data.repository.TransactionRepository
import kotlinx.coroutines.launch

class BookDetailViewModel(
    private val bookRepository: BookRepository,
    private val transactionRepository: TransactionRepository
) : ViewModel() {
    private val _book = MutableLiveData<BookEntity?>()
    val book: LiveData<BookEntity?> = _book

    private val _reviewBookId = MutableLiveData<Long>()
    val reviews = _reviewBookId.switchMap { bookId ->
        bookRepository.observeReviews(bookId).asLiveData()
    }

    fun loadBook(bookId: Long) {
        _reviewBookId.value = bookId
        viewModelScope.launch {
            _book.value = bookRepository.getBook(bookId)
        }
    }

    fun borrowCurrentBook() {
        val current = _book.value ?: return
        viewModelScope.launch {
            transactionRepository.borrowBook(current.bookId, "student-1")
            _book.value = bookRepository.getBook(current.bookId)
        }
    }

    fun addReview(rating: Int, reviewText: String) {
        val current = _book.value ?: return
        viewModelScope.launch {
            bookRepository.addReview(current.bookId, "student-1", rating, reviewText)
        }
    }
}
