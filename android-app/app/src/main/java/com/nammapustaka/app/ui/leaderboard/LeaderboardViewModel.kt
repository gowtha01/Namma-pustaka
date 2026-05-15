package com.nammapustaka.app.ui.leaderboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.asLiveData
import com.nammapustaka.app.data.repository.LeaderboardRepository

class LeaderboardViewModel(
    repository: LeaderboardRepository
) : ViewModel() {
    val leaderboard = repository.observeLeaderboard().asLiveData()
}
