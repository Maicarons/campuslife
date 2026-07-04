<template>
  <div class="marketplace-view">
    <!-- Stats -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ store.filteredProducts.length }}</span>
        <span class="stat-label">在售商品</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ avgPrice }}</span>
        <span class="stat-label">平均价格</span>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <el-select
        v-model="store.filterCategory"
        placeholder="全部分类"
        clearable
        size="default"
        class="filter-item"
      >
        <el-option
          v-for="cat in store.categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>

      <el-select
        v-model="store.filterCondition"
        placeholder="全部成色"
        clearable
        size="default"
        class="filter-item"
      >
        <el-option
          v-for="opt in conditionOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>

      <el-select
        v-model="store.sortMode"
        size="default"
        class="filter-item"
      >
        <el-option label="最新发布" value="latest" />
        <el-option label="价格升序" value="price-asc" />
        <el-option label="价格降序" value="price-desc" />
      </el-select>

      <el-input
        v-model="store.searchQuery"
        placeholder="搜索商品..."
        clearable
        size="default"
        class="filter-search"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>

      <div class="filter-actions">
        <el-button-group>
          <el-button
            :type="store.viewMode === 'grid' ? 'primary' : 'default'"
            @click="store.viewMode = 'grid'"
          >
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button
            :type="store.viewMode === 'list' ? 'primary' : 'default'"
            @click="store.viewMode = 'list'"
          >
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>

        <el-button type="primary" @click="showPublishDialog = true">
          <el-icon><Plus /></el-icon>
          发布商品
        </el-button>
      </div>
    </div>

    <!-- Grid View -->
    <div v-if="store.viewMode === 'grid'" class="product-grid">
      <el-row :gutter="16">
        <el-col
          v-for="product in store.filteredProducts"
          :key="product.id"
          :xs="12"
          :sm="8"
          :md="6"
          :lg="6"
        >
          <div class="product-card" @click="openDetail(product)">
            <div class="card-image">
              <el-icon :size="32" class="image-placeholder-icon"><ShoppingBag /></el-icon>
            </div>
            <div class="card-body">
              <h3 class="card-title text-ellipsis">{{ product.title }}</h3>
              <div class="card-price">
                <span class="price-current">{{ formatPrice(product.price) }}</span>
                <span v-if="product.originalPrice" class="price-original">
                  {{ formatPrice(product.originalPrice) }}
                </span>
              </div>
              <div class="card-tags">
                <el-tag size="small" :type="conditionTagType(product.condition)">
                  {{ conditionLabel(product.condition) }}
                </el-tag>
                <el-tag size="small" type="info">{{ product.category }}</el-tag>
              </div>
              <div class="card-time">{{ formatRelativeTime(product.createdAt) }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-empty
        v-if="store.filteredProducts.length === 0"
        description="暂无商品"
        :image-size="80"
      />
    </div>

    <!-- List View -->
    <div v-else class="product-list">
      <div
        v-for="product in store.filteredProducts"
        :key="product.id"
        class="list-item"
        @click="openDetail(product)"
      >
        <div class="list-image">
          <el-icon :size="24" class="image-placeholder-icon"><ShoppingBag /></el-icon>
        </div>
        <div class="list-body">
          <div class="list-info">
            <h3 class="list-title">{{ product.title }}</h3>
            <div class="list-tags">
              <el-tag size="small" :type="conditionTagType(product.condition)">
                {{ conditionLabel(product.condition) }}
              </el-tag>
              <el-tag size="small" type="info">{{ product.category }}</el-tag>
            </div>
          </div>
          <div class="list-meta">
            <div class="list-price">
              <span class="price-current">{{ formatPrice(product.price) }}</span>
              <span v-if="product.originalPrice" class="price-original">
                {{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            <span class="list-time">{{ formatRelativeTime(product.createdAt) }}</span>
          </div>
        </div>
      </div>
      <el-empty
        v-if="store.filteredProducts.length === 0"
        description="暂无商品"
        :image-size="80"
      />
    </div>

    <!-- Detail Drawer -->
    <el-drawer
      v-model="detailVisible"
      :title="selectedProduct?.title"
      direction="rtl"
      size="400px"
    >
      <template v-if="selectedProduct">
        <div class="detail-image">
          <el-icon :size="48" class="image-placeholder-icon"><ShoppingBag /></el-icon>
        </div>
        <div class="detail-section">
          <div class="detail-price-row">
            <span class="detail-price">{{ formatPrice(selectedProduct.price) }}</span>
            <span v-if="selectedProduct.originalPrice" class="detail-original">
              {{ formatPrice(selectedProduct.originalPrice) }}
            </span>
          </div>
          <div class="detail-tags">
            <el-tag :type="conditionTagType(selectedProduct.condition)">
              {{ conditionLabel(selectedProduct.condition) }}
            </el-tag>
            <el-tag type="info">{{ selectedProduct.category }}</el-tag>
          </div>
        </div>
        <el-divider />
        <div class="detail-section">
          <h4 class="detail-label">商品描述</h4>
          <p class="detail-desc">{{ selectedProduct.description }}</p>
        </div>
        <el-divider />
        <div class="detail-section">
          <h4 class="detail-label">联系方式</h4>
          <p class="detail-contact">{{ selectedProduct.contact }}</p>
        </div>
        <div class="detail-time">
          发布于 {{ formatRelativeTime(selectedProduct.createdAt) }}
        </div>
      </template>
    </el-drawer>

    <!-- Publish Dialog -->
    <el-dialog
      v-model="showPublishDialog"
      title="发布商品"
      width="520px"
      destroy-on-close
    >
      <el-form
        ref="publishFormRef"
        :model="publishForm"
        :rules="publishRules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="商品名称" prop="title">
          <el-input v-model="publishForm.title" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="publishForm.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述商品信息"
          />
        </el-form-item>
        <el-form-item label="出售价格" prop="price">
          <el-input-number
            v-model="publishForm.price"
            :min="0"
            :precision="2"
            :step="10"
            controls-position="right"
            placeholder="¥"
          />
        </el-form-item>
        <el-form-item label="原价">
          <el-input-number
            v-model="publishForm.originalPrice"
            :min="0"
            :precision="2"
            :step="10"
            controls-position="right"
            placeholder="¥（选填）"
          />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="publishForm.category" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="cat in publishCategories"
              :key="cat"
              :label="cat"
              :value="cat"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成色" prop="condition">
          <el-select v-model="publishForm.condition" placeholder="请选择成色" style="width: 100%">
            <el-option
              v-for="opt in conditionOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="publishForm.contact" placeholder="微信号/QQ/手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useMarketplaceStore } from '@/stores/marketplace'
import { formatRelativeTime, formatPrice } from '@/utils/helpers'
import type { Product, ProductCondition } from '@/types'

const store = useMarketplaceStore()

// --- Stats ---
const avgPrice = computed(() => {
  const items = store.filteredProducts
  if (items.length === 0) return '¥0.00'
  const avg = items.reduce((sum, p) => sum + p.price, 0) / items.length
  return formatPrice(avg)
})

// --- Condition helpers ---
const conditionOptions: { label: string; value: ProductCondition }[] = [
  { label: '全新', value: 'new' },
  { label: '几乎全新', value: 'like-new' },
  { label: '良好', value: 'good' },
  { label: '一般', value: 'fair' },
]

function conditionLabel(cond: ProductCondition): string {
  return conditionOptions.find((o) => o.value === cond)?.label ?? cond
}

function conditionTagType(cond: ProductCondition): 'primary' | 'success' | 'warning' | 'info' {
  const map: Record<ProductCondition, 'primary' | 'success' | 'warning' | 'info'> = {
    'new': 'success',
    'like-new': 'primary',
    'good': 'warning',
    'fair': 'info',
  }
  return map[cond] ?? 'info'
}

// --- Detail drawer ---
const detailVisible = ref(false)
const selectedProduct = ref<Product | null>(null)

function openDetail(product: Product) {
  selectedProduct.value = product
  detailVisible.value = true
}

// --- Publish dialog ---
const publishCategories = ['电子产品', '书籍教材', '服饰鞋帽', '生活用品', '乐器', '运动户外', '美妆护肤', '其他']

const showPublishDialog = ref(false)
const publishFormRef = ref<FormInstance>()
const publishForm = reactive({
  title: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  category: '',
  condition: '' as ProductCondition | '',
  contact: '',
})

const publishRules: FormRules = {
  title: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  price: [{ required: true, message: '请输入出售价格', trigger: 'blur' }],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
}

function resetForm() {
  publishForm.title = ''
  publishForm.description = ''
  publishForm.price = 0
  publishForm.originalPrice = undefined
  publishForm.category = ''
  publishForm.condition = ''
  publishForm.contact = ''
}

async function handlePublish() {
  if (!publishFormRef.value) return
  const valid = await publishFormRef.value.validate().catch(() => false)
  if (!valid) return

  store.addProduct({
    title: publishForm.title,
    description: publishForm.description,
    price: publishForm.price,
    originalPrice: publishForm.originalPrice,
    category: publishForm.category,
    condition: publishForm.condition as ProductCondition,
    status: 'available',
    images: [],
    contact: publishForm.contact,
    userId: 'current-user',
  })

  ElMessage.success('商品发布成功')
  showPublishDialog.value = false
  resetForm()
}
</script>

<style lang="scss" scoped>
.marketplace-view {
  padding: $spacing-lg;
}

// Stats
.stats-bar {
  display: flex;
  gap: $spacing-lg;
  margin-bottom: $spacing-lg;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: $color-text-primary;
}

.stat-label {
  font-size: 13px;
  color: $color-text-secondary;
}

// Filter bar
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;
}

.filter-item {
  width: 140px;
}

.filter-search {
  flex: 1;
  min-width: 180px;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  margin-left: auto;
}

// Grid view
.product-grid {
  .el-col {
    margin-bottom: $spacing-md;
  }
}

.product-card {
  background: $color-bg-card;
  border: 1px solid $color-border-lighter;
  border-radius: $radius-lg;
  overflow: hidden;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    box-shadow: $shadow-md;
    transform: translateY(-2px);
  }
}

.card-image {
  height: 160px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder-icon {
  color: #b0c4e8;
}

.card-body {
  padding: $spacing-md;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
}

.card-price {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.price-current {
  font-size: 20px;
  font-weight: 700;
  color: #f5222d;
}

.price-original {
  font-size: 13px;
  color: $color-text-placeholder;
  text-decoration: line-through;
}

.card-tags {
  display: flex;
  gap: $spacing-xs;
  margin-bottom: $spacing-sm;
}

.card-time {
  font-size: 12px;
  color: $color-text-placeholder;
}

// List view
.product-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.list-item {
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md;
  background: $color-bg-card;
  border: 1px solid $color-border-lighter;
  border-radius: $radius-lg;
  cursor: pointer;
  transition: all $transition-fast;

  &:hover {
    box-shadow: $shadow-sm;
  }
}

.list-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-body {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 0;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: $spacing-xs;
}

.list-tags {
  display: flex;
  gap: $spacing-xs;
}

.list-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: $spacing-xs;
  flex-shrink: 0;
  margin-left: $spacing-md;
}

.list-price {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
}

.list-time {
  font-size: 12px;
  color: $color-text-placeholder;
}

// Detail drawer
.detail-image {
  height: 200px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecf8 100%);
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-lg;
}

.detail-section {
  margin-bottom: $spacing-md;
}

.detail-price-row {
  display: flex;
  align-items: baseline;
  gap: $spacing-sm;
  margin-bottom: $spacing-sm;
}

.detail-price {
  font-size: 28px;
  font-weight: 700;
  color: #f5222d;
}

.detail-original {
  font-size: 14px;
  color: $color-text-placeholder;
  text-decoration: line-through;
}

.detail-tags {
  display: flex;
  gap: $spacing-sm;
}

.detail-label {
  font-size: 14px;
  font-weight: 600;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
}

.detail-desc {
  font-size: 14px;
  color: $color-text-regular;
  line-height: 1.7;
}

.detail-contact {
  font-size: 14px;
  color: $color-text-primary;
  font-weight: 500;
}

.detail-time {
  margin-top: $spacing-lg;
  font-size: 12px;
  color: $color-text-placeholder;
}

// Responsive
@media (max-width: 768px) {
  .marketplace-view {
    padding: $spacing-md;
  }

  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-item {
    width: 100%;
  }

  .filter-search {
    min-width: unset;
  }

  .filter-actions {
    margin-left: 0;
    justify-content: space-between;
  }

  .stats-bar {
    gap: $spacing-md;
  }

  .stat-value {
    font-size: 22px;
  }
}
</style>
