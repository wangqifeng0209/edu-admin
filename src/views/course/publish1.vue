<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <el-form-item label="课程简介">
        <el-input v-model="courseInfo.description" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/edu/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
      </el-form-item>

      <el-form-item>

        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

<!--    <el-button style="margin-top: 12px;" @click="next">下一步</el-button>-->
  </div>

</template>

<script>
  import teacher from '../../api/teacher'
  import subject from '../../api/subject'
  import course from '../../api/course'

  const defaultCourse = {
    id: '',
    subjectParentId: '',
    teacherId: '',
    title: '',
    lessonNum: 0,
    description: '',
    price: 0,
    subjectId: '',
    cover: '../../assets/666.jpg'
  }

  export default {
    name: 'publish',
    data() {
      return {
        active: 1,
        courseInfo: defaultCourse,
        teacherList: [],
        subjectNestedList: [],
        subSubjectList: [],
        BASE_API: process.env.VUE_APP_BASE_API
      }
    },

    created() {

      this.init()
    },

    methods: {
      //图片上传成功后的回调函数
      handleAvatarSuccess (response,file) {
        this.courseInfo.cover = response.data.imgUrl
      },
      init() {
        //获取讲师列表
        this.getTeacherList()
        //获取课程分类
        this.getSubjectNestedList()

        //回显表单数据
        this.getCourseInfo()
      },
      getCourseInfo() {
        //判断路由参数中的id值。如果存在就需要回显，
        console.log(this.$route.params && this.$route.params.id)
        if (this.$route.params && this.$route.params.id){
          course.getFormCourse(this.$route.params.id)
            .then(response => {
              this.courseInfo = response.data.formCourse
              console.log(this.courseInfo)
              console.log(this.subjectNestedList)

              for(let i = 0;i < this.subjectNestedList.length;i++){
                if (this.courseInfo.subjectParentId === this.subjectNestedList[i].id){
                  console.log('你猜会执行吗？')
                  this.subSubjectList = this.subjectNestedList[i].children
                  this.courseInfo.subjectId = ''
                }
              }
            })
        } else {
          console.log(1)
          //这边不能直接写this.courseInfo=defaultCourse，
          this.courseInfo = {...defaultCourse}
        }
      },
      next() {
        //判断路由参数中的id值，如果存在，执行的是更新，不存在，执行的是添加
        this.addOrUpdateCourse()
        // this.$router.push({path: "/course/publish2/ + 'this.courseInfo.id'"})
      },
      getTeacherList() {
        teacher.getTeacherList()
          .then(response => {
            this.teacherList = response.data.teachers
          })
      },
      getSubjectNestedList() {
        subject.getNestedTreeList()
          .then(response => {
            this.subjectNestedList = response.data.items
          })
      },
      subjectLevelOneChanged(value) {
        // console.log(this.subjectNestedList)
        //第一种方法，通过直接查数据库得到二级分类
        // subject.getSubSubjectList(this.courseInfo.subjectParentId)
        //   .then(response => {
        //     this.subSubjectList = response.data.items
        //
        //   })
        //第二种方法，subjectNestedList这里面已经包含了二级分类的数据，直接遍历获取
        for(let i = 0;i < this.subjectNestedList.length;i++){
          if (value === this.subjectNestedList[i].id){
            this.subSubjectList = this.subjectNestedList[i].children
            this.courseInfo.subjectId = ''
          }
        }
      },
      addOrUpdateCourse() {
        //判断路由参数中的id值，如果存在，执行的是更新，不存在，执行的是添加
          course.addOrUpdateCourse(this.courseInfo)
            .then(response => {
              // this.courseInfo.id = response.id
              this.$router.push({path: '/course/publish2/' + response.data.id})
            })
      }
    }
  }
</script>

<style scoped>

</style>
