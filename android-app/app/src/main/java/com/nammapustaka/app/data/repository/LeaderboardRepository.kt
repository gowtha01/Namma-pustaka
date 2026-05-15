package com.nammapustaka.app.data.repository

import com.nammapustaka.app.data.local.dao.UserDao
import com.nammapustaka.app.data.local.entity.UserEntity
import kotlinx.coroutines.flow.Flow

class LeaderboardRepository(
    private val userDao: UserDao
) {
    fun observeLeaderboard(): Flow<List<UserEntity>> = userDao.observeLeaderboard()
}
