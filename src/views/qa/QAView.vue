<template>
  <div class="qa-view">
    <!-- Stats & Ask Button -->
    <div class="qa-header">
      <div class="stats">
        <span class="stat-item">
          <span class="stat-value">{{ store.questions.length }}</span>
          <span class="stat-label">全部问题</span>
        </span>
        <span class="stat-item">
          <span class="stat-value">{{ resolvedCount }}</span>
          <span class="stat-label">已解决</span>
        </span>
      </div>
      <el-button type="primary" @click="showAskDialog = true">提问</el-button>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <el-select
        v-model="filterTags"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="筛选标签"
        clearable
        class="filter-item"
      >
        <el-option
          v-for="tag in store.allTags"
          :key="tag"
          :label="tag"
          :value="tag"
        />
      </el-select>

      <el-select v-model="sortBy" class="filter-item sort-select">
        <el-option label="最新" value="newest" />
        <el-option label="热门" value="popular" />
        <el-option label="未解决" value="unresolved" />
      </el-select>

      <el-input
        v-model="searchQuery"
        placeholder="搜索问题..."
        clearable
        class="filter-item search-input"
      />
    </div>

    <!-- Question List -->
    <div class="question-list">
      <div
        v-for="q in filteredQuestions"
        :key="q.id"
        class="question-card"
        :class="{ expanded: expandedId === q.id }"
      >
        <!-- Collapsed View -->
        <div class="question-summary" @click="toggleExpand(q.id)">
          <div class="question-main">
            <div class="question-title-row">
              <h3 class="question-title">{{ q.title }}</h3>
              <el-tag v-if="q.resolved" type="success" size="small" class="resolved-badge">
                <el-icon><Check /></el-icon> 已解决
              </el-tag>
            </div>
            <p class="question-preview">{{ truncate(q.content, 120) }}</p>
            <div class="question-tags">
              <el-tag
                v-for="tag in q.tags"
                :key="tag"
                size="small"
                type="info"
                effect="plain"
              >{{ tag }}</el-tag>
            </div>
          </div>
          <div class="question-meta">
            <span class="meta-author">{{ q.author }}</span>
            <span class="meta-item"><el-icon><ArrowUp /></el-icon> {{ q.votes }}</span>
            <span class="meta-item"><el-icon><ChatDotRound /></el-icon> {{ q.answers?.length ?? 0 }}</span>
            <span class="meta-item"><el-icon><View /></el-icon> {{ q.views }}</span>
            <span class="meta-time">{{ formatRelativeTime(q.createdAt) }}</span>
          </div>
        </div>

        <!-- Expanded Detail -->
        <div v-if="expandedId === q.id" class="question-detail">
          <div class="detail-content">{{ q.content }}</div>

          <!-- Answers -->
          <div class="answers-section">
            <h4 class="answers-title">回答 ({{ q.answers?.length ?? 0 }})</h4>
            <div
              v-for="answer in q.answers"
              :key="answer.id"
              class="answer-item"
              :class="{ accepted: answer.isAccepted }"
            >
              <div class="answer-content">{{ answer.content }}</div>
              <div class="answer-footer">
                <span class="answer-author">{{ answer.author }}</span>
                <span class="answer-time">{{ formatRelativeTime(answer.createdAt) }}</span>
                <div class="answer-actions">
                  <el-button
                    size="small"
                    :type="'default'"
                    text
                    @click="voteAnswer(q.id, answer.id, 1)"
                  >
                    <el-icon><ArrowUp /></el-icon> {{ answer.votes }}
                  </el-button>
                  <el-button
                    size="small"
                    :type="'default'"
                    text
                    @click="voteAnswer(q.id, answer.id, -1)"
                  >
                    <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <el-button
                    v-if="!q.resolved"
                    size="small"
                    type="success"
                    text
                    @click="acceptAnswer(q.id, answer.id)"
                  >
                    采纳
                  </el-button>
                  <el-tag v-if="answer.isAccepted" type="success" size="small">已采纳</el-tag>
                </div>
              </div>
            </div>

            <!-- Vote on question -->
            <div class="question-vote-bar">
              <el-button
                :type="'default'"
                text
                @click="voteQuestion(q.id, 1)"
              >
                <el-icon><ArrowUp /></el-icon> {{ q.votes }}
              </el-button>
              <el-button
                :type="'default'"
                text
                @click="voteQuestion(q.id, -1)"
              >
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>

            <!-- Answer Input -->
            <div class="answer-form">
              <el-input
                v-model="answerTexts[q.id]"
                type="textarea"
                :rows="3"
                placeholder="写下你的回答..."
              />
              <el-button
                type="primary"
                class="submit-answer-btn"
                :disabled="!answerTexts[q.id]?.trim()"
                @click="submitAnswer(q.id)"
              >
                提交回答
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-if="filteredQuestions.length === 0" description="暂无问题" />
    </div>

    <!-- Ask Dialog -->
    <el-dialog v-model="showAskDialog" title="提问" width="560px" destroy-on-close>
      <el-form :model="askForm" label-position="top">
        <el-form-item label="标题" required>
          <el-input v-model="askForm.title" placeholder="简明扼要地描述你的问题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input
            v-model="askForm.content"
            type="textarea"
            :rows="6"
            placeholder="详细描述你的问题..."
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="askForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="选择或创建标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in store.allTags"
              :key="tag"
              :label="tag"
              :value="tag"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAskDialog = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!askForm.title.trim() || !askForm.content.trim()"
          @click="submitQuestion"
        >
          发布
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Check, ArrowUp, ArrowDown, ChatDotRound, View } from '@element-plus/icons-vue'
import { useQAStore } from '@/stores/qa'
import { formatRelativeTime } from '@/utils/helpers'

const store = useQAStore()

// --- Filter state ---
const filterTags = ref<string[]>([])
const sortBy = ref<'newest' | 'popular' | 'unresolved'>('newest')
const searchQuery = ref('')

// --- Expanded question ---
const expandedId = ref<string | null>(null)

// --- Ask dialog ---
const showAskDialog = ref(false)
const askForm = reactive({ title: '', content: '', tags: [] as string[] })

// --- Answer inputs keyed by question id ---
const answerTexts = reactive<Record<string, string>>({})

// --- Computed ---
const resolvedCount = computed(() => store.questions.filter(q => q.resolved).length)

const filteredQuestions = computed(() => {
  let list = [...store.questions]

  if (filterTags.value.length > 0) {
    list = list.filter(q => filterTags.value.some(t => q.tags.includes(t)))
  }

  if (searchQuery.value.trim()) {
    const kw = searchQuery.value.trim().toLowerCase()
    list = list.filter(
      q => q.title.toLowerCase().includes(kw) || q.content.toLowerCase().includes(kw)
    )
  }

  switch (sortBy.value) {
    case 'newest':
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    case 'popular':
      list.sort((a, b) => b.votes - a.votes)
      break
    case 'unresolved':
      list = list.filter(q => !q.resolved)
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return list
})

// --- Methods ---
function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + '...' : text
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function submitQuestion() {
  store.addQuestion({
    title: askForm.title.trim(),
    content: askForm.content.trim(),
    tags: [...askForm.tags],
  })
  askForm.title = ''
  askForm.content = ''
  askForm.tags = []
  showAskDialog.value = false
}

function submitAnswer(questionId: string) {
  const text = answerTexts[questionId]?.trim()
  if (!text) return
  store.addAnswer(questionId, { content: text })
  answerTexts[questionId] = ''
}

function voteQuestion(questionId: string, value: 1 | -1) {
  store.voteQuestion(questionId, value)
}

function voteAnswer(questionId: string, answerId: string, value: 1 | -1) {
  store.voteAnswer(questionId, answerId, value)
}

function acceptAnswer(questionId: string, answerId: string) {
  store.acceptAnswer(questionId, answerId)
}
</script>

<style lang="scss" scoped>
.qa-view {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
}

.qa-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .stats {
    display: flex;
    gap: 24px;

    .stat-item {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: 24px;
        font-weight: 700;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  .filter-item {
    min-width: 0;
  }

  .sort-select {
    width: 120px;
  }

  .search-input {
    flex: 1;
    min-width: 180px;
  }
}

.question-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  }

  &.expanded {
    border-color: var(--el-color-primary-light-5);
  }
}

.question-summary {
  padding: 16px;
  cursor: pointer;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.question-main {
  flex: 1;
  min-width: 0;
}

.question-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;

  .question-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    line-height: 1.4;
  }

  .resolved-badge {
    flex-shrink: 0;
  }
}

.question-preview {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin: 0 0 8px;
  line-height: 1.5;
}

.question-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.question-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);

  .meta-author {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  .meta-time {
    font-size: 12px;
  }
}

.question-detail {
  border-top: 1px solid var(--el-border-color-lighter);
  padding: 16px;

  .detail-content {
    font-size: 14px;
    line-height: 1.7;
    color: var(--el-text-color-primary);
    margin-bottom: 20px;
    white-space: pre-wrap;
  }
}

.answers-section {
  .answers-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 12px;
  }
}

.answer-item {
  padding: 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  margin-bottom: 10px;

  &.accepted {
    border-color: var(--el-color-success-light-5);
    background: var(--el-color-success-light-9);
  }

  .answer-content {
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    margin-bottom: 8px;
  }

  .answer-footer {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    .answer-author {
      font-size: 13px;
      font-weight: 500;
    }

    .answer-time {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .answer-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.question-vote-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 12px 0;
  padding: 8px 0;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.answer-form {
  margin-top: 16px;

  .submit-answer-btn {
    margin-top: 8px;
  }
}
</style>
