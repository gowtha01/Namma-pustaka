package com.nammapustaka.app.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.nammapustaka.app.data.local.entity.ReviewEntity
import com.nammapustaka.app.data.local.model.ReviewWithUser
import kotlinx.coroutines.flow.Flow

@Dao
interface ReviewDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(review: ReviewEntity)

    @Query(
        """
        SELECT r.review_id, r.book_id, r.user_id, u.name AS student_name, r.rating, r.review_text
        FROM reviews r
        INNER JOIN users u ON u.id = r.user_id
        WHERE r.book_id = :bookId
        ORDER BY r.review_id DESC
        """
    )
    fun observeReviews(bookId: Long): Flow<List<ReviewWithUser>>
}
