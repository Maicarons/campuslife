import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { financeApi } from '@/api'

export interface Transaction {
  id: number
  user_id: number
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string | null
  created_at: string
}

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)

  const totalIncome = computed(() =>
    transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  )
  const totalExpense = computed(() =>
    transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  )
  const balance = computed(() => totalIncome.value - totalExpense.value)

  const categorySummary = computed(() => {
    const map: Record<string, number> = {}
    transactions.value.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map).map(([category, amount]) => ({ category, amount }))
  })

  async function fetchTransactions() {
    loading.value = true
    try {
      const { data } = await financeApi.getTransactions()
      transactions.value = data
    } catch { /* fallback */ } finally { loading.value = false }
  }

  async function addTransaction(t: Partial<Transaction>) {
    const { data } = await financeApi.createTransaction(t)
    transactions.value.unshift(data)
    return data
  }

  async function removeTransaction(id: number) {
    await financeApi.deleteTransaction(id)
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  return {
    transactions, loading, totalIncome, totalExpense, balance, categorySummary,
    fetchTransactions, addTransaction, removeTransaction,
  }
})
