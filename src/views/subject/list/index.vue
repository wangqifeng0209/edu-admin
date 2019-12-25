<template>
  <div class="app-container">
    <el-button type="text" @click="addLevelOne">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    >

      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试 -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => addLevelTwo(data)">添加二级分类</el-button>
          <el-button
            v-if="node.level == 1 || node.level == 2"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>

        </span>
      </span>
    </el-tree>

    <el-dialog
      title="添加分类"
      :visible.sync="dialogFormVisible"
      width="30%"
      :before-close="handleClose">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
  import subject from '@/api/subject'
  export default {

    data() {
      return {
        filterText: '',
        subjectList: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        dialogFormVisible: false,
        subject: {
          title: '',
          parentId: 0
        }
      }
    },
    watch: {
      filterText(val) {
        this.$refs.subjectTree.filter(val)
      }
    },

    created() {
      this.fetchNodeList()
    },

    methods: {
      fetchNodeList() {
        subject.getNestedTreeList().then(response => {
          if (response.success === true) {
            this.subjectList = response.data.items
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      //删除课程
      remove (node,data) {
        console.log(data)
        this.$confirm('确定删除该课程吗？','提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return subject.deleteSubject(data.id)
          })
          .then(() => {
            this.fetchNodeList()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
          .catch((response) => {
            if (response === 'cancel'){
              this.$message({
                type: 'info',
                message: '取消成功'
              })
            }else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
      },
      //添加课程
      addSubject () {
        subject.addSubject(this.subject)
          .then(() => {
            return this.dialogFormVisible = false
          })
          .then(() => {
            this.fetchNodeList();
            this.subject.title = ''
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          })
          .catch(() => {
            this.dialogFormVisible = false
            this.subject.title = ''
            this.$message({
              type: 'error',
              message: '添加失败'
            })
          })
      },

      addLevelOne () {
        this.dialogFormVisible = true
        this.subject.parentId = "0"
      },

      addLevelTwo (data) {
        console.log(data)
        this.dialogFormVisible = true
        this.subject.parentId = data.id
      },


    }
  }
</script>
