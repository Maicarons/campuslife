<template>
  <div class="social-view">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 论坛 -->
      <el-tab-pane label="论坛广场" name="forum">
        <div class="section-header">
          <h3>论坛帖子</h3>
          <el-button type="primary" @click="showPostDialog = true">发帖</el-button>
        </div>
        <div class="post-list">
          <el-card v-for="post in socialStore.posts" :key="post.id" shadow="hover" class="post-card" @click="viewPost(post.id)">
            <div class="post-header">
              <el-tag size="small" type="info">{{ post.category }}</el-tag>
              <span class="post-time">{{ formatDate(post.created_at) }}</span>
            </div>
            <h4>{{ post.title }}</h4>
            <p class="post-preview">{{ post.content.slice(0, 120) }}...</p>
            <div class="post-footer">
              <span><el-icon><View /></el-icon> {{ post.views }}</span>
              <span><el-icon><ChatDotRound /></el-icon> {{ post.comment_count }}</span>
              <span><el-icon><Star /></el-icon> {{ post.likes }}</span>
            </div>
          </el-card>
          <el-empty v-if="!socialStore.posts.length" description="暂无帖子" />
        </div>
      </el-tab-pane>

      <!-- 社团 -->
      <el-tab-pane label="社团管理" name="clubs">
        <div class="section-header">
          <h3>校园社团</h3>
          <el-input v-model="clubSearch" placeholder="搜索社团..." style="width: 200px" clearable />
        </div>
        <div class="club-grid">
          <el-card v-for="club in filteredClubs" :key="club.id" shadow="hover" class="club-card">
            <div class="club-header">
              <el-avatar :size="48" :style="{ backgroundColor: getClubColor(club.category) }">
                {{ club.name[0] }}
              </el-avatar>
              <div class="club-info">
                <h4>{{ club.name }}</h4>
                <el-tag size="small">{{ club.category }}</el-tag>
              </div>
            </div>
            <p class="club-desc">{{ club.description }}</p>
            <div class="club-meta">
              <span><el-icon><User /></el-icon> {{ club.memberCount }}人</span>
              <span>社长: {{ club.president }}</span>
            </div>
            <div class="club-tags">
              <el-tag v-for="tag in club.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
            </div>
            <div class="club-actions">
              <el-button :type="club.isJoined ? 'default' : 'primary'" size="small" @click="toggleJoinClub(club)">
                {{ club.isJoined ? '已加入' : '加入社团' }}
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 通讯录 -->
      <el-tab-pane label="通讯录" name="contacts">
        <div class="section-header">
          <h3>我的联系人</h3>
          <div class="contact-filters">
            <el-select v-model="contactGroup" placeholder="全部分组" clearable style="width: 120px">
              <el-option v-for="g in contactGroups" :key="g" :label="g" :value="g" />
            </el-select>
            <el-input v-model="contactSearch" placeholder="搜索联系人..." style="width: 200px" clearable />
          </div>
        </div>
        <div class="contact-list">
          <div v-for="contact in filteredContacts" :key="contact.id" class="contact-item">
            <div class="contact-avatar">
              <el-avatar :size="40">{{ contact.name[0] }}</el-avatar>
              <span v-if="contact.isOnline" class="online-dot" />
            </div>
            <div class="contact-info">
              <div class="contact-name">{{ contact.name }}</div>
              <div class="contact-detail">{{ contact.department }} · {{ contact.grade }}</div>
            </div>
            <div class="contact-extra">
              <el-tag size="small" type="info">{{ contact.group }}</el-tag>
              <span class="contact-status" :class="{ online: contact.isOnline }">
                {{ contact.isOnline ? '在线' : '离线' }}
              </span>
            </div>
            <div class="contact-actions">
              <el-button size="small" circle><el-icon><ChatDotRound /></el-icon></el-button>
              <el-button size="small" circle><el-icon><Phone /></el-icon></el-button>
            </div>
          </div>
          <el-empty v-if="filteredContacts.length === 0" description="暂无联系人" />
        </div>
      </el-tab-pane>

      <!-- 消息 -->
      <el-tab-pane label="消息" name="messages">
        <div class="message-layout">
          <div class="conversation-list">
            <div class="section-header">
              <h3>会话</h3>
            </div>
            <div v-for="conv in chatConversations" :key="conv.id" class="conv-item" :class="{ active: activeConv === conv.id }" @click="selectConversation(conv.id)">
              <el-avatar :size="40">{{ conv.name[0] }}</el-avatar>
              <div class="conv-info">
                <div class="conv-name">{{ conv.name }}</div>
                <div class="conv-last">{{ conv.lastMessage }}</div>
              </div>
              <div class="conv-meta">
                <span class="conv-time">{{ formatTime(conv.lastTime) }}</span>
                <el-badge v-if="conv.unreadCount" :value="conv.unreadCount" class="conv-badge" />
              </div>
            </div>
          </div>
          <div class="chat-area">
            <template v-if="activeConv">
              <div class="chat-header">
                <h4>{{ activeConvData?.name }}</h4>
                <span v-if="activeConvData?.isGroup" class="chat-members">{{ activeConvData.members?.length }}人</span>
              </div>
              <div class="chat-messages">
                <div v-for="msg in currentMessages" :key="msg.id" class="chat-msg" :class="{ own: msg.isOwn }">
                  <div class="msg-bubble">
                    <span v-if="!msg.isOwn && activeConvData?.isGroup" class="msg-sender">{{ msg.senderName }}</span>
                    <p>{{ msg.content }}</p>
                    <span class="msg-time">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                </div>
              </div>
              <div class="chat-input">
                <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage">
                  <template #append>
                    <el-button @click="sendMessage">发送</el-button>
                  </template>
                </el-input>
              </div>
            </template>
            <el-empty v-else description="选择一个会话开始聊天" />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Post Detail Dialog -->
    <el-dialog v-model="showDetailDialog" :title="socialStore.currentPost?.title || ''" width="600" top="5vh">
      <div v-if="socialStore.currentPost" class="post-detail">
        <p>{{ socialStore.currentPost.content }}</p>
        <el-divider />
        <h4>评论 ({{ socialStore.comments.length }})</h4>
        <div v-for="c in socialStore.comments" :key="c.id" class="comment-item">
          <p>{{ c.content }}</p>
          <span class="comment-time">{{ formatDate(c.created_at) }}</span>
        </div>
        <el-input v-model="commentText" placeholder="写评论..." @keyup.enter="submitComment">
          <template #append>
            <el-button @click="submitComment">发送</el-button>
          </template>
        </el-input>
      </div>
    </el-dialog>

    <!-- New Post Dialog -->
    <el-dialog v-model="showPostDialog" title="发帖" width="500">
      <el-form :model="postForm" label-width="60px">
        <el-form-item label="标题"><el-input v-model="postForm.title" /></el-form-item>
        <el-form-item label="分类">
          <el-select v-model="postForm.category">
            <el-option label="综合" value="综合" />
            <el-option label="学习" value="学习" />
            <el-option label="生活" value="生活" />
            <el-option label="情感" value="情感" />
            <el-option label="求职" value="求职" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容"><el-input v-model="postForm.content" type="textarea" :rows="6" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPostDialog = false">取消</el-button>
        <el-button type="primary" @click="submitPost">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { View, ChatDotRound, Star, User, Phone } from '@element-plus/icons-vue'
import { useSocialStore } from '@/stores/social'
import { mockClubs, mockContacts, mockChatConversations, mockChatMessages } from '@/mock/data'

const socialStore = useSocialStore()
const activeTab = ref('forum')
const showPostDialog = ref(false)
const showDetailDialog = ref(false)
const commentText = ref('')
const currentPostId = ref(0)
const postForm = reactive({ title: '', content: '', category: '综合' })

// Club
const clubSearch = ref('')
const clubs = ref(mockClubs)

// Contact
const contactSearch = ref('')
const contactGroup = ref('')
const contacts = ref(mockContacts)
const contactGroups = computed(() => [...new Set(contacts.value.map(c => c.group))])

// Chat
const chatConversations = ref(mockChatConversations)
const chatMessages = ref(mockChatMessages)
const activeConv = ref('')
const newMessage = ref('')

const filteredClubs = computed(() => {
  if (!clubSearch.value) return clubs.value
  const s = clubSearch.value.toLowerCase()
  return clubs.value.filter(c => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s))
})

const filteredContacts = computed(() => {
  let list = contacts.value
  if (contactGroup.value) list = list.filter(c => c.group === contactGroup.value)
  if (contactSearch.value) {
    const s = contactSearch.value.toLowerCase()
    list = list.filter(c => c.name.toLowerCase().includes(s) || c.department.toLowerCase().includes(s))
  }
  return list
})

const activeConvData = computed(() => chatConversations.value.find(c => c.id === activeConv.value))
const currentMessages = computed(() => chatMessages.value.filter(m => m.conversationId === activeConv.value))

onMounted(() => { socialStore.fetchPosts() })

function formatDate(d: string) { return d ? new Date(d).toLocaleString('zh-CN') : '' }
function formatTime(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return new Date(ts).toLocaleDateString('zh-CN')
}

function getClubColor(category: string) {
  const colors: Record<string, string> = { '学术科技': '#409eff', '文化艺术': '#e6a23c', '体育运动': '#67c23a', '公益服务': '#f56c6c' }
  return colors[category] || '#909399'
}

function toggleJoinClub(club: any) { club.isJoined = !club.isJoined }

async function viewPost(id: number) {
  currentPostId.value = id
  await socialStore.fetchPost(id)
  await socialStore.fetchComments(id)
  showDetailDialog.value = true
}

async function submitPost() {
  await socialStore.createPost({ ...postForm })
  showPostDialog.value = false
  Object.assign(postForm, { title: '', content: '', category: '综合' })
}

async function submitComment() {
  if (!commentText.value.trim()) return
  await socialStore.createComment(currentPostId.value, commentText.value)
  commentText.value = ''
}

function selectConversation(id: string) {
  activeConv.value = id
  const conv = chatConversations.value.find(c => c.id === id)
  if (conv) conv.unreadCount = 0
}

function sendMessage() {
  if (!newMessage.value.trim() || !activeConv.value) return
  chatMessages.value.push({
    id: `m${Date.now()}`,
    conversationId: activeConv.value,
    senderId: 'me',
    senderName: '我',
    content: newMessage.value,
    type: 'text',
    timestamp: Date.now(),
    isOwn: true,
  })
  newMessage.value = ''
}
</script>

<style lang="scss" scoped>
.social-view {
  .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    h3 { margin: 0; }
  }
  .contact-filters { display: flex; gap: 8px; }
  .post-list { display: grid; gap: 16px; }
  .post-card { cursor: pointer;
    .post-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .post-time { font-size: 12px; color: var(--el-text-color-secondary); }
    h4 { margin: 0 0 8px; }
    .post-preview { color: var(--el-text-color-secondary); font-size: 13px; margin: 0 0 8px; }
    .post-footer { display: flex; gap: 16px; font-size: 13px; color: var(--el-text-color-secondary);
      span { display: flex; align-items: center; gap: 4px; }
    }
  }
  .post-detail {
    p { line-height: 1.6; }
    .comment-item { padding: 8px 0; border-bottom: 1px solid var(--el-border-color-lighter);
      p { margin: 0 0 4px; }
      .comment-time { font-size: 12px; color: var(--el-text-color-secondary); }
    }
    .el-input { margin-top: 12px; }
  }
  .club-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
  .club-card {
    .club-header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px;
      .club-info { flex: 1;
        h4 { margin: 0 0 4px; font-size: 15px; }
      }
    }
    .club-desc { font-size: 13px; color: var(--el-text-color-secondary); margin: 0 0 12px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .club-meta { display: flex; gap: 16px; font-size: 12px; color: var(--el-text-color-secondary); margin-bottom: 8px;
      span { display: flex; align-items: center; gap: 4px; }
    }
    .club-tags { display: flex; gap: 4px; margin-bottom: 12px; }
    .club-actions { text-align: right; }
  }
  .contact-list { display: flex; flex-direction: column; gap: 8px; }
  .contact-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--el-fill-color-lighter); border-radius: 8px;
    .contact-avatar { position: relative;
      .online-dot { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #67c23a; border-radius: 50%; border: 2px solid #fff; }
    }
    .contact-info { flex: 1;
      .contact-name { font-weight: 500; }
      .contact-detail { font-size: 12px; color: var(--el-text-color-secondary); }
    }
    .contact-extra { display: flex; align-items: center; gap: 8px;
      .contact-status { font-size: 12px; color: var(--el-text-color-secondary);
        &.online { color: #67c23a; }
      }
    }
    .contact-actions { display: flex; gap: 4px; }
  }
  .message-layout { display: flex; height: 500px; border: 1px solid var(--el-border-color-lighter); border-radius: 8px; overflow: hidden; }
  .conversation-list { width: 280px; border-right: 1px solid var(--el-border-color-lighter); overflow-y: auto;
    .section-header { padding: 12px 16px; border-bottom: 1px solid var(--el-border-color-lighter); }
  }
  .conv-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer;
    &:hover { background: var(--el-fill-color-light); }
    &.active { background: var(--el-fill-color); }
    .conv-info { flex: 1; min-width: 0;
      .conv-name { font-weight: 500; font-size: 14px; }
      .conv-last { font-size: 12px; color: var(--el-text-color-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
    .conv-meta { text-align: right;
      .conv-time { font-size: 11px; color: var(--el-text-color-secondary); display: block; }
    }
  }
  .chat-area { flex: 1; display: flex; flex-direction: column;
    .chat-header { padding: 12px 16px; border-bottom: 1px solid var(--el-border-color-lighter); display: flex; align-items: center; gap: 8px;
      h4 { margin: 0; }
      .chat-members { font-size: 12px; color: var(--el-text-color-secondary); }
    }
    .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
    .chat-msg { display: flex;
      &.own { justify-content: flex-end;
        .msg-bubble { background: var(--el-color-primary); color: #fff; }
      }
      .msg-bubble { max-width: 70%; padding: 8px 12px; border-radius: 12px; background: var(--el-fill-color-lighter);
        .msg-sender { font-size: 11px; color: var(--el-color-primary); display: block; margin-bottom: 2px; }
        p { margin: 0; font-size: 14px; line-height: 1.5; }
        .msg-time { font-size: 10px; color: var(--el-text-color-secondary); display: block; margin-top: 4px; }
      }
    }
    .chat-input { padding: 12px 16px; border-top: 1px solid var(--el-border-color-lighter); }
  }
}
</style>
