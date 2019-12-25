<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
      <el-step title="步骤 3"></el-step>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.description }}课时</span></p>
        <p><span>所属分类： {{ coursePublish.subjectName }}</span></p>
        <p>课程讲师：{{ coursePublish.name }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>

    <el-button @click="previous">上一步</el-button>
    <el-button style="margin-top: 12px;" @click="next">发布</el-button>
  </div>

</template>

<script>
  import course from '../../api/course'
  export default {
    name: 'publish',
    data() {
      return {
        active: 3,
        coursePublish: {
          title: '',
          price: 0,
          cover: '',
          description: '',
          name: '',
          subjectName: ''
        }
      };
    },

    created() {
      this.init()
    },

    methods: {
      init() {
        this.getCourseInfo()
      },
      getCourseInfo() {
        course.getCourseInfo(this.$route.params.id)
          .then(response => {
            this.coursePublish = response.data.item
          })
      },
      next() {
        course.updateCourseStatus(this.$route.params.id)
          .then(() => {
            return this.$router.push({path: '/course/list'})
          }).then(() => {
            this.$message({
              type: 'success',
              message: '发布成功'
            })
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '发布失败'
            })
          })

      },
      previous() {
        this.$router.push({path: '/course/publish2/' + this.$route.params.id})
      }
    }
  }
</script>

<style scoped>

</style>
