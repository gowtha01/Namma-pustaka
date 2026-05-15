package com.nammapustaka.app.ui.leaderboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.nammapustaka.app.NammaPustakaApp
import com.nammapustaka.app.databinding.FragmentLeaderboardBinding
import com.nammapustaka.app.ui.common.ViewModelFactory

class LeaderboardFragment : Fragment() {
    private var _binding: FragmentLeaderboardBinding? = null
    private val binding get() = _binding!!

    private val viewModel: LeaderboardViewModel by activityViewModels {
        ViewModelFactory((requireActivity().application as NammaPustakaApp).container)
    }

    private val adapter = LeaderboardAdapter()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLeaderboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.leaderboardList.layoutManager = LinearLayoutManager(requireContext())
        binding.leaderboardList.adapter = adapter

        viewModel.leaderboard.observe(viewLifecycleOwner) { students ->
            adapter.submitList(students)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
