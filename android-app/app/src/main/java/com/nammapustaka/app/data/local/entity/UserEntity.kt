package com.nammapustaka.app.data.local.entity

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val role: String,
    @ColumnInfo(name = "class_name")
    val className: String,
    @ColumnInfo(name = "pages_read_month")
    val pagesReadMonth: Int = 0
)
