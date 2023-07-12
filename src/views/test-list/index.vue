<template>
  <div class="test-admin-wrap">
    <!-- search -->
    <el-card class="search-wrap">
      <el-form
        ref="search-form"
        inline
        :model="searchForm"
        label-width="100"
      >
        <el-form-item label="标题">
          <el-input
            v-model="searchForm.title"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            clearable
            placeholder="请选择状态"
          >
            <el-option
              label="全部"
              :value="0"
            />
            <el-option
              label="上架"
              :value="1"
            />
            <el-option
              label="下架"
              :value="2"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="searchLoading"
            @click="onSearch('search-form')"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- control -->
    <el-card class="control-wrap">
      <el-button
        type="primary"
        @click="onCreate"
      >
        创建
      </el-button>
      <el-button @click="onDelete">
        删除
      </el-button>
    </el-card>
    <!-- content -->
    <el-card class="content-wrap">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="testList"
        @selection-change="handleSelectionChange"
      >
        <div
          v-for="(item, index) in testListHeaders"
          :key="index"
        >
          <el-table-column
            v-if="item.type"
            :fixed="item.fixed"
            :type="item.type"
            :width="item.width"
          />
          <el-table-column
            v-else-if="item.slot"
            :label="item.title"
            :width="item.width"
          >
            <template slot-scope="scope">
              <div v-if="item.slot === 'control'">
                <el-button
                  type="text"
                  size="small"
                  @click="handleEditItem(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status === 2"
                  type="text"
                  size="small"
                  @click="handleDeleteItem(scope.row)"
                >
                  删除
                </el-button>
              </div>
              <div v-if="item.slot === 'status'">
                <el-switch 
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="2"
                  active-text="上架"
                  inactive-text="下架"
                  @change="onSwitchStatus($event, scope.row)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :prop="item.name"
            :label="item.title"
            :width="item.width"
          />
        </div>
      </el-table>
      <el-pagination
        style="margin-top: 10px"
        :current-page="page.page"
        :page-size="page.page_size"
        layout="total, prev, pager, next, jumper"
        :total="page.total"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- create/edit modal -->
    <el-dialog
      :title="dialogType === 'create' ? '新增测试' : '编辑测试'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        v-loading="detailLoading"
        :model="formData"
        label-width="100px"
      >
        <el-form-item
          label="测试标题"
          required
        >
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item
          label="测试封面图"
          required
        >
          <Upload
            :value="formData.cover"
            @input="uploadCover"
          />
        </el-form-item>
        <el-form-item
          label="测试缩略图"
          required
        >
          <Upload
            :value="formData.thumbnail"
            @input="uploadThumbnail"
          />
        </el-form-item>
        <div
          v-for="(item, index) in formData.question"
          :key="index + 'question'"
        >
          <el-form-item
            :label="'题目' + (index + 1)"
            required
          >
            <el-input
              v-model="item.topic"
              style="width: 70%"
            />
            <label style="margin-left: 10px;">
              总分
              <el-input-number
                v-model="item.score"
                :min="1"
                style="width: 20%"
              />
            </label>
          </el-form-item>
          <el-form-item
            :label="'题目' + (index + 1) + '选项'"
            required
          >
            <div
              v-for="(val, key) in item.item_list"
              :key="key + 'item'"
              style="margin-bottom: 10px;"
            >
              <el-input
                v-model="val.item"
                style="width: 70%"
              />
              <label style="margin-left: 10px;">
                分数
                <el-input-number
                  v-model="val.score"
                  :min="1"
                  style="width: 20%"
                />
              </label>
            </div>
            <i
              class="el-icon-circle-plus"
              @click="AddQuestionItem(item)"
            >添加题目{{ index + 1 }}选项</i>
          </el-form-item>
        </div>
        <div
          v-for="(item, index) in formData.result"
          :key="index + 'result'"
        >
          <el-form-item
            :label="'答案' + (index + 1)"
            required
          >
            <el-input
              v-model="item.item"
              style="width: 45%"
            />
            <label style="margin-left: 10px;">
              分数区间
              <el-input-number
                v-model="item.min_score"
                :min="1"
                style="width: 20%"
              />
              <el-input-number
                v-model="item.max_score"
                :min="1"
                style="width: 20%;margin-left: 10px;"
              />
            </label>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="AddItem(formData)"
          >
            添加题目及答案
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit('form')"
          >
            确定
          </el-button>
          <el-button @click="onCancel('form')">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { CreateRequest, ListRequest, DeleteRequest, DetailRequest, SetStateRequest, EditRequest } from '@/api/test'
import Upload from '@/components/Upload/SingleImage'

export default {
  name: 'TestList',
  components: {
    Upload
  },
  data() {
    return {
      searchForm: {
        title: '',
        status: 0,
      },
      searchLoading: false,
      testListHeaders: [
        {
          type: 'selection',
          width: 50,
          fixed: 'left'
        },
        {
          title: '测试标题',
          name: 'title',
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '创建时间',
          name: 'created_at'
        },
        {
          title: '操作',
          slot: 'control'
        },
      ],
      listLoading: false,
      testList: [],
      page: {
        page: 1,
        page_size: 10,
        total: 0
      },
      selectedData: [],
      dialogVisible: false,
      dialogType: 'create',
      formData: {
        title: '',
        cover: "",
        thumbnail: "",
        question: [
          {
            topic: '',
            score: null,
            item_list: [
              {
                item: '',
                score: null
              },
            ]
          }
        ],
        result: [
          {
            item: '',
            max_score: null,
            min_score: null
          }
        ]
      },
      detailLoading: false
    }
  },
  watch: {
    dialogVisible() {
      this.formData = {
        title: '',
        cover: '',
        thumbnail: '',
        question: [
          {
            topic: '',
            score: null,
            item_list: [
              {
                item: '',
                score: null
              },
            ]
          }
        ],
        result: [
          {
            item: '',
            max_score: null,
            min_score: null
          }
        ]
      }
    }
  },
  mounted() {
    this.listLoading = true
    this.GetListData('list')
  },
  methods: {
    // 点击搜索
    onSearch() {
      this.searchLoading = true
      this.listLoading = true
      this.GetListData('search')
    },
    // 点击创建
    onCreate() {
      this.dialogVisible = true
      this.dialogType = 'create'
    },
    // 点击删除
    onDelete() {
      const data = this.selectedData.map(v => {
        return v.sid
      })
      if (data && data.length > 0) {
        this.listLoading = true
        this.DeleteItem(data)
      } else {
        this.$message({
          type: 'warning',
          message: '请选择所要删除的项目！'
        })
      }
    },
    // 切换当前页码
    handleCurrentChange(page) {
      this.page.page = page
      this.listLoading = true
      this.GetListData('list')
    },
    // 当前选中数据
    handleSelectionChange(rows) {
      this.selectedData = rows
    },
    // 点击某项编辑
    handleEditItem(data) {
      this.dialogVisible = true
      this.dialogType = 'edit'
      this.detailLoading = true
      this.GetDetail(data)
    },
    // 点击某项删除
    handleDeleteItem(data) {
      this.$confirm('确定要删除当前选择的测试题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.DeleteItem([data.sid])
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 点击某项上下架
    onSwitchStatus(status, e) {
      this.listLoading = true
      this.SetStatus({ sid: e.sid, status })
    },
    // 关闭模态框
    handleClose() {
      this.dialogVisible = false
    },
    // 添加题目选项
    AddQuestionItem(data) {
      data.item_list.push({
        item: '',
        score: null
      })
    },
    // 添加题目及答案选项
    AddItem(data) {
      data.question.push({
        topic: '',
        score: null,
        item_list: [
          {
            item: '',
            score: null
          },
        ]
      })
      data.result.push({
        item: '',
        max_score: null,
        min_score: null
      })
    },
    // 上传封面图回调
    uploadCover(url) {
      console.log(url)
      this.formData.cover = url
    },
    // 上传缩略图回调
    uploadThumbnail(url) {
      this.formData.thumbnail = url
    },
    // 点击确认创建/修改
    onSubmit() {
      if (this.dialogType === 'create') {
        this.CreateData()
      } else {
        this.EditData()
      }
    },
    // 点击表单取消
    onCancel() {
      this.dialogVisible = false
    },
    // 获取当前列表数据
    GetListData(name) {
      let params = {
        ...this.searchForm,
        ...this.page
      }
      ListRequest(params).then(req => {
        switch (name) {
          case 'search':
            this.searchLoading = false
            this.listLoading = false
            break
          case 'list':
            this.listLoading = false
            break
        }
        const { list, total_count  } = req.data
        this.testList = list
        this.page.total = total_count
      })
    },
    // 删除当前列表数据
    DeleteItem(data) {
      DeleteRequest({ sid: data }).then(() => {
        this.$message({
          message: '删除当前数据成功！',
          type: 'success'
        });
        this.GetListData('list')
      })
    },
    // 创建新的数据
    CreateData() {
      console.log(this.formData)
      CreateRequest(this.formData).then(() => {
        this.$message({
          message: '创建数据成功！',
          type: 'success'
        });
        this.handleClose()
        this.GetListData('list')
      })
    },
    // 修改当前数据
    EditData() {
      EditRequest(this.formData).then(() => {
        this.$message({
          message: '修改数据成功！',
          type: 'success'
        });
        this.handleClose()
        this.GetListData('list')
      })
    },
    // 获取当前数据详情数据
    GetDetail(data) {
      DetailRequest({ sid: data.sid }).then(req => {
        this.formData = req.data
        this.detailLoading = false
      })
    },
    // 设置上下架状态
    SetStatus(data) {
      SetStateRequest(data).then(() => {
        this.$message({
          message: data.status === 1 ? '上架成功！' : '下架成功！',
          type: 'success'
        });
        this.GetListData('list')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.test-admin-wrap{
  margin: 10px;
  .control-wrap{
    margin: 10px 0;
  }
}
.el-icon-circle-plus{
  cursor: pointer;
}
</style>
