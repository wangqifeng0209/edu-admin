<template>
  <div class="app-container">
    <el-form ref="form" :model="teacher" label-width="80px">
      <el-form-item label="讲师姓名">
        <el-input v-model="teacher.name"></el-input>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" placeholder="请选择">
          <el-option label="高级讲师" value="1"></el-option>
          <el-option label="首席讲师" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"></el-input>
      </el-form-item>

      <el-form-item label="讲师简介">
        <el-input type="textarea" v-model="teacher.intro" :rows="10"></el-input>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调
          注意：前端上传的图片的名字不会改变，都是一样的，必须在后台对名字进行重命名-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/edu/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import teacher from '@/api/teacher'
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    name: 'index',
    components: {ImageCropper,PanThumb},
    data () { //定义变量和初始化数据
      return {
        teacher: {
          name: '',
          sort: 0,
          level: '',
          career: '',
          intro: '',
          avatar: ''
        },
        imagecropperShow: false,
        imagecropperKey: 0,
        BASE_API: process.env.VUE_APP_BASE_API
      }
    },
    created() { //在页面渲染之前加载,回显
      this.init()

    },
    methods: { //具体执行的方法

      //点击保存上传成功后的回调函数
      cropSuccess (data) {
        this.teacher.avatar = data.imgUrl
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
      },
      //关闭头像上传弹窗
      close () {
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
      },
      saveOrUpdate() {
        if (this.teacher.id) {
          this.update(this.teacher)
        } else {
          this.save()
        }

      },
      update(newTeacher) {
        teacher.updateTeacherById(newTeacher)
          .then(() => {
            return this.$router.push({path: '/list'})
          })
          .then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '修改失败'
            })
          })
      },
      save () { //保存员工
        teacher.saveTeacher(this.teacher)
          .then(() => {
            return this.$message({
              type: 'success',
              message: '保存成功'
            })
          })
          .then(() => {
            //通过路由跳转页面
            this.$router.push({path: '/list'})
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '保存失败'
            })
          })
      }
      ,
      init () {
        if (this.$route.params.id) {
          teacher.getTeacherById(this.$route.params.id)
            .then(response => {
              this.teacher = response.data.item
            })
            .catch()
        }

      }
    }
  }
</script>

<style scoped>

</style>
