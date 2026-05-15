package com.nammapustaka.app.ui.addbook

import android.graphics.Bitmap
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nammapustaka.app.data.repository.BookRepository
import kotlinx.coroutines.launch

class AddBookViewModel(
    private val repository: BookRepository
) : ViewModel() {
    private val _prefill = MutableLiveData<PrefillState>()
    val prefill: LiveData<PrefillState> = _prefill

    fun runCameraPrefill(bitmap: Bitmap) {
        viewModelScope.launch {
            val suggestion = repository.suggestBookPrefill(bitmap)
            _prefill.value = PrefillState(
                title = suggestion.title,
                author = suggestion.author,
                category = suggestion.category,
                totalPages = suggestion.totalPages.toString()
            )
        }
    }

    fun saveBook(title: String, author: String, category: String, totalPages: Int) {
        viewModelScope.launch {
            repository.addBook(title, author, category, totalPages)
        }
    }

    data class PrefillState(
        val title: String,
        val author: String,
        val category: String,
        val totalPages: String
    )
}
