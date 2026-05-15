package com.nammapustaka.app.ui.addbook

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import com.google.android.material.snackbar.Snackbar
import com.nammapustaka.app.NammaPustakaApp
import com.nammapustaka.app.R
import com.nammapustaka.app.databinding.FragmentAddBookBinding
import com.nammapustaka.app.ui.common.ViewModelFactory

class AddBookFragment : Fragment() {
    private var _binding: FragmentAddBookBinding? = null
    private val binding get() = _binding!!

    private val viewModel: AddBookViewModel by activityViewModels {
        ViewModelFactory((requireActivity().application as NammaPustakaApp).container)
    }

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) {
            takePicturePreviewLauncher.launch(null)
        } else {
            Snackbar.make(binding.root, getString(R.string.camera_permission_needed), Snackbar.LENGTH_SHORT).show()
        }
    }

    private val takePicturePreviewLauncher = registerForActivityResult(
        ActivityResultContracts.TakePicturePreview()
    ) { bitmap: Bitmap? ->
        if (bitmap != null) {
            viewModel.runCameraPrefill(bitmap)
            Snackbar.make(binding.root, "Camera OCR processed the cover text.", Snackbar.LENGTH_SHORT).show()
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAddBookBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.categoryInput.setAdapter(
            ArrayAdapter(
                requireContext(),
                android.R.layout.simple_dropdown_item_1line,
                listOf("Story", "Science", "History", "Language", "General")
            )
        )

        binding.ocrButton.setOnClickListener {
            launchCameraCapture()
        }

        binding.saveBookButton.setOnClickListener {
            val pages = binding.pagesInput.text?.toString()?.toIntOrNull() ?: 0
            viewModel.saveBook(
                title = binding.titleInput.text?.toString().orEmpty(),
                author = binding.authorInput.text?.toString().orEmpty(),
                category = binding.categoryInput.text?.toString().orEmpty(),
                totalPages = pages
            )
            Snackbar.make(binding.root, "Book saved to Room DB.", Snackbar.LENGTH_SHORT).show()
        }

        viewModel.prefill.observe(viewLifecycleOwner) { prefill ->
            binding.titleInput.setText(prefill.title)
            binding.authorInput.setText(prefill.author)
            binding.categoryInput.setText(prefill.category, false)
            binding.pagesInput.setText(prefill.totalPages)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    private fun launchCameraCapture() {
        when {
            ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED -> {
                takePicturePreviewLauncher.launch(null)
            }

            else -> cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        }
    }
}
