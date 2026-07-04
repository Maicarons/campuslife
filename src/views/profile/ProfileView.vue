<template>
  <div class="profile-view">
    <el-card class="profile-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h3>个人资料</h3>
          <el-button type="primary" @click="isEditing = !isEditing">
            {{ isEditing ? '取消' : '编辑' }}
          </el-button>
        </div>
      </template>

      <el-form :model="profileForm" label-width="100px" :disabled="!isEditing">
        <div class="avatar-section">
          <el-avatar :size="80">{{ profileForm.nickname?.[0] || 'U' }}</el-avatar>
          <el-button v-if="isEditing" size="small" type="primary" plain>更换头像</el-button>
        </div>

        <el-divider />

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称">
              <el-input v-model="profileForm.nickname" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="profileForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="profileForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">组织信息</el-divider>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="学校">
              <el-input v-model="profileForm.school" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院">
              <el-input v-model="profileForm.college" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="专业">
              <el-input v-model="profileForm.major" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级">
              <el-input v-model="profileForm.grade" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="班级">
              <el-input v-model="profileForm.className" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="isEditing">
          <el-button type="primary" @click="saveProfile">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Stats -->
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="积分" :value="156" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="笔记数" :value="0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="帖子数" :value="0" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="加入社团" :value="2" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const isEditing = ref(false)

const profileForm = reactive({
  username: 'testuser',
  nickname: '测试用户',
  email: 'test@example.com',
  phone: '',
  school: '北京大学',
  college: '计算机科学与技术学院',
  major: '计算机科学与技术',
  grade: '2022级',
  className: '计科 2201 班',
})

function saveProfile() {
  isEditing.value = false
  ElMessage.success('个人资料已保存')
}
</script>

<style lang="scss" scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .profile-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      h3 { margin: 0; }
    }
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
  }

  .stat-card {
    text-align: center;
  }
}
</style>
