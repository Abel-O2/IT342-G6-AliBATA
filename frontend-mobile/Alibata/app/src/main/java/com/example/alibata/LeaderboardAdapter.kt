package com.example.alibata

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.example.alibata.models.UserScoreProjection

class LeaderboardAdapter :
    ListAdapter<UserScoreProjection, LeaderboardAdapter.VH>(DIFF) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_leaderboard_row, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        holder.bind(getItem(position), position)
    }

    class VH(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val rankTv     = itemView.findViewById<TextView>(R.id.text_rank)
        private val usernameTv = itemView.findViewById<TextView>(R.id.text_username)
        private val pointsTv   = itemView.findViewById<TextView>(R.id.text_points)

        fun bind(item: UserScoreProjection, pos: Int) {
            // 1-based rank
            rankTv.text     = (pos + 1).toString()
            // full name
            usernameTv.text = "${item.firstName} ${item.lastName}"
            // score
            pointsTv.text   = item.score.toString()
        }
    }

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<UserScoreProjection>() {
            override fun areItemsTheSame(a: UserScoreProjection, b: UserScoreProjection) =
                a.userId == b.userId

            override fun areContentsTheSame(a: UserScoreProjection, b: UserScoreProjection) =
                a == b
        }
    }
}
