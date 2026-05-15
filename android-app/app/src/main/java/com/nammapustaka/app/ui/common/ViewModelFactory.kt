package com.nammapustaka.app.ui.common

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.nammapustaka.app.data.AppContainer
import com.nammapustaka.app.ui.addbook.AddBookViewModel
import com.nammapustaka.app.ui.book.BookDetailViewModel
import com.nammapustaka.app.ui.catalog.CatalogViewModel
import com.nammapustaka.app.ui.dashboard.TeacherDashboardViewModel
import com.nammapustaka.app.ui.leaderboard.LeaderboardViewModel
import com.nammapustaka.app.ui.scan.ScanViewModel

class ViewModelFactory(
    private val container: AppContainer
) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        return when {
            modelClass.isAssignableFrom(CatalogViewModel::class.java) ->
                CatalogViewModel(container.bookRepository) as T

            modelClass.isAssignableFrom(BookDetailViewModel::class.java) ->
                BookDetailViewModel(container.bookRepository, container.transactionRepository) as T

            modelClass.isAssignableFrom(TeacherDashboardViewModel::class.java) ->
                TeacherDashboardViewModel(container.transactionRepository) as T

            modelClass.isAssignableFrom(AddBookViewModel::class.java) ->
                AddBookViewModel(container.bookRepository) as T

            modelClass.isAssignableFrom(LeaderboardViewModel::class.java) ->
                LeaderboardViewModel(container.leaderboardRepository) as T

            modelClass.isAssignableFrom(ScanViewModel::class.java) ->
                ScanViewModel(container.transactionRepository) as T

            else -> throw IllegalArgumentException("Unknown view model ${modelClass.name}")
        }
    }
}
