<template>
  <div class="assistant-view">
    <div class="chat-container">
      <!-- Conversation List -->
      <div class="conversation-panel">
        <div class="panel-header">
          <span class="panel-title">对话列表</span>
          <el-button type="primary" text size="small" @click="store.createConversation()">
            <el-icon><Plus /></el-icon>
            新建
          </el-button>
        </div>
        <div class="conversation-list">
          <div
            v-for="conv in store.conversations"
            :key="conv.id"
            class="conv-item"
            :class="{ active: conv.id === store.currentConversationId }"
            @click="store.switchConversation(conv.id)"
          >
            <el-icon class="conv-icon"><ChatDotRound /></el-icon>
            <span class="conv-title text-ellipsis">{{ conv.title }}</span>
            <el-button
              type="danger"
              text
              size="small"
              class="conv-delete"
              @click.stop="store.deleteConversation(conv.id)"
            >
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
          <el-empty v-if="store.conversations.length === 0" description="暂无对话" :image-size="60" />
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-panel">
        <div v-if="!store.currentConversation" class="welcome-screen">
          <div class="welcome-content">
            <div class="welcome-icon">
              <el-icon :size="48"><ChatDotRound /></el-icon>
            </div>
            <h2 class="welcome-title">CampusLife AI 助手</h2>
            <p class="welcome-desc">有任何校园生活问题，都可以问我！</p>

            <div class="quick-actions">
              <div
                v-for="action in store.quickActions"
                :key="action.id"
                class="quick-card"
                @click="handleQuickAction(action)"
              >
                <el-icon :size="24" class="quick-icon"><component :is="action.icon" /></el-icon>
                <span class="quick-label">{{ action.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <div class="messages-area" ref="messagesRef">
            <div
              v-for="msg in store.currentMessages"
              :key="msg.id"
              class="message-row"
              :class="msg.role"
            >
              <div class="message-avatar">
                <el-avatar :size="32" v-if="msg.role === 'assistant'">
                  <el-icon><ChatDotRound /></el-icon>
                </el-avatar>
                <el-avatar :size="32" v-else>
                  <el-icon><User /></el-icon>
                </el-avatar>
              </div>
              <div class="message-bubble">
                <div class="message-content" v-html="renderMarkdown(msg.content)" />
                <span class="message-time">{{ formatRelativeTime(msg.timestamp) }}</span>
              </div>
            </div>
            <div v-if="store.isGenerating" class="message-row assistant">
              <div class="message-avatar">
                <el-avatar :size="32">
                  <el-icon><ChatDotRound /></el-icon>
                </el-avatar>
              </div>
              <div class="message-bubble typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>

          <div class="input-area">
            <el-input
              v-model="inputText"
              type="textarea"
              :rows="2"
              placeholder="输入你的问题... (Enter 发送，Shift+Enter 换行)"
              resize="none"
              @keydown="handleKeydown"
              :disabled="store.isGenerating"
            />
            <div class="input-actions">
              <el-button @click="store.clearCurrentConversation" text size="small">清空对话</el-button>
              <el-button type="primary" @click="sendMessage" :disabled="!inputText.trim() || store.isGenerating">
                <el-icon><Promotion /></el-icon>
                发送
              </el-button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import { useAssistantStore } from '@/stores/assistant'
import { formatRelativeTime } from '@/utils/helpers'
import type { QuickAction } from '@/types'

const store = useAssistantStore()
const inputText = ref('')
const messagesRef = ref<HTMLElement>()

const md = new MarkdownIt({ html: false, linkify: true })

function renderMarkdown(content: string): string {
  return md.render(content)
}

function handleKeydown(e: Event) {
  const ke = e as KeyboardEvent
  if (ke.key === 'Enter' && !ke.shiftKey) {
    ke.preventDefault()
    sendMessage()
  }
}

async function sendMessage() {
  if (!inputText.value.trim() || store.isGenerating) return
  const text = inputText.value
  inputText.value = ''
  await store.sendMessage(text)
  await nextTick()
  scrollToBottom()
}

function handleQuickAction(action: QuickAction) {
  if (!store.currentConversation) {
    store.createConversation()
  }
  inputText.value = action.prompt
  sendMessage()
}

function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

watch(() => store.currentMessages.length, () => {
  nextTick(scrollToBottom)
})
</script>

<style lang="scss" scoped>
.assistant-view {
  height: calc(100vh - 56px - 48px);
}

.chat-container {
  display: flex;
  height: 100%;
  background: var(--el-bg-card, #fff);
  border-radius: $radius-xl;
  overflow: hidden;
  border: 1px solid var(--el-border-color-lighter, #e8e8e8);
}

.conversation-panel {
  width: 240px;
  border-right: 1px solid var(--el-border-color-lighter, #e8e8e8);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border-bottom: 1px solid var(--el-border-color-extra-light, #f0f0f0);
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-sm;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: 10px 12px;
  border-radius: $radius-md;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    background: var(--el-fill-color-light, #f5f5f5);
  }

  &.active {
    background: var(--el-color-primary-light-9, #ecf5ff);
    color: var(--el-color-primary, #409eff);
  }
}

.conv-icon {
  flex-shrink: 0;
  color: inherit;
}

.conv-title {
  flex: 1;
  font-size: 13px;
  color: inherit;
}

.conv-delete {
  opacity: 0;
  transition: opacity $transition-fast;

  .conv-item:hover & {
    opacity: 1;
  }
}

.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.welcome-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-content {
  text-align: center;
  max-width: 560px;
  padding: $spacing-xl;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  border-radius: $radius-xl;
  background: linear-gradient(135deg, #409eff, #53a8ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-lg;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: $spacing-sm;
}

.welcome-desc {
  color: var(--el-text-color-secondary, #8c8c8c);
  margin-bottom: $spacing-xl;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: $spacing-sm;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-radius: $radius-lg;
  border: 1px solid var(--el-border-color-lighter, #e8e8e8);
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    border-color: var(--el-color-primary, #409eff);
    box-shadow: $shadow-sm;
    transform: translateY(-2px);
  }
}

.quick-icon {
  color: var(--el-color-primary, #409eff);
}

.quick-label {
  font-size: 13px;
  font-weight: 500;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.message-row {
  display: flex;
  gap: $spacing-sm;
  max-width: 80%;

  &.user {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-bubble {
      background: var(--el-color-primary, #409eff);
      color: white;
    }

    .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &.assistant {
    align-self: flex-start;
  }
}

.message-bubble {
  background: var(--el-fill-color-light, #f5f5f5);
  border-radius: $radius-lg;
  padding: $spacing-md;
  min-width: 60px;
}

.message-content {
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;

  :deep(p) {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: $font-family-mono;
    font-size: 13px;
  }

  :deep(pre) {
    background: rgba(0, 0, 0, 0.04);
    padding: 12px;
    border-radius: $radius-md;
    overflow-x: auto;
    margin: 8px 0;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0;

    th, td {
      border: 1px solid var(--el-border-color-lighter, #e8e8e8);
      padding: 6px 12px;
      text-align: left;
      font-size: 13px;
    }

    th {
      background: var(--el-fill-color-lighter, #fafafa);
      font-weight: 600;
    }
  }

  :deep(blockquote) {
    border-left: 3px solid var(--el-color-primary, #409eff);
    padding-left: 12px;
    color: var(--el-text-color-secondary, #8c8c8c);
    margin: 8px 0;
  }
}

.message-time {
  display: block;
  font-size: 11px;
  color: var(--el-text-color-placeholder, #c0c4cc);
  margin-top: $spacing-xs;
}

.typing {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--el-text-color-placeholder, #c0c4cc);
    animation: typing 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.input-area {
  padding: $spacing-md $spacing-lg;
  border-top: 1px solid var(--el-border-color-lighter, #e8e8e8);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: $spacing-sm;
}
</style>
