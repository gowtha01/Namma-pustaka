package com.nammapustaka.app.ui.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import androidx.lifecycle.viewModelScope
import com.nammapustaka.app.data.repository.TransactionRepository
import kotlinx.coroutines.launch

class TeacherDashboardViewModel(
    private val repository: TransactionRepository
) : ViewModel() {
    val transactions = repository.observeTransactions().asLiveData()

    fun markReturned(transactionId: Long) {
        viewModelScope.launch {
            repository.returnBook(transactionId)
        }
    }
}
