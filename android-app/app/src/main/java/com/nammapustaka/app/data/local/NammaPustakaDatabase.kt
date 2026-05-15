package com.nammapustaka.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.nammapustaka.app.data.local.dao.BookDao
import com.nammapustaka.app.data.local.dao.ReviewDao
import com.nammapustaka.app.data.local.dao.TransactionDao
import com.nammapustaka.app.data.local.dao.UserDao
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.data.local.entity.ReviewEntity
import com.nammapustaka.app.data.local.entity.TransactionEntity
import com.nammapustaka.app.data.local.entity.UserEntity

@Database(
    entities = [BookEntity::class, UserEntity::class, TransactionEntity::class, ReviewEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class NammaPustakaDatabase : RoomDatabase() {
    abstract fun bookDao(): BookDao
    abstract fun userDao(): UserDao
    abstract fun transactionDao(): TransactionDao
    abstract fun reviewDao(): ReviewDao

    companion object {
        @Volatile
        private var INSTANCE: NammaPustakaDatabase? = null

        fun getInstance(context: Context): NammaPustakaDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    NammaPustakaDatabase::class.java,
                    "namma_pustaka.db"
                ).build()
                    .also { INSTANCE = it }
            }
        }
    }
}
