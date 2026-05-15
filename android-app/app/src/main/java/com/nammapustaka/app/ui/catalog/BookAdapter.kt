package com.nammapustaka.app.ui.catalog

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.nammapustaka.app.R
import com.nammapustaka.app.data.local.entity.BookEntity
import com.nammapustaka.app.databinding.ItemBookBinding

class BookAdapter(
    private val onClick: (BookEntity) -> Unit
) : ListAdapter<BookEntity, BookAdapter.BookViewHolder>(DiffCallback) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookViewHolder {
        val binding = ItemBookBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return BookViewHolder(binding, onClick)
    }

    override fun onBindViewHolder(holder: BookViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class BookViewHolder(
        private val binding: ItemBookBinding,
        private val onClick: (BookEntity) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(book: BookEntity) {
            binding.categoryText.text = book.category
            binding.titleText.text = book.title
            binding.authorText.text = book.author
            binding.statusChip.text = if (book.available) {
                binding.root.context.getString(R.string.book_available)
            } else {
                binding.root.context.getString(R.string.book_not_available)
            }
            binding.statusChip.setTextColor(
                ContextCompat.getColor(
                    binding.root.context,
                    if (book.available) R.color.success_500 else R.color.danger_500
                )
            )
            binding.root.setOnClickListener { onClick(book) }
        }
    }

    private object DiffCallback : DiffUtil.ItemCallback<BookEntity>() {
        override fun areItemsTheSame(oldItem: BookEntity, newItem: BookEntity): Boolean = oldItem.bookId == newItem.bookId
        override fun areContentsTheSame(oldItem: BookEntity, newItem: BookEntity): Boolean = oldItem == newItem
    }
}
