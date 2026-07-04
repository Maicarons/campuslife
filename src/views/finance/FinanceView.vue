<template>
  <div class="finance-view">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 记账本 -->
      <el-tab-pane label="记账本" name="ledger">
        <div class="summary-cards">
          <el-card shadow="hover">
            <el-statistic title="总收入" :value="financeStore.totalIncome" :precision="2" prefix="¥" />
          </el-card>
          <el-card shadow="hover">
            <el-statistic title="总支出" :value="financeStore.totalExpense" :precision="2" prefix="¥" />
          </el-card>
          <el-card shadow="hover">
            <el-statistic title="结余" :value="financeStore.balance" :precision="2" prefix="¥"
              :value-style="{ color: financeStore.balance >= 0 ? '#67C23A' : '#F56C6C' }" />
          </el-card>
        </div>

        <div class="section-header">
          <h3>收支记录</h3>
          <el-button type="primary" @click="showAddDialog = true">记一笔</el-button>
        </div>

        <el-table :data="financeStore.transactions" stripe>
          <el-table-column label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="row.type === 'income' ? 'success' : 'danger'" size="small">
                {{ row.type === 'income' ? '收入' : '支出' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="100" />
          <el-table-column prop="description" label="描述" />
          <el-table-column label="金额" width="120">
            <template #default="{ row }">
              <span :style="{ color: row.type === 'income' ? '#67C23A' : '#F56C6C' }">
                {{ row.type === 'income' ? '+' : '-' }}¥{{ row.amount.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="日期" width="160">
            <template #default="{ row }">{{ formatDate(row.date || row.created_at) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{ row }">
              <el-button size="small" type="danger" text @click="financeStore.removeTransaction(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 分类统计 -->
      <el-tab-pane label="分类统计" name="stats">
        <h3>支出分类统计</h3>
        <div class="category-list">
          <div v-for="item in financeStore.categorySummary" :key="item.category" class="category-item">
            <span class="cat-name">{{ item.category }}</span>
            <el-progress :percentage="Math.min((item.amount / financeStore.totalExpense) * 100, 100)" :stroke-width="16" />
            <span class="cat-amount">¥{{ item.amount.toFixed(2) }}</span>
          </div>
        </div>
      </el-tab-pane>

      <!-- 奖学金 -->
      <el-tab-pane label="奖学金" name="scholarships">
        <el-empty description="奖学金信息加载中..." />
      </el-tab-pane>

      <!-- 兼职 -->
      <el-tab-pane label="兼职信息" name="jobs">
        <el-empty description="兼职信息加载中..." />
      </el-tab-pane>
    </el-tabs>

    <!-- Add Transaction Dialog -->
    <el-dialog v-model="showAddDialog" title="记一笔" width="400">
      <el-form :model="form" label-width="60px">
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio value="expense">支出</el-radio>
            <el-radio value="income">收入</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额"><el-input-number v-model="form.amount" :min="0.01" :precision="2" style="width:100%" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width:100%">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" placeholder="午餐/交通/..." /></el-form-item>
        <el-form-item label="日期"><el-date-picker v-model="form.date" type="date" style="width:100%" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addTransaction">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()
const activeTab = ref('ledger')
const showAddDialog = ref(false)
const categories = ['餐饮', '交通', '娱乐', '学习', '购物', '社交', '医疗', '其他']
const form = reactive({ type: 'expense' as 'income' | 'expense', amount: 0, category: '餐饮', description: '', date: null as any })

onMounted(() => { financeStore.fetchTransactions() })

function formatDate(d: string) { return d ? new Date(d).toLocaleDateString('zh-CN') : '' }

async function addTransaction() {
  await financeStore.addTransaction({ ...form })
  showAddDialog.value = false
  Object.assign(form, { type: 'expense', amount: 0, category: '餐饮', description: '', date: null })
}
</script>

<style lang="scss" scoped>
.finance-view {
  .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; h3 { margin: 0; } }
  .category-list { max-width: 600px; }
  .category-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
    .cat-name { min-width: 60px; font-weight: 500; }
    .cat-amount { min-width: 80px; text-align: right; color: var(--el-color-danger); }
    .el-progress { flex: 1; }
  }
}
</style>
