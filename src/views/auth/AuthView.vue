<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>🎓 CampusLife</h1>
          <p>校园生活一站式工作站</p>
        </div>

        <el-tabs v-model="mode" stretch>
          <el-tab-pane label="登录" name="login">
            <el-form :model="loginForm" @submit.prevent="handleLogin" label-position="top">
              <el-form-item label="用户名">
                <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
              </el-form-item>
              <el-button type="primary" native-type="submit" :loading="loading" style="width:100%">登录</el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="注册" name="register">
            <el-form :model="registerForm" @submit.prevent="handleRegister" label-position="top">
              <el-form-item label="用户名">
                <el-input v-model="registerForm.username" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
              </el-form-item>

              <el-divider>组织信息（可选）</el-divider>

              <el-form-item label="学校">
                <el-select v-model="registerForm.school_id" placeholder="选择学校" style="width:100%" @change="onSchoolChange">
                  <el-option v-for="s in schools" :key="s.id" :label="s.name" :value="s.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="学院" v-if="colleges.length">
                <el-select v-model="registerForm.college_id" placeholder="选择学院" style="width:100%" @change="onCollegeChange">
                  <el-option v-for="c in colleges" :key="c.id" :label="c.name" :value="c.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="专业" v-if="majors.length">
                <el-select v-model="registerForm.major_id" placeholder="选择专业" style="width:100%" @change="onMajorChange">
                  <el-option v-for="m in majors" :key="m.id" :label="m.name" :value="m.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="年级" v-if="grades.length">
                <el-select v-model="registerForm.grade_id" placeholder="选择年级" style="width:100%" @change="onGradeChange">
                  <el-option v-for="g in grades" :key="g.id" :label="g.year + '级'" :value="g.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="班级" v-if="classes.length">
                <el-select v-model="registerForm.class_id" placeholder="选择班级" style="width:100%">
                  <el-option v-for="cl in classes" :key="cl.id" :label="cl.name" :value="cl.id" />
                </el-select>
              </el-form-item>

              <el-button type="primary" native-type="submit" :loading="loading" style="width:100%">注册</el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi, orgApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const mode = ref('login')
const loading = ref(false)

const loginForm = reactive({ username: '', password: '' })
const registerForm = reactive({
  username: '', email: '', password: '', nickname: '',
  school_id: null as number | null,
  college_id: null as number | null,
  major_id: null as number | null,
  grade_id: null as number | null,
  class_id: null as number | null,
})

const schools = ref<any[]>([])
const colleges = ref<any[]>([])
const majors = ref<any[]>([])
const grades = ref<any[]>([])
const classes = ref<any[]>([])

onMounted(async () => {
  try {
    const { data } = await orgApi.getSchools()
    schools.value = data
  } catch { /* offline */ }
})

async function onSchoolChange(id: number) {
  registerForm.college_id = null; registerForm.major_id = null; registerForm.grade_id = null; registerForm.class_id = null
  colleges.value = []; majors.value = []; grades.value = []; classes.value = []
  if (id) { const { data } = await orgApi.getColleges(id); colleges.value = data }
}
async function onCollegeChange(id: number) {
  registerForm.major_id = null; registerForm.grade_id = null; registerForm.class_id = null
  majors.value = []; grades.value = []; classes.value = []
  if (id) { const { data } = await orgApi.getMajors(id); majors.value = data }
}
async function onMajorChange(id: number) {
  registerForm.grade_id = null; registerForm.class_id = null
  grades.value = []; classes.value = []
  if (id) { const { data } = await orgApi.getGrades(id); grades.value = data }
}
async function onGradeChange(id: number) {
  registerForm.class_id = null; classes.value = []
  if (id) { const { data } = await orgApi.getClasses(id); classes.value = data }
}

async function handleLogin() {
  if (!loginForm.username || !loginForm.password) { ElMessage.warning('请输入用户名和密码'); return }
  loading.value = true
  try {
    const { data } = await authApi.login(loginForm.username, loginForm.password)
    authStore.setToken(data.access_token)
    const { data: user } = await authApi.getMe()
    authStore.setUser(user)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e: any) {
    ElMessage.error(e.response?.data?.detail || '登录失败')
  } finally { loading.value = false }
}

async function handleRegister() {
  if (!registerForm.username || !registerForm.email || !registerForm.password) {
    ElMessage.warning('请填写必要信息'); return
  }
  loading.value = true
  try {
    await authApi.register(registerForm)
    ElMessage.success('注册成功，请登录')
    mode.value = 'login'
    loginForm.username = registerForm.username
    loginForm.password = registerForm.password
  } catch (e: any) {
    ElMessage.error(e.response?.data?.detail || '注册失败')
  } finally { loading.value = false }
}
</script>

<style lang="scss" scoped>
.auth-view {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.auth-container { width: 100%; max-width: 460px; padding: 20px; }
.auth-card {
  background: #fff; border-radius: 16px; padding: 32px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.auth-header {
  text-align: center; margin-bottom: 24px;
  h1 { font-size: 28px; margin: 0 0 8px; }
  p { color: #666; margin: 0; }
}
</style>
