import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFinanceStore } from '@/stores/finance'

vi.mock('@/api', () => ({
  financeApi: {
    getTransactions: vi.fn().mockResolvedValue({ data: [] }),
    createTransaction: vi.fn().mockResolvedValue({
      data: { id: 1, user_id: 1, type: 'expense', amount: 25.5, category: '餐饮', description: '午餐', date: null, created_at: '2026-01-01' },
    }),
    deleteTransaction: vi.fn().mockResolvedValue({}),
  },
}))

describe('Finance Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with empty transactions', () => {
    const store = useFinanceStore()
    expect(store.transactions).toEqual([])
    expect(store.totalIncome).toBe(0)
    expect(store.totalExpense).toBe(0)
    expect(store.balance).toBe(0)
  })

  it('should fetch transactions', async () => {
    const store = useFinanceStore()
    await store.fetchTransactions()
    expect(store.transactions).toEqual([])
  })

  it('should add a transaction', async () => {
    const store = useFinanceStore()
    await store.addTransaction({ type: 'expense', amount: 25.5, category: '餐饮', description: '午餐' })
    expect(store.transactions).toHaveLength(1)
    expect(store.transactions[0].amount).toBe(25.5)
  })

  it('should compute totals correctly', async () => {
    const store = useFinanceStore()
    // Add income
    store.transactions = [
      { id: 1, user_id: 1, type: 'income', amount: 1000, category: '工资', description: '', date: null, created_at: '2026-01-01' },
      { id: 2, user_id: 1, type: 'expense', amount: 50, category: '餐饮', description: '', date: null, created_at: '2026-01-01' },
      { id: 3, user_id: 1, type: 'expense', amount: 30, category: '交通', description: '', date: null, created_at: '2026-01-01' },
    ]
    expect(store.totalIncome).toBe(1000)
    expect(store.totalExpense).toBe(80)
    expect(store.balance).toBe(920)
  })

  it('should compute category summary', () => {
    const store = useFinanceStore()
    store.transactions = [
      { id: 1, user_id: 1, type: 'expense', amount: 50, category: '餐饮', description: '', date: null, created_at: '2026-01-01' },
      { id: 2, user_id: 1, type: 'expense', amount: 30, category: '餐饮', description: '', date: null, created_at: '2026-01-01' },
      { id: 3, user_id: 1, type: 'expense', amount: 20, category: '交通', description: '', date: null, created_at: '2026-01-01' },
    ]
    const summary = store.categorySummary
    expect(summary).toHaveLength(2)
    expect(summary.find(s => s.category === '餐饮')?.amount).toBe(80)
    expect(summary.find(s => s.category === '交通')?.amount).toBe(20)
  })

  it('should delete a transaction', async () => {
    const store = useFinanceStore()
    await store.addTransaction({ type: 'expense', amount: 25.5 })
    expect(store.transactions).toHaveLength(1)
    await store.removeTransaction(1)
    expect(store.transactions).toHaveLength(0)
  })
})
