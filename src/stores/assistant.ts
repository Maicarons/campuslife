import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage, Conversation, QuickAction } from '@/types'
import { generateId } from '@/utils/helpers'
import { quickActions as defaultQuickActions } from '@/mock/data'

export const useAssistantStore = defineStore('assistant', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isGenerating = ref(false)
  const quickActions = ref<QuickAction[]>(defaultQuickActions)

  const currentConversation = computed(() =>
    conversations.value.find((c) => c.id === currentConversationId.value)
  )

  const currentMessages = computed(() => currentConversation.value?.messages ?? [])

  function createConversation(): string {
    const id = generateId()
    const conversation: Conversation = {
      id,
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conversation)
    currentConversationId.value = id
    return id
  }

  function switchConversation(id: string) {
    currentConversationId.value = id
  }

  function deleteConversation(id: string) {
    const index = conversations.value.findIndex((c) => c.id === id)
    if (index > -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id ?? null
      }
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim()) return

    let conversation = currentConversation.value
    if (!conversation) {
      const id = createConversation()
      conversation = conversations.value.find((c) => c.id === id)!
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      status: 'sent',
    }
    conversation.messages.push(userMessage)
    conversation.updatedAt = Date.now()

    // Update title from first message
    if (conversation.messages.length === 1) {
      conversation.title = content.trim().slice(0, 20) + (content.length > 20 ? '...' : '')
    }

    // Simulate AI response
    isGenerating.value = true
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'sending',
    }
    conversation.messages.push(assistantMessage)

    // Simulate streaming
    const response = generateMockResponse(content)
    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20 + Math.random() * 30))
      assistantMessage.content += response[i]
    }
    assistantMessage.status = 'sent'
    assistantMessage.timestamp = Date.now()
    conversation.updatedAt = Date.now()
    isGenerating.value = false
  }

  function generateMockResponse(input: string): string {
    const responses: Record<string, string> = {
      default: `你好！我是 CampusLife AI 助手，很高兴为你服务。

关于你的问题"${input.slice(0, 30)}"，我来帮你分析一下：

1. **首先**，这是一个很好的问题
2. **其次**，我建议你可以参考以下方案：
   - 方案A：直接联系相关部门
   - 方案B：查看校园信息页面
   - 方案C：在问答广场提问

3. **最后**，如果你需要更多帮助，随时可以问我！

> 💡 小提示：你可以点击左侧的快捷操作按钮，获取更精准的服务。`,
    }

    if (input.includes('课程') || input.includes('选课')) {
      return `关于课程咨询，我为你整理了以下信息：

## 📚 选课建议

**必修课**：请确保先完成培养方案中的必修课程。

**选修课推荐**：
| 课程名称 | 教师 | 评分 | 难度 |
|---------|------|------|------|
| Python数据分析 | 王教授 | ⭐4.8 | 中等 |
| 机器学习入门 | 李教授 | ⭐4.6 | 较难 |
| 前端开发实战 | 张教授 | ⭐4.9 | 简单 |

**选课时间**：请关注教务系统通知，一般在开学前两周开放。

有其他问题欢迎继续问我！ 😊`
    }

    if (input.includes('食堂') || input.includes('吃')) {
      return `## 🍜 今日食堂推荐

**第一食堂**：
- 🌟 招牌红烧肉 — 人气最高，建议11:30前去
- 🥗 轻食沙拉窗口 — 健康减脂首选
- 🍜 兰州拉面 — 汤头鲜美

**第二食堂**：
- 🍛 黄焖鸡米饭 — 性价比之王
- 🥘 麻辣香锅 — 自选食材，味道一绝
- 🍜 粥品窗口 — 晚餐养生选择

**温馨提示**：食堂午餐高峰在12:00-12:30，建议错峰就餐。

祝你用餐愉快！🍽️`
    }

    return responses.default
  }

  function clearCurrentConversation() {
    if (currentConversation.value) {
      currentConversation.value.messages = []
      currentConversation.value.title = '新对话'
      currentConversation.value.updatedAt = Date.now()
    }
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    currentMessages,
    isGenerating,
    quickActions,
    createConversation,
    switchConversation,
    deleteConversation,
    sendMessage,
    clearCurrentConversation,
  }
})
