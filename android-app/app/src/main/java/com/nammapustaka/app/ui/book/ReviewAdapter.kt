package com.nammapustaka.app.ui.book

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.nammapustaka.app.data.local.model.ReviewWithUser
import com.nammapustaka.app.databinding.ItemReviewBinding

class ReviewAdapter : ListAdapter<ReviewWithUser, ReviewAdapter.ReviewViewHolder>(DiffCallback) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val binding = ItemReviewBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ReviewViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class ReviewViewHolder(
        private val binding: ItemReviewBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(review: ReviewWithUser) {
            binding.reviewRating.rating = review.rating.toFloat()
            binding.reviewAuthor.text = review.studentName
            binding.reviewText.text = review.reviewText
        }
    }

    private object DiffCallback : DiffUtil.ItemCallback<ReviewWithUser>() {
        override fun areItemsTheSame(oldItem: ReviewWithUser, newItem: ReviewWithUser): Boolean = oldItem.reviewId == newItem.reviewId
        override fun areContentsTheSame(oldItem: ReviewWithUser, newItem: ReviewWithUser): Boolean = oldItem == newItem
    }
}
