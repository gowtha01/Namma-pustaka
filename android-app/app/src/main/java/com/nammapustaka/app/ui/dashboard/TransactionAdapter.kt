package com.nammapustaka.app.ui.dashboard

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.nammapustaka.app.R
import com.nammapustaka.app.data.local.model.TransactionWithDetails
import com.nammapustaka.app.databinding.ItemTransactionBinding
import java.time.format.DateTimeFormatter

class TransactionAdapter(
    private val onReturn: (Long) -> Unit
) : ListAdapter<TransactionWithDetails, TransactionAdapter.TransactionViewHolder>(DiffCallback) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TransactionViewHolder {
        val binding = ItemTransactionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TransactionViewHolder(binding, onReturn)
    }

    override fun onBindViewHolder(holder: TransactionViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class TransactionViewHolder(
        private val binding: ItemTransactionBinding,
        private val onReturn: (Long) -> Unit
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(transaction: TransactionWithDetails) {
            binding.bookTitleText.text = transaction.title
            binding.studentNameText.text = transaction.studentName
            binding.dueDateText.text = binding.root.context.getString(
                R.string.due_date_label,
                transaction.dueDate.format(DateTimeFormatter.ISO_DATE)
            )
            binding.dueDateText.setTextColor(
                if (transaction.isOverdue) Color.parseColor("#D86767") else Color.parseColor("#D7CDBA")
            )
            binding.returnButton.setOnClickListener { onReturn(transaction.transactionId) }
        }
    }

    private object DiffCallback : DiffUtil.ItemCallback<TransactionWithDetails>() {
        override fun areItemsTheSame(oldItem: TransactionWithDetails, newItem: TransactionWithDetails): Boolean =
            oldItem.transactionId == newItem.transactionId

        override fun areContentsTheSame(oldItem: TransactionWithDetails, newItem: TransactionWithDetails): Boolean =
            oldItem == newItem
    }
}
