package com.example.alibata

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.fragment.app.Fragment
import com.example.alibata.databinding.ActivityHomepageBinding

class Homepage : AppCompatActivity() {
    private lateinit var binding: ActivityHomepageBinding

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityHomepageBinding.inflate(layoutInflater)
        setContentView(binding.root)

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        loadFragment(LessonFragment())

        binding.bottomNavigationView.setOnItemSelectedListener { item ->
            when (item.itemId){
                R.id.home -> {
                    loadFragment(LessonFragment())
                    true
                }
                R.id.stories -> {
                    loadFragment(StoriesFragment())
                    true
                }
                R.id.account -> {
                    loadFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
    }
}
