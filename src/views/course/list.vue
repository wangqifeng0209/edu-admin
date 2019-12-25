<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item>
        <el-input v-model="searchObj.title" placeholder="课程标题"/>
      </el-form-item>
      <!-- 讲师 -->
      <el-form-item>
        <el-select
          v-model="searchObj.teacherId"
          placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <el-table
      :data="courseList"
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
        prop="title"
        label="课程名"
        width="380">
      </el-table-column>
      <!-- TODO 课程分类名和教师名显示-->
<!--      <el-table-column-->
<!--        prop="subjectName"-->
<!--        label="课程分类"-->
<!--        width="180">-->
<!--        <template slot-scope="scope">-->
<!--          {{ getSubject(scope.row.subjectId,scope) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="name"-->
<!--        label="讲师姓名"-->
<!--        width="180">-->
<!--        <template slot-scope="scope" >-->
<!--          {{ getTeacher(scope.row.teacherId,scope.$index) }}-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        prop="price"
        label="课程单价"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lessonNum"
        label="课时"
        width="180">
      </el-table-column>
      <el-table-column
        prop="buyCount"
        label="购买人数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加日期"
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
      @current-change="getCoursePageList"
    />
  </div>


</template>

<script>
  import course from '../../api/course'
  import teacher from '../../api/teacher'
  import subject from '../../api/subject'

  const defaultSearchObj = {

  }
  export default {
    name: 'list',
    data () {
      return {
        searchObj: {
          title: '',
          subjectParentId: '',
          subjectId: '',
          teacherId: ''
        },
        courseList: [],
        page: 1,
        limit: 10,
        total: 0,
        subjectNestedList: [],
        subSubjectList: [],
        teacherList: []

      }
    },
    created() {
      this.init()
    },
    computed: {

    },
    methods: {
      init() {
        //获取课程列表
        this.getCoursePageList()

        //获取一级分类
        this.getSubjectNestedList()

        //获取教师
        this.getTeacherList()
      },
      fetchData() {
        this.getCoursePageList()
      },
      resetData() {
        this.searchObj.title = ''
        this.searchObj.subjectId = ''
        this.searchObj.subjectParentId = ''
        this.searchObj.teacherId = ''
        this.getCoursePageList()
      },
      getCoursePageList(page=1) {
        this.page = page
        course.pageList(this.page, this.limit, this.searchObj)
          .then(response => {
            this.courseList = response.data.items
            this.total = response.data.total
            this.current = response.data.current
            this.pages = response.data.pages
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '暂时无法获取课程列表，请稍后再试'
            })
          })
      },
      getTeacher(id,index) {

        teacher.getTeacherById(id)
          .then(response => {
            console.log(id,index)
            this.courseList[index].name = response.data.item.name
          })
          .catch(error => {
            console.log(error)
          })
      },
      getSubject(id) {
        subject.getSubjectById(id)
          .then(response => {

            // return response.data.item.title
          })
      },
      getSubjectNestedList() {
        subject.getNestedTreeList()
          .then(response => {
            this.subjectNestedList = response.data.items
          })
      },
      subjectLevelOneChanged(value) {
        for(let i = 0;i < this.subjectNestedList.length;i++){
          if (value === this.subjectNestedList[i].id){
            this.subSubjectList = this.subjectNestedList[i].children
            this.courseInfo.subjectId = ''
          }
        }
      },
      getTeacherList() {
        teacher.getTeacherList()
          .then(response => {
            this.teacherList = response.data.teachers
          })
      },
      handleDelete(id) {
        this.$confirm('确定删除该课程？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return course.deleteCourse(id)
        }).then(() => {
            return this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
          .then(() => {
            this.getCoursePageList()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '取消删除'
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
