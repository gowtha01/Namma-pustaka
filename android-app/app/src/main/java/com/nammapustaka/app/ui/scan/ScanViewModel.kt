package com.nammapustaka.app.ui.scan

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nammapustaka.app.data.repository.TransactionRepository
import kotlinx.coroutines.launch

class ScanViewModel(
    private val repository: TransactionRepository
) : ViewModel() {
    private val _status = MutableLiveData<String>()
    val status: LiveData<String> = _status

    fun processQrCode(rawValue: String) {
        viewModelScope.launch {
            val success = repository.borrowBookByQrCode(rawValue, "student-1")
            _status.value = if (success) "Book issued successfully." else "No matching book found for this QR code yet."
        }
    }
}
