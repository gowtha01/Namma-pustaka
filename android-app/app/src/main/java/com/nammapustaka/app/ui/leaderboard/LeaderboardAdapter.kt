package com.nammapustaka.app.ui.leaderboard

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.nammapustaka.app.data.local.entity.UserEntity
import com.nammapustaka.app.databinding.ItemLeaderboardBinding

class LeaderboardAdapter : ListAdapter<UserEntity, LeaderboardAdapter.LeaderboardViewHolder>(DiffCallback) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LeaderboardViewHolder {
        val binding = ItemLeaderboardBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return LeaderboardViewHolder(binding)
    }

    override fun onBindViewHolder(holder: LeaderboardViewHolder, position: Int) {
        holder.bind(getItem(position), position + 1)
    }

    class LeaderboardViewHolder(
        private val binding: ItemLeaderboardBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(user: UserEntity, rank: Int) {
            binding.rankText.text = rank.toString()
            binding.studentText.text = "${user.name} · ${user.className}"
            binding.pagesText.text = "${user.pagesReadMonth} pages this month"
        }
    }

    private object DiffCallback : DiffUtil.ItemCallback<UserEntity>() {
        override fun areItemsTheSame(oldItem: UserEntity, newItem: UserEntity): Boolean = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: UserEntity, newItem: UserEntity): Boolean = oldItem == newItem
    }
}
