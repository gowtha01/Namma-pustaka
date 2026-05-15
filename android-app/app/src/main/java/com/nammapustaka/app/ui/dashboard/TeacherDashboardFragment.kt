package com.nammapustaka.app.ui.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.nammapustaka.app.MainActivity
import com.nammapustaka.app.NammaPustakaApp
import com.nammapustaka.app.databinding.FragmentTeacherDashboardBinding
import com.nammapustaka.app.ui.common.ViewModelFactory

class TeacherDashboardFragment : Fragment() {
    private var _binding: FragmentTeacherDashboardBinding? = null
    private val binding get() = _binding!!

    private val viewModel: TeacherDashboardViewModel by activityViewModels {
        ViewModelFactory((requireActivity().application as NammaPustakaApp).container)
    }

    private val adapter = TransactionAdapter { transactionId ->
        viewModel.markReturned(transactionId)
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentTeacherDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.transactionList.layoutManager = LinearLayoutManager(requireContext())
        binding.transactionList.adapter = adapter
        binding.addBookButton.setOnClickListener {
            (activity as? MainActivity)?.openAddBook()
        }

        viewModel.transactions.observe(viewLifecycleOwner) { transactions ->
            adapter.submitList(transactions)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
