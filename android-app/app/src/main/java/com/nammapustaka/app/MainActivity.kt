package com.nammapustaka.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.commit
import com.nammapustaka.app.databinding.ActivityMainBinding
import com.nammapustaka.app.ui.addbook.AddBookFragment
import com.nammapustaka.app.ui.catalog.CatalogFragment
import com.nammapustaka.app.ui.dashboard.TeacherDashboardFragment
import com.nammapustaka.app.ui.leaderboard.LeaderboardFragment
import com.nammapustaka.app.ui.scan.ScanFragment

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)

        if (savedInstanceState == null) {
            showCatalog()
        }

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.menu_catalog -> showCatalog()
                R.id.menu_scan -> replaceFragment(ScanFragment())
                R.id.menu_dashboard -> replaceFragment(TeacherDashboardFragment())
                R.id.menu_leaderboard -> replaceFragment(LeaderboardFragment())
            }
            true
        }
    }

    private fun showCatalog() {
        replaceFragment(CatalogFragment())
    }

    fun openAddBook() {
        replaceFragment(AddBookFragment())
    }

    private fun replaceFragment(fragment: androidx.fragment.app.Fragment) {
        supportFragmentManager.commit {
            replace(R.id.fragment_container, fragment)
        }
    }
}
