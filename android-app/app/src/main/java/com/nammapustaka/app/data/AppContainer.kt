package com.nammapustaka.app.data

import android.content.Context
import com.nammapustaka.app.data.local.NammaPustakaDatabase
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.data.local.entity.UserEntity
import com.nammapustaka.app.data.repository.BookRepository
import com.nammapustaka.app.data.repository.LeaderboardRepository
import com.nammapustaka.app.data.repository.TransactionRepository
import com.nammapustaka.app.data.service.AiSummaryService
import com.nammapustaka.app.data.service.OcrPrefillService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class AppContainer(context: Context) {
    private val database = NammaPustakaDatabase.getInstance(context)
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private val aiSummaryService = AiSummaryService()
    private val ocrPrefillService = OcrPrefillService()

    val bookRepository = BookRepository(
        bookDao = database.bookDao(),
        reviewDao = database.reviewDao(),
        aiSummaryService = aiSummaryService,
        ocrPrefillService = ocrPrefillService
    )

    val transactionRepository = TransactionRepository(
        transactionDao = database.transactionDao(),
        bookDao = database.bookDao(),
        userDao = database.userDao()
    )

    val leaderboardRepository = LeaderboardRepository(database.userDao())

    init {
        seedLocalDataIfNeeded()
    }

    private fun seedLocalDataIfNeeded() {
        scope.launch {
            if (database.userDao().countUsers() == 0) {
                database.userDao().insertAll(
                    listOf(
                        UserEntity(id = "student-1", name = "Asha", role = "student", className = "6A", pagesReadMonth = 120),
                        UserEntity(id = "student-2", name = "Ravi", role = "student", className = "7B", pagesReadMonth = 80),
                        UserEntity(id = "teacher-1", name = "Meena Teacher", role = "teacher", className = "")
                    )
                )
            }

            if (database.bookDao().countBooks() == 0) {
                database.bookDao().insertAll(
                    listOf(
                        BookEntity(
                            title = "Malgudi Days",
                            author = "R. K. Narayan",
                            category = "Story",
                            summaryKn = "Simple Kannada summary placeholder for Malgudi Days.",
                            totalPages = 180,
                            qrCode = "BOOK-1"
                        ),
                        BookEntity(
                            title = "Wings of Fire",
                            author = "A. P. J. Abdul Kalam",
                            category = "Science",
                            summaryKn = "Simple Kannada summary placeholder for Wings of Fire.",
                            totalPages = 220,
                            qrCode = "BOOK-2"
                        )
                    )
                )
            }
        }
    }
}
