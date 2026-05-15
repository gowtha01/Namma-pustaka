package com.nammapustaka.app.ui.book

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.snackbar.Snackbar
import com.nammapustaka.app.NammaPustakaApp
import com.nammapustaka.app.R
import com.nammapustaka.app.databinding.ActivityBookDetailBinding
import com.nammapustaka.app.ui.common.ViewModelFactory

class BookDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityBookDetailBinding
    private val reviewAdapter = ReviewAdapter()

    private val viewModel: BookDetailViewModel by viewModels {
        ViewModelFactory((application as NammaPustakaApp).container)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBookDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.reviewList.layoutManager = LinearLayoutManager(this)
        binding.reviewList.adapter = reviewAdapter

        val bookId = intent.getLongExtra(EXTRA_BOOK_ID, -1L)
        viewModel.loadBook(bookId)

        binding.borrowButton.setOnClickListener {
            viewModel.borrowCurrentBook()
            Snackbar.make(binding.root, "Borrow flow saved locally.", Snackbar.LENGTH_SHORT).show()
        }

        binding.saveReviewButton.setOnClickListener {
            val rating = binding.ratingInput.rating.toInt()
            val review = binding.reviewInput.text?.toString().orEmpty()
            if (rating == 0) {
                Snackbar.make(binding.root, "Add a star rating first.", Snackbar.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            viewModel.addReview(rating, review)
            binding.ratingInput.rating = 0f
            binding.reviewInput.setText("")
            Snackbar.make(binding.root, getString(R.string.review_saved), Snackbar.LENGTH_SHORT).show()
        }

        viewModel.book.observe(this) { book ->
            book ?: return@observe
            binding.detailTitle.text = book.title
            binding.detailAuthor.text = "${book.author} · ${book.category} · ${book.totalPages} pages"
            binding.detailSummary.text = book.summaryKn
            binding.borrowButton.isEnabled = book.available
        }

        viewModel.reviews.observe(this) { reviews ->
            reviewAdapter.submitList(reviews)
        }
    }

    companion object {
        private const val EXTRA_BOOK_ID = "extra_book_id"

        fun intent(context: Context, bookId: Long): Intent {
            return Intent(context, BookDetailActivity::class.java).putExtra(EXTRA_BOOK_ID, bookId)
        }
    }
}
