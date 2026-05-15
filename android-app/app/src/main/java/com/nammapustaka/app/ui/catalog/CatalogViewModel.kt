package com.nammapustaka.app.ui.catalog

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.switchMap
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.data.repository.BookRepository

class CatalogViewModel(
    private val repository: BookRepository
) : ViewModel() {
    private val query = MutableLiveData("")

    val books: LiveData<List<BookEntity>> = query.switchMap { search ->
        repository.observeBooks(search).asLiveData()
    }

    fun updateQuery(value: String) {
        query.value = value
    }
}
