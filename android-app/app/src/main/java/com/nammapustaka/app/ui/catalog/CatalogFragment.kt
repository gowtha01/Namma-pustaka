package com.nammapustaka.app.ui.catalog

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.widget.doAfterTextChanged
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import com.nammapustaka.app.NammaPustakaApp
import com.nammapustaka.app.databinding.FragmentCatalogBinding
import com.nammapustaka.app.ui.book.BookDetailActivity
import com.nammapustaka.app.ui.common.ViewModelFactory

class CatalogFragment : Fragment() {
    private var _binding: FragmentCatalogBinding? = null
    private val binding get() = _binding!!

    private val viewModel: CatalogViewModel by activityViewModels {
        ViewModelFactory((requireActivity().application as NammaPustakaApp).container)
    }

    private val adapter = BookAdapter { book ->
        startActivity(BookDetailActivity.intent(requireContext(), book.bookId))
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCatalogBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.bookList.layoutManager = GridLayoutManager(requireContext(), 2)
        binding.bookList.adapter = adapter

        binding.searchInput.doAfterTextChanged {
            viewModel.updateQuery(it?.toString().orEmpty())
        }

        viewModel.books.observe(viewLifecycleOwner) { books ->
            adapter.submitList(books)
            binding.emptyView.visibility = if (books.isEmpty()) View.VISIBLE else View.GONE
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
