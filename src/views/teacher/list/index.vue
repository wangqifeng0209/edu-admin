<template>
    <div>
      <!--查询表单-->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="searchObj.name" placeholder="讲师名"/>
        </el-form-item>

        <el-form-item>
          <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
            <el-option :value="1" label="高级讲师"/>
            <el-option :value="2" label="首席讲师"/>
          </el-select>
        </el-form-item>

        <el-form-item label="添加时间">
          <el-date-picker
            v-model="searchObj.gmtCreateStart"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="searchObj.gmtCreateEnd"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getTeacherPageList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>

      <el-table
        :data="teacherList"
        style="width: 100%"
        border>
        <el-table-column
          label="序号"
          width="70"
          align="center">
          <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="头衔"
          width="180">
          <template slot-scope="scope">
            {{ scope.row.level===1?'高级讲师':'首席讲师' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="intro"
          label="资历"
          width="380">
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="添加日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link :to="'/update/' + scope.row.id" >
              <el-button
                size="mini">编辑</el-button>
            </router-link>

            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        style="padding: 30px 0; text-align: center;"
        layout="total, prev, pager, next, jumper"
        @current-change="getTeacherPageList"
      />
    </div>


</template>

<script>
  import teacher from '../../../api/teacher'

  export default {
    name: 'index',
    data () { //定义变量和初始化数据
      return {
        total: 0,
        page: 1,
        limit: 10,
        searchObj: {},
        teacherList: []
      }
    },
    created() { //在页面渲染之前挂载
      this.getTeacherPageList()
    },
    methods: { //具体调用的方法执行
      getTeacherPageList(page=1) {
        this.page = page
        teacher.getTeacherPageList(this.page, this.limit, this.searchObj)
          .then(response => {
            // console.log(response)
            this.teacherList = response.data.items
            this.total = response.data.total
          })

          .catch(response => {

          })
      },
      resetData () {
        this.searchObj = {}
        this.getTeacherPageList()
      },
      // 删除讲师
      handleDelete(id) {
        this.$confirm('确定删除该讲师?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return teacher.deleteById(id)
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTeacherPageList(this.page)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>

</style>
